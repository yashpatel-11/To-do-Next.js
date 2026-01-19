import Link from "next/link";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthForm from "../../components/auth/AuthForm";

export default function LoginPage() {
  return (
    <AuthLayout title="Sign in">
      <p className="text-sm text-gray-600 mb-6 text-center">
        Sign in to manage your tasks
      </p>
      <AuthForm mode="login" />
      <p className="text-sm text-gray-600 mt-6 text-center">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}
