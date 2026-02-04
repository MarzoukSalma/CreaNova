import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Sparkles, HelpCircle } from "lucide-react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Qu'est-ce que CreaNova ?",
      answer:
        "CreaNova est un écosystème créatif nouvelle génération qui fusionne l'intelligence émotionnelle et la structure digitale. C'est un espace conçu pour transformer vos idées en réalité grâce à des outils intuitifs et puissants.",
    },
    {
      question: "Comment fonctionne le Journal Créatif ?",
      answer:
        "Le Journal Créatif est un espace d'introspection assisté par une interface minimaliste. Il vous permet de documenter vos pensées, idées et projets tout en bénéficiant de suggestions intelligentes pour enrichir votre réflexion.",
    },
    {
      question: "Qu'est-ce que la Focus Zone ?",
      answer:
        "La Focus Zone est un environnement sans distraction conçu pour maximiser votre concentration. Elle élimine tout élément superflu pour vous permettre de vous immerger totalement dans votre travail créatif.",
    },
    {
      question: "CreaNova AI utilise-t-elle mes données pour l'entraînement ?",
      answer:
        "Non, vos données restent privées et sécurisées. CreaNova AI utilise vos informations uniquement pour vous fournir des suggestions personnalisées dans votre session. Nous ne partageons ni n'utilisons vos données pour entraîner nos modèles.",
    },
    {
      question: "Puis-je collaborer avec d'autres créateurs ?",
      answer:
        "Oui, CreaNova propose des fonctionnalités de collaboration en temps réel. Vous pouvez inviter d'autres créateurs à travailler sur vos projets, partager des espaces de travail et échanger des idées de manière fluide.",
    },
    {
      question: "Quels sont les tarifs de CreaNova ?",
      answer:
        "CreaNova propose une version gratuite avec les fonctionnalités essentielles. Les plans premium démarrent à 9€/mois et offrent des fonctionnalités avancées comme l'IA illimitée, plus d'espace de stockage et des outils de collaboration étendus.",
    },
    {
      question: "Y a-t-il une application mobile ?",
      answer:
        "Oui, CreaNova est disponible sur iOS et Android. L'application mobile offre une expérience optimisée pour capturer vos idées en déplacement et synchronise automatiquement avec la version web.",
    },
    {
      question: "Comment puis-je exporter mes projets ?",
      answer:
        "Vous pouvez exporter vos projets dans plusieurs formats : PDF, DOCX, Markdown, ou JSON. Tous vos contenus vous appartiennent et peuvent être téléchargés à tout moment depuis votre tableau de bord.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative z-10 py-32 px-6 overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/5 to-transparent pointer-events-none" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/20 rounded-full"
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

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] uppercase tracking-[0.3em] mb-6">
            <HelpCircle size={14} className="animate-pulse" />
            <span>Questions Fréquentes</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-extralight text-white mb-4">
            Vous avez des{" "}
            <span className="font-serif italic text-purple-400">Questions</span>
            ?
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Trouvez toutes les réponses dont vous avez besoin
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group"
            >
              <div
                className={`bg-slate-900/40 backdrop-blur-xl rounded-2xl border transition-all duration-300 overflow-hidden ${
                  openIndex === index
                    ? "border-purple-500/50 shadow-xl shadow-purple-500/10"
                    : "border-slate-800/50 hover:border-slate-700"
                }`}
              >
                {/* Question */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors duration-300"
                >
                  <span className="text-white font-medium pr-8">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-950/50 border border-slate-800 flex items-center justify-center text-purple-400 group-hover:border-purple-500/50 transition-colors"
                  >
                    {openIndex === index ? (
                      <Minus size={18} />
                    ) : (
                      <Plus size={18} />
                    )}
                  </motion.div>
                </button>

                {/* Answer */}
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-0">
                        <div className="pt-4 border-t border-slate-800/50">
                          <p className="text-slate-400 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16 p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl border border-purple-500/20"
        >
          <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h3 className="text-2xl font-light text-white mb-3">
            Vous ne trouvez pas votre réponse ?
          </h3>
          <p className="text-slate-400 mb-6">
            Notre équipe est là pour vous aider
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
          >
            Nous contacter
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
