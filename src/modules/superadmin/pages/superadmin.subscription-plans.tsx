import { Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import {
	type SubscriptionPlan,
	useCreateSubscriptionPlan,
	useDeleteSubscriptionPlan,
	useSubscriptionPlans,
	useUpdateSubscriptionPlan,
} from "../hooks/useSubscriptionPlan";

export default function SuperAdminSubscriptionPlans() {
	const { data: plans, isLoading } = useSubscriptionPlans();
	const { mutateAsync: createPlan } = useCreateSubscriptionPlan();
	const { mutateAsync: updatePlan } = useUpdateSubscriptionPlan();
	const { mutateAsync: deletePlan } = useDeleteSubscriptionPlan();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingPlan, setEditingPlan] =
		useState<Partial<SubscriptionPlan> | null>(null);

	const handleOpenModal = (plan?: SubscriptionPlan) => {
		if (plan) {
			setEditingPlan(plan);
		} else {
			setEditingPlan({});
		}
		setIsModalOpen(true);
	};

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (editingPlan?.id) {
				await updatePlan({ id: editingPlan.id, data: editingPlan });
				toast.success("Plan updated successfully");
			} else {
				await createPlan(editingPlan as Partial<SubscriptionPlan>);
				toast.success("Plan created successfully");
			}
			setIsModalOpen(false);
		} catch (_error) {
			toast.error("Failed to save plan");
		}
	};

	const handleDelete = async (id: string) => {
		if (window.confirm("Are you sure you want to delete this plan?")) {
			try {
				await deletePlan(id);
				toast.success("Plan deleted");
			} catch {
				toast.error("Failed to delete plan");
			}
		}
	};

	if (isLoading)
		return (
			<div className="p-10 flex justify-center text-gray-500 font-medium">
				Loading plans...
			</div>
		);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Subscription Plans</h1>
				<button
					onClick={() => handleOpenModal()}
					className="flex items-center gap-2 bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 rounded-xl"
				>
					<Plus size={16} />
					Create Plan
				</button>
			</div>

			<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
				<table className="w-full text-left text-sm text-gray-500">
					<thead className="bg-gray-50 text-gray-700 font-semibold border-b">
						<tr>
							<th className="px-6 py-4">Name</th>
							<th className="px-6 py-4">Price</th>
							<th className="px-6 py-4">Stripe Price ID</th>
							<th className="px-6 py-4">Project Limit</th>
							<th className="px-6 py-4">Status</th>
							<th className="px-6 py-4 text-right">Actions</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
						{plans?.map((plan) => (
							<tr key={plan.id} className="hover:bg-gray-50 transition-colors">
								<td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
									{plan.name}
									{plan.isPopular && (
										<span className="px-2 py-0.5 text-[10px] font-bold tracking-wider rounded-full bg-blue-100 text-blue-700 uppercase">
											Popular
										</span>
									)}
								</td>
								<td className="px-6 py-4">₹{plan.price}</td>
								<td className="px-6 py-4 font-mono text-xs">
									{plan.stripePriceId || "-"}
								</td>
								<td className="px-6 py-4">
									{plan.projectLimit === -1 ? "Unlimited" : plan.projectLimit}
								</td>
								<td className="px-6 py-4">
									<span
										className={`px-2 py-1 rounded-full text-xs font-medium ${plan.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
									>
										{plan.isActive ? "Active" : "Inactive"}
									</span>
								</td>
								<td className="px-6 py-4 text-right flex justify-end gap-2 text-gray-400">
									<button
										onClick={() => handleOpenModal(plan)}
										className="hover:text-indigo-600 p-1"
									>
										<Edit size={16} />
									</button>
									<button
										onClick={() => handleDelete(plan.id)}
										className="hover:text-red-600 p-1"
									>
										<Trash2 size={16} />
									</button>
								</td>
							</tr>
						))}
						{plans?.length === 0 && (
							<tr>
								<td
									colSpan={6}
									className="px-6 py-10 text-center text-gray-500"
								>
									No plans found. Create one.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm overflow-y-auto">
					<div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden my-8">
						<form onSubmit={handleSave} className="flex flex-col max-h-[90vh]">
							<div className="px-6 py-4 border-b flex items-center justify-between shrink-0">
								<h2 className="text-lg font-bold">
									{editingPlan?.id ? "Edit Plan" : "Create Plan"}
								</h2>
								<button
									type="button"
									onClick={() => setIsModalOpen(false)}
									className="text-gray-400 hover:text-gray-600"
								>
									<Plus size={20} className="rotate-45" />
								</button>
							</div>

							<div className="p-6 space-y-4 overflow-y-auto min-h-0 shrink">
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-1">
										<label className="text-xs font-semibold text-gray-600">
											Plan Name
										</label>
										<input
											required
											value={editingPlan?.name || ""}
											onChange={(e) =>
												setEditingPlan({ ...editingPlan, name: e.target.value })
											}
											className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
											placeholder="e.g. Pro Plan"
										/>
									</div>
									<div className="space-y-1">
										<label className="text-xs font-semibold text-gray-600">
											Price (₹)
										</label>
										<input
											required
											type="number"
											min="0"
											value={editingPlan?.price || 0}
											onChange={(e) =>
												setEditingPlan({
													...editingPlan,
													price: Number(e.target.value),
												})
											}
											className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
										/>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-1">
										<label className="text-xs font-semibold text-gray-600">
											Project Limit
										</label>
										<input
											required
											type="number"
											min="-1"
											value={editingPlan?.projectLimit ?? 2}
											onChange={(e) =>
												setEditingPlan({
													...editingPlan,
													projectLimit: Number(e.target.value),
												})
											}
											className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
											placeholder="-1 for unlimited"
											title="Enter -1 for Unlimited"
										/>
									</div>
									<div className="space-y-1">
										<label className="text-xs font-semibold text-gray-600">
											Stripe Price ID (Optional)
										</label>
										<input
											value={editingPlan?.stripePriceId || ""}
											onChange={(e) =>
												setEditingPlan({
													...editingPlan,
													stripePriceId: e.target.value,
												})
											}
											className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
											placeholder="price_1..."
										/>
									</div>
								</div>

								<div className="flex gap-4">
									<label className="flex items-center gap-2 text-sm cursor-pointer select-none">
										<input
											type="checkbox"
											checked={editingPlan?.isActive ?? true}
											onChange={(e) =>
												setEditingPlan({
													...editingPlan,
													isActive: e.target.checked,
												})
											}
											className="w-4 h-4 rounded text-indigo-600"
										/>
										Active
									</label>
									<label className="flex items-center gap-2 text-sm cursor-pointer select-none">
										<input
											type="checkbox"
											checked={editingPlan?.isPopular ?? false}
											onChange={(e) =>
												setEditingPlan({
													...editingPlan,
													isPopular: e.target.checked,
												})
											}
											className="w-4 h-4 rounded text-indigo-600"
										/>
										Mark as Popular
									</label>
								</div>

								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<label className="text-xs font-semibold text-gray-600">
											Features
										</label>
										<button
											type="button"
											onClick={() =>
												setEditingPlan({
													...editingPlan,
													features: [
														...(editingPlan?.features || []),
														{ text: "", included: true },
													],
												})
											}
											className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
										>
											+ Add Feature
										</button>
									</div>

									<div className="space-y-2 max-h-40 overflow-y-auto pr-1">
										{editingPlan?.features?.map((f, idx) => (
											<div
												// biome-ignore lint/suspicious/noArrayIndexKey: idx is stable here as we don't reorder features
												key={idx}
												className="flex items-center gap-2"
											>
												<input
													value={f.text}
													onChange={(e) => {
														const newF = [...(editingPlan.features || [])];
														newF[idx].text = e.target.value;
														setEditingPlan({ ...editingPlan, features: newF });
													}}
													className="flex-1 px-3 py-1.5 text-sm border rounded hover:border-indigo-300 focus:border-indigo-500 outline-none"
													placeholder="e.g. Unlimited Projects"
												/>
												<select
													value={f.included ? "yes" : "no"}
													onChange={(e) => {
														const newF = [...(editingPlan.features || [])];
														newF[idx].included = e.target.value === "yes";
														setEditingPlan({ ...editingPlan, features: newF });
													}}
													className="px-2 py-1.5 text-sm border rounded outline-none"
												>
													<option value="yes">Incl.</option>
													<option value="no">Excl.</option>
												</select>
												<button
													type="button"
													onClick={() => {
														const newF = editingPlan.features?.filter(
															(_, i) => i !== idx,
														);
														setEditingPlan({ ...editingPlan, features: newF });
													}}
													className="p-1 px-2 text-gray-400 hover:text-red-600 rounded bg-gray-50 border"
												>
													<Plus size={14} className="rotate-45" />
												</button>
											</div>
										))}
									</div>
								</div>
							</div>

							<div className="p-6 border-t bg-gray-50 shrink-0 flex justify-end gap-3 rounded-b-2xl">
								<button
									type="button"
									onClick={() => setIsModalOpen(false)}
									className="px-4 py-2 font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="px-4 py-2 font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
								>
									Save Plan
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
