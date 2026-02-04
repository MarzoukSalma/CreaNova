import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Lightbulb,
  MessageCircle,
  Timer,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <BookOpen size={28} />,
      title: "Journal Créatif",
      description: "L'art de l'introspection assistée par une interface pure.",
      gradient: "from-purple-500 to-pink-500",
      delay: 0.1,
    },
    {
      icon: <Lightbulb size={28} />,
      title: "Studio Rêves",
      description: "Architecturez vos ambitions dans un espace sans limites.",
      gradient: "from-blue-500 to-cyan-500",
      delay: 0.2,
    },
    {
      icon: <MessageCircle size={28} />,
      title: "CreaNova AI",
      description: "Une intelligence qui comprend votre langage créatif.",
      gradient: "from-violet-500 to-purple-500",
      delay: 0.3,
    },
    {
      icon: <Timer size={28} />,
      title: "Focus Zone",
      description: "Le silence numérique nécessaire à l'éclosion d'idées.",
      gradient: "from-pink-500 to-rose-500",
      delay: 0.4,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.8,
      rotateX: -15,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8,
      },
    },
  };

  return (
    <section className="relative z-10 py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/5 to-transparent pointer-events-none" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] uppercase tracking-[0.3em] mb-6">
            <Sparkles size={14} className="animate-pulse" />
            <span>Fonctionnalités</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-extralight text-white mb-4">
            Un Écosystème{" "}
            <span className="font-serif italic text-purple-400">Complet</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Quatre piliers pour transformer votre créativité en réalité
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{
                y: -10,
                scale: 1.02,
                transition: { duration: 0.3 },
              }}
              className="group relative"
            >
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-[2rem] opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`}
              />

              <div className="relative h-[380px] bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-xl rounded-[2rem] border border-slate-800/50 group-hover:border-slate-700 p-8 flex flex-col justify-between overflow-hidden transition-all duration-500">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5`}
                  />
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)`,
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>

                <div className="relative z-10 space-y-6">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-[2px] shadow-2xl`}
                  >
                    <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center text-white group-hover:bg-transparent transition-all duration-500">
                      {feature.icon}
                    </div>
                  </motion.div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>

                <motion.div
                  className="relative z-10 flex items-center gap-2 text-slate-500 group-hover:text-purple-400 transition-colors duration-300"
                  whileHover={{ x: 5 }}
                >
                  <span className="text-[10px] uppercase tracking-widest font-bold">
                    Explorer
                  </span>
                  <ArrowRight size={14} />
                </motion.div>

                <motion.div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`}
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-20"
        >
          <p className="text-slate-500 text-sm mb-6">
            Prêt à transformer votre créativité ?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
          >
            Découvrir toutes les fonctionnalités
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
