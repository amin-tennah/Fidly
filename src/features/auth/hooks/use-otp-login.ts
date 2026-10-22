"use client";

import { useEffect, useReducer, useTransition } from "react";
import { useRouter } from "next/navigation";
import { sendEmailOtp, verifyEmailOtp } from "@/features/auth/actions/otp-actions";
import { OTP_RESEND_COOLDOWN_SECONDS } from "@/features/auth/constants";
import { sanitizeNextPath } from "@/features/auth/domain/redirects";

export type OtpFlowStep = "email" | "code";

export interface UseOtpLoginOptions {
  readonly nextPath: string;
}

export interface UseOtpLoginReturn {
  readonly step: OtpFlowStep;
  readonly email: string;
  readonly errorMessage: string | null;
  readonly infoMessage: string | null;
  readonly resendSecondsLeft: number;
  readonly isPending: boolean;
  readonly requestOtp: (email: string) => void;
  readonly submitOtpCode: (token: string) => void;
  readonly resendOtp: () => void;
  readonly changeEmail: () => void;
}

interface OtpState {
  readonly step: OtpFlowStep;
  readonly email: string;
  readonly errorMessage: string | null;
  readonly infoMessage: string | null;
  readonly resendSecondsLeft: number;
}

type OtpAction =
  | { readonly type: "clear_feedback" }
  | { readonly type: "set_error"; readonly message: string }
  | { readonly type: "otp_sent"; readonly email: string }
  | { readonly type: "tick" }
  | { readonly type: "change_email" };

const INITIAL_STATE: OtpState = {
  step: "email",
  email: "",
  errorMessage: null,
  infoMessage: null,
  resendSecondsLeft: 0,
};

function otpReducer(state: OtpState, action: OtpAction): OtpState {
  switch (action.type) {
    case "clear_feedback":
      return { ...state, errorMessage: null, infoMessage: null };
    case "set_error":
      return { ...state, errorMessage: action.message };
    case "otp_sent":
      return {
        step: "code",
        email: action.email,
        errorMessage: null,
        infoMessage: `Un code à 6 chiffres a été envoyé à ${action.email}.`,
        resendSecondsLeft: OTP_RESEND_COOLDOWN_SECONDS,
      };
    case "tick":
      return {
        ...state,
        resendSecondsLeft: Math.max(0, state.resendSecondsLeft - 1),
      };
    case "change_email":
      return { ...state, step: "email", errorMessage: null, infoMessage: null };
    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}

function useResendCountdown(secondsLeft: number, onTick: () => void): void {
  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }
    const timer = window.setInterval(onTick, 1000);
    return () => window.clearInterval(timer);
  }, [secondsLeft, onTick]);
}

export function useOtpLogin({ nextPath }: UseOtpLoginOptions): UseOtpLoginReturn {
  const router = useRouter();
  const [state, dispatch] = useReducer(otpReducer, INITIAL_STATE);
  const [isPending, startTransition] = useTransition();
  useResendCountdown(state.resendSecondsLeft, () => dispatch({ type: "tick" }));

  const requestOtp = (rawEmail: string): void => {
    dispatch({ type: "clear_feedback" });
    startTransition(async () => {
      const res = await sendEmailOtp({ email: rawEmail });
      dispatch(
        res.ok
          ? { type: "otp_sent", email: res.data.email }
          : { type: "set_error", message: res.error.message },
      );
    });
  };

  const submitOtpCode = (token: string): void => {
    dispatch({ type: "clear_feedback" });
    startTransition(async () => {
      const res = await verifyEmailOtp({ email: state.email, token });
      if (!res.ok) {
        dispatch({ type: "set_error", message: res.error.message });
        return;
      }
      router.replace(sanitizeNextPath(nextPath));
      router.refresh();
    });
  };

  return {
    ...state,
    isPending,
    requestOtp,
    submitOtpCode,
    resendOtp: () => {
      if (state.resendSecondsLeft === 0 && state.email) requestOtp(state.email);
    },
    changeEmail: () => dispatch({ type: "change_email" }),
  };
}
