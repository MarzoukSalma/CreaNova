import React, { useEffect, useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Github,
  Linkedin,
  Mail,
  Code2,
  Cpu,
  Globe,
  Rocket,
  ArrowLeft,
  Heart,
  Sparkles,
  Brain,
  Database,
} from "lucide-react";

// --- 1. BACKGROUND DYNAMIQUE ---
const MouseStarsBackground = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particles = [];
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();
    const handleMouseMove = (e) => {
      for (let i = 0; i < 2; i++)
        particles.push(new Particle(e.clientX, e.clientY));
    };
    window.addEventListener("mousemove", handleMouseMove);
    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 1.5;
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = (Math.random() - 0.5) * 1.5;
        this.color = `rgba(168, 85, 247, ${Math.random() * 0.5})`;
        this.life = 100;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 1;
      }
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.update();
        p.draw();
        if (p.life <= 0) particles.splice(i, 1);
      });
      requestAnimationFrame(animate);
    };
    animate();
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  return (
    <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
  );
};

// --- 2. COMPOSANT CARTE RÉDUITE ---
const EngineerCard = ({ eng, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="relative group"
    >
      <div className="relative border border-white/5 rounded-[2.5rem] overflow-hidden bg-slate-900/20 backdrop-blur-xl hover:border-purple-500/30 transition-all duration-500">
        {/* IMAGE PLUS PETITE (h-96 = 384px) */}
        <div className="relative h-96 overflow-hidden">
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 1 }}
            src={eng.image}
            className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
            alt={eng.name}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-90" />

          {/* Badge Spécialité */}
          <div className="absolute top-6 left-6 bg-slate-950/80 border border-purple-500/30 p-2 rounded-xl backdrop-blur-md">
            <div className="text-purple-400">{eng.specialtyIcon}</div>
          </div>

          {/* Social Links Reveal */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 translate-x-20 group-hover:translate-x-0 transition-transform duration-500">
            {[
              { icon: <Github size={18} />, link: eng.links.github },
              { icon: <Linkedin size={18} />, link: eng.links.linkedin },
              { icon: <Mail size={18} />, link: eng.links.mail },
            ].map((social, i) => (
              <a
                key={i}
                href={social.link}
                className="w-10 h-10 rounded-xl bg-black/80 border border-white/10 flex items-center justify-center text-slate-300 hover:text-purple-400 hover:border-purple-500/50 backdrop-blur-xl transition-all"
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Nom */}
          <div className="absolute bottom-6 left-8">
            <h3 className="text-3xl font-extralight text-white tracking-tighter">
              {eng.name.split(" ")[0]}{" "}
              <span className="font-serif italic text-purple-500">
                {eng.name.split(" ")[1]}
              </span>
            </h3>
            <p className="text-purple-400 text-[9px] uppercase tracking-widest font-bold">
              {eng.role}
            </p>
          </div>
        </div>

        {/* Détails expertise au hover */}
        <div className="max-h-0 group-hover:max-h-[300px] transition-all duration-700 ease-in-out bg-white/[0.01] overflow-hidden">
          <div className="p-6 space-y-4">
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              {eng.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {eng.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-white/5 rounded text-[10px] text-slate-300 border border-white/5"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- 3. PAGE PRINCIPALE ---
const AboutUs = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const team = [
    {
      name: "Salma Marzouk",
      role: "AI Engineer",
      image: "/salma.png", // Image locale dans le dossier public
      bio: "L'IA au service de l'humain.",
      description: `Salma, étudiante en 4ᵉ année à l’ENSAT Tanger, développe des projets
alliant Intelligence Artificielle, backend et animations 3D interactives.
Elle s’intéresse particulièrement aux solutions innovantes et aux
expériences numériques intelligentes et immersives.`,

      specialtyIcon: <Brain size={18} />,
      skills: [
        "ML",
        "React",
        "Express.js",
        "Python",
        "RAG",
        "3D Animation",
        "NLP",
      ],
      links: {
        github: "https://github.com/MarzoukSalma",
        linkedin: "www.linkedin.com/in/salma-marzouk-822065314",
        mail: "salmamarzouk07@gmail.com",
      },
    },
    {
      name: "Douae Rajei",
      role: "Backend Engineer",
      image: "/douae.png", // Image locale dans le dossier public

      bio: "Bâtir l'invisible.",
      description: `Étudiante en 4ᵉ année à l’ENSAT Tanger, Douae contribue au
développement back-end et à la sécurité des applications, en mettant
l’accent sur la fiabilité et la protection des données.`,
      skills: ["Node.js", "Docker", "Express.js", "MongoDB", "Postgres", "Jwt"],
      links: { github: "#", linkedin: "#", mail: "#" },
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-purple-500/30 overflow-x-hidden font-sans relative">
      <MouseStarsBackground />
      <motion.div
        className="fixed top-0 left-0 right-0 h-[1px] bg-purple-500 z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* BOUTON RETOUR - Plus discret */}
      <button
        onClick={() => navigate("/")}
        className="fixed top-20 left-8 z-[60] flex items-center gap-3 text-slate-500 hover:text-white transition-all group"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span className="text-[9px] uppercase tracking-[0.3em]">Retour</span>
      </button>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-20">
        {" "}
        {/* PT-20 réduit l'espace haut */}
        {/* HERO SECTION - Plus compacte */}
        <section className="text-center mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-purple-500/60 text-[10px] uppercase tracking-[0.4em]"
          >
            ENSAT Tanger
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-extralight tracking-tighter"
          >
            Les Artisanes{" "}
            <span className="font-serif italic text-purple-500">du Futur</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-400 text-sm max-w-xl mx-auto font-light leading-relaxed"
          >
            Fusionner l'IA et le Backend pour redéfinir l'expérience digitale.
          </motion.p>
        </section>
        {/* TEAM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto mb-32">
          {team.map((eng, index) => (
            <EngineerCard key={index} eng={eng} index={index} />
          ))}
        </div>
        {/* VISION SECTION - Plus compacte */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-12 text-center space-y-6"
        >
          <Sparkles size={24} className="text-purple-500 mx-auto" />
          <h2 className="text-3xl font-extralight italic">
            "Le code est notre pinceau."
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto font-light leading-loose">
            Notre vision à l'ENSAT est de créer une technologie qui ne se
            contente pas de fonctionner, mais qui inspire. Chaque projet est un
            pas vers un futur plus intelligent et plus humain.
          </p>
          <div className="flex justify-center gap-2 pt-4">
            <Heart size={14} className="text-purple-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest text-slate-500">
              Passion & Ingénierie
            </span>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default AboutUs;
