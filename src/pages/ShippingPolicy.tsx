import { Truck, PackageCheck, Mail, AlertTriangle, ShieldCheck, MapPin } from 'lucide-react';
import { SEO } from '@/components/layout/SEO';
import { Link } from 'react-router-dom';

export default function ShippingPolicy() {
  return (
    <div className="py-20 px-4 max-w-4xl mx-auto">
      <SEO 
        title="Shipping & Delivery Policy"
        description="ForenClue Ventures Shipping Policy. Details regarding order dispatch timelines, courier partners, delivery addresses, and shipment confirmations."
        keywords="forenclue shipping policy, delivery timeline, forensic book delivery, order dispatch terms"
        canonicalPath="/shipping-policy"
      />

      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warning/10 border border-warning/20 mb-6 shadow-[0_0_30px_rgba(255,165,0,0.2)]">
          <Truck className="text-warning" size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-black mb-4 uppercase tracking-tight">
          Shipping & <span className="text-warning">Delivery Policy</span>
        </h1>
        <p className="text-text-muted text-sm max-w-xl mx-auto">
          Official Shipping Terms and Delivery Guidelines for orders placed on the ForenClue Platform (<a href="https://forenclue.in" className="text-warning hover:underline">https://forenclue.in</a>).
        </p>
      </div>

      <div className="space-y-12 text-base text-text-muted leading-relaxed">

        {/* Shipping Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface p-6 border border-black/10 dark:border-white/10 rounded-xl space-y-2">
            <div className="w-10 h-10 rounded-lg bg-warning/10 text-warning flex items-center justify-center font-bold">
              <Truck size={20} />
            </div>
            <h3 className="font-bold text-text-main text-sm">Domestic Speed Post / Courier</h3>
            <p className="text-xs text-text-muted">Shipped exclusively through registered domestic courier companies and/or speed post.</p>
          </div>

          <div className="bg-surface p-6 border border-black/10 dark:border-white/10 rounded-xl space-y-2">
            <div className="w-10 h-10 rounded-lg bg-warning/10 text-warning flex items-center justify-center font-bold">
              <PackageCheck size={20} />
            </div>
            <h3 className="font-bold text-text-main text-sm">2-Day Dispatch Window</h3>
            <p className="text-xs text-text-muted">Orders are shipped within 2 days from the date of the order and/or payment confirmation.</p>
          </div>

          <div className="bg-surface p-6 border border-black/10 dark:border-white/10 rounded-xl space-y-2">
            <div className="w-10 h-10 rounded-lg bg-warning/10 text-warning flex items-center justify-center font-bold">
              <Mail size={20} />
            </div>
            <h3 className="font-bold text-text-main text-sm">Email Confirmation</h3>
            <p className="text-xs text-text-muted">Delivery of services and tracking details are confirmed to your registered email address.</p>
          </div>
        </div>

        {/* Core Shipping Policy Clauses */}
        <section className="bg-surface p-8 border border-black/10 dark:border-white/10 relative overflow-hidden rounded-xl space-y-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-warning/5 rounded-full blur-[50px] -z-10"></div>
          <h2 className="text-2xl font-heading font-bold text-text-main uppercase tracking-wide">
            Shipping Terms & Conditions
          </h2>

          <div className="space-y-5 text-sm text-text-main">
            <div className="p-4 bg-base/50 rounded-lg border border-black/5 dark:border-white/5 space-y-2">
              <h3 className="font-bold text-text-main flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-warning"></span>
                1. Courier & Speed Post Dispatch
              </h3>
              <p className="text-text-muted leading-relaxed pl-4">
                The orders for the user are shipped through registered domestic courier companies and/or speed post only. 
              </p>
            </div>

            <div className="p-4 bg-base/50 rounded-lg border border-black/5 dark:border-white/5 space-y-2">
              <h3 className="font-bold text-text-main flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-warning"></span>
                2. Shipping Timelines
              </h3>
              <p className="text-text-muted leading-relaxed pl-4">
                Orders are shipped within <strong>2 days</strong> from the date of the order and/or payment or as per the delivery date agreed at the time of order confirmation and delivering of the shipment, subject to courier company / post office norms.
              </p>
            </div>

            <div className="p-4 bg-base/50 rounded-lg border border-black/5 dark:border-white/5 space-y-2">
              <h3 className="font-bold text-text-main flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-warning"></span>
                3. Delivery Delays & Third-Party Norms
              </h3>
              <p className="text-text-muted leading-relaxed pl-4">
                Platform Owner (ForenClue Ventures) shall not be liable for any delay in delivery by the courier company / postal authority.
              </p>
            </div>

            <div className="p-4 bg-base/50 rounded-lg border border-black/5 dark:border-white/5 space-y-2">
              <h3 className="font-bold text-text-main flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-warning"></span>
                4. Buyer Address & Delivery Confirmation
              </h3>
              <p className="text-text-muted leading-relaxed pl-4">
                Delivery of all orders will be made to the address provided by the buyer at the time of purchase. Delivery of our services will be confirmed on your email ID as specified at the time of registration.
              </p>
            </div>

            <div className="p-4 bg-base/50 rounded-lg border border-black/5 dark:border-white/5 space-y-2">
              <h3 className="font-bold text-text-main flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-warning"></span>
                5. Shipping Cost Policy
              </h3>
              <p className="text-text-muted leading-relaxed pl-4">
                If there are any shipping cost(s) levied by the seller or the Platform Owner (as the case be), the same is <strong>non-refundable</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Dispatch Operations Info */}
        <div className="bg-surface p-8 border border-black/10 dark:border-white/10 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-bold text-text-main text-base">Questions regarding your shipment?</h4>
            <p className="text-xs text-text-muted">
              Registered Office: ForenClue Ventures, Pune, Maharashtra, India. Operating Hours: Monday – Friday (09:00 – 18:00 IST).
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link 
              to="/contact" 
              className="px-5 py-2.5 bg-warning text-crust font-bold text-xs uppercase tracking-wider rounded hover:bg-warning-dark transition-colors"
            >
              Contact Us
            </Link>
            <Link 
              to="/refund-policy" 
              className="px-5 py-2.5 bg-base border border-black/15 dark:border-white/10 text-text-main font-bold text-xs uppercase tracking-wider rounded hover:border-warning transition-colors"
            >
              Return & Refund Policy
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
