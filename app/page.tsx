import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Zap, Sun } from "lucide-react";
import { ProductCard } from "@/lib/components/client";
import { howItWorks, testimonials } from "@/lib/data";
import { prisma } from "@/lib/db";
import { getMode } from "@/lib/utils";

export default async function Home() {
  // Fetch featured products from database
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      quantity: { gt: 0 },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 4, // Show 4 featured products
  });

  const featuredProducts = products.map((product) => ({
    ...product,
    additionalImages: product.additionalImages as string[],
    features: product.additionalImages as string[],
    specifications: product.specifications as Record<string, string>,
    createdAt: product.createdAt.toLocaleDateString(),
    updatedAt: product.updatedAt.toLocaleDateString(),
  }));
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 pt-12 sm:pt-20 pb-16 sm:pb-28 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-10 right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl opacity-50 hidden md:block" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-secondary/20 rounded-full blur-3xl opacity-50 hidden md:block" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight animate-fade-in">
                  Power Your Future with
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                    {" "}
                    Clean Energy
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-lg leading-relaxed">
                  Rent or buy premium renewable energy equipment from industry
                  leaders. Start your sustainability journey with EnergyHub.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/rent"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Start Renting
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  href="/purchase"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg border-2 border-secondary text-secondary font-semibold hover:bg-secondary/10 transition-all duration-200"
                >
                  Browse to Buy
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <Check className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    10,000+ Happy Customers
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <Sun className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    Expert Support
                  </span>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative h-80 sm:h-96 md:h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-2xl" />
              <Image
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=600&fit=crop"
                alt="Clean energy technology"
                width={600}
                height={600}
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Featured Equipment
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our curated selection of premium renewable energy
              solutions
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} mode={getMode(product)} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started with clean energy in just 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative group">
                  {/* Connector Line */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-full w-full h-1 bg-gradient-to-r from-primary to-transparent" />
                  )}

                  <div className="relative z-10 bg-white rounded-xl p-6 sm:p-8 border border-border hover:border-primary transition-all duration-300 hover:shadow-lg h-full">
                    {/* Number Badge */}
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary text-white font-bold mb-4">
                      {index + 1}
                    </div>

                    <Icon className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Rent vs Buy Comparison */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Rent or Buy?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the option that best fits your energy needs and budget
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Rent Card */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary rounded-2xl p-8 sm:p-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full mb-6 font-semibold">
                <Zap className="w-4 h-4" />
                Flexible Rental
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
                Rent Equipment
              </h3>

              <ul className="space-y-4 mb-8">
                {[
                  "No upfront capital investment",
                  "Maintenance included",
                  "Upgrade anytime",
                  "Perfect for testing",
                  "Month-to-month flexibility",
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/rent"
                className="w-full inline-block text-center px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-all duration-200"
              >
                Explore Rentals
              </Link>
            </div>

            {/* Buy Card */}
            <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-2 border-secondary rounded-2xl p-8 sm:p-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-full mb-6 font-semibold">
                <Sun className="w-4 h-4" />
                Long-term Investment
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
                Buy Equipment
              </h3>

              <ul className="space-y-4 mb-8">
                {[
                  "Own your equipment",
                  "Maximum savings over time",
                  "Tax incentives available",
                  "Increase property value",
                  "20+ year lifespan",
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary text-white flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/purchase"
                className="w-full inline-block text-center px-6 py-3 rounded-lg bg-secondary text-white font-semibold hover:bg-secondary/90 transition-all duration-200"
              >
                View Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real experiences from our satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 sm:p-8 border border-border hover:border-primary transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">
                      ★
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Go Green?
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Join thousands of customers who are saving money and the planet with
            renewable energy from EnergyHub.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/rent"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-white text-primary font-semibold hover:bg-gray-100 transition-all duration-200"
            >
              Rent Now
            </Link>
            <Link
              href="/purchase"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg border-2 border-white text-white font-semibold hover:bg-white/10 transition-all duration-200"
            >
              View Buying Options
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
