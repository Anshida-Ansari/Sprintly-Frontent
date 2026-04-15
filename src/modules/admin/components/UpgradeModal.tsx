import { Check, Rocket, Shield, Zap, X, Sparkles } from "lucide-react";
import { useCreateStripeSession, useUpgradeSubscription } from "../hooks/useSubscription";

interface UpgradeModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
	const { mutate: upgradeSimulated, isPending: isUpgradingSimulated } = useUpgradeSubscription();
	const { mutate: createStripeSession, isPending: isCreatingSession } = useCreateStripeSession();

	if (!isOpen) return null;

	const PRO_PRICE_ID = "price_1TLmEXF7vhBBxTD2tPyXV0re";

	const handleUpgrade = () => {
		createStripeSession(PRO_PRICE_ID);
	};

	const plans = [
		{
			name: "Free",
			price: "₹0",
			period: "/month",
			badge: "Current Plan",
			badgeColor: "bg-gray-100 text-gray-500",
			borderColor: "border-gray-200",
			bgColor: "bg-gray-50",
			features: [
				{ text: "Up to 2 Projects", included: true },
				{ text: "Basic Analytics", included: true },
				{ text: "Team Collaboration", included: true },
				{ text: "Unlimited Projects", included: false },
				{ text: "Priority Support", included: false },
				{ text: "Advanced Analytics", included: false },
			],
			cta: null,
		},
		{
			name: "Pro",
			price: "₹469",
			period: "/month",
			badge: "Most Popular",
			badgeColor: "bg-indigo-600 text-white",
			borderColor: "border-indigo-500",
			bgColor: "bg-white",
			features: [
				{ text: "Up to 2 Projects", included: true },
				{ text: "Basic Analytics", included: true },
				{ text: "Team Collaboration", included: true },
				{ text: "Unlimited Projects", included: true },
				{ text: "Priority Support", included: true },
				{ text: "Advanced Analytics", included: true },
			],
			cta: handleUpgrade,
		},
	];

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
			<div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm" onClick={onClose} />
			
			<div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden">
				{/* Header gradient */}
				<div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-7 text-white relative overflow-hidden">
					<div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
					<div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full" />
					<button
						onClick={onClose}
						className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
					>
						<X size={18} className="text-white" />
					</button>
					<div className="flex items-center gap-3 mb-1">
						<div className="p-2 bg-white/20 rounded-xl">
							<Sparkles size={22} className="text-yellow-300" />
						</div>
						<h2 className="text-2xl font-black tracking-tight">Unlock Your Full Potential</h2>
					</div>
					<p className="text-indigo-100 text-sm">
						You've reached the free plan limit. Upgrade to Pro for unlimited projects.
					</p>
				</div>

				{/* Plan comparison */}
				<div className="p-6 grid grid-cols-2 gap-4">
					{plans.map((plan) => (
						<div
							key={plan.name}
							className={`rounded-2xl border-2 ${plan.borderColor} ${plan.bgColor} p-5 flex flex-col relative overflow-hidden`}
						>
							{/* Badge */}
							<span className={`absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full ${plan.badgeColor}`}>
								{plan.badge}
							</span>

							{/* Plan name & price */}
							<div className="mb-5">
								<p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-1">{plan.name}</p>
								<div className="flex items-baseline gap-1">
									<span className="text-3xl font-black text-gray-900">{plan.price}</span>
									<span className="text-sm text-gray-400 font-medium">{plan.period}</span>
								</div>
							</div>

							{/* Features */}
							<ul className="space-y-2.5 flex-1 mb-5">
								{plan.features.map((f, idx) => (
									<li key={idx} className="flex items-center gap-2.5 text-sm">
										{f.included ? (
											<div className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
												<Check size={10} className="text-indigo-600 stroke-[3]" />
											</div>
										) : (
											<div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
												<X size={10} className="text-gray-400 stroke-[3]" />
											</div>
										)}
										<span className={f.included ? "text-gray-700" : "text-gray-400 line-through"}>
											{f.text}
										</span>
									</li>
								))}
							</ul>

							{/* CTA */}
							{plan.cta ? (
								<button
									onClick={plan.cta}
									disabled={isCreatingSession || isUpgradingSimulated}
									className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-200 disabled:opacity-60 flex items-center justify-center gap-2 group"
								>
									{isCreatingSession ? (
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
									) : (
										<>
											Upgrade Now
											<Zap size={15} className="fill-white group-hover:scale-110 transition-transform" />
										</>
									)}
								</button>
							) : (
								<div className="w-full py-3 bg-gray-100 text-gray-400 rounded-xl font-bold text-sm text-center cursor-not-allowed">
									Current Plan
								</div>
							)}
						</div>
					))}
				</div>

				{/* Footer */}
				<div className="px-6 pb-5 flex flex-col items-center gap-2">
					<button
						onClick={() => upgradeSimulated()}
						disabled={isUpgradingSimulated || isCreatingSession}
						className="text-xs text-gray-400 hover:text-indigo-600 transition-colors font-medium"
					>
						{isUpgradingSimulated ? "Upgrading..." : "Simulate Upgrade (Dev Only)"}
					</button>
					<p className="text-xs text-gray-400 flex items-center gap-1">
						<Shield size={12} />
						Secured by Stripe · Cancel anytime · No hidden fees
					</p>
				</div>
			</div>
		</div>
	);
}
