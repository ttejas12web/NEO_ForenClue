import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { SEO } from '@/components/layout/SEO';
import { Linkedin, Youtube, Mail } from 'lucide-react';

const TeamCard = ({ member, index = 0 }: { member: any, index?: number }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const hasSocials = Boolean(member.linkedin || member.youtube || member.email);

  return (
    <motion.div 
      id={member.name.toLowerCase().replace(/\s+/g, '-')}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d"
      }}
      className="group relative flex flex-col items-center justify-start mx-auto max-w-sm w-full h-full p-7 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all duration-300 hover:shadow-[0_14px_36px_rgba(0,0,0,0.2)] border border-black/10 dark:border-white/10 hover:border-warning/40 bg-surface/90 dark:bg-white/[0.03] backdrop-blur-xl"
    >
      {/* Subtle ambient top glow */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-warning/10 via-warning/[0.03] to-transparent pointer-events-none transition-opacity duration-500 opacity-75 group-hover:opacity-100 z-0" />
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-warning/50 to-transparent pointer-events-none z-10" />

      {/* Profile Photo */}
      <motion.div 
        style={{ transform: "translateZ(30px)" }}
        className="relative w-36 h-36 rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow-[0_8px_24px_rgba(0,0,0,0.25)] ring-2 ring-black/10 dark:ring-white/15 group-hover:ring-warning/60 z-10 bg-black/5 dark:bg-white/5 transition-all duration-300"
      >
        {member.image ? (
          <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top z-10 relative group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl font-heading font-black text-text-main/20 uppercase tracking-widest z-10 relative">
            {member.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
        )}
      </motion.div>
      
      {/* Name, Role & Bio Information directly below Profile Photo */}
      <motion.div 
        style={{ transform: "translateZ(20px)" }}
        className="relative z-10 text-center flex flex-col items-center w-full mt-5 flex-1"
      >
        <h3 className="text-xl font-bold font-heading text-text-main group-hover:text-warning transition-colors duration-300 tracking-tight">
          {member.name}
        </h3>
        <p className="text-warning mt-1 uppercase tracking-[0.14em] text-[11px] font-bold">
          {member.role}
        </p>

        {/* Divider directly under Role */}
        <div className="w-full border-t border-black/10 dark:border-white/10 my-4" />

        {/* Information / Highlights immediately below photo & title */}
        <ul className="flex flex-col gap-2.5 w-full text-left">
          {member.points.map((point: string, i: number) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-text-muted group-hover:text-text-main/90 transition-colors duration-200 leading-snug">
              <span className="w-1.5 h-1.5 rounded-full bg-warning mt-2 shrink-0" />
              <span>{point}</span>
            </li>
          ))}
        </ul>

        {/* Social Links neatly anchored below information */}
        {hasSocials && (
          <div className="flex items-center justify-center gap-3 pt-5 mt-5 border-t border-black/5 dark:border-white/5 w-full">
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label={`${member.name} LinkedIn`}
                className="p-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-warning/15 text-text-muted hover:text-warning transition-colors border border-black/5 dark:border-white/10"
              >
                <Linkedin size={16} />
              </a>
            )}
            {member.youtube && (
              <a
                href={member.youtube}
                target="_blank"
                rel="noreferrer"
                aria-label={`${member.name} YouTube`}
                className="p-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-warning/15 text-text-muted hover:text-warning transition-colors border border-black/5 dark:border-white/10"
              >
                <Youtube size={16} />
              </a>
            )}
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                aria-label={`Email ${member.name}`}
                className="p-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-warning/15 text-text-muted hover:text-warning transition-colors border border-black/5 dark:border-white/10"
              >
                <Mail size={16} />
              </a>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default function About() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = decodeURIComponent(hash.replace('#', ''));
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  }, []);

  const team = [
    {
      name: "Tejas Tapse",
      role: "Founder & CEO",
      image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhBbTT3QCs_EHXasFjAT9pC1laU-vAIRhIQ7qjpQHS3ErsprqykE9eT63H-XnATqutTGhCjq-zzbmvCeFhHfE0_DZ1wtZmu8pmARltV1makLhdqyCwftxjW55J0qyPbmjn6H6Abb6OzIHPUrkbkYOwmDeVxLmGyH_0nbr9qOnWtWKEg3NaPIvEJKTNg8vU/s1323/IMG_0865.PNG",
      linkedin: "https://www.linkedin.com/in/ttapse12/",
      youtube: "https://www.youtube.com/@TejasTapse",
      email: "tejastapse12@gmail.com",
      points: [
        "Creator of Neet Cracker",
        "Passionate about forensic education",
        "Dedicated to making learning stress-free"
      ]
    },
    {
      name: "Ayush Gaikwad",
      role: "Co-Founder",
      image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjsllQMEHs5qT_GJSyZnGVcFH64Zadagai4Y9rlbFHQ9vuaVgX-3CgkApXQu660nTDPB0C3mEMJoZSnhLnOpBtTOt5mlEEADPKcOZbzcem8pq3flsJWbG6adC-aDmg9tlmyu4nGyaDh-TLzHanJ4dde67VUggiI5rMCb-4dVVUzRhY-A_EJKmiQgLkJez4/s1462/IMG_0859%20(1).PNG",
      linkedin: "https://www.linkedin.com/in/ayush-gaikwad-41313a3bb/",
      email: "ayushgaikwad705o@gmail.com",
      points: [
        "Forensic Science Student"
      ]
    },
    {
      name: "Pranav Kale Patil",
      role: "Managing Director (MD)",
      image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjtMbZr5AjExAGCqfwCJCaidFxFnNlRkh9KiRw7iwAjS1CINzxnRlEKIEO66fIaUEZfMjRYLOawndJh2aTVyoeSY88Ivbf2dS20SSoaz9YM8QisDdUJqGr1r8-0_-kBe94xNU9G5lpKFpxswLnhFnKQ220eLAvXUdmEaSh0BLle2SdpFiKaL4qC3wogd60/s1600/image.jpeg",
      points: [
        "Managing Director of ForenClue",
        "Forensic Science & Operations"
      ]
    },
    {
      name: "Punam Gadade",
      role: "Chief Technology Officer (CTO)",
      image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhk5LmpFNaR2YN6ZCUpVLvfWnJimYXwbrNtK9ztFDyfAD2frVDHHplRgN1_KZXjeh2RCHd40Q8EY2y3Qfygkw-wgZeK7rirHtRD-xL-JdW-FD7k0hsm8RSYWZc4gZvYOGkw1iZdp2J0MXzNmuma9_HEFdJMmN3tjmeTEEnbBDbKuMhVIr2xvVLdHN5u7CA/s1600/image.png",
      points: [
        "Chief Technology Officer of ForenClue",
        "Tech Professional"
      ]
    }
  ];

  const academicMentors = [
    {
      name: "Rajat Pithadia",
      role: "Academic Mentor & Editorial Reviewer",
      image: "https://blogger.googleusercontent.com/img/a/AVvXsEiseuO8LFJ74UtogyoZLu5orh44gH7WVqDM4oinlMLhD3u4grQKoinTCZYk-OfKJrXJjV8E9EZHoPbhefI60LoXmqO623wQXiv-4hXumhYmBrBJCh4HYvYk9ifZ4nSccrYe5qyJHQXAQvW_8Zgkdq3T7vCycYqiJy0aUSZYzhmqc8M12jhhUq3X1GoORws",
      linkedin: "https://www.linkedin.com/in/rajatresearch",
      points: [
        "UGC-NET & GSET Qualified",
        "Assistant Professor, Parul University",
        "Wiley Author",
        "Ph.D. Scholar (Genotoxicity & Mutagenicity)",
        "M.Sc. (Forensic Chemistry, Toxicology & Pharmacology)"
      ]
    },
    {
      name: "Dr. Riya Mariya",
      role: "Advisory Board Member & Forensic Odontologist",
      image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgobEPn1woMfp278ivQTg-VZsKM02ZvNAQ8bxANMa26tSCP2gWdXJEQgPVcBBBkfeHLwlKdkCS9OlSdqpzE8dvmYtq8GlB1FwXSv49dakFckuCUgmPdsqZfNuqUZcJmIPUA3hRtnjbb1EAQyA4Nic4m9qSuZ3DOflHlZRT1s9ypVR8ob_hvGXnfowCKOgE/s1600/image.png",
      linkedin: "https://www.linkedin.com/in/dr-riya-mariya/",
      points: [
        "Forensic Odontologist & Dentist",
        "Assistant Professor",
        "UGC NET Qualified & FACT 2026 Qualified",
        "PG Professional Diploma in Forensic Archaeology",
        "ForenClue Advisory Board Member"
      ]
    }
  ];

  const aboutCustomSchema = [
    {
      '@type': 'AboutPage',
      '@id': 'https://forenclue.in/about#aboutpage',
      url: 'https://forenclue.in/about',
      name: 'About ForenClue – Mission, Editorial Standards, Leadership & Academic Faculty',
      description:
        "Learn about ForenClue, India's MSME Udyam registered Forensic Science and Cybersecurity EdTech publication and learning platform headquartered in Pune, Maharashtra, India.",
      inLanguage: 'en-IN',
      isPartOf: { '@id': 'https://forenclue.in/#website' },
      mainEntity: { '@id': 'https://forenclue.in/#organization' },
    },
    {
      '@type': 'EducationalOrganization',
      '@id': 'https://forenclue.in/#organization',
      name: 'ForenClue',
      alternateName: 'ForenClue Ventures',
      url: 'https://forenclue.in',
      foundingDate: '2025',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Pune',
        addressRegion: 'Maharashtra',
        addressCountry: 'IN',
      },
      areaServed: {
        '@type': 'Country',
        name: 'India',
      },
      description:
        'Founded in 2025 and headquartered in Pune, Maharashtra, India, ForenClue is a dedicated Forensic Science and Cybersecurity EdTech platform registered under MSME Udyam, Government of India, empowering students, educators, and investigators through peer-reviewed forensic guides, virtual labs, and documented case studies.',
      knowsAbout: [
        'Forensic Science',
        'Cyber Security',
        'Digital Forensics',
        'Crime Scene Investigation',
        'Forensic Toxicology',
        'Forensic Odontology',
        'Questioned Documents & Fingerprints',
        'UGC-NET Forensic Science Preparation',
      ],
      founder: [
        {
          '@type': 'Person',
          '@id': 'https://forenclue.in/about#tejas-tapse',
          name: 'Tejas Tapse',
          jobTitle: 'Founder & CEO',
          image:
            'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhBbTT3QCs_EHXasFjAT9pC1laU-vAIRhIQ7qjpQHS3ErsprqykE9eT63H-XnATqutTGhCjq-zzbmvCeFhHfE0_DZ1wtZmu8pmARltV1makLhdqyCwftxjW55J0qyPbmjn6H6Abb6OzIHPUrkbkYOwmDeVxLmGyH_0nbr9qOnWtWKEg3NaPIvEJKTNg8vU/s1323/IMG_0865.PNG',
          worksFor: { '@id': 'https://forenclue.in/#organization' },
          sameAs: [
            'https://www.linkedin.com/in/ttapse12/',
            'https://www.youtube.com/@TejasTapse',
          ],
        },
        {
          '@type': 'Person',
          '@id': 'https://forenclue.in/about#ayush-gaikwad',
          name: 'Ayush Gaikwad',
          jobTitle: 'Co-Founder',
          image:
            'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjsllQMEHs5qT_GJSyZnGVcFH64Zadagai4Y9rlbFHQ9vuaVgX-3CgkApXQu660nTDPB0C3mEMJoZSnhLnOpBtTOt5mlEEADPKcOZbzcem8pq3flsJWbG6adC-aDmg9tlmyu4nGyaDh-TLzHanJ4dde67VUggiI5rMCb-4dVVUzRhY-A_EJKmiQgLkJez4/s1462/IMG_0859%20(1).PNG',
          worksFor: { '@id': 'https://forenclue.in/#organization' },
          sameAs: ['https://www.linkedin.com/in/ayush-gaikwad-41313a3bb/'],
        },
      ],
      member: [
        {
          '@type': 'Person',
          '@id': 'https://forenclue.in/about#pranav-kale-patil',
          name: 'Pranav Kale Patil',
          jobTitle: 'Managing Director (MD)',
          image:
            'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjtMbZr5AjExAGCqfwCJCaidFxFnNlRkh9KiRw7iwAjS1CINzxnRlEKIEO66fIaUEZfMjRYLOawndJh2aTVyoeSY88Ivbf2dS20SSoaz9YM8QisDdUJqGr1r8-0_-kBe94xNU9G5lpKFpxswLnhFnKQ220eLAvXUdmEaSh0BLle2SdpFiKaL4qC3wogd60/s1600/image.jpeg',
          worksFor: { '@id': 'https://forenclue.in/#organization' },
        },
        {
          '@type': 'Person',
          '@id': 'https://forenclue.in/about#punam-gadade',
          name: 'Punam Gadade',
          jobTitle: 'Chief Technology Officer (CTO)',
          description: 'Chief Technology Officer (CTO) and Tech Professional at ForenClue.',
          image:
            'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhk5LmpFNaR2YN6ZCUpVLvfWnJimYXwbrNtK9ztFDyfAD2frVDHHplRgN1_KZXjeh2RCHd40Q8EY2y3Qfygkw-wgZeK7rirHtRD-xL-JdW-FD7k0hsm8RSYWZc4gZvYOGkw1iZdp2J0MXzNmuma9_HEFdJMmN3tjmeTEEnbBDbKuMhVIr2xvVLdHN5u7CA/s1600/image.png',
          worksFor: { '@id': 'https://forenclue.in/#organization' },
        },
        {
          '@type': 'Person',
          '@id': 'https://forenclue.in/about#rajat-pithadia',
          name: 'Rajat Pithadia',
          jobTitle: 'Academic Mentor & Editorial Reviewer',
          description:
            'UGC-NET & GSET Qualified Assistant Professor at Parul University, Wiley Author, Ph.D. Scholar (Genotoxicity & Mutagenicity), and M.Sc. in Forensic Chemistry, Toxicology & Pharmacology.',
          image:
            'https://blogger.googleusercontent.com/img/a/AVvXsEiseuO8LFJ74UtogyoZLu5orh44gH7WVqDM4oinlMLhD3u4grQKoinTCZYk-OfKJrXJjV8E9EZHoPbhefI60LoXmqO623wQXiv-4hXumhYmBrBJCh4HYvYk9ifZ4nSccrYe5qyJHQXAQvW_8Zgkdq3T7vCycYqiJy0aUSZYzhmqc8M12jhhUq3X1GoORws',
          worksFor: { '@id': 'https://forenclue.in/#organization' },
          sameAs: ['https://www.linkedin.com/in/rajatresearch'],
        },
        {
          '@type': 'Person',
          '@id': 'https://forenclue.in/about#dr-riya-mariya',
          name: 'Dr. Riya Mariya',
          jobTitle: 'Advisory Board Member & Forensic Odontologist',
          description:
            'Forensic Odontologist, Dentist, Assistant Professor, UGC NET Qualified, FACT 2026 Qualified, PG Professional Diploma in Forensic Archaeology, and ForenClue Advisory Board Member.',
          image:
            'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgobEPn1woMfp278ivQTg-VZsKM02ZvNAQ8bxANMa26tSCP2gWdXJEQgPVcBBBkfeHLwlKdkCS9OlSdqpzE8dvmYtq8GlB1FwXSv49dakFckuCUgmPdsqZfNuqUZcJmIPUA3hRtnjbb1EAQyA4Nic4m9qSuZ3DOflHlZRT1s9ypVR8ob_hvGXnfowCKOgE/s1600/image.png',
          worksFor: { '@id': 'https://forenclue.in/#organization' },
          sameAs: ['https://www.linkedin.com/in/dr-riya-mariya/'],
        },
      ],
    },
  ];

  return (
    <div className="py-20 px-4 max-w-7xl mx-auto relative perspective-[2000px]">
      <SEO 
        title="About ForenClue – Mission, Editorial Standards, Leadership & Academic Mentors"
        description="Discover ForenClue, India's MSME Udyam registered Forensic Science & Cybersecurity EdTech platform headquartered in Pune, Maharashtra. Review our editorial standards, leadership team, and academic faculty."
        keywords="about forenclue, forenclue pune, forenclue founders, tejas tapse, ayush gaikwad, pranav kale patil, punam gadade, rajat pithadia, dr riya mariya, forensic science edtech india, forensic editorial standards"
        canonicalPath="/about"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'About Us', path: '/about' }
        ]}
        faqs={[
          {
            question: "What is ForenClue and where is it headquartered?",
            answer: "Founded in 2025 and headquartered in Pune, Maharashtra, India, ForenClue (ForenClue Ventures) is an official MSME Udyam registered Forensic Science and Cybersecurity EdTech platform dedicated to peer-reviewed educational guides, documented case studies, virtual laboratory simulations, and academic mentorship."
          },
          {
            question: "Who are the leaders and founders of ForenClue?",
            answer: "ForenClue is led by Founder & CEO Tejas Tapse, Co-Founder Ayush Gaikwad, Managing Director (MD) Pranav Kale Patil, and Chief Technology Officer (CTO) Punam Gadade."
          },
          {
            question: "Who are the Academic Mentors and Advisory Board Members at ForenClue?",
            answer: "ForenClue's academic review board includes Rajat Pithadia (UGC-NET & GSET Qualified Assistant Professor at Parul University, Wiley Author, and Ph.D. Scholar in Genotoxicity & Mutagenicity) and Dr. Riya Mariya (Forensic Odontologist, Assistant Professor, UGC-NET & FACT 2026 Qualified, PG Diploma in Forensic Archaeology)."
          },
          {
            question: "What are ForenClue's editorial and fact-checking standards?",
            answer: "Every article, laboratory manual, and forensic case study published on ForenClue undergoes academic review against standard operating procedures from the Directorate of Forensic Science Services (DFSS), Central Forensic Science Laboratories (CFSL), Bharatiya Sakshya Adhiniyam (BSA), and peer-reviewed literature, with primary citations included on every dossier."
          }
        ]}
        customSchema={aboutCustomSchema}
      />

      <article className="max-w-4xl mx-auto mb-24 text-left">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-heading font-black mb-12 uppercase tracking-tight text-center"
        >
          About <span className="text-warning">ForenClue</span>
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-surface p-8 border border-black/10 dark:border-white/10 mb-12 relative overflow-hidden rounded-xl space-y-4"
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-warning/5 rounded-full blur-[50px] -z-10"></div>
          <p className="text-base text-text-muted leading-relaxed relative z-10">
            Founded in 2025 and headquartered in <strong className="text-text-main">Pune, Maharashtra, India</strong>, <strong className="text-text-main">ForenClue</strong> (operated by ForenClue Ventures) is a dedicated Forensic Science and Cybersecurity educational publication and learning platform, officially registered under <strong className="text-text-main">MSME Udyam, Government of India</strong>. We are committed to empowering university students, educators, legal practitioners, researchers, and law enforcement personnel through peer-reviewed technical articles, virtual laboratory instrumentation simulators, documented forensic case studies, open reference textbooks, and structured academic mentorship.
          </p>
          <p className="text-base text-text-muted leading-relaxed relative z-10">
            By bridging the gap between university curricula (B.Sc./M.Sc. Forensic Science, UGC-NET Code 82, NFAT, and FACT) and real-world laboratory and crime-scene investigation protocols, ForenClue cultivates the next generation of forensic scientists and digital forensics specialists across India and globally.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="bg-surface p-8 border border-black/10 dark:border-white/10 mb-12 relative overflow-hidden rounded-xl"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-warning/5 rounded-full blur-[50px] -z-10"></div>
          <h2 className="text-2xl font-heading font-bold mb-4 text-warning uppercase tracking-widest">Our Vision</h2>
          <p className="text-lg text-text-muted leading-relaxed relative z-10">
            At ForenClue, we envision a future where rigorous, laboratory-grade forensic science education is democratized and accessible to every passionate student regardless of geographic or institutional constraints. We aim to standardize forensic pedagogy by combining peer-reviewed scientific writing with interactive 3D instrumentation and documented judicial precedents.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-surface p-8 border border-black/10 dark:border-white/10 mb-12 relative overflow-hidden rounded-xl"
        >
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-warning/5 rounded-full blur-[50px] -z-10"></div>
          <h2 className="text-2xl font-heading font-bold mb-4 text-warning uppercase tracking-widest">Our Educational Mission</h2>
          <p className="text-lg text-text-muted leading-relaxed mb-6 relative z-10">
            Our mission is to empower aspiring forensic scientists through practical, evidence-led, and career-driven learning experiences. We are dedicated to:
          </p>
          <ul className="space-y-4 text-text-muted text-base relative z-10">
            <li className="flex gap-4 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-warning mt-2 shrink-0"></div>
              <span><strong className="text-text-main">Demystifying Forensic Analytical Science:</strong> Breaking down complex analytical chemistry, toxicology, microscopy, DNA profiling, and digital forensics concepts into rigorous, structured educational articles and laboratory manuals.</span>
            </li>
            <li className="flex gap-4 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-warning mt-2 shrink-0"></div>
              <span><strong className="text-text-main">Practical Laboratory Empowerment:</strong> Providing interactive 3D virtual laboratory simulations (Compound &amp; Comparison Microscopy, UV-Vis Spectrophotometry) and methodological case studies that complement university benchwork.</span>
            </li>
            <li className="flex gap-4 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-warning mt-2 shrink-0"></div>
              <span><strong className="text-text-main">Academic &amp; Institutional Transparency:</strong> Maintaining India&apos;s most comprehensive verified directory of 120+ Forensic Science Universities &amp; Colleges alongside free UGC-NET and NFAT diagnostic assessments.</span>
            </li>
            <li className="flex gap-4 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-warning mt-2 shrink-0"></div>
              <span><strong className="text-text-main">Community &amp; Career Advancement:</strong> Fostering an inclusive national network of forensic educators, university ambassadors, and researchers with verifiable digital credentials.</span>
            </li>
          </ul>
        </motion.div>

        {/* Editorial Standards, Peer Review & Fact-Checking Policy */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="bg-surface p-8 border border-black/10 dark:border-white/10 mb-12 relative overflow-hidden rounded-xl space-y-4"
        >
          <h2 className="text-2xl font-heading font-bold text-warning uppercase tracking-widest">
            Editorial Standards, Peer Review &amp; Fact-Checking Policy
          </h2>
          <p className="text-sm sm:text-base text-text-muted leading-relaxed">
            ForenClue adheres to strict academic publishing and editorial governance standards across all Forensic Guides (<code className="text-warning">/articles</code>), Case Studies (<code className="text-warning">/cases</code>), and Virtual Laboratory Manuals (<code className="text-warning">/simulations</code>):
          </p>
          <ul className="space-y-3 text-sm text-text-muted leading-relaxed">
            <li className="flex gap-3 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-warning mt-2 shrink-0" />
              <span><strong className="text-text-main">Credentialed Authorship &amp; Academic Review:</strong> All technical guides and curriculum modules are authored or reviewed by qualified forensic science faculty and subject-matter specialists holding advanced degrees (M.Sc./Ph.D./M.D.S.) and national qualifications (UGC-NET Code 82, GSET, FACT).</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-warning mt-2 shrink-0" />
              <span><strong className="text-text-main">Primary Statutory &amp; Scientific Citations:</strong> Every article and case study cites verifiable primary sources, including Supreme Court and High Court of India judgments, Central Forensic Science Laboratory (CFSL) and Directorate of Forensic Science Services (DFSS) manuals, ISO/IEC 17025 and 27037 standards, and peer-reviewed textbooks.</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-warning mt-2 shrink-0" />
              <span><strong className="text-text-main">Non-Sensational, Methodological Framing:</strong> Historical criminal cases are documented strictly as academic forensic case studies examining chain of custody, evidentiary admissibility, and analytical methodology—never as sensationalized or graphic crime reporting.</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-warning mt-2 shrink-0" />
              <span><strong className="text-text-main">Corrections &amp; Updates Protocol:</strong> Readers, university faculty, and legal practitioners may submit citation updates or technical corrections directly to <a href="mailto:forenclue@gmail.com" className="text-warning hover:underline">forenclue@gmail.com</a>. All substantive revisions are timestamped on the respective publication page.</span>
            </li>
          </ul>
          <div className="pt-4 border-t border-black/10 dark:border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-text-muted">
            <div>
              <span className="font-mono uppercase text-[10px] text-warning block">Registered Entity</span>
              <strong className="text-text-main">ForenClue Ventures (MSME Udyam Registered)</strong>
            </div>
            <div>
              <span className="font-mono uppercase text-[10px] text-warning block">Headquarters Base</span>
              <strong className="text-text-main">Pune, Maharashtra, India</strong>
            </div>
            <div>
              <span className="font-mono uppercase text-[10px] text-warning block">Editorial &amp; Support Desk</span>
              <a href="mailto:forenclue@gmail.com" className="text-warning font-bold hover:underline">forenclue@gmail.com</a>
            </div>
          </div>
        </motion.div>
      </article>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto perspective-[2000px]"
      >
        <h2 className="text-3xl font-heading font-black mb-12 text-center">Meet Our Leadership Team</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-center">
          {team.map((member, i) => (
            <TeamCard key={i} member={member} index={i} />
          ))}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto mt-24 perspective-[2000px]"
      >
        <h2 className="text-3xl font-heading font-black mb-4 text-center">Academic Mentors &amp; Editorial Advisory Board</h2>
        <p className="text-sm text-text-muted text-center max-w-2xl mx-auto mb-12">
          Our curriculum, laboratory simulation guides, and forensic case studies are authored and peer-reviewed by credentialed university educators and forensic specialists.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {academicMentors.map((mentor, i) => (
            <TeamCard key={i} member={mentor} index={i} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
