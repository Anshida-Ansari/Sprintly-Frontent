import { AlertTriangle, Home, RefreshCw } from "lucide-react";

interface ErrorFallbackProps {
	error: Error;
	resetErrorBoundary: () => void;
}

export const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-[#FDFDFF] p-6 font-sans">
			<div className="max-w-md w-full bg-white border border-gray-100 rounded-[2.5rem] p-12 text-center shadow-[0_20px_50px_rgba(79,70,229,0.08)] relative overflow-hidden">
				{/* Subtle Background Decoration */}
				<div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -mr-16 -mt-16" />
				<div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-50/50 rounded-full blur-3xl -ml-16 -mb-16" />

				<div className="relative z-10 flex flex-col items-center">
					<div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-8 shadow-sm border border-indigo-100/50">
						<AlertTriangle className="w-10 h-10 text-indigo-600" />
					</div>

					<h1 className="text-2xl font-bold mb-3 tracking-tight text-gray-900">
						Oops! Something happened
					</h1>
					
					<p className="text-gray-500 mb-8 leading-relaxed text-[15px]">
						We've encountered an unexpected error. Our team has been notified. You can try to reload or head back.
					</p>

					{/* Error Detail (Optional/Debug) */}
					{import.meta.env.DEV && (
						<div className="w-full mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left overflow-auto max-h-32 custom-scrollbar">
							<code className="text-xs text-rose-500/80 font-mono break-all">
								{error.message || "Unknown error"}
							</code>
						</div>
					)}

					<div className="flex flex-col gap-3 w-full">
						<button
							onClick={resetErrorBoundary}
							type="button"
							className="flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-4 px-8 rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all duration-300 active:scale-[0.98]"
						>
							<RefreshCw className="w-4 h-4" />
							Try to Refresh
						</button>
						<button
							onClick={() => (window.location.href = "/")}
							type="button"
							className="flex items-center justify-center gap-2 bg-white text-gray-600 font-semibold py-4 px-8 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all duration-300 active:scale-[0.98]"
						>
							<Home className="w-4 h-4" />
							Back to Safety
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
