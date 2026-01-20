import AuthLayout from "../_components/auth-layout";
import SignInForm from "../_components/signin-form";

function SignInPage() {
  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto">
        <SignInForm />
      </div>
    </AuthLayout>
  );
}

export default SignInPage;
