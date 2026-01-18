import Link from "next/link";
import { ArrowLeft, Shield, Lock, FileText } from "lucide-react";

export default function TermsPage() {
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
              Terms & Privacy Policy
            </h1>
            <p className="text-lg sm:text-xl text-white/90">
              Last updated: January 18, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-8 bg-white border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#terms"
              className="px-4 py-2 rounded-lg bg-muted hover:bg-primary/10 transition-colors font-medium text-sm"
            >
              Terms of Service
            </a>
            <a
              href="#privacy"
              className="px-4 py-2 rounded-lg bg-muted hover:bg-primary/10 transition-colors font-medium text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="#cookies"
              className="px-4 py-2 rounded-lg bg-muted hover:bg-primary/10 transition-colors font-medium text-sm"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Terms of Service */}
          <div id="terms" className="scroll-mt-24 mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Terms of Service</h2>
            </div>

            <div className="bg-white rounded-xl border border-border p-8 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h3>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using EnergyHub's website and services, you accept and agree to be
                  bound by the terms and provision of this agreement. If you do not agree to abide by
                  the above, please do not use this service.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">2. Use License</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Permission is granted to temporarily use our website for personal, non-commercial
                  transitory viewing only. This is the grant of a license, not a transfer of title,
                  and under this license you may not:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or public display</li>
                  <li>Attempt to decompile or reverse engineer any software on EnergyHub</li>
                  <li>Remove any copyright or proprietary notations from the materials</li>
                  <li>Transfer the materials to another person or mirror on any server</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">3. Product Availability</h3>
                <p className="text-muted-foreground leading-relaxed">
                  All products are subject to availability. We reserve the right to limit quantities
                  or refuse service to anyone. Prices and availability are subject to change without
                  notice. We make every effort to display accurate pricing and product information,
                  but errors may occur.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">4. Rental Terms</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Equipment rented from EnergyHub must be returned in the same condition as received,
                  normal wear and tear excepted. You are responsible for any damage beyond normal use.
                  Late returns may incur additional charges. Rental equipment remains the property of
                  EnergyHub at all times.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">5. Purchase Terms</h3>
                <p className="text-muted-foreground leading-relaxed">
                  All purchases are final after 30 days. Returns within 30 days will receive a full
                  refund excluding installation costs. Purchased equipment comes with manufacturer
                  warranties as specified in product descriptions. EnergyHub is not responsible for
                  manufacturer warranty claims.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">6. Limitation of Liability</h3>
                <p className="text-muted-foreground leading-relaxed">
                  In no event shall EnergyHub be liable for any damages (including, without
                  limitation, damages for loss of data or profit, or due to business interruption)
                  arising out of the use or inability to use our products or services, even if
                  EnergyHub has been notified orally or in writing of the possibility of such damage.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Policy */}
          <div id="privacy" className="scroll-mt-24 mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-secondary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Privacy Policy</h2>
            </div>

            <div className="bg-white rounded-xl border border-border p-8 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Information We Collect</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Name, email address, phone number, and shipping address</li>
                  <li>Payment information (processed securely through our payment partners)</li>
                  <li>Account credentials and preferences</li>
                  <li>Communications with our customer support team</li>
                  <li>Product reviews and feedback</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">How We Use Your Information</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Process and fulfill your orders</li>
                  <li>Send order confirmations and shipping updates</li>
                  <li>Respond to your questions and provide customer support</li>
                  <li>Send promotional emails (you can opt-out at any time)</li>
                  <li>Improve our website and services</li>
                  <li>Detect and prevent fraud</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Information Sharing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We do not sell, trade, or rent your personal information to third parties. We may
                  share your information with trusted service providers who assist us in operating our
                  website and conducting our business (payment processors, shipping companies, etc.).
                  These parties agree to keep your information confidential.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Data Security</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate security measures to protect your personal information.
                  However, no method of transmission over the Internet is 100% secure. While we strive
                  to protect your data, we cannot guarantee absolute security.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Your Rights</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">You have the right to:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Object to processing of your personal data</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Cookie Policy */}
          <div id="cookies" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Cookie Policy</h2>
            </div>

            <div className="bg-white rounded-xl border border-border p-8 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">What Are Cookies?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Cookies are small text files stored on your device when you visit our website. They
                  help us provide you with a better experience by remembering your preferences and
                  understanding how you use our site.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Types of Cookies We Use</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Essential Cookies</h4>
                    <p className="text-muted-foreground text-sm">
                      Required for the website to function properly. These include cookies for
                      shopping cart, login, and security features.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Analytics Cookies</h4>
                    <p className="text-muted-foreground text-sm">
                      Help us understand how visitors interact with our website by collecting
                      anonymous information about pages visited and features used.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Marketing Cookies</h4>
                    <p className="text-muted-foreground text-sm">
                      Used to deliver relevant advertisements and track campaign effectiveness. You
                      can opt-out of these cookies.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Managing Cookies</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You can control and manage cookies through your browser settings. Please note that
                  removing or blocking cookies may impact your user experience and some features may
                  not function properly.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-16 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20 p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">Questions About Our Policies?</h3>
            <p className="text-muted-foreground mb-6">
              If you have any questions about these terms or our privacy practices, please contact us.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-all duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
