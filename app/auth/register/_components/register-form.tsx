"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import type { ZodIssue } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { apiPost } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import type { User, SkillItem } from "@/stores/auth/auth.types";

const TOTAL_STEPS = 4;

interface UserResponseData {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  about: string;
  city: string;
  country: string;
  profile_picture: string;
  weekly_availability: number;
  skills: unknown[];
  interests: unknown[];
  skillsToTeach: SkillItem[];
  skillsToLearn: SkillItem[];
  language: string;
  timezone: string;
  website: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface RegisterResponseData {
  user: UserResponseData;
  accessToken: string;
  refreshToken: string;
}

function mapUserResponseToUser(data: UserResponseData): User {
  return {
    _id: data.id,
    first_name: data.first_name,
    last_name: data.last_name,
    username: data.username,
    email: data.email,
    about: data.about,
    city: data.city,
    country: data.country,
    profile_picture: data.profile_picture,
    weekly_availability: data.weekly_availability,
    skills: data.skills,
    interests: data.interests,
    skillsToTeach: data.skillsToTeach || [],
    skillsToLearn: data.skillsToLearn || [],
    language: data.language,
    timezone: data.timezone,
    website: data.website || "",
    deletedAt: data.deletedAt,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

function RegisterForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState<string>("");
  const router = useRouter();
  const { login } = useAuthStore();

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

  // Track OTP verification status
  const [isOtpVerified, setIsOtpVerified] = useState(false);

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
    if (!isValid) return;

    // Send email verification when moving from step 1 to step 2
    // Only send if not already sent, or if email has changed
    if (currentStep === 1) {
      const formData = form.getValues();
      const emailChanged = verifiedEmail !== formData.email;

      // Only send if not sent before, or if email changed
      if (!emailVerificationSent || emailChanged) {
        try {
          const response = await apiPost("/auth/email-verification", {
            email: formData.email,
          });
          if (response.status !== "success") {
            form.setError("email", {
              type: "manual",
              message:
                response.error?.message || "Failed to send verification email",
            });
            return;
          }
          // Mark as sent and store the email
          setEmailVerificationSent(true);
          setVerifiedEmail(formData.email);
        } catch {
          form.setError("email", {
            type: "manual",
            message: "Failed to send verification email. Please try again.",
          });
          return;
        }
      }
    }

    if (currentStep < TOTAL_STEPS) {
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

    try {
      // Step 1: Upload profile picture to Cloudinary if provided
      let profilePictureUrl = "";
      if (data.profilePicture) {
        try {
          const formData = new FormData();
          formData.append("file", data.profilePicture);
          formData.append("folder", "profile-pictures");

          const uploadResponse = await fetch("/api/v1/upload", {
            method: "POST",
            body: formData,
          });

          const uploadData = await uploadResponse.json();
          if (uploadData.status === "success" && uploadData.data?.url) {
            profilePictureUrl = uploadData.data.url;
          } else {
            throw new Error(uploadData.error?.message || "Upload failed");
          }
        } catch (error) {
          form.setError("root", {
            message:
              error instanceof Error
                ? error.message
                : "Failed to upload profile picture",
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Step 2: Register user with all data
      const registerData = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: data.password,
        username: `${data.firstName.toLowerCase()}.${data.lastName.toLowerCase()}`,
        about: data.bio,
        city: data.location.city,
        country: data.location.country,
        profile_picture: profilePictureUrl,
        weekly_availability: data.availability,
        skills: data.skillsToTeach.map((skill) => ({
          name: skill.skill,
          level: skill.level,
        })),
        interests: data.skillsToLearn.map((skill) => ({
          name: skill.skill,
          level: skill.level,
        })),
        language: "en",
        timezone: "UTC",
        otp: data.code,
      };

      const response = await apiPost<RegisterResponseData>(
        "/auth/register",
        registerData,
      );

      if (response.status === "success" && response.data) {
        const mappedUser = mapUserResponseToUser(response.data.user);
        login(response.data.accessToken, mappedUser);
        toast.success("Registration successful!", {
          description: `Welcome, ${mappedUser.first_name}!`,
        });
        router.push("/@me");
      } else {
        const errorResponse = response as { error: { message: string } };
        form.setError("root", {
          message:
            errorResponse.error?.message ||
            "Registration failed. Please try again.",
        });
      }
    } catch (error) {
      form.setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepAccount />;
      case 2:
        return <StepSkills />;
      case 3:
        return <StepProfile />;
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
            <div className="min-h-[400px]">
              {currentStep === 4 ? (
                <StepVerification onVerified={() => setIsOtpVerified(true)} />
              ) : (
                renderStep()
              )}
            </div>

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
                  disabled={isSubmitting || !isOtpVerified}
                  className="bg-linear-to-r from-[#10b981] via-[#3b82f6] to-[#8b5cf6] text-white hover:opacity-90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      <span className="hidden sm:inline">
                        Creating Account...
                      </span>
                      <span className="sm:hidden">Creating...</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">
                        Complete Registration
                      </span>
                      <span className="sm:hidden">Register</span>
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
