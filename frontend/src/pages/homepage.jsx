import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import ajouté
import {
  Sparkles,
  Quote,
  Zap,
  MessageCircle,
  Star,
  Mail,
  Rocket,
} from "lucide-react"; // Rocket ajouté
import Testimonials from "../components/Testimonials";
import Features from "../components/Features";
import Contact from "../components/Contact";
import FAQ from "../components/FAQ";

// --- 1. BACKGROUND ANIMÉ (ÉTOILES SUIVANT LA SOURIS) ---
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
      for (let i = 0; i < 2; i++) particles.push(new Particle(e.x, e.y));
    };
    window.addEventListener("mousemove", handleMouseMove);
    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `rgba(168, 85, 247, ${Math.random() * 0.5 + 0.5})`;
        this.life = 100;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 0.8;
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

// --- 2. COMPOSANT PAGE PRINCIPALE ---
const HomePage = ({ onNavigateToLogin }) => {
  const navigate = useNavigate(); // Hook de navigation initialisé

  // Fonction de scroll fluide pour les sections internes
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans relative overflow-x-hidden">
      <MouseStarsBackground />

      {/* 1. HERO SECTION */}
      <section className="relative z-10 h-screen flex flex-col justify-center items-center px-6 text-center overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute w-[600px] h-[300px] bg-purple-600/20 blur-[120px] rounded-full -z-10"
        />

        <div className="max-w-5xl space-y-10">
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, filter: "blur(20px)", y: 20 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="text-7xl md:text-[10rem] font-extralight text-white tracking-tighter leading-none"
            >
              CREA
              <span className="font-serif italic text-purple-500">NOVA</span>
            </motion.h1>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 1, duration: 1.5, ease: "easeInOut" }}
              className="h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mx-auto"
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="text-slate-400 text-xl md:text-2xl font-light max-w-3xl mx-auto leading-relaxed"
          >
            L'espace où vos{" "}
            <span className="text-white italic font-serif">
              visions les plus folles
            </span>{" "}
            deviennent des architectures digitales d'exception.
          </motion.p>

          {/* --- MENU DE NAVIGATION AVEC LE BOUTON "RÉALISÉ PAR" --- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
            className="flex flex-wrap justify-center gap-4 pt-4"
          >
            {[
              {
                label: "Features",
                icon: <Zap size={14} />,
                id: "features-sec",
                type: "scroll",
              },
              {
                label: "Témoignages",
                icon: <Star size={14} />,
                id: "testimonials-sec",
                type: "scroll",
              },
              {
                label: "FAQ",
                icon: <MessageCircle size={14} />,
                id: "faq-sec",
                type: "scroll",
              },
              {
                label: "Contact",
                icon: <Mail size={14} />,
                id: "contact-sec",
                type: "scroll",
              },
              // Nouveau bouton vers la page AboutUs
              {
                label: "Réalisé par",
                icon: <Rocket size={14} />,
                path: "/about",
                type: "page",
              },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={() => {
                  if (btn.type === "page") {
                    navigate(btn.path);
                  } else {
                    scrollToSection(btn.id);
                  }
                }}
                className="group flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-purple-500/10 hover:border-purple-500/50 transition-all duration-300 text-sm font-light tracking-wide hover:scale-105"
              >
                <span className="text-purple-400">{btn.icon}</span>
                {btn.label}
              </button>
            ))}
          </motion.div>

          {/* --- BOUTONS D'ACTION VERS LOGIN --- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 1 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6 pt-10"
          >
            <button
              onClick={onNavigateToLogin}
              className="group relative px-12 py-5 bg-white text-black font-bold rounded-full overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95"
            >
              <span className="relative z-10">COMMENCER L'EXPÉRIENCE</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>

            <button
              onClick={onNavigateToLogin}
              className="px-10 py-5 border border-white/20 rounded-full font-medium hover:bg-white hover:text-black transition-all duration-500"
            >
              DÉCOUVRIR TOUT
            </button>
          </motion.div>
        </div>

        <div className="absolute inset-0 pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: ["0vh", "100vh"], opacity: [0, 0.3, 0] }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 10,
              }}
              className="absolute w-[1px] h-20 bg-gradient-to-b from-purple-500/50 to-transparent"
              style={{ left: `${Math.random() * 100}%` }}
            />
          ))}
        </div>
      </section>

      {/* 2. CITATION SECTION */}
      <section className="relative z-10 py-28 bg-slate-950/40 border-y border-slate-900/50 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <Quote className="w-10 h-10 text-purple-900 mx-auto mb-8 opacity-30" />
          <h2 className="text-2xl md:text-4xl text-slate-400 font-light italic leading-snug">
            "La créativité est la seule richesse qui augmente quand on la
            partage."
          </h2>
        </div>
      </section>

      {/* 3. MANIFESTO SECTION */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-extralight text-white leading-tight">
              L'Équilibre Parfait entre <br />
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="font-serif italic text-purple-400"
              >
                Rigueur et Chaos
              </motion.span>
            </h2>
            <div className="space-y-6 text-slate-400 font-light text-lg border-l border-purple-500/30 pl-6">
              <p>
                CreaNova est né d'un constat simple : les outils actuels sont
                soit trop rigides, soit trop désordonnés.
              </p>
              <p>
                Nous avons bâti un écosystème hybride où chaque pixel est au
                service de votre intuition.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "circOut" }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-purple-600/20 blur-[60px] rounded-full animate-pulse" />
            <motion.div
              whileHover={{ rotateX: 5, rotateY: -5, scale: 1.02 }}
              animate={{ y: [0, -20, 0] }}
              transition={{
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                default: { type: "spring", stiffness: 300 },
              }}
              className="relative border border-slate-700/50 rounded-[3rem] overflow-hidden bg-slate-900/40 p-3 shadow-2xl backdrop-blur-sm"
            >
              <img
                src="/image0.png"
                className="rounded-[2.5rem] opacity-80 grayscale hover:grayscale-0 transition-all duration-700 w-full object-cover"
                alt="Manifesto Visual"
              />
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-6 bg-slate-900 border border-purple-500/50 px-6 py-3 rounded-2xl shadow-xl backdrop-blur-md z-20"
            >
              <span className="text-xs uppercase tracking-[0.2em] text-purple-400 font-bold">
                Innovation Art
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 4. GALERIE SECTION - SYMPHONIE DIGITALE */}
      <section className="relative z-10 py-32 bg-black/40 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative min-h-[700px] flex items-center justify-center">
          {/* Texte Central */}
          <div className="relative z-20 text-center max-w-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <span className="text-purple-400 text-xs uppercase tracking-[0.4em] mb-4 block">
                Découvrez notre univers
              </span>
              <h2 className="text-5xl md:text-7xl font-extralight text-white leading-tight">
                Symphonie{" "}
                <span className="italic font-serif text-purple-400 block">
                  Digitale
                </span>
              </h2>
              <p className="mt-6 text-slate-500 text-sm font-light tracking-widest leading-relaxed">
                Où l'art et la technologie s'unissent pour créer une expérience
                immersive unique.
              </p>
            </motion.div>
          </div>

          {/* Photos aux positions originales SANS effet gris */}
          {[
            {
              id: "01",
              title: "Design Émotionnel",
              img: "/image1.png",
              pos: "top-0 left-0",
              delay: 0.2,
            },
            {
              id: "02",
              title: "Structure Agile",
              img: "/image2.png",
              pos: "top-0 right-0",
              delay: 0.4,
            },
            {
              id: "03",
              title: "Interface Intuitive",
              img: "/image3.png",
              pos: "bottom-0 left-0",
              delay: 0.6,
            },
            {
              id: "04",
              title: "Vision Créative",
              img: "/image.png",
              pos: "bottom-0 right-0",
              delay: 0.8,
            },
          ].map((item) => (
            <motion.div
              key={item.id}
              initial={{
                opacity: 0,
                x: item.pos.includes("left") ? -50 : 50,
                y: item.pos.includes("top") ? -50 : 50,
              }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: item.delay, duration: 1, ease: "easeOut" }}
              className={`absolute ${item.pos} hidden lg:block group`}
            >
              <div className="relative w-64 h-80 rounded-[2rem] overflow-hidden border border-white/5 bg-slate-900/40 backdrop-blur-sm">
                <img
                  src={item.img}
                  className="absolute inset-0 w-full h-full object-cover"
                  alt={item.title}
                />
                {/* Dégradé discret pour le texte */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h4 className="text-lg font-light text-white">
                    {item.title}
                  </h4>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- SECTIONS AVEC IDS --- */}
      <div id="features-sec">
        <Features />
      </div>
      <div id="faq-sec">
        <FAQ />
      </div>
      <div id="testimonials-sec">
        <Testimonials />
      </div>
      <div id="contact-sec">
        <Contact />
      </div>
    </div>
  );
};

export default HomePage;
