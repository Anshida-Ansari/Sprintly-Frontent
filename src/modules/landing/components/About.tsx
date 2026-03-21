import { Code2, Shield, Users } from "lucide-react";

// components/landing/About.jsx
export default function About() {
	return (
		<section id="about" className="bg-slate-50 py-24">
			<div className="max-w-7xl mx-auto px-6">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold text-gray-900 mb-4">
						Why Sprintly?
					</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						Designed specifically for development teams who need more than just
						task boards. Sprintly brings together project management,
						collaboration, and developer tools in one unified platform.
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-8">
					<div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-2xl border border-indigo-100">
						<div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4">
							<Code2 className="w-6 h-6 text-white" />
						</div>
						<h3 className="text-xl font-bold text-gray-900 mb-3">
							Developer-First Design
						</h3>
						<p className="text-gray-600">
							Built by developers, for developers. Native Git integration, CLI
							support, and workflows that match how you actually work.
						</p>
					</div>

					<div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100">
						<div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
							<Users className="w-6 h-6 text-white" />
						</div>
						<h3 className="text-xl font-bold text-gray-900 mb-3">
							Seamless Collaboration
						</h3>
						<p className="text-gray-600">
							Real-time updates, integrated meetings, and communication tools
							that keep everyone aligned without constant context switching.
						</p>
					</div>

					<div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl border border-indigo-100">
						<div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
							<Shield className="w-6 h-6 text-white" />
						</div>
						<h3 className="text-xl font-bold text-gray-900 mb-3">
							Enterprise Ready
						</h3>
						<p className="text-gray-600">
							Role-based permissions, audit logs, SSO support, and security
							features that scale with your organization.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
