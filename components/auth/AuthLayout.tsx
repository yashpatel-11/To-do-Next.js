import type { ReactNode } from "react";

type AuthLayoutProps = {
	title?: string;
	children: ReactNode;
};

export default function AuthLayout({ title, children }: AuthLayoutProps) {
	return (
		<main
			className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-6"
			style={{ backgroundImage: "url('/todo-bg.svg')" }}
		>
			<div className="w-full max-w-md rounded-xl border border-white/70 bg-white/75 p-6 shadow-sm backdrop-blur">
				{title && (
					<h1 className="text-2xl font-semibold text-slate-900 mb-4">
						{title}
					</h1>
				)}
				{children}
			</div>
		</main>
	);
}

