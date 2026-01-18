import { ArrowRight, Zap, Calendar } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/lib/components/client";
import { rentalBenefits } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export default async function RentPage() {
  // Fetch rental products from database
  const rentalProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      quantity: { gt: 0 },
      rentalPrice: { gt: 0 },
    },
    select: {
      id: true,
      name: true,
      shortDescription: true,
      category: true,
      rentalPrice: true,
      purchasePrice: true,
      rentalSalePrice: true,
      purchaseSalePrice: true,
      image: true,
      quantity: true,
    },
    orderBy: {
      rentalPrice: "asc",
    },
    take: 12, // Show 12 products
  });
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Flexible Energy Solutions
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                {" "}
                Without the Commitment
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground">
              Rent premium renewable energy equipment on a month-to-month basis.
              Test, upgrade, or switch anytime with zero long-term contracts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/30 inline-flex items-center gap-2 justify-center">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Rent from $99/month
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Rent?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the advantages of renting vs buying
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {rentalBenefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={idx}
                  className="p-6 sm:p-8 border border-border rounded-xl hover:border-primary transition-all duration-300 hover:shadow-lg"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Rental Products */}
      <section className="py-16 sm:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Available for Rent
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse our extensive catalog of rental equipment
            </p>
          </div>

          {rentalProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rentalProducts.map((product) => (
                <ProductCard key={product.id} {...product} mode="rent" />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-border">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-40" />
              <h3 className="text-2xl font-bold text-foreground mb-2">
                No Rental Products Available
              </h3>
              <p className="text-muted-foreground mb-6">Check back soon for new rental options</p>
              <Link
                href="/purchase"
                className="inline-block px-6 py-3 rounded-lg bg-secondary text-white font-medium hover:bg-secondary/90 transition-all duration-200"
              >
                View Products for Purchase
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Rental Process */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Simple Rental Process
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in three easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              {
                num: "1",
                title: "Select Equipment",
                desc: "Browse our catalog and pick what you need",
              },
              {
                num: "2",
                title: "Checkout",
                desc: "Complete payment and choose rental period",
              },
              {
                num: "3",
                title: "Deliver & Install",
                desc: "We deliver and install at your location",
              },
            ].map((step, idx) => (
              <div key={idx} className="relative">
                {idx < 2 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-1 bg-gradient-to-r from-primary to-transparent" />
                )}
                <div className="relative z-10 bg-white border-2 border-primary rounded-xl p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-bold mb-4">
                    {step.num}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Rent?
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Start your renewable energy journey today with flexible rental
            options
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-white text-primary font-semibold hover:bg-gray-100 transition-all duration-200"
            >
              Browse All Equipment
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg border-2 border-white text-white font-semibold hover:bg-white/10 transition-all duration-200"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
