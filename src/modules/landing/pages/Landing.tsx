import About from "../components/About";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Features from "../components/Feature";
import Roles from "../components/Roles";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

export default function LandingPage(){
    return(
        <>
        <Navbar/>
        <Hero/>
        <About/>
        <Features/>
        <Roles/>
        <CTA/>
        <Footer/>
        </>
    )
}