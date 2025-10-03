"use client"

import { useState, useEffect, useCallback } from "react"
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
import api from "../api/api"

const fetchProjectsFromApi = async () => {
  try {
    const allProjects = await api.get(`/dreams`)
    return allProjects.data || []
  } catch (error) {
    console.error("Erreur lors du chargement des journaux:", error)
    return []
  }
}

const CreativeTree = ({ projects }) => {
  const totalProgress =
    projects.length > 0
      ? projects.reduce((sum, p) => {
          if (p.statut === "Terminé") return sum + 100
          if (p.statut === "En cours") return sum + 50
          return sum + 0 // "À faire"
        }, 0) / projects.length
      : 0

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
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true)
      const apiProjects = await fetchProjectsFromApi()

      const projectsWithProgress = apiProjects.map((project) => {
        let progress = 0
        if (project.statut === "Terminé") progress = 100
        else if (project.statut === "En cours") progress = 50
        else progress = 0 // "À faire"

        return {
          ...project,
          dateCreation: new Date(project.dateCreation),
          progress,
          workspaces: project.workspaces || [],
        }
      })

      setProjects(projectsWithProgress)
    } catch (error) {
      console.error("Erreur lors du chargement des projets:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProjects()
  }, [loadProjects, refreshTrigger])

  const handleRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1)
  }, [])

  const filteredProjects = projects.filter((project) => {
    const statusMatch = !statusFilter || project.statut === statusFilter
    const priorityMatch = !priorityFilter || project.priorite === priorityFilter
    const searchMatch =
      !searchTerm ||
      project.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    return statusMatch && priorityMatch && searchMatch
  })

  const stats = {
    total: projects.length,
    todo: projects.filter((p) => p.statut === "À faire").length,
    inProgress: projects.filter((p) => p.statut === "En cours").length,
    completed: projects.filter((p) => p.statut === "Terminé").length,
    totalHours: projects.reduce((sum, p) => sum + (p.spentHours || 0), 0),
    avgProgress:
      projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) : 0,
  }

  // Data for charts
  const pieData = [
    { name: "À faire", value: stats.todo, color: "#fbbf24" },
    { name: "En cours", value: stats.inProgress, color: "#3b82f6" },
    { name: "Terminé", value: stats.completed, color: "#10b981" },
  ]

  const progressData = projects.map((p) => ({
    name: p.titre.length > 15 ? p.titre.substring(0, 15) + "..." : p.titre,
    progress: p.progress,
    priorite: p.priorite,
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

  // Modal functions
  const openModal = (project = null) => {
    setEditingProject(project)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setEditingProject(null)
    setIsModalOpen(false)
  }

  const saveProject = async (projectData) => {
    try {
      if (editingProject) {
        await api.put(`/dreams/${editingProject.id}`, projectData)
        const updatedProject = {
          ...editingProject,
          ...projectData,
          progress: projectData.statut === "Terminé" ? 100 : projectData.statut === "En cours" ? 50 : 0,
        }
        setProjects(projects.map((p) => (p.id === editingProject.id ? updatedProject : p)))
      } else {
        const response = await api.post("/dreams/", {
          ...projectData,
          dateCreation: new Date().toISOString(),
          statut: projectData.statut || "À faire",
        })

        const newProject = {
          ...response.data,
          dateCreation: new Date(response.data.dateCreation),
          progress: response.data.statut === "Terminé" ? 100 : response.data.statut === "En cours" ? 50 : 0,
          workspaces: [],
        }

        setProjects([...projects, newProject])
      }

      closeModal()
      setTimeout(() => handleRefresh(), 100)
    } catch (error) {
      console.error("Error saving project:", error)
    }
  }

  const deleteProject = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      try {
        await api.delete(`/dreams/${id}`)
        setProjects(projects.filter((p) => p.id !== id))
        setTimeout(() => handleRefresh(), 100)
      } catch (error) {
        console.error("Error deleting project:", error)
      }
    }
  }

  const getStatusColor = (statut) => {
    switch (statut) {
      case "À faire":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "En cours":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Terminé":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priorite) => {
    switch (priorite) {
      case "haute":
        return "bg-red-100 text-red-800 border-red-200"
      case "moyenne":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "faible":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
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
              ? "bg-black  text-white shadow-lg transform scale-105"
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
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1 px-3 py-1 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-200 text-purple-600 hover:text-purple-700"
              disabled={loading}
            >
              <Activity className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Actualiser
            </button>
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

          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-4 md:p-6 text-white transform hover:scale-105 transition-all duration-300">
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

          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-4 md:p-6 text-white transform hover:scale-105 transition-all duration-300">
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

          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 md:p-6 text-white transform hover:scale-105 transition-all duration-300">
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
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800 mb-1">{project.titre}</h3>
                          <p className="text-gray-600 text-sm flex items-center gap-1">
                            <Timer className="w-4 h-4" />
                            Créé le {project.dateCreation.toLocaleDateString("fr-FR")}
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

                      <p className="text-gray-700 mb-3 text-sm line-clamp-2">{project.description}</p>

                      <div className="flex justify-between items-center mb-3">
                        <div className="flex gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.statut)}`}
                          >
                            {project.statut}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getPriorityColor(project.priorite)}`}
                          >
                            {getPriorityIcon(project.priorite)}
                            {project.priorite}
                          </span>
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
              <CreativeTree projects={projects} key={`tree-${projects.length}-${stats.avgProgress}`} />

              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Répartition des Projets</h3>
                <ResponsiveContainer width="100%" height={200} key={`pie-${stats.total}-${stats.completed}`}>
                  <RechartsPieChart data={pieData} cx="50%" cy="50%" outerRadius={70}>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </RechartsPieChart>
                </ResponsiveContainer>
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
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-blue-700">Heures investies</span>
                    <span className="font-bold text-blue-800">{stats.totalHours}h</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-green-700">Taux de réussite</span>
                    <span className="font-bold text-green-800">
                      {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
                        <div className="text-sm text-gray-500">Basé sur le statut</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                          project.statut === "À faire" ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-800">À faire</h4>
                          {project.statut === "À faire" ? (
                            <Clock className="w-5 h-5 text-yellow-600" />
                          ) : (
                            <Clock className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className="text-sm text-gray-600">Phase initiale</div>
                      </div>

                      <div
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                          project.statut === "En cours" ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-800">En cours</h4>
                          {project.statut === "En cours" ? (
                            <AlertCircle className="w-5 h-5 text-blue-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className="text-sm text-gray-600">En développement</div>
                      </div>

                      <div
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                          project.statut === "Terminé" ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-800">Terminé</h4>
                          {project.statut === "Terminé" ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className="text-sm text-gray-600">Projet finalisé</div>
                      </div>
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

        {activeTab === "analytics" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Progression des Projets</h3>
                <ResponsiveContainer width="100%" height={300} key={`bar-${progressData.length}`}>
                  <BarChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="progress" fill="url(#progressGradient)" radius={[4, 4, 0, 0]} />
                    <defs>
                      <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9} />
                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0.7} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Évolution Mensuelle</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
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
      </div>

      {/* Project Modal */}
      {isModalOpen && <ProjectModal project={editingProject} onSave={saveProject} onClose={closeModal} />}
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
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const processedData = {
      ...formData,
    }
    onSave(processedData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{project ? "Modifier le Projet" : "Nouveau Projet"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
            <input
              type="text"
              required
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="Titre de votre projet..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 transition-all"
              placeholder="Décrivez votre projet..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut *</label>
              <select
                required
                value={formData.statut}
                onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
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
                onChange={(e) => setFormData({ ...formData, priorite: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
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

export default EnhancedDashboard
