import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Heart,
  Sparkles,
  Stars,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.jsx"; // Adjust path based on your file structure

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showmotDePasse, setShowmotDePasse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    mail: "",
    motDePasse: "",
    confirmmotDePasse: "",
    name: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  // Floating elements animation
  const [floatingElements, setFloatingElements] = useState([]);

  useEffect(() => {
    const elements = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      speed: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.1,
    }));
    setFloatingElements(elements);

    const interval = setInterval(() => {
      setFloatingElements((prev) =>
        prev.map((el) => ({
          ...el,
          y: (el.y - el.speed) % 110,
        }))
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

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
      newErrors.mail = "mail requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.mail)) {
      newErrors.mail = "Format d'mail invalide";
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
      if (formData.motDePasse !== formData.confirmmotDePasse) {
        newErrors.confirmmotDePasse = "Les mots de passe ne correspondent pas";
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

      // Assuming your backend returns { token, user }
      const { token, user } = response.data;

      // Store token in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect to reves or home page
      navigate("/reves"); // Adjust route as needed
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;

        if (status === 401) {
          setServerError("mail ou mot de passe incorrect");
        } else if (status === 404) {
          setServerError("Utilisateur non trouvé");
        } else if (status === 500) {
          setServerError("Erreur serveur. Veuillez réessayer plus tard.");
        } else {
          setServerError(data.message || "Erreur de connexion");
        }
      } else if (error.request) {
        // Network error
        setServerError(
          "Impossible de se connecter au serveur. Vérifiez votre connexion."
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

      // Assuming your backend returns { token, user } or { message }
      const { token, user, message } = response.data;

      if (token) {
        // Auto-login after registration
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        alert("Inscription réussie! Vous êtes maintenant connecté.");
        navigate("/reves"); // Adjust route as needed
      } else {
        // Registration successful but requires mail verification
        alert(message || "Inscription réussie! Veuillez vérifier votre mail.");
        setIsLogin(true); // Switch to login mode
      }
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400) {
          if (data.message && data.message.includes("mail")) {
            setServerError("Cette adresse mail est déjà utilisée");
          } else {
            setServerError(data.message || "Données invalides");
          }
        } else if (status === 409) {
          setServerError("Un compte avec cette adresse mail existe déjà");
        } else if (status === 500) {
          setServerError("Erreur serveur. Veuillez réessayer plus tard.");
        } else {
          setServerError(data.message || "Erreur d'inscription");
        }
      } else if (error.request) {
        setServerError(
          "Impossible de se connecter au serveur. Vérifiez votre connexion."
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
      confirmmotDePasse: "",
      name: "",
    });
    setErrors({});
    setServerError("");
  };

  const handleForgotmotDePasse = async () => {
    if (!formData.mail) {
      setErrors({ mail: "Veuillez entrer votre mail d'abord" });
      return;
    }

    try {
      setIsLoading(true);
      await api.post("/auth/forgot-motDePasse", { mail: formData.mail });
      alert("Un mail de réinitialisation a été envoyé à votre adresse");
    } catch (error) {
      console.error("Forgot motDePasse error:", error);
      setServerError("Erreur lors de l'envoi de l'mail de réinitialisation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              width: `${element.size}px`,
              height: `${element.size}px`,
              opacity: element.opacity,
              animation: `float ${
                element.speed + 3
              }s ease-in-out infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/10 to-blue-600/20" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 shadow-2xl">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">✨ Les Rêves</h1>
            <p className="text-purple-200 text-lg">
              Votre journal créatif personnel
            </p>
          </div>

          {/* Login/Register Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
            {/* Server Error Display */}
            {serverError && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-400/50 rounded-xl">
                <p className="text-red-200 text-sm flex items-center gap-2">
                  <span>⚠️</span>
                  {serverError}
                </p>
              </div>
            )}

            {/* Tab Switcher */}
            <div className="flex bg-white/10 rounded-2xl p-1 mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-6 rounded-xl transition-all duration-300 font-semibold ${
                  isLogin
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Connexion
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-6 rounded-xl transition-all duration-300 font-semibold ${
                  !isLogin
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Inscription
              </button>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Name Field (only for registration) */}
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-white font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nom complet
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className={`w-full px-4 py-4 bg-white/10 border ${
                        errors.name ? "border-red-400" : "border-white/30"
                      } rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300`}
                      placeholder="Votre nom complet"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-300 text-sm flex items-center gap-1">
                      <span>⚠️</span> {errors.name}
                    </p>
                  )}
                </div>
              )}

              {/* mail Field */}
              <div className="space-y-2">
                <label className="text-white font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Adresse mail
                </label>
                <div className="relative">
                  <input
                    type="mail"
                    value={formData.mail}
                    onChange={(e) => handleInputChange("mail", e.target.value)}
                    className={`w-full px-4 py-4 bg-white/10 border ${
                      errors.mail ? "border-red-400" : "border-white/30"
                    } rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300`}
                    placeholder="votre@mail.com"
                  />
                </div>
                {errors.mail && (
                  <p className="text-red-300 text-sm flex items-center gap-1">
                    <span>⚠️</span> {errors.mail}
                  </p>
                )}
              </div>

              {/* motDePasse Field */}
              <div className="space-y-2">
                <label className="text-white font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showmotDePasse ? "text" : "motDePasse"}
                    value={formData.motDePasse}
                    onChange={(e) =>
                      handleInputChange("motDePasse", e.target.value)
                    }
                    className={`w-full px-4 py-4 pr-12 bg-white/10 border ${
                      errors.motDePasse ? "border-red-400" : "border-white/30"
                    } rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowmotDePasse(!showmotDePasse)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    {showmotDePasse ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.motDePasse && (
                  <p className="text-red-300 text-sm flex items-center gap-1">
                    <span>⚠️</span> {errors.motDePasse}
                  </p>
                )}
              </div>

              {/* Confirm motDePasse (only for registration) */}
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-white font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type="motDePasse"
                      value={formData.confirmmotDePasse}
                      onChange={(e) =>
                        handleInputChange("confirmmotDePasse", e.target.value)
                      }
                      className={`w-full px-4 py-4 bg-white/10 border ${
                        errors.confirmmotDePasse
                          ? "border-red-400"
                          : "border-white/30"
                      } rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirmmotDePasse && (
                    <p className="text-red-300 text-sm flex items-center gap-1">
                      <span>⚠️</span> {errors.confirmmotDePasse}
                    </p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-purple-400/50 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-2xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isLogin
                      ? "Connexion en cours..."
                      : "Création du compte..."}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    {isLogin ? (
                      <>
                        <Heart className="w-5 h-5" />
                        Se connecter
                      </>
                    ) : (
                      <>
                        <Stars className="w-5 h-5" />
                        Créer mon compte
                      </>
                    )}
                  </div>
                )}
              </button>

              {/* Forgot motDePasse (only for login) */}
              {isLogin && (
                <div className="text-center">
                  <button
                    onClick={handleForgotmotDePasse}
                    disabled={isLoading}
                    className="text-purple-300 hover:text-white transition-colors text-sm disabled:opacity-50"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
              )}

              {/* Switch Mode */}
              <div className="text-center pt-4 border-t border-white/20">
                <p className="text-white/70 mb-3">
                  {isLogin
                    ? "Vous n'avez pas de compte ?"
                    : "Vous avez déjà un compte ?"}
                </p>
                <button
                  onClick={switchMode}
                  className="text-purple-300 hover:text-white font-semibold transition-colors"
                >
                  {isLogin ? "Créer un compte" : "Se connecter"}
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-white/50 text-sm">
              © 2024 Les Rêves - Journal Créatif
            </p>
            <p className="text-white/30 text-xs mt-2">
              Donnez vie à vos projets créatifs ✨
            </p>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-20px) rotate(10deg); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
