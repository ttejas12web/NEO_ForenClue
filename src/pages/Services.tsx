import { SEO } from "@/components/layout/SEO";
import { Link } from "react-router-dom";
import { Video, Award, GraduationCap, CheckCircle2, ArrowRight } from "lucide-react";

export default function Services() {
  const services = [
    { 
      title: "Workshops & Webinars", 
      desc: "Topic-focused learning sessions for students, educators, and early-career professionals. A confirmed session brief states the subject, speaker, format, learning objectives, schedule, and whether a recording or certificate is included.",
      bestFor: "Student groups, departments, and professional learning communities",
      includes: ["Published topic and learning outcomes", "Speaker and schedule details", "Registration or institutional delivery options"],
      path: "/webinar",
      icon: Video
    },
    { 
      title: "Certification Programs", 
      desc: "Structured learning activities with a ForenClue-issued completion credential when the stated requirements are met. Each credential can be checked through the public verification portal.",
      bestFor: "Learners who need verifiable evidence of participation or completion",
      includes: ["Requirements stated before enrollment", "ForenClue verification identifier", "Clear distinction from a degree or government licence"],
      path: "/certificate",
      icon: Award
    },
    { 
      title: "College Collaborations", 
      desc: "Custom academic engagement for colleges that want a forensic science webinar, workshop, awareness session, quiz, or learning-resource collaboration. Scope and responsibilities are documented before confirmation.",
      bestFor: "Departments, student associations, placement cells, and faculty coordinators",
      includes: ["Needs and audience review", "Written delivery scope", "Post-session feedback and support channel"],
      path: "/contact",
      icon: GraduationCap
    }
  ];

  return (
    <div className="py-20 px-4 max-w-7xl mx-auto">
      <SEO 
        title="Forensic Workshops, Certifications, and College Collaborations"
        description="Boost your profile with recognized forensic certification credentials, live webinars, physical hands-on workshops, and institutional university affiliations."
        keywords="forensic science workshops, forensic science certified online, forensic university collaboration, study forensics program"
        canonicalPath="/services"
        type="service"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' }
        ]}
        faqs={[
          { question: "What services does ForenClue offer colleges?", answer: "We offer guest lectures, forensic science workshops, institutional university collaborations, curriculum design assistance, and student certification drives." },
          { question: "Are physical hands-on forensic workshops available?", answer: "Yes! ForenClue facilitates both high-fidelity online workshops and physical hands-on crime scene, fingerprinting, and digital forensic training events." }
        ]}
      />

      <h1 className="text-4xl md:text-6xl font-heading font-black mb-6 text-center uppercase tracking-tight">
        Our <span className="text-warning">Services</span>
      </h1>

      <p className="max-w-3xl mx-auto text-center text-text-muted leading-relaxed mb-16">
        ForenClue&apos;s services are educational. We publish the scope, intended audience, delivery format, and credential terms before a participant or institution commits. Forensic laboratory examination, legal opinions, and law-enforcement services are outside this offering unless a separate written engagement expressly says otherwise.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, i) => (
          <div key={i} className="bg-surface p-10 border border-black/10 dark:border-white/5 hover:border-warning transition-colors group relative overflow-hidden">
            {/* Absolute accent element for micro-interaction */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-warning/5 rounded-full blur-2xl group-hover:bg-warning/10 transition-all duration-300 pointer-events-none" />
            
            {/* Vector Clipart Container */}
            <div className="mb-8 relative w-24 h-24 flex items-center justify-center bg-warning/[0.03] border border-warning/15 rounded-2xl overflow-hidden group-hover:bg-warning/[0.08] group-hover:border-warning/30 transition-all duration-300">
              {/* Tech vector coordinate line accents */}
              <div className="absolute inset-2 border border-dashed border-warning/10 rounded-xl pointer-events-none" />
              {/* Radial background design */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #facc15 1px, transparent 1px)', backgroundSize: '8px 8px' }} />
              <div className="absolute w-12 h-12 rounded-full bg-warning/10 blur-xl group-hover:bg-warning/20 transition-all duration-300" />
              
              {/* Clean Vector Icon representation */}
              <service.icon className="w-12 h-12 text-warning relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3" strokeWidth={1.25} />
            </div>

            <h2 className="text-2xl font-heading font-bold mb-4">{service.title}</h2>
            <p className="text-text-muted mb-6 leading-relaxed">{service.desc}</p>

            <p className="text-xs font-black uppercase tracking-wider text-warning mb-2">Best for</p>
            <p className="text-sm text-text-muted mb-6">{service.bestFor}</p>

            <ul className="space-y-2 mb-8">
              {service.includes.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-text-muted">
                  <CheckCircle2 size={16} className="text-warning shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link 
              to={service.path}
              className="text-sm font-bold text-warning uppercase tracking-widest inline-flex items-center gap-2 group-hover:gap-4 transition-all"
            >
              Learn More <ArrowRight size={16} />
            </Link>
          </div>
        ))}
      </div>

      <section className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface border border-black/10 dark:border-white/5 p-8 md:p-10 rounded-2xl">
          <h2 className="text-2xl font-heading font-black uppercase tracking-tight mb-5">How an engagement works</h2>
          <ol className="space-y-4 text-sm text-text-muted leading-relaxed">
            <li><strong className="text-text-main">1. Define the need.</strong> Tell us the audience, topic, preferred date, delivery mode, and expected outcome.</li>
            <li><strong className="text-text-main">2. Review the scope.</strong> We confirm what can be delivered, who is involved, what participants receive, and any applicable fee.</li>
            <li><strong className="text-text-main">3. Confirm in writing.</strong> The final schedule, responsibilities, cancellation terms, and credential conditions are documented before delivery.</li>
            <li><strong className="text-text-main">4. Deliver and follow up.</strong> Participants receive the confirmed session or program, followed by the promised resources, feedback process, or verification details.</li>
          </ol>
        </div>

        <div className="bg-surface border border-black/10 dark:border-white/5 p-8 md:p-10 rounded-2xl">
          <h2 className="text-2xl font-heading font-black uppercase tracking-tight mb-5">Before you enquire</h2>
          <div className="space-y-4 text-sm text-text-muted leading-relaxed">
            <p>Availability depends on the requested topic, speaker schedule, audience size, and delivery format. A website listing is not a booking confirmation.</p>
            <p>Certificates are issued by ForenClue for the activity described on the certificate. They do not represent a university degree, statutory professional licence, government accreditation, or employment guarantee unless that status is explicitly documented.</p>
            <p>For corrections, accessibility needs, safeguarding concerns, institutional due diligence, or a written proposal, contact the team before registration.</p>
          </div>
          <Link to="/contact" className="mt-8 inline-flex items-center gap-2 bg-warning text-crust px-6 py-3 text-xs font-black uppercase tracking-wider hover:bg-warning-dark transition-colors">
            Contact ForenClue <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
