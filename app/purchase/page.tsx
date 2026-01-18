import { ArrowRight, TrendingUp, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/lib/components/client";
import { buyingGuide, purchaseBenefits } from "@/lib/data";
import { prisma } from "@/lib/db";

export default async function PurchasePage() {
  const purchaseProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      quantity: { gt: 0 },
      purchasePrice: { gt: 0 },
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
      purchasePrice: "asc",
    },
    take: 12,
  });

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary/10 via-primary/5 to-accent/10 py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Own Your Clean Energy
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">
                {" "}
                Solution
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground">
              Make a permanent investment in renewable energy. Buy premium
              equipment with long warranties and maximize your energy savings.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <div className="px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30 inline-flex items-center gap-2 justify-center">
                <TrendingUp className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium text-secondary">
                  Save 50% on energy costs
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
              Why Buy?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join homeowners and businesses making smart long-term investments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {purchaseBenefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={idx}
                  className="p-6 sm:p-8 border border-border rounded-xl hover:border-secondary transition-all duration-300 hover:shadow-lg"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-secondary/10 mb-4">
                    <Icon className="w-6 h-6 text-secondary" />
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

      {/* Products */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Available for Purchase
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Premium renewable energy systems with long-term warranties
            </p>
          </div>

          {purchaseProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchaseProducts.map((product) => (
                <ProductCard key={product.id} {...product} mode="purchase" />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-border">
              <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-40" />
              <h3 className="text-2xl font-bold text-foreground mb-2">
                No Products Available for Purchase
              </h3>
              <p className="text-muted-foreground mb-6">Check back soon for new products</p>
              <Link
                href="/rent"
                className="inline-block px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-all duration-200"
              >
                View Rental Options
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Buying Guide */}
      <section className="py-16 sm:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Buying Guide
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our simple four-step process to your new renewable energy system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {buyingGuide.map((step, idx) => (
              <div key={idx} className="relative">
                {idx < 3 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-1 bg-gradient-to-r from-secondary to-transparent" />
                )}
                <div className="relative z-10 bg-white border-2 border-secondary rounded-xl p-6 text-center h-full flex flex-col">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-white font-bold mb-4 mx-auto">
                    {step.num}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm flex-grow">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financing Options */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Flexible Financing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Make renewable energy affordable with our financing options
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Zero Down",
                desc: "Get started with $0 down and flexible monthly payments",
                highlight: true,
              },
              {
                title: "Tax Credits",
                desc: "Reduce costs with up to 40% federal tax credit",
                highlight: false,
              },
              {
                title: "Fast Approval",
                desc: "Quick financing approval with no hidden fees",
                highlight: false,
              },
            ].map((option, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-xl border-2 ${
                  option.highlight
                    ? "border-secondary bg-gradient-to-br from-secondary/10 to-accent/10"
                    : "border-border hover:border-secondary"
                } transition-all duration-300`}
              >
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {option.title}
                </h3>
                <p className="text-muted-foreground">{option.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
