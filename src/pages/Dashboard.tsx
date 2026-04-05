import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import CategoriesSection from "../components/CategoriesSection";
import DestinationsSection from "../components/DestinationsSection";
import RecommendedSection from "../components/RecommendedSection";
import MonthlyRentalSection from "../components/MonthlyRentalSection";
import BenefitsSection from "../components/BenefitsSection";
import TestimonialsSection from "../components/TestimonialsSection";
import BudgetSection from "../components/BudgetSection";
import HowItWorksSection from "../components/HowItWorksSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <CategoriesSection />
      <DestinationsSection />
      <RecommendedSection />
      <MonthlyRentalSection />
      <BenefitsSection />
      <TestimonialsSection />
      <BudgetSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Dashboard;
