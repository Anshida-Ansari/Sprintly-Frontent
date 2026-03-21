import About from "../components/About";
import CTA from "../components/CTA";
import Features from "../components/Feature";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Roles from "../components/Roles";

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 flex flex-col">
			<Navbar />
			<main className="flex-1">
				<Hero />
				<Features />
				<Roles />
				<About />
				<CTA />
			</main>
			<Footer />
		</div>
	);
}
