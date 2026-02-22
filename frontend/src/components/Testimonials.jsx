import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const testimonials = [
    {
      name: "Alexandre V.",
      text: "CreaNova a totalement changé ma manière d'aborder mes projets. L'interface est si pure qu'elle laisse toute la place à l'imagination.",
      role: "Designer UI/UX",
    },
    {
      name: "Sofia K.",
      text: "L'IA intégrée ne se contente pas de corriger, elle propose des pistes créatives qui débloquent ma page blanche en quelques secondes.",
      role: "Auteure",
    },
    {
      name: "Marc L.",
      text: "Le minimalisme est enfin mis au service de la productivité. La 'Focus Zone' est devenue mon espace favori au quotidien.",
      role: "Créateur Digital",
    },
  ];

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
    }),
    center: { zIndex: 1, x: 0, opacity: 1, scale: 1 },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
    }),
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentIndex(
      (prev) =>
        (prev + newDirection + testimonials.length) % testimonials.length,
    );
  };

  return (
    <section className="relative z-10 py-32 px-6 overflow-hidden">
      {/* Image de fond avec les étoiles */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/image0.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Overlay léger pour ne pas masquer les étoiles */}
      <div className="absolute inset-0 z-0 bg-[#020617]/30"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-purple-400 font-bold mb-4">
            Avis Clients
          </p>
          <h2 className="text-4xl font-extralight text-white font-serif italic">
            Paroles de Créateurs
          </h2>
        </div>

        <div
          className="relative h-[380px] flex items-center justify-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 200, damping: 25 },
                opacity: { duration: 0.3 },
              }}
              className="absolute max-w-2xl w-full bg-slate-900/40 backdrop-blur-xl p-10 md:p-14 rounded-[3rem] border border-slate-800 text-center shadow-2xl"
            >
              <Quote className="w-10 h-10 text-purple-500/10 mx-auto mb-6" />
              <p className="text-xl md:text-2xl text-slate-300 font-light italic leading-relaxed mb-8">
                "{testimonials[currentIndex].text}"
              </p>
              <div className="text-white font-bold tracking-wide">
                {testimonials[currentIndex].name}
              </div>
              <div className="text-purple-500 text-[10px] uppercase tracking-widest mt-1 font-bold">
                {testimonials[currentIndex].role}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-x-0 flex justify-between px-2 md:-px-10">
            <button
              onClick={() => paginate(-1)}
              className="w-10 h-10 rounded-full border border-slate-800 bg-slate-950/50 text-white flex items-center justify-center hover:bg-purple-600 transition-all pointer-events-auto"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => paginate(1)}
              className="w-10 h-10 rounded-full border border-slate-800 bg-slate-950/50 text-white flex items-center justify-center hover:bg-purple-600 transition-all pointer-events-auto"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
