"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Filter,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  PieChart,
  BarChart3,
  Search,
  Star,
  Target,
  Zap,
  Activity,
  Timer,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  PieChart as RechartsPieChart,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";
import api from "../api/api";

const fetchProjectsFromApi = async () => {
  try {
    const allProjects = await api.get(`/dreams`);
    return allProjects.data || [];
  } catch (error) {
    console.error("Erreur lors du chargement des journaux:", error);
    return [];
  }
};

const EnhancedDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [viewMode, setViewMode] = useState("grid");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const apiProjects = await fetchProjectsFromApi();

      const projectsWithProgress = apiProjects.map((project) => {
        let progress = 0;
        if (project.statut === "Terminé") progress = 100;
        else if (project.statut === "En cours") progress = 50;
        else progress = 0; // "À faire"

        return {
          ...project,
          dateCreation: new Date(project.dateCreation),
          progress,
          workspaces: project.workspaces || [],
        };
      });

      setProjects(projectsWithProgress);
    } catch (error) {
      console.error("Erreur lors du chargement des projets:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects, refreshTrigger]);

  const handleRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const filteredProjects = projects.filter((project) => {
    const statusMatch = !statusFilter || project.statut === statusFilter;
    const priorityMatch =
      !priorityFilter || project.priorite === priorityFilter;
    const searchMatch =
      !searchTerm ||
      project.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && priorityMatch && searchMatch;
  });

  const stats = {
    total: projects.length,
    todo: projects.filter((p) => p.statut === "À faire").length,
    inProgress: projects.filter((p) => p.statut === "En cours").length,
    completed: projects.filter((p) => p.statut === "Terminé").length,

    totalHours: projects.reduce((sum, p) => sum + (p.spentHours || 0), 0),
    avgProgress:
      projects.length > 0
        ? Math.round(
            projects.reduce((sum, p) => sum + p.progress, 0) / projects.length,
          )
        : 0,
  };

  // Data for charts
  const pieData = [
    { name: "À faire", value: stats.todo, color: "#fbbf24" },
    { name: "En cours", value: stats.inProgress, color: "#3b82f6" },
    { name: "Terminé", value: stats.completed, color: "#10b981" },
  ];

  const progressData = projects.map((p) => ({
    name: p.titre.length > 15 ? p.titre.substring(0, 15) + "..." : p.titre,
    progress: p.progress,
    priorite: p.priorite,
    hours: p.spentHours || 0,
  }));

  const monthlyData = [
    { month: "Jan", projets: 2, heures: 45 },
    { month: "Fév", projets: 3, heures: 78 },
    { month: "Mar", projets: 1, heures: 32 },
    { month: "Avr", projets: 2, heures: 56 },
    { month: "Mai", projets: 1, heures: 23 },
    { month: "Juin", projets: 0, heures: 0 },
  ];

  // Modal functions
  const openModal = (project = null) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingProject(null);
    setIsModalOpen(false);
  };

  const saveProject = async (projectData) => {
    try {
      if (editingProject) {
        await api.put(`/dreams/${editingProject.id}`, projectData);
        const updatedProject = {
          ...editingProject,
          ...projectData,
          progress:
            projectData.statut === "Terminé"
              ? 100
              : projectData.statut === "En cours"
                ? 50
                : 0,
        };
        setProjects(
          projects.map((p) =>
            p.id === editingProject.id ? updatedProject : p,
          ),
        );
      } else {
        const response = await api.post("/dreams/", {
          ...projectData,
          dateCreation: new Date().toISOString(),
          statut: projectData.statut || "À faire",
        });

        const newProject = {
          ...response.data,
          dateCreation: new Date(response.data.dateCreation),
          progress:
            response.data.statut === "Terminé"
              ? 100
              : response.data.statut === "En cours"
                ? 50
                : 0,
          workspaces: [],
        };

        setProjects([...projects, newProject]);
      }

      closeModal();
      setTimeout(() => handleRefresh(), 100);
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const deleteProject = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      try {
        await api.delete(`/dreams/${id}`);
        setProjects(projects.filter((p) => p.id !== id));
        setTimeout(() => handleRefresh(), 100);
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case "À faire":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "En cours":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Terminé":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getPriorityColor = (priorite) => {
    switch (priorite) {
      case "haute":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "moyenne":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "faible":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getPriorityIcon = (priorite) => {
    switch (priorite) {
      case "haute":
        return <Zap className="w-4 h-4" />;
      case "moyenne":
        return <Target className="w-4 h-4" />;
      case "faible":
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const renderTabNavigation = () => (
    <div className="flex justify-center mb-8">
      <div className="bg-[#0a0e1a] border border-[#1e2540] rounded-xl p-1 shadow-lg">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 md:px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
            activeTab === "overview"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105"
              : "text-slate-400 hover:text-white hover:bg-[#1a1f35]"
          }`}
        >
          <TrendingUp className="inline w-5 h-5 mr-2" />
          <span className="hidden sm:inline">Vue d'ensemble</span>
        </button>
        <button
          onClick={() => setActiveTab("process")}
          className={`px-4 md:px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
            activeTab === "process"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105"
              : "text-slate-400 hover:text-white hover:bg-[#1a1f35]"
          }`}
        >
          <Activity className="inline w-5 h-5 mr-2" />
          <span className="hidden sm:inline">Processus</span>
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 md:px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
            activeTab === "analytics"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105"
              : "text-slate-400 hover:text-white hover:bg-[#1a1f35]"
          }`}
        >
          <BarChart3 className="inline w-5 h-5 mr-2" />
          <span className="hidden sm:inline">Analytiques</span>
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Chargement des projets créatifs...</p>
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

      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-extralight text-white tracking-tight mb-2">
            Dashboard{" "}
            <span className="font-serif italic text-violet-400">Créatif</span>
          </h1>
          <p className="text-slate-400 text-sm mb-4">
            Gestion des Projets Créatifs
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              {stats.total} projets créatifs
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-blue-400" />
              {stats.totalHours}h investies
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-400" />
              {stats.avgProgress}% progression moyenne
            </span>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1 px-3 py-1 bg-[#0a0e1a] border border-[#1e2540] rounded-full shadow-sm hover:border-purple-500/50 transition-all duration-200 text-purple-400 hover:text-purple-300"
              disabled={loading}
            >
              <Activity
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Actualiser
            </button>
          </div>
        </motion.div>

        {renderTabNavigation()}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0 }}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-4 md:p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-500/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs md:text-sm">
                  Total Projets
                </p>
                <p className="text-2xl md:text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="bg-white/20 rounded-full p-2 md:p-3">
                <PieChart className="w-4 h-4 md:w-6 md:h-6" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-4 md:p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-500/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs md:text-sm">À faire</p>
                <p className="text-2xl md:text-3xl font-bold">{stats.todo}</p>
              </div>
              <div className="bg-white/20 rounded-full p-2 md:p-3">
                <Clock className="w-4 h-4 md:w-6 md:h-6" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-4 md:p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-500/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs md:text-sm">En cours</p>
                <p className="text-2xl md:text-3xl font-bold">
                  {stats.inProgress}
                </p>
              </div>
              <div className="bg-white/20 rounded-full p-2 md:p-3">
                <AlertCircle className="w-4 h-4 md:w-6 md:h-6" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-4 md:p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-500/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs md:text-sm">Terminés</p>
                <p className="text-2xl md:text-3xl font-bold">
                  {stats.completed}
                </p>
              </div>
              <div className="bg-white/20 rounded-full p-2 md:p-3">
                <CheckCircle className="w-4 h-4 md:w-6 md:h-6" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Projects List - takes 3 columns */}
            <div className="lg:col-span-3">
              <div className="bg-[#0a0e1a] border border-[#1e2540] rounded-2xl shadow-xl p-4 md:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <h2 className="text-xl md:text-2xl font-light text-white">
                    Mes Projets
                  </h2>
                  <div className="flex gap-2">
                    <div className="flex bg-[#1a1f35] border border-[#1e2540] rounded-lg p-1">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded ${
                          viewMode === "grid"
                            ? "bg-purple-500/20 text-purple-400"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <BarChart3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded ${
                          viewMode === "list"
                            ? "bg-purple-500/20 text-purple-400"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <Filter className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => openModal()}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="hidden sm:inline">Nouveau</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Rechercher un projet..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-[#0f1323] border border-[#1e2540] text-white placeholder-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 bg-[#0f1323] border border-[#1e2540] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                  >
                    <option value="">Tous les statuts</option>
                    <option value="À faire">À faire</option>
                    <option value="En cours">En cours</option>
                    <option value="Terminé">Terminé</option>
                  </select>

                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="px-4 py-2 bg-[#0f1323] border border-[#1e2540] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                  >
                    <option value="">Toutes les priorités</option>
                    <option value="haute">Haute</option>
                    <option value="moyenne">Moyenne</option>
                    <option value="faible">Faible</option>
                  </select>
                </div>

                <div
                  className={`${
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                      : "space-y-4"
                  }`}
                >
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="border border-[#1e2540] rounded-xl p-4 hover:shadow-lg hover:border-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 bg-[#0f1323]"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-white mb-1">
                            {project.titre}
                          </h3>
                          <p className="text-slate-400 text-sm flex items-center gap-1">
                            <Timer className="w-4 h-4" />
                            Créé le{" "}
                            {project.dateCreation.toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal(project)}
                            className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProject(project.id)}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-slate-300 mb-3 text-sm line-clamp-2">
                        {project.description}
                      </p>

                      <div className="flex justify-between items-center mb-3">
                        <div className="flex gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                              project.statut,
                            )}`}
                          >
                            {project.statut}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getPriorityColor(
                              project.priorite,
                            )}`}
                          >
                            {getPriorityIcon(project.priorite)}
                            {project.priorite}
                          </span>
                        </div>
                      </div>

                      <div className="w-full bg-[#1a1f35] rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {filteredProjects.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-slate-400 mb-4">
                      <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Aucun projet trouvé</p>
                      <p className="text-sm">
                        Essayez de modifier vos filtres ou créez un nouveau
                        projet
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar - Charts only (no tree) */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-[#0a0e1a] border border-[#1e2540] rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-light mb-4 text-white">
                  Répartition des Projets
                </h3>
                <ResponsiveContainer
                  width="100%"
                  height={200}
                  key={`pie-${stats.total}-${stats.completed}`}
                >
                  <RechartsPieChart>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-[#0a0e1a] border border-[#1e2540] rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-light mb-4 text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Insights
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                    <span className="text-sm text-purple-300">
                      Progression moyenne
                    </span>
                    <span className="font-bold text-purple-400">
                      {stats.avgProgress}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                    <span className="text-sm text-blue-300">
                      Heures investies
                    </span>
                    <span className="font-bold text-blue-400">
                      {stats.totalHours}h
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                    <span className="text-sm text-green-300">
                      Taux de réussite
                    </span>
                    <span className="font-bold text-green-400">
                      {stats.total > 0
                        ? Math.round((stats.completed / stats.total) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "process" && (
          <div className="space-y-8">
            <div className="bg-[#0a0e1a] border border-[#1e2540] rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-light text-white mb-6 flex items-center gap-2">
                <Activity className="w-7 h-7" />
                Suivi des Processus par Projet
              </h2>

              <div className="space-y-6">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="border border-[#1e2540] rounded-xl p-6 bg-[#0f1323]"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {project.titre}
                        </h3>
                        <p className="text-slate-400 text-sm">
                          {project.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-400">
                          {project.progress}%
                        </div>
                        <div className="text-sm text-slate-500">
                          Basé sur le statut
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                          project.statut === "À faire"
                            ? "bg-yellow-500/20 border-yellow-500/40"
                            : "bg-[#1a1f35] border-[#1e2540]"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white">À faire</h4>
                          {project.statut === "À faire" ? (
                            <Clock className="w-5 h-5 text-yellow-400" />
                          ) : (
                            <Clock className="w-5 h-5 text-slate-500" />
                          )}
                        </div>
                        <div className="text-sm text-slate-400">
                          Phase initiale
                        </div>
                      </div>

                      <div
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                          project.statut === "En cours"
                            ? "bg-blue-500/20 border-blue-500/40"
                            : "bg-[#1a1f35] border-[#1e2540]"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white">En cours</h4>
                          {project.statut === "En cours" ? (
                            <AlertCircle className="w-5 h-5 text-blue-400" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-slate-500" />
                          )}
                        </div>
                        <div className="text-sm text-slate-400">
                          En développement
                        </div>
                      </div>

                      <div
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                          project.statut === "Terminé"
                            ? "bg-green-500/20 border-green-500/40"
                            : "bg-[#1a1f35] border-[#1e2540]"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white">Terminé</h4>
                          {project.statut === "Terminé" ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-slate-500" />
                          )}
                        </div>
                        <div className="text-sm text-slate-400">
                          Projet finalisé
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 w-full bg-[#1a1f35] rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-[#0a0e1a] border border-[#1e2540] rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-light mb-4 text-white">
                  Progression des Projets
                </h3>
                <ResponsiveContainer
                  width="100%"
                  height={300}
                  key={`bar-${progressData.length}`}
                >
                  <BarChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2540" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: "#94a3b8" }}
                    />
                    <YAxis tick={{ fill: "#94a3b8" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f1323",
                        border: "1px solid #1e2540",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Bar
                      dataKey="progress"
                      fill="url(#progressGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient
                        id="progressGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="95%"
                          stopColor="#182955"
                          stopOpacity={0.7}
                        />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-[#0a0e1a] border border-[#1e2540] rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-light mb-4 text-white">
                  Évolution Mensuelle
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2540" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: "#94a3b8" }}
                    />
                    <YAxis tick={{ fill: "#94a3b8" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f1323",
                        border: "1px solid #1e2540",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="projets"
                      stroke="#8b5cf6"
                      fill="url(#areaGradient)"
                      strokeWidth={3}
                    />
                    <Area
                      type="monotone"
                      dataKey="heures"
                      stroke="#ec4899"
                      fill="url(#areaGradient2)"
                      strokeWidth={2}
                      fillOpacity={0.3}
                    />
                    <defs>
                      <linearGradient
                        id="areaGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="areaGradient2"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#ec4899"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#ec4899"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Project Modal */}
      {isModalOpen && (
        <ProjectModal
          project={editingProject}
          onSave={saveProject}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

// ProjectModal component
const ProjectModal = ({ project, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    titre: project?.titre || "",
    description: project?.description || "",
    statut: project?.statut || "À faire",
    priorite: project?.priorite || "moyenne",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedData = {
      ...formData,
    };
    onSave(processedData);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-[#0f1323] border border-[#1e2540] rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-light mb-6 text-white">
          {project ? "Modifier le Projet" : "Nouveau Projet"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-light text-slate-300 mb-2 uppercase tracking-wider">
              Titre *
            </label>
            <input
              type="text"
              required
              value={formData.titre}
              onChange={(e) =>
                setFormData({ ...formData, titre: e.target.value })
              }
              className="w-full px-4 py-3 bg-[#0a0e1a] border border-[#1e2540] text-white placeholder-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
              placeholder="Titre de votre projet..."
            />
          </div>

          <div>
            <label className="block text-sm font-light text-slate-300 mb-2 uppercase tracking-wider">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 bg-[#0a0e1a] border border-[#1e2540] text-white placeholder-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 h-24 resize-none transition-all"
              placeholder="Décrivez votre projet..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-light text-slate-300 mb-2 uppercase tracking-wider">
                Statut *
              </label>
              <select
                required
                value={formData.statut}
                onChange={(e) =>
                  setFormData({ ...formData, statut: e.target.value })
                }
                className="w-full px-4 py-3 bg-[#0a0e1a] border border-[#1e2540] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
              >
                <option value="À faire">À faire</option>
                <option value="En cours">En cours</option>
                <option value="Terminé">Terminé</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-light text-slate-300 mb-2 uppercase tracking-wider">
                Priorité *
              </label>
              <select
                required
                value={formData.priorite}
                onChange={(e) =>
                  setFormData({ ...formData, priorite: e.target.value })
                }
                className="w-full px-4 py-3 bg-[#0a0e1a] border border-[#1e2540] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
              >
                <option value="faible">Faible</option>
                <option value="moyenne">Moyenne</option>
                <option value="haute">Haute</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-[#1a1f35] border border-[#1e2540] text-slate-300 rounded-xl hover:border-slate-600 transition-all duration-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EnhancedDashboard;
