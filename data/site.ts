import {
  Award,
  BarChart3,
  Check,
  DollarSign,
  Leaf,
  Shield,
  TrendingUp,
  Wind,
  Zap,
} from "lucide-react";
import type { LucideProps } from "lucide-react";
import { ReactNode } from "react";

const SOLAR_PANEL_IMAGE = "/images/solar-panel.svg";
const WIND_TURBINE_IMAGE = "/images/wind-turbine.svg";
const BATTERY_STORAGE_IMAGE = "/images/battery-storage.svg";
const HYBRID_INVERTER_IMAGE = "/images/hybrid-inverter.svg";
const POWER_STATION_IMAGE = "/images/power-station.svg";
const EV_CHARGER_IMAGE = "/images/ev-charging.svg";
const SOLAR_HEATER_IMAGE = "/images/solar-heater.svg";
const SOLAR_ARRAY_IMAGE = "/images/solar-array.svg";
const SOLAR_SYSTEM_IMAGE = "/images/solar-system.svg";

type IconComponent = (props: LucideProps) => ReactNode;

export type ProductType = "rent" | "buy";

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  type: ProductType;
  price: number;
  originalPrice?: number;
  badge?: string;
  specs?: string[];
}

export const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Solar Panel Kit Pro",
    description: "High-efficiency monocrystalline solar panels",
    image: SOLAR_PANEL_IMAGE,
    rating: 4.8,
    reviews: 128,
    type: "rent",
    price: 299,
    badge: "Popular",
    specs: ["500W output", "20 year warranty"],
  },
  {
    id: "2",
    name: "Wind Turbine Mini",
    description: "Compact vertical axis wind turbine",
    image: WIND_TURBINE_IMAGE,
    rating: 4.6,
    reviews: 94,
    type: "buy",
    price: 1899,
    originalPrice: 2199,
    badge: "Sale",
    specs: ["3kW capacity", "Easy installation"],
  },
  {
    id: "3",
    name: "Battery Storage System",
    description: "LiFePO4 battery backup storage",
    image: BATTERY_STORAGE_IMAGE,
    rating: 4.9,
    reviews: 156,
    type: "rent",
    price: 199,
    specs: ["10kWh capacity", "Smart monitoring"],
  },
  {
    id: "4",
    name: "Hybrid Inverter System",
    description: "Grid-tie inverter with battery support",
    image: HYBRID_INVERTER_IMAGE,
    rating: 4.7,
    reviews: 112,
    type: "buy",
    price: 899,
    specs: ["15kW capacity", "WiFi monitoring"],
  },
];

export const rentalProducts: Product[] = [
  {
    id: "rent-1",
    name: "Portable Solar Panel 200W",
    description: "Lightweight and efficient solar panel system",
    image: SOLAR_PANEL_IMAGE,
    rating: 4.8,
    reviews: 156,
    type: "rent",
    price: 99,
    badge: "Best for Travel",
    specs: ["200W output", "Portable"],
  },
  {
    id: "rent-2",
    name: "Portable Power Station 3000W",
    description: "Complete energy solution with storage",
    image: POWER_STATION_IMAGE,
    rating: 4.9,
    reviews: 203,
    type: "rent",
    price: 199,
    badge: "Most Popular",
    specs: ["3000W capacity", "Multiple outlets"],
  },
  {
    id: "rent-3",
    name: "Wind Turbine Micro 1kW",
    description: "Small-scale wind energy generator",
    image: WIND_TURBINE_IMAGE,
    rating: 4.7,
    reviews: 89,
    type: "rent",
    price: 299,
    specs: ["1kW capacity", "12V/24V options"],
  },
  {
    id: "rent-4",
    name: "Solar Water Heater Kit",
    description: "Thermal heating system for water",
    image: SOLAR_HEATER_IMAGE,
    rating: 4.6,
    reviews: 67,
    type: "rent",
    price: 149,
    specs: ["100 gallon capacity", "Stainless steel"],
  },
  {
    id: "rent-5",
    name: "Hybrid Solar Kit 5kW",
    description: "Complete residential solar system",
    image: SOLAR_ARRAY_IMAGE,
    rating: 4.8,
    reviews: 234,
    type: "rent",
    price: 499,
    badge: "Premium",
    specs: ["5kW output", "Battery ready"],
  },
  {
    id: "rent-6",
    name: "EV Charging Station",
    description: "Level 2 electric vehicle charger",
    image: EV_CHARGER_IMAGE,
    rating: 4.5,
    reviews: 112,
    type: "rent",
    price: 249,
    specs: ["240V operation", "NEMA 14-50"],
  },
];

export const purchaseProducts: Product[] = [
  {
    id: "buy-1",
    name: "Solar Panel Array 10kW",
    description: "Professional-grade solar array system",
    image: SOLAR_ARRAY_IMAGE,
    rating: 4.9,
    reviews: 287,
    type: "buy",
    price: 3999,
    originalPrice: 4599,
    badge: "Best Value",
    specs: ["10kW capacity", "25 year warranty"],
  },
  {
    id: "buy-2",
    name: "Complete Home Battery System",
    description: "LiFePO4 residential battery storage",
    image: BATTERY_STORAGE_IMAGE,
    rating: 4.8,
    reviews: 198,
    type: "buy",
    price: 5499,
    specs: ["15kWh capacity", "Smart management"],
  },
  {
    id: "buy-3",
    name: "Wind Turbine 10kW",
    description: "Residential wind energy system",
    image: WIND_TURBINE_IMAGE,
    rating: 4.7,
    reviews: 145,
    type: "buy",
    price: 12999,
    originalPrice: 14999,
    badge: "Premium",
    specs: ["10kW output", "20 year warranty"],
  },
  {
    id: "buy-4",
    name: "Hybrid Inverter 15kW",
    description: "Grid-tie with battery backup inverter",
    image: HYBRID_INVERTER_IMAGE,
    rating: 4.8,
    reviews: 176,
    type: "buy",
    price: 2899,
    specs: ["15kW capacity", "WiFi monitoring"],
  },
  {
    id: "buy-5",
    name: "Complete Solar System 25kW",
    description: "Full commercial solar installation package",
    image: SOLAR_SYSTEM_IMAGE,
    rating: 4.9,
    reviews: 342,
    type: "buy",
    price: 8999,
    specs: ["25kW capacity", "Commercial grade"],
  },
  {
    id: "buy-6",
    name: "Premium EV Charging System",
    description: "Level 3 DC fast charging station",
    image: EV_CHARGER_IMAGE,
    rating: 4.6,
    reviews: 223,
    type: "buy",
    price: 6999,
    specs: ["50kW DC charging", "Network enabled"],
  },
];

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
