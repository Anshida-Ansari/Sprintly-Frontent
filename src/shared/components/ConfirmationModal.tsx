import { AlertTriangle, CheckCircle2, X } from "lucide-react";
import type { ReactNode } from "react";

interface ConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string | ReactNode;
	confirmText?: string;
	cancelText?: string;
	isLoading?: boolean;
	variant?: "danger" | "success" | "warning" | "info";
}

export default function ConfirmationModal({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = "Confirm",
	cancelText = "Cancel",
	isLoading = false,
	variant = "danger",
}: ConfirmationModalProps) {
	if (!isOpen) return null;

	const styles = {
		danger: {
			iconBg: "bg-rose-50",
			iconColor: "text-rose-500",
			buttonBg: "bg-rose-600",
			buttonHover: "hover:bg-rose-700",
			buttonShadow: "shadow-rose-200",
			icon: <AlertTriangle size={32} strokeWidth={2.5} />,
		},
		success: {
			iconBg: "bg-emerald-50",
			iconColor: "text-emerald-500",
			buttonBg: "bg-emerald-600",
			buttonHover: "hover:bg-emerald-700",
			buttonShadow: "shadow-emerald-200",
			icon: <CheckCircle2 size={32} strokeWidth={2.5} />,
		},
		warning: {
			iconBg: "bg-amber-50",
			iconColor: "text-amber-500",
			buttonBg: "bg-amber-600",
			buttonHover: "hover:bg-amber-700",
			buttonShadow: "shadow-amber-200",
			icon: <AlertTriangle size={32} strokeWidth={2.5} />,
		},
		info: {
			iconBg: "bg-indigo-50",
			iconColor: "text-indigo-500",
			buttonBg: "bg-indigo-600",
			buttonHover: "hover:bg-indigo-700",
			buttonShadow: "shadow-indigo-200",
			icon: <AlertTriangle size={32} strokeWidth={2.5} />,
		},
	};

	const currentStyle = styles[variant];

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
			{/* Overlay */}
			<div
				className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
				onClick={isLoading ? undefined : onClose}
			/>

			{/* Modal Card */}
			<div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 p-8 flex flex-col gap-6 text-center z-10">
				<button
					onClick={onClose}
					disabled={isLoading}
					className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all"
				>
					<X size={20} />
				</button>

				<div
					className={`w-16 h-16 ${currentStyle.iconBg} ${currentStyle.iconColor} rounded-full flex items-center justify-center mx-auto mb-2`}
				>
					{currentStyle.icon}
				</div>

				<div className="space-y-2">
					<h2 className="text-2xl font-black text-gray-900">{title}</h2>
					<div className="text-gray-500 font-medium leading-relaxed">
						{message}
					</div>
				</div>

				<div className="grid grid-cols-2 gap-3 mt-2">
					<button
						onClick={onClose}
						disabled={isLoading}
						className="px-6 py-3.5 border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
					>
						{cancelText}
					</button>
					<button
						onClick={onConfirm}
						disabled={isLoading}
						className={`px-6 py-3.5 ${currentStyle.buttonBg} text-white rounded-xl font-bold ${currentStyle.buttonHover} transition-colors shadow-lg ${currentStyle.buttonShadow} disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
					>
						{isLoading ? (
							<>
								<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
								Processing...
							</>
						) : (
							confirmText
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
