const CreaNovaManifesto = () => {
  return (
    <section className="relative z-10 py-32 px-6 bg-[#020617]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-8">
          <h2 className="text-4xl md:text-5xl font-extralight text-white leading-tight">
            L'Équilibre Parfait entre <br />
            <span className="font-serif italic text-purple-400">
              Rigueur et Chaos
            </span>
          </h2>
          <div className="space-y-6 text-slate-400 font-light text-lg leading-relaxed">
            <p>
              CreaNova est né d'un constat simple : les outils actuels sont soit
              trop rigides, soit trop désordonnés. Nous avons bâti un{" "}
              <strong>écosystème hybride</strong> où chaque pixel est au service
              de votre intuition.
            </p>
            <p>
              Grâce à notre architecture "Flow-State", l'interface s'efface pour
              ne laisser que votre contenu. Que vous soyez designer, écrivain ou
              stratège, CreaNova s'adapte à votre propre rythme cognitif.
            </p>
          </div>
          <div className="flex gap-10 border-t border-slate-900 pt-10">
            <div>
              <div className="text-3xl font-bold text-white">99.9%</div>
              <div className="text-xs uppercase tracking-widest text-purple-500 mt-1">
                Focus pur
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-xs uppercase tracking-widest text-purple-500 mt-1">
                Accès Créatif
              </div>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-4 bg-purple-500/10 blur-2xl rounded-full group-hover:bg-purple-500/20 transition-all duration-700" />
          <div className="relative border border-slate-800 rounded-[3rem] overflow-hidden bg-slate-950 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800"
              alt="Interface preview"
              className="opacity-60 group-hover:opacity-100 transition-opacity duration-1000"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
