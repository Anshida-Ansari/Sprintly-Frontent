import About from "../components/About";
import CTA from "../components/CTA";
import Features from "../components/Feature";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Roles from "../components/Roles";

export default function LandingPage() {
	return (
		<>
			<Navbar />
			<Hero />
			<About />
			<Features />
			<Roles />
			<CTA />
			<Footer />
		</>
	);
}
