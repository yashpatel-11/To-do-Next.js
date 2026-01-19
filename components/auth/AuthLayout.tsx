import type { ReactNode } from "react";

type AuthLayoutProps = {
	title?: string;
	children: ReactNode;
};

export default function AuthLayout({ title, children }: AuthLayoutProps) {
	return (
		<main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
			<div className="w-full max-w-md bg-white shadow-sm rounded-lg p-6">
				{title && (
					<h1 className="text-2xl font-semibold text-gray-900 mb-4">
						{title}
					</h1>
				)}
				{children}
			</div>
		</main>
	);
}

