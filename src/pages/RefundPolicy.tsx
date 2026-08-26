import { RotateCcw, RefreshCw, AlertCircle, Clock, ShieldCheck, PackageCheck } from 'lucide-react';
import { SEO } from '@/components/layout/SEO';
import { Link } from 'react-router-dom';

export default function RefundPolicy() {
  return (
    <div className="py-20 px-4 max-w-4xl mx-auto">
      <SEO 
        title="Refund, Cancellation & Return Policy | ForenClue"
        description="Review ForenClue Ventures' official Refund, Cancellation, and Return policies regarding study materials, books, forensic kits, and learning services."
        keywords="forenclue refund policy, return policy, cancellation terms, forensic study material refund"
        canonicalPath="/refund-policy"
      />

      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warning/10 border border-warning/20 mb-6 shadow-[0_0_30px_rgba(255,165,0,0.2)]">
          <RotateCcw className="text-warning" size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-black mb-4 uppercase tracking-tight">
          Refund, Cancellation & <span className="text-warning">Return Policy</span>
        </h1>
        <p className="text-text-muted text-sm max-w-xl mx-auto">
          ForenClue Ventures (&quot;Platform Owner&quot;, &quot;we&quot;, &quot;us&quot;) is committed to fair, transparent service delivery and customer satisfaction.
        </p>
      </div>

      <div className="space-y-12 text-base text-text-muted leading-relaxed">
        
        {/* Quick Highlights Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-surface p-6 border border-black/10 dark:border-white/10 rounded-xl">
          <div className="flex items-start gap-3">
            <Clock className="text-warning shrink-0 mt-1" size={20} />
            <div>
              <p className="font-bold text-text-main text-sm">4 Days Cancellation</p>
              <p className="text-xs text-text-muted">Requests considered within 4 days of placing order.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <PackageCheck className="text-warning shrink-0 mt-1" size={20} />
            <div>
              <p className="font-bold text-text-main text-sm">2 Days Return Window</p>
              <p className="text-xs text-text-muted">Refund/exchange within first 2 days of delivery.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <RefreshCw className="text-warning shrink-0 mt-1" size={20} />
            <div>
              <p className="font-bold text-text-main text-sm">2 Days Refund Payout</p>
              <p className="text-xs text-text-muted">Approved refunds are processed in 2 business days.</p>
            </div>
          </div>
        </div>

        {/* SECTION 1: Refund and Cancellation Policy */}
        <section className="bg-surface p-8 border border-black/10 dark:border-white/10 relative overflow-hidden rounded-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-warning/5 rounded-full blur-[50px] -z-10"></div>
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-warning/15 text-warning font-bold text-xs rounded-full uppercase tracking-wider">Part 1</span>
            <h2 className="text-2xl font-heading font-bold text-text-main uppercase tracking-wide">Refund and Cancellation Policy</h2>
          </div>
          <p className="mb-6 text-sm text-text-muted">
            This refund and cancellation policy outlines how you can cancel or seek a refund for a product or service that you have purchased through the Platform (<a href="https://forenclue.in" className="text-warning hover:underline">https://forenclue.in</a>). Under this policy:
          </p>

          <div className="space-y-6 text-sm">
            <div className="flex items-start gap-4 p-4 bg-base/50 rounded-lg border border-black/5 dark:border-white/5">
              <span className="w-6 h-6 rounded-full bg-warning/20 text-warning font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
              <div>
                <h3 className="font-bold text-text-main mb-1">Cancellation Request Window</h3>
                <p>
                  Cancellations will only be considered if the request is made within <strong>4 days</strong> of placing the order. However, cancellation requests may not be entertained if the orders have been communicated to such sellers / merchant(s) listed on the Platform and they have initiated the process of shipping them, or the product is out for delivery. In such an event, you may choose to reject the product at the doorstep.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-base/50 rounded-lg border border-black/5 dark:border-white/5">
              <span className="w-6 h-6 rounded-full bg-warning/20 text-warning font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
              <div>
                <h3 className="font-bold text-text-main mb-1">Perishable & Consumable Items</h3>
                <p>
                  <strong>ForenClue Ventures</strong> does not accept cancellation requests for perishable items like flowers, eatables, etc. However, the refund / replacement can be made if the user establishes that the quality of the product delivered is not good.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-base/50 rounded-lg border border-black/5 dark:border-white/5">
              <span className="w-6 h-6 rounded-full bg-warning/20 text-warning font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
              <div>
                <h3 className="font-bold text-text-main mb-1">Damaged or Defective Items Reporting</h3>
                <p>
                  In case of receipt of damaged or defective items, please report to our customer service team. The request would be entertained once the seller/merchant listed on the Platform has checked and determined the same at its own end. This should be reported within <strong>4 days</strong> of receipt of products. In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within <strong>4 days</strong> of receiving the product. The customer service team after looking into your complaint will take an appropriate decision.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-base/50 rounded-lg border border-black/5 dark:border-white/5">
              <span className="w-6 h-6 rounded-full bg-warning/20 text-warning font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">4</span>
              <div>
                <h3 className="font-bold text-text-main mb-1">Manufacturer Warranty</h3>
                <p>
                  In case of complaints regarding the products that come with a warranty from the manufacturers, please refer the issue to them directly.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-base/50 rounded-lg border border-black/5 dark:border-white/5">
              <span className="w-6 h-6 rounded-full bg-warning/20 text-warning font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">5</span>
              <div>
                <h3 className="font-bold text-text-main mb-1">Refund Processing Timeline</h3>
                <p>
                  In case of any refunds approved by ForenClue Ventures, it will take <strong>2 days</strong> for the refund to be processed to you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Return Policy */}
        <section className="bg-surface p-8 border border-black/10 dark:border-white/10 relative overflow-hidden rounded-xl">
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-warning/5 rounded-full blur-[50px] -z-10"></div>
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-warning/15 text-warning font-bold text-xs rounded-full uppercase tracking-wider">Part 2</span>
            <h2 className="text-2xl font-heading font-bold text-text-main uppercase tracking-wide">Return Policy</h2>
          </div>

          <div className="space-y-4 text-sm">
            <p>
              We offer refund / exchange within the first <strong>2 days</strong> from the date of your purchase. If 2 days have passed since your purchase, you will not be offered a return, exchange or refund of any kind.
            </p>
            
            <h3 className="font-bold text-text-main pt-2">Eligibility for Return or Exchange:</h3>
            <ul className="list-disc pl-6 space-y-2 text-text-main">
              <li>The purchased item should be unused and in the same condition as you received it.</li>
              <li>The item must have original packaging intact.</li>
              <li>If the item was purchased on a sale, then the item may not be eligible for a return / exchange.</li>
              <li>Further, only such items are replaced by us (based on an exchange request), if such items are found defective or damaged.</li>
            </ul>

            <h3 className="font-bold text-text-main pt-2">Exempted Categories & Inspection Process:</h3>
            <p>
              You agree that there may be a certain category of products / items that are exempted from returns or refunds. Such categories of the products would be identified to you at the time of purchase.
            </p>
            <p>
              For exchange / return accepted request(s) (as applicable), once your returned product / item is received and inspected by us, we will send you an email to notify you about receipt of the returned / exchanged product. Further, if the same has been approved after the quality check at our end, your request (i.e. return / exchange) will be processed in accordance with our policies.
            </p>
          </div>
        </section>

        {/* Support & Assistance */}
        <section className="bg-surface p-8 border border-black/10 dark:border-white/10 rounded-xl text-center space-y-4">
          <ShieldCheck size={36} className="text-warning mx-auto" />
          <h3 className="text-xl font-bold font-heading text-text-main uppercase tracking-wide">
            Need Help with an Order or Cancellation?
          </h3>
          <p className="text-sm max-w-lg mx-auto text-text-muted">
            Our support desk is available Monday through Friday (9:00 - 18:00 IST). Write to us with your order details and registered email ID for prompt assistance.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link 
              to="/contact" 
              className="px-6 py-2.5 bg-warning text-crust font-bold text-xs uppercase tracking-wider rounded hover:bg-warning-dark transition-colors"
            >
              Contact Support
            </Link>
            <a 
              href="mailto:forenclue@gmail.com" 
              className="px-6 py-2.5 bg-base border border-black/15 dark:border-white/10 text-text-main font-bold text-xs uppercase tracking-wider rounded hover:border-warning transition-colors"
            >
              Email forenclue@gmail.com
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
