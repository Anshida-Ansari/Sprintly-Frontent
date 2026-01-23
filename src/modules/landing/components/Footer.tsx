import { Code2 } from "lucide-react";

// components/landing/Footer.jsx
export default function Footer() {
	return (
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
								<a href="#" className="hover:text-white transition">
									Features
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-white transition">
									Pricing
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-white transition">
									Integrations
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-white transition">
									API Docs
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h4 className="text-white font-semibold mb-4">Company</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<a href="#" className="hover:text-white transition">
									About Us
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-white transition">
									Blog
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-white transition">
									Careers
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-white transition">
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
								<a href="#" className="hover:text-white transition">
									Twitter
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-white transition">
									GitHub
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-white transition">
									LinkedIn
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
					<p>© 2025 Sprintly. All rights reserved.</p>
					<div className="flex gap-6 mt-4 md:mt-0">
						<a href="#" className="hover:text-white transition">
							Privacy Policy
						</a>
						<a href="#" className="hover:text-white transition">
							Terms of Service
						</a>
						<a href="#" className="hover:text-white transition">
							Security
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
