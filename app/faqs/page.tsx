"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronUp, Search } from "lucide-react";

const faqs = [
  {
    category: "General",
    questions: [
      {
        q: "What is EnergyHub?",
        a: "EnergyHub is a premier marketplace for renewable energy equipment. We offer both rental and purchase options for solar panels, wind turbines, battery storage systems, and other clean energy solutions.",
      },
      {
        q: "Do you offer installation services?",
        a: "Yes! We provide professional installation services for all products. Our certified technicians will handle the complete setup, ensuring your equipment is properly installed and optimized for maximum efficiency.",
      },
      {
        q: "What areas do you service?",
        a: "We currently service all 50 US states. Shipping and installation timelines may vary based on your location. Contact us for specific availability in your area.",
      },
    ],
  },
  {
    category: "Rentals",
    questions: [
      {
        q: "How do rental periods work?",
        a: "Our rental periods are flexible and can be customized based on your needs. We offer daily, weekly, and monthly rental options. You can extend your rental period at any time or upgrade to purchase the equipment.",
      },
      {
        q: "Is maintenance included in rentals?",
        a: "Yes! All rental agreements include regular maintenance and support. If any issues arise with the equipment, we'll repair or replace it at no additional cost to you.",
      },
      {
        q: "Can I purchase equipment I'm currently renting?",
        a: "Absolutely! We offer rent-to-own options. A portion of your rental payments can be applied toward the purchase price. Contact our sales team to discuss the details.",
      },
      {
        q: "What happens if I damage rented equipment?",
        a: "Normal wear and tear is expected and covered. For damage beyond normal use, you may be responsible for repair costs. We recommend reviewing our rental agreement for complete details.",
      },
    ],
  },
  {
    category: "Purchases",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards, bank transfers, and cryptocurrency payments. Financing options are also available for qualified buyers.",
      },
      {
        q: "Do you offer warranties on purchased equipment?",
        a: "Yes! All our equipment comes with manufacturer warranties ranging from 5-25 years depending on the product. We also offer extended warranty options for additional peace of mind.",
      },
      {
        q: "Can I return purchased equipment?",
        a: "We offer a 30-day satisfaction guarantee on all purchases. If you're not completely satisfied, you can return the equipment for a full refund (excluding installation costs).",
      },
      {
        q: "Are there tax incentives for purchasing renewable energy equipment?",
        a: "Yes! Many federal and state tax incentives are available for renewable energy purchases. The Federal Solar Tax Credit (ITC) currently offers 30% back on solar installations. We can help you navigate available incentives in your area.",
      },
    ],
  },
  {
    category: "Technical",
    questions: [
      {
        q: "How much energy can I expect to generate?",
        a: "Energy generation depends on several factors including equipment type, location, sunlight hours, and weather conditions. Our team can provide a customized energy assessment based on your specific situation.",
      },
      {
        q: "What happens during power outages?",
        a: "Systems with battery storage can provide backup power during outages. Grid-tied systems without batteries will shut down for safety reasons. We can help you design a system that meets your backup power needs.",
      },
      {
        q: "How long does installation take?",
        a: "Most residential installations are completed within 1-3 days. Larger commercial projects may take 1-2 weeks. Timeline depends on system size, complexity, and permitting requirements.",
      },
      {
        q: "Do I need special permits?",
        a: "Yes, most renewable energy installations require local permits and utility approval. We handle all permitting and paperwork as part of our installation service.",
      },
    ],
  },
  {
    category: "Billing & Account",
    questions: [
      {
        q: "How do I create an account?",
        a: "You can create an account during the checkout process or by clicking the 'Login' button in the header. Accounts are required to complete purchases and track orders.",
      },
      {
        q: "When will I be charged?",
        a: "For purchases, payment is processed when you place your order. For rentals, you'll be charged on the rental start date and then according to your selected billing cycle (daily, weekly, or monthly).",
      },
      {
        q: "Can I cancel my order?",
        a: "Orders can be canceled within 24 hours of placement for a full refund. After 24 hours, cancellation policies vary based on whether the equipment has been shipped or installed.",
      },
      {
        q: "How do I apply a coupon code?",
        a: "Coupon codes can be entered during checkout. Simply paste your code in the 'Coupon Code' field and click 'Apply' to see your discount reflected in the order total.",
      },
    ],
  },
];

export default function FAQsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = faqs.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (faq) =>
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-lg sm:text-xl text-white/90">
              Find answers to common questions about our products, services, and policies.
            </p>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-8 -mt-8 relative z-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {filteredFaqs.length > 0 ? (
            <div className="space-y-12">
              {filteredFaqs.map((category, catIndex) => (
                <div key={catIndex}>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
                    {category.category}
                  </h2>

                  <div className="space-y-4">
                    {category.questions.map((faq, faqIndex) => {
                      const id = `${catIndex}-${faqIndex}`;
                      const isOpen = openItems.includes(id);

                      return (
                        <div
                          key={id}
                          className="bg-white rounded-xl border border-border overflow-hidden hover:border-primary transition-all duration-200"
                        >
                          <button
                            onClick={() => toggleItem(id)}
                            className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                          >
                            <span className="font-semibold text-foreground pr-4">{faq.q}</span>
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            )}
                          </button>

                          {isOpen && (
                            <div className="px-6 pb-5 text-muted-foreground leading-relaxed">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-border">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-40" />
              <h3 className="text-2xl font-bold text-foreground mb-2">No Results Found</h3>
              <p className="text-muted-foreground mb-6">
                Try different keywords or browse all categories
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-all duration-200"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl font-bold text-foreground mb-4">Still Have Questions?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            {"Can't"} find the answer {"you're"} looking for? Our customer support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block px-8 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-all duration-200"
            >
              Contact Support
            </Link>
            <Link
              href="/products"
              className="inline-block px-8 py-3 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary/10 transition-all duration-200"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
