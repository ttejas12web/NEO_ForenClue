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
      role: "Founder",
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
      name: "Mrunmayee Bodhe",
      role: "Chief Executive Officer",
      image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjt-N4hwGU4tzUkx9XwNKGHv2Te4J3tbfxJWFRXS6Z3KzdZX1f9VKZB88MYTeF4OqePRwDcGMbqjmOpoROSJlsSHaZJnLEIMnP2S98gBLOlP6IDs33SBqLf7yhLEyWCICI90IfGk5XV06fUYonMDC5zufGitO8-sTe1sIExdZcckiMh0VuZmmmPJpxhGQs/s1352/IMG_0866.PNG",
      linkedin: "https://www.linkedin.com/in/mrunmayee-bodhe-bb3a8a394/",
      email: "mrunmayeebodhe118@gmail.com",
      points: [
        "CEO Of ForenClue Ventures",
        "Forensic Enthusiast",
        "Academic Counselor"
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
      role: "Academic Mentor",
      image: "https://blogger.googleusercontent.com/img/a/AVvXsEiseuO8LFJ74UtogyoZLu5orh44gH7WVqDM4oinlMLhD3u4grQKoinTCZYk-OfKJrXJjV8E9EZHoPbhefI60LoXmqO623wQXiv-4hXumhYmBrBJCh4HYvYk9ifZ4nSccrYe5qyJHQXAQvW_8Zgkdq3T7vCycYqiJy0aUSZYzhmqc8M12jhhUq3X1GoORws",
      linkedin: "https://www.linkedin.com/in/rajatresearch",
      points: [
        "UGC-NET & GSET Qualified",
        "Assistant Professor, Parul University",
        "Wiley Author",
        "Ph.D. Scholar (Genotoxicity & Mutagenicity)",
        "M.Sc. (Forensic Chemistry, Toxicology & Pharmacology)"
      ]
    }
  ];

  const aboutCustomSchema = [
    {
      '@type': 'AboutPage',
      '@id': 'https://forenclue.in/about#aboutpage',
      url: 'https://forenclue.in/about',
      name: 'About ForenClue – Mission, Vision, Leadership & Academic Mentors',
      description:
        "Learn about ForenClue, India's MSME Udyam registered Forensic Science and Cybersecurity EdTech platform founded in 2025. Meet our leadership team and academic mentors.",
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
      areaServed: {
        '@type': 'Country',
        name: 'India',
      },
      description:
        'Founded in 2025, ForenClue is a dedicated Forensic Science and Cybersecurity EdTech platform registered under MSME Udyam, Government of India, empowering students, educators, and investigators through practical learning, virtual labs, and case studies.',
      knowsAbout: [
        'Forensic Science',
        'Cyber Security',
        'Digital Forensics',
        'Crime Scene Investigation',
        'Forensic Toxicology',
        'Questioned Documents & Fingerprints',
        'UGC-NET Forensic Science Preparation',
      ],
      founder: [
        {
          '@type': 'Person',
          '@id': 'https://forenclue.in/about#tejas-tapse',
          name: 'Tejas Tapse',
          jobTitle: 'Founder',
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
          '@id': 'https://forenclue.in/about#mrunmayee-bodhe',
          name: 'Mrunmayee Bodhe',
          jobTitle: 'Chief Executive Officer',
          image:
            'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjt-N4hwGU4tzUkx9XwNKGHv2Te4J3tbfxJWFRXS6Z3KzdZX1f9VKZB88MYTeF4OqePRwDcGMbqjmOpoROSJlsSHaZJnLEIMnP2S98gBLOlP6IDs33SBqLf7yhLEyWCICI90IfGk5XV06fUYonMDC5zufGitO8-sTe1sIExdZcckiMh0VuZmmmPJpxhGQs/s1352/IMG_0866.PNG',
          worksFor: { '@id': 'https://forenclue.in/#organization' },
          sameAs: ['https://www.linkedin.com/in/mrunmayee-bodhe-bb3a8a394/'],
        },
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
          jobTitle: 'Academic Mentor',
          description:
            'UGC-NET & GSET Qualified Assistant Professor at Parul University, Wiley Author, Ph.D. Scholar (Genotoxicity & Mutagenicity), and M.Sc. in Forensic Chemistry, Toxicology & Pharmacology.',
          image:
            'https://blogger.googleusercontent.com/img/a/AVvXsEiseuO8LFJ74UtogyoZLu5orh44gH7WVqDM4oinlMLhD3u4grQKoinTCZYk-OfKJrXJjV8E9EZHoPbhefI60LoXmqO623wQXiv-4hXumhYmBrBJCh4HYvYk9ifZ4nSccrYe5qyJHQXAQvW_8Zgkdq3T7vCycYqiJy0aUSZYzhmqc8M12jhhUq3X1GoORws',
          worksFor: { '@id': 'https://forenclue.in/#organization' },
          sameAs: ['https://www.linkedin.com/in/rajatresearch'],
        },
      ],
    },
  ];

  return (
    <div className="py-20 px-4 max-w-7xl mx-auto relative perspective-[2000px]">
      <SEO 
        title="About ForenClue – Mission, Leadership & Academic Mentors"
        description="Discover ForenClue, India's MSME Udyam registered Forensic Science & Cybersecurity EdTech platform. Meet our leadership team, founders, and academic mentors."
        keywords="about forenclue, forenclue founders, tejas tapse, mrunmayee bodhe, ayush gaikwad, pranav kale patil, punam gadade, rajat pithadia, forensic science edtech india, cybersecurity learning platform, msme registered forensic platform, forensic academic mentor"
        canonicalPath="/about"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'About Us', path: '/about' }
        ]}
        faqs={[
          {
            question: "What is ForenClue and when was it founded?",
            answer: "Founded in 2025, ForenClue is an official MSME Udyam registered Forensic Science and Cybersecurity EdTech platform in India dedicated to practical investigation training, real-world case studies, virtual laboratory simulations, and academic mentorship."
          },
          {
            question: "Who are the leaders and founders of ForenClue?",
            answer: "ForenClue is led by Founder Tejas Tapse, Chief Executive Officer (CEO) Mrunmayee Bodhe, Co-Founder Ayush Gaikwad, Managing Director (MD) Pranav Kale Patil, and Chief Technology Officer (CTO) Punam Gadade."
          },
          {
            question: "Who is the Academic Mentor at ForenClue?",
            answer: "Rajat Pithadia serves as Academic Mentor at ForenClue. He is UGC-NET & GSET qualified, an Assistant Professor at Parul University, a published Wiley Author, and a Ph.D. Scholar specializing in Genotoxicity & Mutagenicity with an M.Sc. in Forensic Chemistry, Toxicology & Pharmacology."
          },
          {
            question: "What is the mission and vision of ForenClue?",
            answer: "ForenClue's mission is to democratize top-tier forensic science and cybersecurity education by bridging the gap between academic theory and real-world crime scene and digital investigation practices."
          }
        ]}
        customSchema={aboutCustomSchema}
      />

      <div className="max-w-4xl mx-auto mb-24 text-left">
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
          className="bg-surface p-8 border border-black/10 dark:border-white/10 mb-12 relative overflow-hidden rounded-xl"
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-warning/5 rounded-full blur-[50px] -z-10"></div>
          <p className="text-base text-text-muted leading-relaxed relative z-10">
            Founded in 2025, ForenClue is a dedicated Forensic Science and Cybersecurity EdTech platform, officially registered under MSME Udyam, Government of India. We are committed to empowering students, educators, researchers, and professionals through practical learning, expert-led content, real-world case studies, research resources, and industry-focused skill development. By bridging the gap between academic knowledge and real-world investigation practices, ForenClue aims to nurture the next generation of skilled forensic and cybersecurity professionals equipped to meet the evolving challenges of the digital and investigative landscape.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="bg-surface p-8 border border-black/10 dark:border-white/10 mb-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-warning/5 rounded-full blur-[50px] -z-10"></div>
          <h2 className="text-2xl font-heading font-bold mb-4 text-warning uppercase tracking-widest">Our Vision</h2>
          <p className="text-lg text-text-muted leading-relaxed relative z-10">
            At ForenClue, we envision a future where top-tier forensic education is democratized and accessible to every passionate student. We aim to bridge the gap between theoretical knowledge and real-world application, cultivating a new generation of investigators equipped to solve the challenges of modern crime and digital forensics globally.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-surface p-8 border border-black/10 dark:border-white/10 mb-12 relative overflow-hidden"
        >
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-warning/5 rounded-full blur-[50px] -z-10"></div>
          <h2 className="text-2xl font-heading font-bold mb-4 text-warning uppercase tracking-widest">Our Mission</h2>
          <p className="text-lg text-text-muted leading-relaxed mb-6 relative z-10">
            Our mission is to empower aspiring forensic scientists through practical, engaging, and career-driven learning experiences. We are dedicated to:
          </p>
          <ul className="space-y-4 text-text-muted text-base relative z-10">
            <li className="flex gap-4 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-warning mt-2 shrink-0"></div>
              <span><strong className="text-text-main">Demystifying Forensics:</strong> Breaking down complex scientific concepts into accessible, easy-to-understand modules.</span>
            </li>
            <li className="flex gap-4 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-warning mt-2 shrink-0"></div>
              <span><strong className="text-text-main">Practical Empowerment:</strong> Providing hands-on tools, simulated case studies, and real-world exposure that textbooks simply cannot offer.</span>
            </li>
            <li className="flex gap-4 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-warning mt-2 shrink-0"></div>
              <span><strong className="text-text-main">Community Building:</strong> Fostering India’s strongest inclusive network for forensic discussion, collaboration, and career mentorship.</span>
            </li>
             <li className="flex gap-4 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-warning mt-2 shrink-0"></div>
              <span><strong className="text-text-main">Career Advancement:</strong> Offering certifications and pathways that actively boost professional profiles.</span>
            </li>
          </ul>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto perspective-[2000px]"
      >
        <h2 className="text-3xl font-heading font-black mb-12 text-center">Meet Our Leaders</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
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
        <h2 className="text-3xl font-heading font-black mb-12 text-center">Academic Mentor</h2>
        
        <div className="max-w-md mx-auto">
          {academicMentors.map((mentor, i) => (
            <TeamCard key={i} member={mentor} index={i} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
