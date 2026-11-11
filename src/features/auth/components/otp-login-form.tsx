"use client";

import type { ReactNode } from "react";
import { type Step, StepTransition } from "@/components/shared/step-transition";
import { OtpCodeStepForm } from "@/features/auth/components/otp-code-step-form";
import { OtpEmailStepForm } from "@/features/auth/components/otp-email-step-form";
import { type UseOtpLoginReturn, useOtpLogin } from "@/features/auth/hooks/use-otp-login";

export interface OtpLoginFormProps {
  readonly nextPath: string;
}

function buildSteps(otp: UseOtpLoginReturn): readonly Step[] {
  return [
    {
      id: "email",
      node: (
        <OtpEmailStepForm
          defaultEmail={otp.email}
          isPending={otp.isPending}
          onSubmitEmail={otp.requestOtp}
        />
      ),
    },
    {
      id: "code",
      node: (
        <OtpCodeStepForm
          key={otp.email}
          email={otp.email}
          isPending={otp.isPending}
          resendSecondsLeft={otp.resendSecondsLeft}
          onSubmitCode={otp.submitOtpCode}
          onResend={otp.resendOtp}
          onChangeEmail={otp.changeEmail}
        />
      ),
    },
  ];
}

export function OtpLoginForm({ nextPath }: OtpLoginFormProps): ReactNode {
  const otp = useOtpLogin({ nextPath });

  return (
    <div className="space-y-4">
      {otp.infoMessage ? (
        <p role="status" className="text-muted-foreground text-sm">
          {otp.infoMessage}
        </p>
      ) : null}
      {otp.errorMessage ? (
        <p role="alert" className="text-destructive text-sm font-medium">
          {otp.errorMessage}
        </p>
      ) : null}
      <StepTransition activeId={otp.step} steps={buildSteps(otp)} />
    </div>
  );
}
