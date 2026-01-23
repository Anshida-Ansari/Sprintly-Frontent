import {
	BarChart3,
	Calendar,
	CheckCircle,
	GitBranch,
	Users,
	Zap,
} from "lucide-react";

// components/landing/Features.jsx
export default function Features() {
	return (
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
					].map((feature, idx) => (
						<div
							key={idx}
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
	);
}
