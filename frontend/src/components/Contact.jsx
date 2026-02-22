import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { WavyBackground } from "./ui/WavyBackground";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    /* pt-20 : Un espace léger et élégant pour séparer les composants */
    <section
      id="contact"
      className="relative pt-20 bg-[#020617] overflow-hidden"
    >
      <WavyBackground
        className="max-w-6xl mx-auto pb-32 px-6"
        containerClassName="h-auto min-h-[800px]" // Ajusté pour ne pas forcer le plein écran si inutile
        backgroundFill="#020617"
        colors={["#a855f7", "#ec4899", "#8b5cf6"]}
        waveOpacity={0.2}
        blur={10}
      >
        <div className="relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] uppercase tracking-[0.3em] mb-6">
              <MessageCircle size={14} />
              <span>Contactez-nous</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-extralight text-white mb-4">
              Parlons de votre{" "}
              <span className="font-serif italic text-purple-400">Projet</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-slate-800/50">
                <h3 className="text-2xl font-light text-white mb-8">
                  Informations
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-5 group">
                    <div className="w-12 h-12 rounded-2xl bg-slate-950/50 border border-slate-800 flex items-center justify-center text-purple-400 group-hover:border-purple-500 transition-all">
                      <Mail size={20} />
                    </div>
                    <p className="text-sm font-light text-slate-300">
                      contact@creanova.studio
                    </p>
                  </div>
                  <div className="flex items-center gap-5 group">
                    <div className="w-12 h-12 rounded-2xl bg-slate-950/50 border border-slate-800 flex items-center justify-center text-purple-400 group-hover:border-purple-500 transition-all">
                      <Phone size={20} />
                    </div>
                    <p className="text-sm font-light text-slate-300">
                      +33 1 23 45 67 89
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/5 to-transparent backdrop-blur-xl rounded-[2.5rem] p-8 border border-purple-500/10">
                <Sparkles className="w-6 h-6 text-purple-400 mb-4" />
                <p className="text-slate-400 text-sm font-light italic">
                  "Réponse garantie sous 24h."
                </p>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <form
                onSubmit={handleSubmit}
                className="bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-slate-800/50 space-y-5"
              >
                <input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white focus:border-purple-500/50 transition-all outline-none font-light"
                  placeholder="Nom complet"
                />
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white focus:border-purple-500/50 transition-all outline-none font-light"
                  placeholder="Email"
                />
                <textarea
                  rows="4"
                  name="message"
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white focus:border-purple-500/50 transition-all outline-none font-light resize-none"
                  placeholder="Votre message..."
                ></textarea>
                <button className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-purple-600 hover:text-white transition-all duration-500 flex items-center justify-center gap-2">
                  <Send size={18} /> Envoyer
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </WavyBackground>
    </section>
  );
};

export default Contact;
