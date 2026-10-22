"use client";

import type { ReactNode } from "react";
import { OtpCodeStepForm } from "@/features/auth/components/otp-code-step-form";
import { OtpEmailStepForm } from "@/features/auth/components/otp-email-step-form";
import { useOtpLogin } from "@/features/auth/hooks/use-otp-login";

export interface OtpLoginFormProps {
  readonly nextPath: string;
}

export function OtpLoginForm({ nextPath }: OtpLoginFormProps): ReactNode {
  const otp = useOtpLogin({ nextPath });

  return (
    <div className="space-y-4">
      {otp.infoMessage ? (
        <p role="status" className="text-muted-foreground text-xs">
          {otp.infoMessage}
        </p>
      ) : null}
      {otp.errorMessage ? (
        <p role="alert" className="text-destructive text-xs font-medium">
          {otp.errorMessage}
        </p>
      ) : null}
      {otp.step === "email" ? (
        <OtpEmailStepForm
          defaultEmail={otp.email}
          isPending={otp.isPending}
          onSubmitEmail={otp.requestOtp}
        />
      ) : (
        <OtpCodeStepForm
          email={otp.email}
          isPending={otp.isPending}
          resendSecondsLeft={otp.resendSecondsLeft}
          onSubmitCode={otp.submitOtpCode}
          onResend={otp.resendOtp}
          onChangeEmail={otp.changeEmail}
        />
      )}
    </div>
  );
}
