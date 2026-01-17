import { ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { buyingGuide, purchaseBenefits, purchaseProducts } from "@/data/site";

export default function PurchasePage() {
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

      {/* Savings Calculator */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-secondary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-xl border-2 border-secondary p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
              Estimate Your Savings
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Current Monthly Energy Bill
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-lg text-muted-foreground">
                    $
                  </span>
                  <input
                    type="number"
                    placeholder="150"
                    className="w-full pl-8 pr-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-lg p-6 border border-secondary/30">
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">
                    Est. Annual Savings
                  </p>
                  <p className="text-4xl font-bold text-secondary">$1,800</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Over 20 years: $36,000
                  </p>
                </div>
              </div>

              <button className="w-full px-6 py-3 rounded-lg bg-secondary text-white font-semibold hover:bg-secondary/90 transition-all duration-200">
                Start Your Free Assessment
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </button>
            </div>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchaseProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
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

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-secondary to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Invest?
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Start your journey to energy independence and long-term savings
            today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-white text-secondary font-semibold hover:bg-gray-100 transition-all duration-200"
            >
              Start Assessment
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
