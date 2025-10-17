import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Testimonials from "@/components/Testimonials";


const page = () => {
  return (

    <div className="flex flex-col gap-10 w-screen">
  {/* navbar */}
  <Navbar/>
  {/* Hero section */}
  <Hero/>


  {/* feature */}
  {/* testomonials */}
  <Testimonials/>
  <CTASection/>
  {/* Footer */}
  <Footer/>
 </div>
)
};

export default page;
