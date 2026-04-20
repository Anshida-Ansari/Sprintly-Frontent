import { Trash2 } from "lucide-react";

interface DeleteConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title?: string;
	message?: string;
	isLoading?: boolean;
}

export default function DeleteConfirmationModal({
	isOpen,
	onClose,
	onConfirm,
	title = "Confirm Deletion",
	message = "Are you sure you want to delete this item? This action cannot be undone.",
	isLoading = false,
}: DeleteConfirmationModalProps) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
			{/* Overlay */}
			<div
				className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
				onClick={isLoading ? undefined : onClose}
			/>

			{/* Modal Card */}
			<div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 p-8 flex flex-col gap-6 text-center z-10">
				<div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-2">
					<Trash2 size={32} strokeWidth={2.5} />
				</div>

				<div className="space-y-2">
					<h2 className="text-2xl font-black text-gray-900">{title}</h2>
					<p className="text-gray-500 font-medium leading-relaxed">{message}</p>
				</div>

				<div className="grid grid-cols-2 gap-3 mt-2">
					<button
						onClick={onClose}
						disabled={isLoading}
						className="px-6 py-3.5 border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						disabled={isLoading}
						className="px-6 py-3.5 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						{isLoading ? (
							<>
								<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
								Deleting...
							</>
						) : (
							"Delete"
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
