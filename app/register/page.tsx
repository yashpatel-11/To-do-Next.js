import Link from "next/link";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthForm from "../../components/auth/AuthForm";

export default function RegisterPage() {
  return (
    <AuthLayout title="Create account">
      <p className="text-sm text-gray-600 mb-6 text-center">
        Start organizing your tasks today
      </p>
      <AuthForm mode="register" />
      <p className="text-sm text-gray-600 mt-6 text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
