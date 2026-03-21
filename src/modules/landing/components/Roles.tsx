import { CheckCircle, Code2, Shield, Users } from "lucide-react";

export default function Roles() {
	return (
		<section id="teams" className="bg-white py-24 border-y border-slate-100">
			<div className="max-w-7xl mx-auto px-6">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold text-gray-900 mb-4">
						Built for Every Role
					</h2>
					<p className="text-xl text-gray-600">
						Flexible permissions and workflows for your entire team structure
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-8">
					<div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-2xl border border-purple-100 text-center">
						<div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
							<Shield className="w-8 h-8 text-white" />
						</div>
						<h3 className="text-2xl font-bold text-gray-900 mb-3">
							Super Admin
						</h3>
						<p className="text-gray-600 mb-4">
							Full platform control with organization-wide settings, billing
							management, and complete oversight of all projects and teams.
						</p>
						<ul className="text-sm text-gray-600 space-y-2">
							<li className="flex items-center gap-2">
								<CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
								Manage all workspaces
							</li>
							<li className="flex items-center gap-2">
								<CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
								Configure integrations
							</li>
							<li className="flex items-center gap-2">
								<CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
								Access audit logs
							</li>
						</ul>
					</div>

					<div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-2xl border border-indigo-100 text-center">
						<div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
							<Users className="w-8 h-8 text-white" />
						</div>
						<h3 className="text-2xl font-bold text-gray-900 mb-3">
							Admin (Lead)
						</h3>
						<p className="text-gray-600 mb-4">
							Project leads manage sprints, assign tasks, track team progress,
							and schedule meetings while maintaining project visibility.
						</p>
						<ul className="text-sm text-gray-600 space-y-2">
							<li className="flex items-center gap-2">
								<CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
								Manage project settings
							</li>
							<li className="flex items-center gap-2">
								<CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
								Assign and review tasks
							</li>
							<li className="flex items-center gap-2">
								<CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
								View team analytics
							</li>
						</ul>
					</div>

					<div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100 text-center">
						<div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
							<Code2 className="w-8 h-8 text-white" />
						</div>
						<h3 className="text-2xl font-bold text-gray-900 mb-3">Developer</h3>
						<p className="text-gray-600 mb-4">
							Focus on coding with a clean interface for task tracking, PR
							linking, time logging, and seamless collaboration with the team.
						</p>
						<ul className="text-sm text-gray-600 space-y-2">
							<li className="flex items-center gap-2">
								<CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
								Work on assigned tasks
							</li>
							<li className="flex items-center gap-2">
								<CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
								Link commits and PRs
							</li>
							<li className="flex items-center gap-2">
								<CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
								Track time and updates
							</li>
						</ul>
					</div>
				</div>
			</div>
		</section>
	);
}
