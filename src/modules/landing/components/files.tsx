import {
	ArrowRight,
	BarChart3,
	Calendar,
	CheckCircle,
	Code2,
	GitBranch,
	Shield,
	Users,
	Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SprintlyLanding() {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
			{/* Navigation */}
			<nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Code2 className="w-8 h-8 text-indigo-600" />
						<span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
							Sprintly
						</span>
					</div>
					<div className="hidden md:flex items-center gap-8">
						<a
							href="#features"
							className="text-gray-600 hover:text-indigo-600 transition"
						>
							Features
						</a>
						<a
							href="#teams"
							className="text-gray-600 hover:text-indigo-600 transition"
						>
							For Teams
						</a>
						<a
							href="#about"
							className="text-gray-600 hover:text-indigo-600 transition"
						>
							About
						</a>
						{/* UPDATED: Navigate to /register */}
						<button
							onClick={() => navigate("/register")}
							className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm"
						>
							Join Sprintly
						</button>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<section className="max-w-7xl mx-auto px-6 pt-20 pb-32">
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
							The all-in-one platform where developers and leads manage
							projects, collaborate seamlessly, and integrate tools—without the
							chaos.
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
								<div className="text-blue-400">
									✓ Tests passed (98% coverage)
								</div>
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

			{/* About Section */}
			<section id="about" className="bg-white py-20">
				<div className="max-w-7xl mx-auto px-6">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-gray-900 mb-4">
							Why Sprintly?
						</h2>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto">
							Designed specifically for development teams who need more than
							just task boards. Sprintly brings together project management,
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

			{/* Features Section */}
			<section id="features" className="py-20">
				<div className="max-w-7xl mx-auto px-6">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-gray-900 mb-4">
							Everything You Need
						</h2>
						<p className="text-xl text-gray-600">
							Powerful features that streamline your development workflow
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{[
							{
								icon: CheckCircle,
								title: "Task Management",
								desc: "Create, assign, and track tasks with custom workflows and priorities",
							},
							{
								icon: Users,
								title: "Team Collaboration",
								desc: "Real-time chat, comments, and notifications keep everyone in sync",
							},
							{
								icon: GitBranch,
								title: "Git Integration",
								desc: "Connect repositories, track commits, and link PRs to tasks automatically",
							},
							{
								icon: Calendar,
								title: "Meeting Scheduling",
								desc: "Built-in calendar and scheduling tools for standups and sprint planning",
							},
							{
								icon: BarChart3,
								title: "Progress Tracking",
								desc: "Visualize sprint velocity, burndown charts, and team performance",
							},
							{
								icon: Zap,
								title: "Automation",
								desc: "Automate workflows, notifications, and repetitive tasks to save time",
							},
						].map((feature) => (
							<div
								key={feature.title}
								className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border border-gray-100"
							>
								<feature.icon className="w-10 h-10 text-indigo-600 mb-4" />
								<h3 className="text-lg font-bold text-gray-900 mb-2">
									{feature.title}
								</h3>
								<p className="text-gray-600">{feature.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Teams Section */}
			<section id="teams" className="bg-white py-20">
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
							<h3 className="text-2xl font-bold text-gray-900 mb-3">
								Developer
							</h3>
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

			{/* CTA Section */}
			<section className="py-20">
				<div className="max-w-4xl mx-auto px-6 text-center">
					<div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-3xl p-12 shadow-2xl">
						<h2 className="text-4xl font-bold text-white mb-4">
							Ready to Transform Your Workflow?
						</h2>
						<p className="text-xl text-indigo-100 mb-8">
							Join thousands of development teams already using Sprintly to ship
							faster and collaborate better.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							{/* UPDATED: Navigate to /register */}
							<button
								onClick={() => navigate("/register")}
								className="px-8 py-4 bg-white text-indigo-600 rounded-xl hover:bg-gray-50 transition shadow-lg text-lg font-semibold"
							>
								Join the Waitlist
							</button>
							<button className="px-8 py-4 bg-indigo-700 text-white rounded-xl hover:bg-indigo-800 transition border-2 border-indigo-400 text-lg font-semibold">
								Schedule a Demo
							</button>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-gray-900 text-gray-400 py-12">
				<div className="max-w-7xl mx-auto px-6">
					<div className="grid md:grid-cols-4 gap-8 mb-8">
						<div>
							<div className="flex items-center gap-2 mb-4">
								<Code2 className="w-6 h-6 text-indigo-400" />
								<span className="text-xl font-bold text-white">Sprintly</span>
							</div>
							<p className="text-sm">
								Project management built for modern development teams.
							</p>
						</div>

						<div>
							<h4 className="text-white font-semibold mb-4">Product</h4>
							<ul className="space-y-2 text-sm">
								<li>
									<a href="#!" className="hover:text-white transition">
										Features
									</a>
								</li>
								<li>
									<a href="#!" className="hover:text-white transition">
										Pricing
									</a>
								</li>
								<li>
									<a href="#!" className="hover:text-white transition">
										Integrations
									</a>
								</li>
								<li>
									<a href="#!" className="hover:text-white transition">
										API Docs
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="text-white font-semibold mb-4">Company</h4>
							<ul className="space-y-2 text-sm">
								<li>
									<a href="#!" className="hover:text-white transition">
										About Us
									</a>
								</li>
								<li>
									<a href="#!" className="hover:text-white transition">
										Blog
									</a>
								</li>
								<li>
									<a href="#!" className="hover:text-white transition">
										Careers
									</a>
								</li>
								<li>
									<a href="#!" className="hover:text-white transition">
										Contact
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="text-white font-semibold mb-4">Connect</h4>
							<ul className="space-y-2 text-sm">
								<li>
									<a
										href="mailto:hello@sprintly.dev"
										className="hover:text-white transition"
									>
										hello@sprintly.dev
									</a>
								</li>
								<li>
									<a href="#!" className="hover:text-white transition">
										Twitter
									</a>
								</li>
								<li>
									<a href="#!" className="hover:text-white transition">
										GitHub
									</a>
								</li>
								<li>
									<a href="#!" className="hover:text-white transition">
										LinkedIn
									</a>
								</li>
							</ul>
						</div>
					</div>

					<div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
						<p>© 2025 Sprintly. All rights reserved.</p>
						<div className="flex gap-6 mt-4 md:mt-0">
							<a href="#!" className="hover:text-white transition">
								Privacy Policy
							</a>
							<a href="#!" className="hover:text-white transition">
								Terms of Service
							</a>
							<a href="#!" className="hover:text-white transition">
								Security
							</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
