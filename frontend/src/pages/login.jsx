import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Mail, User, Heart, Sparkles, Stars } from 'lucide-react';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [errors, setErrors] = useState({});

  // Floating elements animation
  const [floatingElements, setFloatingElements] = useState([]);

  useEffect(() => {
    const elements = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      speed: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.1
    }));
    setFloatingElements(elements);

    const interval = setInterval(() => {
      setFloatingElements(prev => prev.map(el => ({
        ...el,
        y: (el.y - el.speed) % 110
      })));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Au moins 6 caractères';
    }
    
    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Nom requis';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert(isLogin ? 'Connexion réussie!' : 'Inscription réussie!');
    }, 2000);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    });
    setErrors({});
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
              animation: `float ${element.speed + 3}s ease-in-out infinite alternate`
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
            <h1 className="text-4xl font-bold text-white mb-2">
              ✨ Les Rêves
            </h1>
            <p className="text-purple-200 text-lg">
              Votre journal créatif personnel
            </p>
          </div>

          {/* Login/Register Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
            {/* Tab Switcher */}
            <div className="flex bg-white/10 rounded-2xl p-1 mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-6 rounded-xl transition-all duration-300 font-semibold ${
                  isLogin
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Connexion
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-6 rounded-xl transition-all duration-300 font-semibold ${
                  !isLogin
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-white/70 hover:text-white'
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
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-4 bg-white/10 border ${
                        errors.name ? 'border-red-400' : 'border-white/30'
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

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-white font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Adresse email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-4 bg-white/10 border ${
                      errors.email ? 'border-red-400' : 'border-white/30'
                    } rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300`}
                    placeholder="votre@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-300 text-sm flex items-center gap-1">
                    <span>⚠️</span> {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-white font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full px-4 py-4 pr-12 bg-white/10 border ${
                      errors.password ? 'border-red-400' : 'border-white/30'
                    } rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-300 text-sm flex items-center gap-1">
                    <span>⚠️</span> {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password (only for registration) */}
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-white font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`w-full px-4 py-4 bg-white/10 border ${
                        errors.confirmPassword ? 'border-red-400' : 'border-white/30'
                      } rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-300 text-sm flex items-center gap-1">
                      <span>⚠️</span> {errors.confirmPassword}
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
                    {isLogin ? 'Connexion en cours...' : 'Création du compte...'}
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

              {/* Forgot Password (only for login) */}
              {isLogin && (
                <div className="text-center">
                  <button className="text-purple-300 hover:text-white transition-colors text-sm">
                    Mot de passe oublié ?
                  </button>
                </div>
              )}

              {/* Switch Mode */}
              <div className="text-center pt-4 border-t border-white/20">
                <p className="text-white/70 mb-3">
                  {isLogin ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
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
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-20px) rotate(10deg); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;