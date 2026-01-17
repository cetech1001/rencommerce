import {
  Award,
  BarChart3,
  Check,
  DollarSign,
  Leaf,
  LucideProps,
  Shield,
  TrendingUp,
  Wind,
  Zap,
} from "lucide-react";
import { ReactNode } from "react";

type IconComponent = (props: LucideProps) => ReactNode;

export const howItWorks: { icon: IconComponent; title: string; description: string }[] = [
  {
    icon: Zap,
    title: "Browse & Select",
    description:
      "Explore our wide range of renewable energy equipment tailored to your needs",
  },
  {
    icon: TrendingUp,
    title: "Choose Your Plan",
    description: "Pick between renting for flexibility or buying for long-term investment",
  },
  {
    icon: Check,
    title: "Complete Setup",
    description: "Our experts handle installation and configuration for optimal performance",
  },
  {
    icon: Wind,
    title: "Start Saving",
    description: "Begin generating clean energy and reducing your carbon footprint today",
  },
];

export const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Homeowner",
    content:
      "EnergyHub made switching to solar incredibly easy. The rental option was perfect for testing before buying!",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  },
  {
    name: "Mike Chen",
    role: "Business Owner",
    content:
      "Saved 60% on energy costs within 6 months. Their support team is outstanding and always helpful.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
  {
    name: "Emma Rodriguez",
    role: "Farm Manager",
    content:
      "The wind turbine system has exceeded our expectations. Best investment we've made for sustainability.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
  },
];

export const rentalBenefits: { icon: IconComponent; title: string; description: string }[] = [
  {
    icon: Zap,
    title: "Test Before You Buy",
    description: "Try any equipment risk-free to ensure it meets your needs",
  },
  {
    icon: DollarSign,
    title: "Lower Initial Cost",
    description: "Flexible monthly payments instead of large upfront investment",
  },
  {
    icon: TrendingUp,
    title: "Upgrade Anytime",
    description: "Switch to newer models or upgrade your system whenever needed",
  },
  {
    icon: Shield,
    title: "Full Maintenance",
    description: "All repairs and maintenance included in your rental cost",
  },
];

export const purchaseBenefits: { icon: IconComponent; title: string; description: string }[] = [
  {
    icon: TrendingUp,
    title: "Long-term Savings",
    description: "Save thousands on energy costs over 20+ years of equipment lifespan",
  },
  {
    icon: Award,
    title: "Government Incentives",
    description: "Eligible for federal tax credits and state rebates up to 40%",
  },
  {
    icon: Leaf,
    title: "Environmental Impact",
    description: "Permanent reduction in carbon footprint for your property",
  },
  {
    icon: BarChart3,
    title: "Property Value",
    description:
      "Increase home value and appeal to eco-conscious buyers and renters",
  },
];

export const buyingGuide = [
  {
    num: "1",
    title: "Assess Your Needs",
    desc: "Evaluate your energy consumption and goals",
  },
  {
    num: "2",
    title: "Compare Options",
    desc: "Browse systems and compare features and pricing",
  },
  {
    num: "3",
    title: "Get Incentives",
    desc: "Explore available tax credits and rebates",
  },
  {
    num: "4",
    title: "Purchase & Install",
    desc: "Complete installation by our certified technicians",
  },
];
