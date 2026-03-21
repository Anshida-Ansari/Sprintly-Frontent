// components/landing/Hero.jsx
import { ArrowRight, CheckCircle, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
	const navigate = useNavigate();

	return (
		<section className="max-w-7xl mx-auto px-6 pt-32 pb-24">
			<div className="grid md:grid-cols-2 gap-12 items-center">
				<div>
					<div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
						<Zap className="w-4 h-4" />
						Project Management for Modern Teams
					</div>
					<h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
						Built for Developers.
						<br />
						<span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
							Powered by Collaboration.
						</span>
					</h1>
					<p className="text-xl text-gray-600 mb-8 leading-relaxed">
						The all-in-one platform where developers and leads manage projects,
						collaborate seamlessly, and integrate tools—without the chaos.
					</p>
					<div className="flex flex-col sm:flex-row gap-4">
						{/* UPDATED: Navigate to /register */}
						<button
							onClick={() => navigate("/register")}
							className="px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg font-semibold"
						>
							Get Started <ArrowRight className="w-5 h-5" />
						</button>
						<button className="px-8 py-4 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition shadow-md border border-gray-200 text-lg font-semibold">
							View Demo
						</button>
					</div>
					<div className="flex items-center gap-8 mt-12 text-sm text-gray-600">
						<div className="flex items-center gap-2">
							<CheckCircle className="w-5 h-5 text-green-500" />
							Free 14-day trial
						</div>
						<div className="flex items-center gap-2">
							<CheckCircle className="w-5 h-5 text-green-500" />
							No credit card required
						</div>
					</div>
				</div>

				<div className="relative">
					<div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl p-8 shadow-2xl transform rotate-1">
						<div className="bg-slate-900 rounded-lg p-6 text-left font-mono text-sm">
							<div className="flex gap-2 mb-4">
								<div className="w-3 h-3 rounded-full bg-red-500"></div>
								<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
								<div className="w-3 h-3 rounded-full bg-green-500"></div>
							</div>
							<div className="text-green-400">
								$ git commit -m "Sprint complete"
							</div>
							<div className="text-blue-400 mt-2">
								[main 7a8c9d2] Sprint complete
							</div>
							<div className="text-gray-400 mt-1">
								{" "}
								12 files changed, 847 insertions(+)
							</div>
							<div className="text-green-400 mt-4">
								$ sprintly deploy --production
							</div>
							<div className="text-blue-400 mt-2">✓ Build successful</div>
							<div className="text-blue-400">✓ Tests passed (98% coverage)</div>
							<div className="text-blue-400">✓ Deployed to production</div>
							<div className="text-gray-400 mt-2">
								Team notified · Sprint #42 closed
							</div>
						</div>
					</div>
					<div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-200 rounded-full blur-3xl opacity-50"></div>
					<div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-50"></div>
				</div>
			</div>
		</section>
	);
}
