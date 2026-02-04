import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.jsx";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showMotDePasse, setShowMotDePasse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    mail: "",
    motDePasse: "",
    confirmMotDePasse: "",
    name: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (serverError) {
      setServerError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.mail) {
      newErrors.mail = "Email requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.mail)) {
      newErrors.mail = "Format d'email invalide";
    }

    if (!formData.motDePasse) {
      newErrors.motDePasse = "Mot de passe requis";
    } else if (formData.motDePasse.length < 6) {
      newErrors.motDePasse = "Au moins 6 caractères";
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = "Nom requis";
      }
      if (formData.motDePasse !== formData.confirmMotDePasse) {
        newErrors.confirmMotDePasse = "Les mots de passe ne correspondent pas";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", {
        mail: formData.mail,
        motDePasse: formData.motDePasse,
      });

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/reves");
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          setServerError("Email ou mot de passe incorrect");
        } else if (status === 404) {
          setServerError("Utilisateur non trouvé");
        } else if (status === 500) {
          setServerError("Erreur serveur. Veuillez réessayer plus tard.");
        } else {
          setServerError(data.message || "Erreur de connexion");
        }
      } else if (error.request) {
        setServerError(
          "Impossible de se connecter au serveur. Vérifiez votre connexion.",
        );
      } else {
        setServerError("Une erreur inattendue s'est produite");
      }
    }
  };

  const handleRegister = async () => {
    try {
      const response = await api.post("/auth/register", {
        nom: formData.name,
        mail: formData.mail,
        motDePasse: formData.motDePasse,
      });

      const { token, user, message } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/reves");
      } else {
        setIsLogin(true);
      }
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          if (data.message && data.message.includes("mail")) {
            setServerError("Cette adresse email est déjà utilisée");
          } else {
            setServerError(data.message || "Données invalides");
          }
        } else if (status === 409) {
          setServerError("Un compte avec cette adresse email existe déjà");
        } else if (status === 500) {
          setServerError("Erreur serveur. Veuillez réessayer plus tard.");
        } else {
          setServerError(data.message || "Erreur d'inscription");
        }
      } else if (error.request) {
        setServerError(
          "Impossible de se connecter au serveur. Vérifiez votre connexion.",
        );
      } else {
        setServerError("Une erreur inattendue s'est produite");
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setServerError("");

    try {
      if (isLogin) {
        await handleLogin();
      } else {
        await handleRegister();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      mail: "",
      motDePasse: "",
      confirmMotDePasse: "",
      name: "",
    });
    setErrors({});
    setServerError("");
  };

  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden">
      {/* Background with stars image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/image4.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="absolute inset-0 z-0 bg-[#020617]/40"></div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md w-full"
        >
          {/* Logo Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-[1.5rem] mb-6 shadow-2xl shadow-purple-500/50"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-5xl font-extralight text-white mb-3 tracking-tight">
              <span className="font-serif italic text-purple-400">
                CreaNova
              </span>
            </h1>
            <p className="text-slate-400 text-sm font-light tracking-wide">
              Votre espace créatif personnel
            </p>
          </div>

          {/* Login/Register Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-10 border border-slate-800/50 shadow-2xl"
          >
            {/* Server Error Display */}
            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-400/30 rounded-xl"
              >
                <p className="text-red-300 text-sm">{serverError}</p>
              </motion.div>
            )}

            {/* Tab Switcher */}
            <div className="flex bg-slate-950/50 rounded-2xl p-1 mb-8 border border-slate-800">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-6 rounded-xl transition-all duration-300 font-medium text-sm ${
                  isLogin
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Connexion
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-6 rounded-xl transition-all duration-300 font-medium text-sm ${
                  !isLogin
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Inscription
              </button>
            </div>

            {/* Form */}
            <div className="space-y-5">
              {/* Name Field (only for registration) */}
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-slate-300 font-light text-sm flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-400" />
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`w-full px-5 py-4 bg-slate-950/50 border ${
                      errors.name ? "border-red-400/50" : "border-slate-800"
                    } rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-all duration-300`}
                    placeholder="Votre nom"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs">{errors.name}</p>
                  )}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-slate-300 font-light text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-400" />
                  Adresse email
                </label>
                <input
                  type="email"
                  value={formData.mail}
                  onChange={(e) => handleInputChange("mail", e.target.value)}
                  className={`w-full px-5 py-4 bg-slate-950/50 border ${
                    errors.mail ? "border-red-400/50" : "border-slate-800"
                  } rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-all duration-300`}
                  placeholder="votre@email.com"
                />
                {errors.mail && (
                  <p className="text-red-400 text-xs">{errors.mail}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-slate-300 font-light text-sm flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-400" />
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showMotDePasse ? "text" : "password"}
                    value={formData.motDePasse}
                    onChange={(e) =>
                      handleInputChange("motDePasse", e.target.value)
                    }
                    className={`w-full px-5 py-4 pr-12 bg-slate-950/50 border ${
                      errors.motDePasse
                        ? "border-red-400/50"
                        : "border-slate-800"
                    } rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-all duration-300`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowMotDePasse(!showMotDePasse)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-purple-400 transition-colors"
                  >
                    {showMotDePasse ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.motDePasse && (
                  <p className="text-red-400 text-xs">{errors.motDePasse}</p>
                )}
              </div>

              {/* Confirm Password (only for registration) */}
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-slate-300 font-light text-sm flex items-center gap-2">
                    <Lock className="w-4 h-4 text-purple-400" />
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    value={formData.confirmMotDePasse}
                    onChange={(e) =>
                      handleInputChange("confirmMotDePasse", e.target.value)
                    }
                    className={`w-full px-5 py-4 bg-slate-950/50 border ${
                      errors.confirmMotDePasse
                        ? "border-red-400/50"
                        : "border-slate-800"
                    } rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-all duration-300`}
                    placeholder="••••••••"
                  />
                  {errors.confirmMotDePasse && (
                    <p className="text-red-400 text-xs">
                      {errors.confirmMotDePasse}
                    </p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 mt-8"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isLogin ? "Connexion..." : "Création..."}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>{isLogin ? "Se connecter" : "Créer mon compte"}</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </motion.button>

              {/* Switch Mode */}
              <div className="text-center pt-6 border-t border-slate-800">
                <p className="text-slate-400 text-sm mb-3">
                  {isLogin
                    ? "Vous n'avez pas de compte ?"
                    : "Vous avez déjà un compte ?"}
                </p>
                <button
                  onClick={switchMode}
                  className="text-purple-400 hover:text-purple-300 font-medium text-sm transition-colors"
                >
                  {isLogin ? "Créer un compte" : "Se connecter"}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-slate-600 text-xs tracking-widest uppercase">
              © 2026 CreaNova Studio
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
