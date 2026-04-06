// components/landing/Navbar.jsx
import { Code2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
	const navigate = useNavigate();

	return (
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
						className="text-gray-600 hover:text-indigo-600 transition font-medium"
					>
						Features
					</a>
					<a
						href="#teams"
						className="text-gray-600 hover:text-indigo-600 transition font-medium"
					>
						For Teams
					</a>
					<a
						href="#about"
						className="text-gray-600 hover:text-indigo-600 transition font-medium"
					>
						About
					</a>
					<button
						onClick={() => navigate("/register")}
						className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-all duration-150 shadow-sm hover:shadow-md"
					>
						Join Sprintly
					</button>
				</div>
			</div>
		</nav>
	);
}
