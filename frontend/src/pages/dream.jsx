<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import {
  Calendar,
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
} from "lucide-react";
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
  LineChart,
  Line,
} from "recharts";
import Navbar from "../components/navbar";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
=======
"use client"

import { useState, useEffect } from "react"
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
} from "lucide-react"
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
} from "recharts"
import api from "../api/api.jsx"




// Fixed: Added userId parameter and proper error handling
const userId = localStorage.getItem("userId");
const fetchProjectsFromApi = async (userId) => {

  if (!userId) {
    console.error('Aucun ID utilisateur trouvé')
    return []
  }
  try {
    const allProjects = await api.get(`/dreams`)
    return allProjects.data || []
  } catch (error) {
    console.error('Erreur lors du chargement des journaux:', error)
    return []
  }
}

const CreativeTree = ({ projects }) => {
  const totalProgress = projects.reduce((sum, p) => sum + p.progress, 0) / projects.length
  const treeHeight = Math.max(200, (totalProgress / 100) * 400)
  const branchCount = Math.floor(totalProgress / 20) + 1
  const leafCount = Math.floor(totalProgress / 10)

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">🌳 Arbre Créatif</h3>
      <div className="flex justify-center">
        <svg width="200" height="300" viewBox="0 0 200 300" className="overflow-visible">
          {/* Tree trunk */}
          <rect
            x="90"
            y={300 - treeHeight * 0.3}
            width="20"
            height={treeHeight * 0.3}
            fill="#8B4513"
            rx="2"
            className="transition-all duration-1000"
          />

          {/* Main branches */}
          {Array.from({ length: branchCount }, (_, i) => {
            const angle = (i * 60 - 30) * (Math.PI / 180)
            const branchLength = 30 + (totalProgress / 100) * 20
            const startY = 300 - treeHeight * 0.3 + i * 15
            const endX = 100 + Math.sin(angle) * branchLength
            const endY = startY - Math.cos(angle) * branchLength

            return (
              <g key={i}>
                <line
                  x1="100"
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="#654321"
                  strokeWidth="3"
                  className="transition-all duration-1000"
                  style={{ animationDelay: `${i * 200}ms` }}
                />

                {/* Sub-branches */}
                {totalProgress > (i + 1) * 15 && (
                  <>
                    <line
                      x1={endX}
                      y1={endY}
                      x2={endX + Math.sin(angle + 0.5) * 15}
                      y2={endY - Math.cos(angle + 0.5) * 15}
                      stroke="#654321"
                      strokeWidth="2"
                      className="transition-all duration-1000"
                    />
                    <line
                      x1={endX}
                      y1={endY}
                      x2={endX + Math.sin(angle - 0.5) * 15}
                      y2={endY - Math.cos(angle - 0.5) * 15}
                      stroke="#654321"
                      strokeWidth="2"
                      className="transition-all duration-1000"
                    />
                  </>
                )}
              </g>
            )
          })}

          {/* Leaves */}
          {Array.from({ length: leafCount }, (_, i) => {
            const angle = i * 36 * (Math.PI / 180)
            const radius = 40 + (i % 3) * 15
            const x = 100 + Math.sin(angle) * radius
            const y = 200 - Math.cos(angle) * radius - (totalProgress / 100) * 50
            const colors = ["#22c55e", "#16a34a", "#15803d", "#84cc16", "#65a30d"]

            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4"
                fill={colors[i % colors.length]}
                className="transition-all duration-1000 animate-pulse"
                style={{
                  animationDelay: `${i * 100}ms`,
                  opacity: totalProgress > i * 5 ? 1 : 0,
                }}
              />
            )
          })}

          {/* Flowers for completed projects */}
          {projects
            .filter((p) => p.statut === "Terminé")
            .map((_, i) => (
              <g key={`flower-${i}`}>
                <circle cx={80 + i * 40} cy={180} r="3" fill="#ec4899" />
                <circle cx={77 + i * 40} cy={177} r="2" fill="#f9a8d4" />
                <circle cx={83 + i * 40} cy={177} r="2" fill="#f9a8d4" />
                <circle cx={77 + i * 40} cy={183} r="2" fill="#f9a8d4" />
                <circle cx={83 + i * 40} cy={183} r="2" fill="#f9a8d4" />
              </g>
            ))}
        </svg>
      </div>

      <div className="mt-4 text-center">
        <div className="text-2xl font-bold text-green-600 mb-2">{Math.round(totalProgress)}%</div>
        <div className="text-sm text-gray-600">Progression Globale</div>
        <div className="mt-3 flex justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Feuilles: {leafCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
            <span>Fleurs: {projects.filter((p) => p.statut === "Terminé").length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const EnhancedDashboard = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [viewMode, setViewMode] = useState("grid")

  // Fixed: Added proper userId management
  const userId = 1 // Replace with actual user authentication
>>>>>>> 3ab1e9b3897b2735bbe299138e6edc0da47b8938

  useEffect(() => {
<<<<<<< HEAD
    const sampleProjects = [
      {
        id: 1,
        titre: "Roman fantastique",
        description:
          "Écrire un roman de fantasy sur un monde où la magie est alimentée par les émotions humaines.",
        dateCreation: new Date("2024-01-15"),
        statut: "En cours",
        priorite: "haute",
        progress: 65,
      },
      {
        id: 2,
        titre: "Série de peintures abstraites",
        description:
          "Créer une série de 12 toiles abstraites représentant les 12 mois de l'année.",
        dateCreation: new Date("2024-02-20"),
        statut: "À faire",
        priorite: "moyenne",
        progress: 0,
      },
      {
        id: 3,
        titre: "Podcast sur l'art contemporain",
        description:
          "Lancer un podcast hebdomadaire interviewant des artistes contemporains.",
        dateCreation: new Date("2024-01-10"),
        statut: "Terminé",
        priorite: "haute",
        progress: 100,
      },
      {
        id: 4,
        titre: "Jardin de sculptures",
        description:
          "Aménager un espace dans mon jardin avec des sculptures en métal recyclé.",
        dateCreation: new Date("2024-03-01"),
        statut: "En cours",
        priorite: "faible",
        progress: 30,
      },
      {
        id: 5,
        titre: "Album photo artistique",
        description:
          "Créer un livre photo avec mes meilleures œuvres photographiques de l'année.",
        dateCreation: new Date("2024-02-05"),
        statut: "À faire",
        priorite: "moyenne",
        progress: 10,
      },
    ];
    setProjects(sampleProjects);
  }, []);

  // Get filtered projects
  const filteredProjects = projects.filter((project) => {
    const statusMatch = !statusFilter || project.statut === statusFilter;
    const priorityMatch =
      !priorityFilter || project.priorite === priorityFilter;
    return statusMatch && priorityMatch;
  });
=======
    const loadProjects = async () => {
      try {
        setLoading(true)
        const apiProjects = await fetchProjectsFromApi(userId)

        const projectsWithProgress = apiProjects.map((project) => {
  const workspaces = project.workspaces || []  // <-- fallback
  const completedWorkspaces = workspaces.filter((w) => w.completed).length
  const totalWorkspaces = workspaces.length
  const progress = totalWorkspaces > 0 ? Math.round((completedWorkspaces / totalWorkspaces) * 100) : 0

  const estimatedHours = workspaces.reduce((sum, w) => sum + (w.hours || 0), 0)
  const spentHours = workspaces.filter((w) => w.completed).reduce((sum, w) => sum + (w.hours || 0), 0)

  return {
    ...project,
    dateCreation: new Date(project.dateCreation),
    progress,
    estimatedHours,
    spentHours,
  }
})


        setProjects(projectsWithProgress)
      } catch (error) {
        console.error("Erreur lors du chargement des projets:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [userId])

  const filteredProjects = projects.filter((project) => {
    const statusMatch = !statusFilter || project.statut === statusFilter
    const priorityMatch = !priorityFilter || project.priorite === priorityFilter
    const searchMatch =
      !searchTerm ||
      project.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return statusMatch && priorityMatch && searchMatch
  })
>>>>>>> 3ab1e9b3897b2735bbe299138e6edc0da47b8938

  const stats = {
    total: projects.length,
    todo: projects.filter((p) => p.statut === "À faire").length,
    inProgress: projects.filter((p) => p.statut === "En cours").length,
    completed: projects.filter((p) => p.statut === "Terminé").length,
<<<<<<< HEAD
  };
=======
    totalHours: projects.reduce((sum, p) => sum + (p.spentHours || 0), 0),
    avgProgress:
      projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) : 0,
  }
>>>>>>> 3ab1e9b3897b2735bbe299138e6edc0da47b8938

  // Data for charts
  const pieData = [
    { name: "À faire", value: stats.todo, color: "#fbbf24" },
    { name: "En cours", value: stats.inProgress, color: "#3b82f6" },
    { name: "Terminé", value: stats.completed, color: "#10b981" },
<<<<<<< HEAD
  ];
=======
  ]
>>>>>>> 3ab1e9b3897b2735bbe299138e6edc0da47b8938

  const progressData = projects.map((p) => ({
    name: p.titre.length > 15 ? p.titre.substring(0, 15) + "..." : p.titre,
    progress: p.progress,
    priorite: p.priorite,
<<<<<<< HEAD
  }));

  const monthlyData = [
    { month: "Jan", projets: 2 },
    { month: "Fév", projets: 3 },
    { month: "Mar", projets: 1 },
    { month: "Avr", projets: 0 },
    { month: "Mai", projets: 0 },
    { month: "Juin", projets: 0 },
  ];
=======
    hours: p.spentHours || 0,
  }))

  const monthlyData = [
    { month: "Jan", projets: 2, heures: 45 },
    { month: "Fév", projets: 3, heures: 78 },
    { month: "Mar", projets: 1, heures: 32 },
    { month: "Avr", projets: 2, heures: 56 },
    { month: "Mai", projets: 1, heures: 23 },
    { month: "Juin", projets: 0, heures: 0 },
  ]
>>>>>>> 3ab1e9b3897b2735bbe299138e6edc0da47b8938

  // Modal functions
  const openModal = (project = null) => {
    setEditingProject(project)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setEditingProject(null)
    setIsModalOpen(false)
  }

<<<<<<< HEAD
  const saveProject = (projectData) => {
    if (editingProject) {
      setProjects(
        projects.map((p) =>
          p.id === editingProject.id ? { ...p, ...projectData } : p
        )
      );
    } else {
      const newProject = {
        id: Date.now(),
        dateCreation: new Date(),
        progress: 0,
        ...projectData,
      };
      setProjects([...projects, newProject]);
    }
    closeModal();
  };

  const deleteProject = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      setProjects(projects.filter((p) => p.id !== id));
=======
  // Fixed: Corrected syntax errors and API calls
  const saveProject = async (projectData) => {
    try {
      if (editingProject) {
        await api.put(`/dreams/${editingProject.id}`, projectData)
        setProjects(projects.map((p) => 
          p.id === editingProject.id ? { ...p, ...projectData } : p
        ))
      } else {
        // CREATE (POST)
        const response = await api.post("/dreams/", {
          ...projectData,
          userId: userId,
          dateCreation: new Date().toISOString(),
          statut: projectData.statut || "À faire",
          estimatedHours: projectData.estimatedHours || 0,
          spentHours: projectData.spentHours || 0,
          workspaces: []
        })

        // Fixed: Parse the date for consistency
        const newProject = {
          ...response.data,
          dateCreation: new Date(response.data.dateCreation),
          progress: 0
        }
        
        setProjects([...projects, newProject])
      }

      closeModal()
    } catch (error) {
      console.error("Error saving project:", error)
>>>>>>> 3ab1e9b3897b2735bbe299138e6edc0da47b8938
    }
  }

  // Fixed: Added proper API delete call
  const deleteProject = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      try {
        await api.delete(`/dreams/${id}`)
        setProjects(projects.filter((p) => p.id !== id))
      } catch (error) {
        console.error("Error deleting project:", error)
      }
    }
  }

  const getStatusColor = (statut) => {
    switch (statut) {
      case "À faire":
<<<<<<< HEAD
        return "bg-yellow-100 text-yellow-800";
      case "En cours":
        return "bg-blue-100 text-blue-800";
      case "Terminé":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
=======
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "En cours":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Terminé":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
>>>>>>> 3ab1e9b3897b2735bbe299138e6edc0da47b8938
    }
  }

  const getPriorityColor = (priorite) => {
    switch (priorite) {
      case "haute":
<<<<<<< HEAD
        return "bg-red-100 text-red-800";
      case "moyenne":
        return "bg-yellow-100 text-yellow-800";
      case "faible":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
=======
        return "bg-red-100 text-red-800 border-red-200"
      case "moyenne":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "faible":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
>>>>>>> 3ab1e9b3897b2735bbe299138e6edc0da47b8938
    }
  }

  const getPriorityIcon = (priorite) => {
    switch (priorite) {
      case "haute":
        return <Zap className="w-4 h-4" />
      case "moyenne":
        return <Target className="w-4 h-4" />
      case "faible":
        return <Clock className="w-4 h-4" />
      default:
        return null
    }
  }

  const renderTabNavigation = () => (
    <div className="flex justify-center mb-8">
      <div className="bg-white rounded-xl p-1 shadow-lg">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 md:px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
            activeTab === "overview"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105"
              : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
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
              : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
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
              : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
          }`}
        >
          <BarChart3 className="inline w-5 h-5 mr-2" />
          <span className="hidden sm:inline">Analytiques</span>
        </button>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des projets créatifs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100">
<<<<<<< HEAD
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            ✨ Les Rêves
          </h1>
          <p className="text-lg text-gray-600">
            Dashboard - Gestion des Projets Créatifs
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-1 shadow-lg">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === "overview"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              <TrendingUp className="inline w-5 h-5 mr-2" />
              Vue d'ensemble
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === "calendar"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              <Calendar className="inline w-5 h-5 mr-2" />
              Calendrier
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === "analytics"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              <BarChart3 className="inline w-5 h-5 mr-2" />
              Analytiques
            </button>
=======
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            ✨ Les Rêves
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-4">Dashboard - Gestion des Projets Créatifs</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              {stats.total} projets créatifs
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-blue-500" />
              {stats.totalHours}h investies
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              {stats.avgProgress}% progression moyenne
            </span>
>>>>>>> 3ab1e9b3897b2735bbe299138e6edc0da47b8938
          </div>
        </div>

        {renderTabNavigation()}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-4 md:p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs md:text-sm">Total Projets</p>
                <p className="text-2xl md:text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="bg-blue-400 rounded-full p-2 md:p-3">
                <PieChart className="w-4 h-4 md:w-6 md:h-6" />
              </div>
            </div>
          </div>

<<<<<<< HEAD
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 text-white">
=======
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-4 md:p-6 text-white transform hover:scale-105 transition-all duration-300">
>>>>>>> 3ab1e9b3897b2735bbe299138e6edc0da47b8938
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-xs md:text-sm">À faire</p>
                <p className="text-2xl md:text-3xl font-bold">{stats.todo}</p>
              </div>
              <div className="bg-yellow-400 rounded-full p-2 md:p-3">
                <Clock className="w-4 h-4 md:w-6 md:h-6" />
              </div>
            </div>
          </div>

<<<<<<< HEAD
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
=======
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-4 md:p-6 text-white transform hover:scale-105 transition-all duration-300">
>>>>>>> 3ab1e9b3897b2735bbe299138e6edc0da47b8938
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-xs md:text-sm">En cours</p>
                <p className="text-2xl md:text-3xl font-bold">{stats.inProgress}</p>
              </div>
              <div className="bg-indigo-400 rounded-full p-2 md:p-3">
                <AlertCircle className="w-4 h-4 md:w-6 md:h-6" />
              </div>
            </div>
          </div>

<<<<<<< HEAD
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
=======
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 md:p-6 text-white transform hover:scale-105 transition-all duration-300">
>>>>>>> 3ab1e9b3897b2735bbe299138e6edc0da47b8938
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs md:text-sm">Terminés</p>
                <p className="text-2xl md:text-3xl font-bold">{stats.completed}</p>
              </div>
              <div className="bg-green-400 rounded-full p-2 md:p-3">
                <CheckCircle className="w-4 h-4 md:w-6 md:h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {activeTab === "overview" && (
<<<<<<< HEAD
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Projects List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Mes Projets
                  </h2>
                  <button
                    onClick={() => openModal()}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Nouveau
                  </button>
=======
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Projects List - takes 3 columns */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">Mes Projets</h2>
                  <div className="flex gap-2">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
                      >
                        <BarChart3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
                      >
                        <Filter className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => openModal()}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="hidden sm:inline">Nouveau</span>
                    </button>
                  </div>
>>>>>>> 3ab1e9b3897b2735bbe299138e6edc0da47b8938
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Rechercher un projet..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Tous les statuts</option>
                    <option value="À faire">À faire</option>
                    <option value="En cours">En cours</option>
                    <option value="Terminé">Terminé</option>
                  </select>

                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Toutes les priorités</option>
                    <option value="haute">Haute</option>
                    <option value="moyenne">Moyenne</option>
                    <option value="faible">Faible</option>
                  </select>
                </div>

                <div className={`${viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}`}>
                  {filteredProjects.map((project) => (
                    <div
                      key={project.id}
<<<<<<< HEAD
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">
                            {project.titre}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Créé le{" "}
                            {project.dateCreation.toLocaleDateString("fr-FR")}
=======
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800 mb-1">{project.titre}</h3>
                          <p className="text-gray-600 text-sm flex items-center gap-1">
                            <Timer className="w-4 h-4" />
                            Créé le {project.dateCreation.toLocaleDateString("fr-FR")}
>>>>>>> 3ab1e9b3897b2735bbe299138e6edc0da47b8938
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal(project)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProject(project.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

<<<<<<< HEAD
                      <p className="text-gray-700 mb-3">
                        {project.description}
                      </p>
=======
                      <p className="text-gray-700 mb-3 text-sm line-clamp-2">{project.description}</p>

                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
>>>>>>> 3ab1e9b3897b2735bbe299138e6edc0da47b8938

                      <div className="flex justify-between items-center mb-3">
                        <div className="flex gap-2">
                          <span
<<<<<<< HEAD
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              project.statut
                            )}`}
=======
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.statut)}`}
>>>>>>> 3ab1e9b3897b2735bbe299138e6edc0da47b8938
                          >
                            {project.statut}
                          </span>
                          <span
<<<<<<< HEAD
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                              project.priorite
                            )}`}
                          >
=======
                            className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getPriorityColor(project.priorite)}`}
                          >
                            {getPriorityIcon(project.priorite)}
>>>>>>> 3ab1e9b3897b2735bbe299138e6edc0da47b8938
                            {project.priorite}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-600">{project.progress}%</div>
                          {project.spentHours > 0 && (
                            <div className="text-xs text-gray-500">
                              {project.spentHours}h / {project.estimatedHours}h
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredProjects.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Search className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-lg">Aucun projet trouvé</p>
                      <p className="text-sm">Essayez de modifier vos filtres ou créez un nouveau projet</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar - Creative Tree and Charts */}
            <div className="lg:col-span-1 space-y-6">
              <CreativeTree projects={projects} />

              {/* Fixed: Corrected PieChart component usage */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  Répartition des Projets
                </h3>
                <ResponsiveContainer width="100%" height={200}>
<<<<<<< HEAD
                  <RechartsPieChart>
                    <Tooltip />
                    <RechartsPieChart
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </RechartsPieChart>
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {pieData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-gray-600">
                        {item.name}: {item.value}
                      </span>
                    </div>
                  ))}
                </div>
=======
                  <RechartsPieChart data={pieData} cx="50%" cy="50%" outerRadius={70}>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </RechartsPieChart>
                </ResponsiveContainer>
>>>>>>> 3ab1e9b3897b2735bbe299138e6edc0da47b8938
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Insights
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm text-purple-700">Progression moyenne</span>
                    <span className="font-bold text-purple-800">{stats.avgProgress}%</span>
                  </div>
<<<<<<< HEAD
                  <div className="text-gray-600">
                    {selectedDate.toLocaleDateString("fr-FR", {
                      month: "long",
                      year: "numeric",
                    })}
=======
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-blue-700">Heures investies</span>
                    <span className="font-bold text-blue-800">{stats.totalHours}h</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-green-700">Taux de réussite</span>
                    <span className="font-bold text-green-800">
                      {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                    </span>
>>>>>>> 3ab1e9b3897b2735bbe299138e6edc0da47b8938
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

<<<<<<< HEAD
        {/* Analytics Tab */}
=======
        {activeTab === "process" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Activity className="w-7 h-7" />
                Suivi des Processus par Projet
              </h2>

              <div className="space-y-6">
                {projects.map((project) => (
                  <div key={project.id} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{project.titre}</h3>
                        <p className="text-gray-600 text-sm">{project.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">{project.progress}%</div>
                        <div className="text-sm text-gray-500">
                          {project.spentHours}h / {project.estimatedHours}h
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {project.workspaces.map((workspace) => (
                        <div
                          key={workspace.id}
                          className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                            workspace.completed ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-800">{workspace.name}</h4>
                            {workspace.completed ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <Clock className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            {workspace.hours}h {workspace.completed ? "terminées" : "estimées"}
                          </div>
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  workspace.completed ? "bg-green-500" : "bg-gray-300"
                                }`}
                                style={{ width: workspace.completed ? "100%" : "0%" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
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

>>>>>>> 3ab1e9b3897b2735bbe299138e6edc0da47b8938
        {activeTab === "analytics" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  Progression des Projets
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="progress" fill="url(#progressGradient)" radius={[4, 4, 0, 0]} />
                    <defs>
<<<<<<< HEAD
                      <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#8884d8"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8884d8"
                          stopOpacity={0.2}
                        />
=======
                      <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9} />
                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0.7} />
>>>>>>> 3ab1e9b3897b2735bbe299138e6edc0da47b8938
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6">
<<<<<<< HEAD
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  Projets par Mois
                </h3>
=======
                <h3 className="text-xl font-bold mb-4 text-gray-800">Évolution Mensuelle</h3>
>>>>>>> 3ab1e9b3897b2735bbe299138e6edc0da47b8938
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
<<<<<<< HEAD
                    <Line
                      type="monotone"
                      dataKey="projets"
                      stroke="#8884d8"
                      strokeWidth={3}
                      dot={{ fill: "#8884d8", strokeWidth: 2, r: 6 }}
=======
                    <Area
                      type="monotone"
                      dataKey="projets"
                      stroke="#8b5cf6"
                      fill="url(#areaGradient)"
                      strokeWidth={3}
>>>>>>> 3ab1e9b3897b2735bbe299138e6edc0da47b8938
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
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="areaGradient2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
<<<<<<< HEAD

        {/* Calendar Tab */}
        {activeTab === "calendar" && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Calendar className="w-7 h-7" />
              Calendrier des Projets
            </h2>
            <div className="grid grid-cols-7 gap-4 mb-4">
              {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day) => (
                <div
                  key={day}
                  className="text-center font-semibold text-gray-600 py-2"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-4">
              {Array.from({ length: 35 }, (_, i) => (
                <div
                  key={i}
                  className="aspect-square border border-gray-200 rounded-lg flex items-center justify-center hover:bg-purple-50 cursor-pointer transition-colors"
                >
                  {i > 6 && i < 28 ? i - 6 : ""}
                </div>
              ))}
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
=======
      </div>

      {/* Project Modal */}
      {isModalOpen && <ProjectModal project={editingProject} onSave={saveProject} onClose={closeModal} />}
>>>>>>> 3ab1e9b3897b2735bbe299138e6edc0da47b8938
    </div>
  )
}

// ProjectModal component
const ProjectModal = ({ project, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    titre: project?.titre || "",
    description: project?.description || "",
    statut: project?.statut || "À faire",
    priorite: project?.priorite || "moyenne",
<<<<<<< HEAD
  });
=======
    tags: project?.tags?.join(", ") || "",
    estimatedHours: project?.estimatedHours || 0,
    spentHours: project?.spentHours || 0,
  })
>>>>>>> 3ab1e9b3897b2735bbe299138e6edc0da47b8938

  const handleSubmit = (e) => {
    e.preventDefault()
    const processedData = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      estimatedHours: parseInt(formData.estimatedHours) || 0,
      spentHours: parseInt(formData.spentHours) || 0,
    }
    onSave(processedData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
<<<<<<< HEAD
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {project ? "Modifier le Projet" : "Nouveau Projet"}
        </h2>
=======
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{project ? "Modifier le Projet" : "Nouveau Projet"}</h2>
>>>>>>> 3ab1e9b3897b2735bbe299138e6edc0da47b8938

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
            <input
              type="text"
              required
              value={formData.titre}
<<<<<<< HEAD
              onChange={(e) =>
                setFormData({ ...formData, titre: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
=======
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
>>>>>>> 3ab1e9b3897b2735bbe299138e6edc0da47b8938
              placeholder="Titre de votre projet..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
<<<<<<< HEAD
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 h-24"
=======
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 transition-all"
>>>>>>> 3ab1e9b3897b2735bbe299138e6edc0da47b8938
              placeholder="Décrivez votre projet..."
            />
          </div>

<<<<<<< HEAD
=======
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags (séparés par des virgules)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="art, créatif, personnel..."
            />
          </div>

>>>>>>> 3ab1e9b3897b2735bbe299138e6edc0da47b8938
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut *</label>
              <select
                required
                value={formData.statut}
<<<<<<< HEAD
                onChange={(e) =>
                  setFormData({ ...formData, statut: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
=======
                onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
>>>>>>> 3ab1e9b3897b2735bbe299138e6edc0da47b8938
              >
                <option value="À faire">À faire</option>
                <option value="En cours">En cours</option>
                <option value="Terminé">Terminé</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priorité *</label>
              <select
                required
                value={formData.priorite}
<<<<<<< HEAD
                onChange={(e) =>
                  setFormData({ ...formData, priorite: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
=======
                onChange={(e) => setFormData({ ...formData, priorite: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
>>>>>>> 3ab1e9b3897b2735bbe299138e6edc0da47b8938
              >
                <option value="faible">Faible</option>
                <option value="moyenne">Moyenne</option>
                <option value="haute">Haute</option>
              </select>
            </div>
          </div>

<<<<<<< HEAD
=======
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Heures estimées</label>
              <input
                type="number"
                min="0"
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Heures passées</label>
              <input
                type="number"
                min="0"
                value={formData.spentHours}
                onChange={(e) => setFormData({ ...formData, spentHours: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="0"
              />
            </div>
          </div>

>>>>>>> 3ab1e9b3897b2735bbe299138e6edc0da47b8938
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

<<<<<<< HEAD
export default Dashboard;
=======
export default EnhancedDashboard
>>>>>>> 3ab1e9b3897b2735bbe299138e6edc0da47b8938
