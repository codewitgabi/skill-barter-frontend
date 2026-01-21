"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import type { ZodIssue } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ProgressIndicator from "./progress-indicator";
import StepAccount from "./step-account";
import StepSkills from "./step-skills";
import StepProfile from "./step-profile";
import StepVerification from "./step-verification";
import {
  accountSchema,
  skillsSchema,
  profileSchema,
  verificationSchema,
  registrationSchema,
  type RegistrationFormData,
} from "../../_lib/validation";

const TOTAL_STEPS = 4;

function RegisterForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<RegistrationFormData>({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
      skillsToTeach: [],
      skillsToLearn: [],
      bio: "",
      location: {
        city: "",
        country: "",
      },
      availability: 5,
      code: "",
    },
  });

  const validateCurrentStep = async () => {
    let schema;
    switch (currentStep) {
      case 1:
        schema = accountSchema;
        break;
      case 2:
        schema = skillsSchema;
        break;
      case 3:
        schema = profileSchema;
        break;
      case 4:
        schema = verificationSchema;
        break;
      default:
        return false;
    }

    const formData = form.getValues();
    const result = schema.safeParse(formData);

    if (!result.success) {
      // Set errors for each field
      // Use issues property which exists on all ZodError instances
      const issues = (result.error as { issues: ZodIssue[] }).issues;
      issues.forEach((err: ZodIssue) => {
        const fieldPath = err.path;
        const fieldName = fieldPath.length > 0 ? fieldPath.join(".") : "root";
        form.setError(fieldName as keyof RegistrationFormData, {
          type: "manual",
          message: err.message,
        });
      });
      return false;
    }

    return true;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: RegistrationFormData) => {
    // Validate complete form before submission
    try {
      registrationSchema.parse(data);
    } catch {
      form.setError("root", {
        message: "Please complete all steps correctly.",
      });
      return;
    }

    setIsSubmitting(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Show success message (UI only, no API call)
    form.setError("root", {
      type: "success",
      message: "Registration successful! Redirecting...",
    });

    // Simulate redirect after a delay
    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);

    setIsSubmitting(false);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepAccount />;
      case 2:
        return <StepSkills />;
      case 3:
        return <StepProfile />;
      case 4:
        return <StepVerification />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-background border-2 border-border rounded-2xl p-8">
        <ProgressIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="min-h-[400px]">{renderStep()}</div>

            {form.formState.errors.root && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {form.formState.errors.root.message}
              </div>
            )}

            <div className="flex items-center justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1 || isSubmitting}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep < TOTAL_STEPS ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="bg-linear-to-r from-[#10b981] via-[#3b82f6] to-[#8b5cf6] text-white hover:opacity-90"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-linear-to-r from-[#10b981] via-[#3b82f6] to-[#8b5cf6] text-white hover:opacity-90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Complete Registration
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default RegisterForm;
