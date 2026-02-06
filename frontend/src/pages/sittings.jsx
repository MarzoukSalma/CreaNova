import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Edit3,
  Camera,
  Save,
  Bell,
  Palette,
  Globe,
  Shield,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Heart,
  Star,
  Settings,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  X,
  Lock,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../api/api.jsx";

const PersonalSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    nom: "",
    mail: "",
    phoneNumber: "",
    bio: "",
    dateNaissance: "",
    avatarUrl: "",
  });

  // État pour les changements de mot de passe et email
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [emailData, setEmailData] = useState({
    newMail: "",
    motDePasse: "",
  });

  const [settings, setSettings] = useState({
    theme: "dark",
    notifications: true,
    sound: true,
    language: "fr",
    privacy: "public",
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: false,
  });

  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showEmailFields, setShowEmailFields] = useState(false);
  const fileInputRef = useRef(null);

  // Message system
  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const MessageComponent = () => {
    if (!message) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg backdrop-blur-sm ${
          message.type === "success"
            ? "bg-green-500/90 text-white border border-green-400"
            : "bg-red-500/90 text-white border border-red-400"
        }`}
      >
        {message.type === "success" ? (
          <CheckCircle className="w-5 h-5" />
        ) : (
          <AlertCircle className="w-5 h-5" />
        )}
        <span>{message.text}</span>
        <button
          onClick={() => setMessage(null)}
          className="ml-2 hover:bg-white/20 p-1 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    );
  };

  // Load user profile data - UTILISERA /profile/me
  const loadProfile = async () => {
    try {
      const response = await api.get("/users/profile/me"); // Route protégée
      const userData = response.data?.user || response.data;

      setProfileData({
        nom: userData.nom || "",
        mail: userData.mail || "",
        phoneNumber: userData.phoneNumber || "",
        bio: userData.bio || "",
        dateNaissance: userData.dateNaissance
          ? userData.dateNaissance.split("T")[0]
          : "",
        avatarUrl:
          userData.avatarUrl ||
          "https://images.unsplash.com/photo-1494790108755-2616b612b15c?w=150&h=150&fit=crop&crop=face",
      });
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
      showMessage(
        error.response?.data?.message || "Erreur lors du chargement du profil",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  // Save profile data - UTILISERA /profile/me
  const saveProfile = async () => {
    setSaving(true);
    try {
      const response = await api.put("/users/profile/me", {
        nom: profileData.nom,
        avatarUrl: profileData.avatarUrl,
        bio: profileData.bio,
        dateNaissance: profileData.dateNaissance,
        phoneNumber: profileData.phoneNumber,
      });

      showMessage("Profil sauvegardé avec succès !", "success");

      // Update localStorage if user object exists
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const updatedUser = { ...user, ...profileData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      showMessage(
        error.response?.data?.message ||
          "Erreur lors de la sauvegarde du profil",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  // Changer l'email
  const updateEmail = async () => {
    if (!emailData.newMail || !emailData.motDePasse) {
      showMessage("Veuillez remplir tous les champs", "error");
      return;
    }

    setSaving(true);
    try {
      await api.put("/users/profile/email", emailData);
      showMessage("Email mis à jour avec succès !", "success");
      setProfileData((prev) => ({ ...prev, mail: emailData.newMail }));
      setEmailData({ newMail: "", motDePasse: "" });
      setShowEmailFields(false);
    } catch (error) {
      showMessage(
        error.response?.data?.message ||
          "Erreur lors de la mise à jour de l'email",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  // Changer le mot de passe
  const updatePassword = async () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      showMessage("Veuillez remplir tous les champs", "error");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage("Les mots de passe ne correspondent pas", "error");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showMessage(
        "Le mot de passe doit contenir au moins 6 caractères",
        "error",
      );
      return;
    }

    setSaving(true);
    try {
      await api.put("/users/profile/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      showMessage("Mot de passe mis à jour avec succès !", "success");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordFields(false);
    } catch (error) {
      showMessage(
        error.response?.data?.message ||
          "Erreur lors de la mise à jour du mot de passe",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  // Supprimer le compte
  const deleteAccount = async () => {
    const password = prompt(
      "Pour supprimer votre compte, veuillez entrer votre mot de passe:",
    );
    if (!password) return;

    if (
      confirm(
        "⚠️ ATTENTION: Cette action supprimera définitivement votre compte et toutes vos données. Êtes-vous absolument sûr(e) ?",
      )
    ) {
      setSaving(true);
      try {
        await api.delete("/users/profile/me", {
          data: { motDePasse: password },
        });

        // Clear local storage and redirect
        localStorage.clear();
        showMessage("Compte supprimé avec succès", "success");

        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } catch (error) {
        showMessage(
          error.response?.data?.message ||
            "Erreur lors de la suppression du compte",
          "error",
        );
      } finally {
        setSaving(false);
      }
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier la taille (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        showMessage("La taille de l'image doit être inférieure à 5MB", "error");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData((prev) => ({
          ...prev,
          avatarUrl: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // Tab configuration
  const tabs = [
    { id: "profile", label: "Profil", icon: <User className="w-5 h-5" /> },
    { id: "security", label: "Sécurité", icon: <Lock className="w-5 h-5" /> },
    {
      id: "preferences",
      label: "Préférences",
      icon: <Settings className="w-5 h-5" />,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="w-5 h-5" />,
    },
    {
      id: "privacy",
      label: "Confidentialité",
      icon: <Shield className="w-5 h-5" />,
    },
  ];

  const renderProfileTab = () => (
    <div className="space-y-8">
      {/* Avatar Section */}
      <div className="bg-[#0a0e1a] border border-[#1e2540] rounded-3xl shadow-xl p-8">
        <h3 className="text-2xl font-light text-white mb-6 flex items-center gap-2">
          <Camera className="w-6 h-6 text-purple-400" />
          Photo de Profil
        </h3>

        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src={profileData.avatarUrl}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-purple-500/30"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-full hover:shadow-lg hover:shadow-purple-500/30 transition-all transform hover:scale-110"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
          <div>
            <p className="text-slate-300 mb-2">
              Choisissez une photo qui vous représente
            </p>
            <p className="text-sm text-slate-500">
              JPG, PNG ou GIF. Taille max: 5MB
            </p>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-[#0a0e1a] border border-[#1e2540] rounded-3xl shadow-xl p-8">
        <h3 className="text-2xl font-light text-white mb-6 flex items-center gap-2">
          <User className="w-6 h-6 text-purple-400" />
          Informations Personnelles
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-light text-slate-300 mb-2 uppercase tracking-wider">
              Nom complet
            </label>
            <input
              type="text"
              value={profileData.nom}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, nom: e.target.value }))
              }
              className="w-full px-4 py-3 bg-[#0f1323] border border-[#1e2540] text-white placeholder-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
              placeholder="Votre nom complet"
            />
          </div>

          <div>
            <label className="block text-sm font-light text-slate-300 mb-2 uppercase tracking-wider">
              Email (lecture seule)
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type="email"
                value={profileData.mail}
                readOnly
                className="w-full pl-11 pr-4 py-3 bg-[#0f1323] border border-[#1e2540] text-slate-400 rounded-xl cursor-not-allowed"
                placeholder="votre.email@example.com"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Utilisez l'onglet Sécurité pour changer votre email
            </p>
          </div>

          <div>
            <label className="block text-sm font-light text-slate-300 mb-2 uppercase tracking-wider">
              Téléphone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type="tel"
                value={profileData.phoneNumber}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value,
                  }))
                }
                className="w-full pl-11 pr-4 py-3 bg-[#0f1323] border border-[#1e2540] text-white placeholder-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="+212 6 00 00 00 00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-light text-slate-300 mb-2 uppercase tracking-wider">
              Date de naissance
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type="date"
                value={profileData.dateNaissance}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    dateNaissance: e.target.value,
                  }))
                }
                className="w-full pl-11 pr-4 py-3 bg-[#0f1323] border border-[#1e2540] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="bg-[#0a0e1a] border border-[#1e2540] rounded-3xl shadow-xl p-8">
        <h3 className="text-2xl font-light text-white mb-6 flex items-center gap-2">
          <Edit3 className="w-6 h-6 text-purple-400" />
          Biographie
        </h3>

        <textarea
          value={profileData.bio}
          onChange={(e) =>
            setProfileData((prev) => ({ ...prev, bio: e.target.value }))
          }
          className="w-full px-4 py-3 bg-[#0f1323] border border-[#1e2540] text-white placeholder-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 h-32 resize-none transition-all"
          placeholder="Parlez-nous de vous et de votre passion créative..."
          maxLength="500"
        />
        <p className="text-sm text-slate-500 mt-2">
          {profileData.bio?.length || 0}/500 caractères
        </p>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveProfile}
          disabled={saving}
          className={`bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-2xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 flex items-center gap-2 transform hover:scale-105 ${
            saving ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Save className="w-5 h-5" />
          {saving ? "Sauvegarde..." : "Sauvegarder le profil"}
        </button>
      </div>
    </div>
  );

  // NOUVEL ONGLET SÉCURITÉ
  const renderSecurityTab = () => (
    <div className="space-y-8">
      {/* Change Email */}
      <div className="bg-[#0a0e1a] border border-[#1e2540] rounded-3xl shadow-xl p-8">
        <h3 className="text-2xl font-light text-white mb-6 flex items-center gap-2">
          <Mail className="w-6 h-6 text-purple-400" />
          Changer d'Email
        </h3>

        <div className="mb-4">
          <p className="text-slate-300 mb-2">
            Email actuel:{" "}
            <strong className="text-white">{profileData.mail}</strong>
          </p>
          <button
            onClick={() => setShowEmailFields(!showEmailFields)}
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            {showEmailFields ? "Annuler" : "Changer d'email"}
          </button>
        </div>

        {showEmailFields && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-light text-slate-300 mb-2 uppercase tracking-wider">
                Nouvel email
              </label>
              <input
                type="email"
                value={emailData.newMail}
                onChange={(e) =>
                  setEmailData((prev) => ({ ...prev, newMail: e.target.value }))
                }
                className="w-full px-4 py-3 bg-[#0f1323] border border-[#1e2540] text-white placeholder-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="nouveau.email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-light text-slate-300 mb-2 uppercase tracking-wider">
                Mot de passe actuel
              </label>
              <input
                type="password"
                value={emailData.motDePasse}
                onChange={(e) =>
                  setEmailData((prev) => ({
                    ...prev,
                    motDePasse: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 bg-[#0f1323] border border-[#1e2540] text-white placeholder-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="Votre mot de passe actuel"
              />
            </div>

            <button
              onClick={updateEmail}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50"
            >
              {saving ? "Mise à jour..." : "Mettre à jour l'email"}
            </button>
          </div>
        )}
      </div>

      {/* Change Password */}
      <div className="bg-[#0a0e1a] border border-[#1e2540] rounded-3xl shadow-xl p-8">
        <h3 className="text-2xl font-light text-white mb-6 flex items-center gap-2">
          <Lock className="w-6 h-6 text-purple-400" />
          Changer le Mot de Passe
        </h3>

        <div className="mb-4">
          <button
            onClick={() => setShowPasswordFields(!showPasswordFields)}
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            {showPasswordFields ? "Annuler" : "Changer le mot de passe"}
          </button>
        </div>

        {showPasswordFields && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-light text-slate-300 mb-2 uppercase tracking-wider">
                Mot de passe actuel
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 bg-[#0f1323] border border-[#1e2540] text-white placeholder-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="Mot de passe actuel"
              />
            </div>

            <div>
              <label className="block text-sm font-light text-slate-300 mb-2 uppercase tracking-wider">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 bg-[#0f1323] border border-[#1e2540] text-white placeholder-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="Nouveau mot de passe (min. 6 caractères)"
              />
            </div>

            <div>
              <label className="block text-sm font-light text-slate-300 mb-2 uppercase tracking-wider">
                Confirmer le nouveau mot de passe
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 bg-[#0f1323] border border-[#1e2540] text-white placeholder-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="Confirmer le nouveau mot de passe"
              />
            </div>

            <button
              onClick={updatePassword}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50"
            >
              {saving ? "Mise à jour..." : "Mettre à jour le mot de passe"}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-8">
      {/* Theme */}
      <div className="bg-[#0a0e1a] border border-[#1e2540] rounded-3xl shadow-xl p-8">
        <h3 className="text-2xl font-light text-white mb-6 flex items-center gap-2">
          <Palette className="w-6 h-6 text-purple-400" />
          Apparence
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#0f1323] border border-[#1e2540] rounded-xl">
            <div className="flex items-center gap-3">
              {settings.theme === "light" ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-400" />
              )}
              <div>
                <p className="font-medium text-white">Thème</p>
                <p className="text-sm text-slate-400">
                  Choisissez votre mode d'affichage préféré
                </p>
              </div>
            </div>
            <select
              value={settings.theme}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, theme: e.target.value }))
              }
              className="px-4 py-2 bg-[#0a0e1a] border border-[#1e2540] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="light">Clair</option>
              <option value="dark">Sombre</option>
              <option value="auto">Automatique</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#0f1323] border border-[#1e2540] rounded-xl">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-blue-400" />
              <div>
                <p className="font-medium text-white">Langue</p>
                <p className="text-sm text-slate-400">
                  Langue d'affichage de l'interface
                </p>
              </div>
            </div>
            <select
              value={settings.language}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, language: e.target.value }))
              }
              className="px-4 py-2 bg-[#0a0e1a] border border-[#1e2540] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sound */}
      <div className="bg-[#0a0e1a] border border-[#1e2540] rounded-3xl shadow-xl p-8">
        <h3 className="text-2xl font-light text-white mb-6 flex items-center gap-2">
          {settings.sound ? (
            <Volume2 className="w-6 h-6 text-purple-400" />
          ) : (
            <VolumeX className="w-6 h-6 text-purple-400" />
          )}
          Audio
        </h3>

        <div className="flex items-center justify-between p-4 bg-[#0f1323] border border-[#1e2540] rounded-xl">
          <div>
            <p className="font-medium text-white">Sons de l'application</p>
            <p className="text-sm text-slate-400">
              Activer les effets sonores et notifications audio
            </p>
          </div>
          <button
            onClick={() =>
              setSettings((prev) => ({ ...prev, sound: !prev.sound }))
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.sound
                ? "bg-gradient-to-r from-purple-500 to-pink-500"
                : "bg-[#1e2540]"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.sound ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-8">
      <div className="bg-[#0a0e1a] border border-[#1e2540] rounded-3xl shadow-xl p-8">
        <h3 className="text-2xl font-light text-white mb-6 flex items-center gap-2">
          <Bell className="w-6 h-6 text-purple-400" />
          Préférences de Notifications
        </h3>

        <div className="space-y-4">
          {[
            {
              key: "emailNotifications",
              title: "Notifications par email",
              description: "Recevez les mises à jour importantes par email",
            },
            {
              key: "pushNotifications",
              title: "Notifications push",
              description: "Notifications instantanées dans votre navigateur",
            },
            {
              key: "weeklyDigest",
              title: "Résumé hebdomadaire",
              description: "Recevez un résumé de vos activités chaque semaine",
            },
          ].map((notification) => (
            <div
              key={notification.key}
              className="flex items-center justify-between p-4 bg-[#0f1323] border border-[#1e2540] rounded-xl"
            >
              <div>
                <p className="font-medium text-white">{notification.title}</p>
                <p className="text-sm text-slate-400">
                  {notification.description}
                </p>
              </div>
              <button
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    [notification.key]: !prev[notification.key],
                  }))
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings[notification.key]
                    ? "bg-gradient-to-r from-purple-500 to-pink-500"
                    : "bg-[#1e2540]"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings[notification.key]
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-8">
      <div className="bg-[#0a0e1a] border border-[#1e2540] rounded-3xl shadow-xl p-8">
        <h3 className="text-2xl font-light text-white mb-6 flex items-center gap-2">
          <Shield className="w-6 h-6 text-purple-400" />
          Paramètres de Confidentialité
        </h3>

        <div className="space-y-6">
          <div className="p-4 bg-[#0f1323] border border-[#1e2540] rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium text-white">Visibilité du profil</p>
                <p className="text-sm text-slate-400">
                  Qui peut voir votre profil et vos créations
                </p>
              </div>
              <select
                value={settings.privacy}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, privacy: e.target.value }))
                }
                className="px-4 py-2 bg-[#0a0e1a] border border-[#1e2540] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                <option value="public">Public</option>
                <option value="friends">Amis uniquement</option>
                <option value="private">Privé</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <h4 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Zone Dangereuse
            </h4>
            <p className="text-sm text-red-300 mb-4">
              Cette action est irréversible. Toutes vos données seront
              supprimées.
            </p>
            <button
              onClick={deleteAccount}
              disabled={saving}
              className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/30 transition-all ${
                saving ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {saving
                ? "Suppression..."
                : "Supprimer mon compte définitivement"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-[#080c1a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6 opacity-60">🔒</div>
          <h3 className="text-2xl font-light mb-2 text-white">Accès requis</h3>
          <p className="text-lg text-slate-400">
            Veuillez vous connecter pour accéder à vos paramètres
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-slate-300">
            Chargement de votre profil...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080c1a] text-slate-300 font-sans relative overflow-x-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-18%] left-[-12%] w-[50%] h-[50%] bg-blue-900/12 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-18%] right-[-12%] w-[45%] h-[45%] bg-violet-900/10 blur-[150px] rounded-full" />
        <div className="absolute top-[40%] right-[10%] w-[25%] h-[25%] bg-pink-900/8 blur-[120px] rounded-full" />
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -35, 0],
              opacity: [0.1, 0.35, 0.1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <MessageComponent />

      <div className="relative z-10 max-w-6xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-extralight text-white tracking-tight mb-2">
            Mon Profil &{" "}
            <span className="font-serif italic text-violet-400">
              Paramètres
            </span>
          </h1>
          <p className="text-slate-400 text-sm">
            Gérez votre profil et personnalisez votre expérience
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-[#0a0e1a] border border-[#1e2540] rounded-3xl shadow-xl p-6 sticky top-6">
              <div className="text-center mb-6">
                <img
                  src={profileData.avatarUrl}
                  alt="Profile"
                  className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-purple-500/30 object-cover"
                />
                <h3 className="font-bold text-lg text-white">
                  {profileData.nom || "Utilisateur"}
                </h3>
                <p className="text-sm text-slate-400">Artiste créatif</p>
                <div className="flex justify-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30"
                        : "text-slate-300 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/20"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>

              {/* Stats */}
              <div className="mt-8 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl">
                <h4 className="font-semibold text-white mb-3">
                  Mes Statistiques
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Inspirations créées</span>
                    <span className="font-semibold text-purple-400">24</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">J'aime reçus</span>
                    <span className="font-semibold text-pink-400">156</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Conversations Muse</span>
                    <span className="font-semibold text-indigo-400">89</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {activeTab === "profile" && renderProfileTab()}
            {activeTab === "security" && renderSecurityTab()}
            {activeTab === "preferences" && renderPreferencesTab()}
            {activeTab === "notifications" && renderNotificationsTab()}
            {activeTab === "privacy" && renderPrivacyTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalSettingsPage;
