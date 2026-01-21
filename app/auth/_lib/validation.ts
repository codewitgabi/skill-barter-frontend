import { z } from "zod";

// Step 1: Account Basics
export const accountSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Step 2: Skills
export const skillsSchema = z.object({
  skillsToTeach: z
    .array(
      z.object({
        skill: z.string().min(1, "Skill name is required"),
        level: z.enum(["beginner", "intermediate", "advanced"]),
      }),
    )
    .min(1, "Please add at least one skill you can teach"),
  skillsToLearn: z
    .array(
      z.object({
        skill: z.string().min(1, "Skill name is required"),
        level: z.enum(["beginner", "intermediate", "advanced"]),
      }),
    )
    .min(1, "Please add at least one skill you want to learn"),
});

// Step 3: Profile
export const profileSchema = z.object({
  bio: z
    .string()
    .min(50, "Bio must be at least 50 characters")
    .max(500, "Bio must be less than 500 characters"),
  location: z.object({
    city: z.string().min(1, "City is required"),
    country: z.string().min(1, "Country is required"),
  }),
  profilePicture: z.instanceof(File).optional(),
  availability: z
    .number()
    .min(1)
    .max(40, "Availability must be between 1 and 40 hours per week"),
});

// Step 4: Verification
export const verificationSchema = z.object({
  code: z.string().length(6, "Verification code must be 6 digits"),
});

// Complete registration schema
export const registrationSchema = accountSchema
  .merge(skillsSchema)
  .merge(profileSchema)
  .merge(verificationSchema);

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Type exports
export type AccountFormData = z.infer<typeof accountSchema>;
export type SkillsFormData = z.infer<typeof skillsSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type VerificationFormData = z.infer<typeof verificationSchema>;
export type RegistrationFormData = z.infer<typeof registrationSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
