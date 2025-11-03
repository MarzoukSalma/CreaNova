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
  Sparkles,
  Flame,
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
  Area,
  AreaChart,
  LineChart,
  Line,
} from "recharts"

// Import your API
import api from "../api/api";

const fetchProjectsFromApi = async () => {
  try {
    const allProjects = await api.get(`/dreams`);
    return allProjects.data || [];
  } catch (error) {
    console.error("Error loading projects:", error);
    return [];
  }
};

const CreativeTree = ({ projects }) => {
  const totalProgress =
    projects.length > 0
      ? projects.reduce((sum, p) => {
          if (p.statut === "Terminé") return sum + 100
          if (p.statut === "En cours") return sum + 50
          return sum + 0
        }, 0) / projects.length
      : 0

  const treeHeight = Math.max(200, (totalProgress / 100) * 400)
  const branchCount = Math.floor(totalProgress / 20) + 1
  const leafCount = Math.floor(totalProgress / 10)

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-8 border border-slate-200/50 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-amber-500" />
        <h3 className="text-sm font-bold text-slate-600 uppercase tracking-widest">Growth Tree</h3>
      </div>
      <div className="flex justify-center mb-8">
        <svg width="160" height="240" viewBox="0 0 200 300" className="overflow-visible">
          <rect
            x="90"
            y={300 - treeHeight * 0.3}
            width="20"
            height={treeHeight * 0.3}
            fill="#78350f"
            rx="2"
            className="transition-all duration-1000"
          />

          {Array.from({ length: branchCount }, (_, i) => {
            const angle = (i * 60 - 30) * (Math.PI / 180);
            const branchLength = 30 + (totalProgress / 100) * 20;
            const startY = 300 - treeHeight * 0.3 + i * 15;
            const endX = 100 + Math.sin(angle) * branchLength;
            const endY = startY - Math.cos(angle) * branchLength;

            return (
              <g key={i}>
                <line
                  x1="100"
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="#b45309"
                  strokeWidth="3"
                  className="transition-all duration-1000"
                />

                {totalProgress > (i + 1) * 15 && (
                  <>
                    <line
                      x1={endX}
                      y1={endY}
                      x2={endX + Math.sin(angle + 0.5) * 15}
                      y2={endY - Math.cos(angle + 0.5) * 15}
                      stroke="#b45309"
                      strokeWidth="2"
                      className="transition-all duration-1000"
                    />
                    <line
                      x1={endX}
                      y1={endY}
                      x2={endX + Math.sin(angle - 0.5) * 15}
                      y2={endY - Math.cos(angle - 0.5) * 15}
                      stroke="#b45309"
                      strokeWidth="2"
                      className="transition-all duration-1000"
                    />
                  </>
                )}
              </g>
            );
          })}

          {Array.from({ length: leafCount }, (_, i) => {
            const angle = i * 36 * (Math.PI / 180);
            const radius = 40 + (i % 3) * 15;
            const x = 100 + Math.sin(angle) * radius;
            const y = 200 - Math.cos(angle) * radius - (totalProgress / 100) * 50;
            const colors = ["#10b981", "#059669", "#047857", "#84cc16", "#65a30d"];

            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4"
                fill={colors[i % colors.length]}
                className="transition-all duration-1000 animate-pulse"
                style={{ opacity: totalProgress > i * 5 ? 1 : 0.3 }}
              />
            );
          })}

          {projects.filter((p) => p.statut === "Terminé").map((_, i) => (
            <g key={`flower-${i}`}>
              <circle cx={80 + i * 40} cy={180} r="3" fill="#f43f5e" />
              <circle cx={77 + i * 40} cy={177} r="2" fill="#fbcfe8" />
              <circle cx={83 + i * 40} cy={177} r="2" fill="#fbcfe8" />
              <circle cx={77 + i * 40} cy={183} r="2" fill="#fbcfe8" />
              <circle cx={83 + i * 40} cy={183} r="2" fill="#fbcfe8" />
            </g>
          ))}
        </svg>
      </div>

      <div className="text-center space-y-2">
        <div className="text-4xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
          {Math.round(totalProgress)}%
        </div>
        <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Overall Progress</div>
        <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
            <span className="text-xs text-slate-600 font-medium">{leafCount} leaves</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-rose-500 rounded-full"></div>
            <span className="text-xs text-slate-600 font-medium">{projects.filter((p) => p.statut === "Terminé").length} blooms</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const EnhancedDashboard = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetchProjectsFromApi()
      const projectsWithProgress = response.map((project) => {
        let progress = 0
        if (project.statut === "Terminé") progress = 100
        else if (project.statut === "En cours") progress = 50
        else progress = 0
        return {
          ...project,
          dateCreation: new Date(project.dateCreation),
          progress,
        }
      })
      setProjects(projectsWithProgress)
    } catch (error) {
      console.error("Error loading projects:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

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
      projects.length > 0
        ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
        : 0,
  }

  const pieData = [
    { name: "To Do", value: stats.todo, color: "#fbbf24" },
    { name: "In Progress", value: stats.inProgress, color: "#3b82f6" },
    { name: "Completed", value: stats.completed, color: "#10b981" },
  ]

  const progressData = projects.map((p) => ({
    name: p.titre.length > 12 ? p.titre.substring(0, 12) + "..." : p.titre,
    progress: p.progress,
  }))

  const monthlyData = [
    { month: "Jan", projects: 2, hours: 45 },
    { month: "Feb", projects: 3, hours: 78 },
    { month: "Mar", projects: 1, hours: 32 },
    { month: "Apr", projects: 2, hours: 56 },
  ]

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
        })
        const newProject = {
          ...response.data,
          dateCreation: new Date(response.data.dateCreation),
          progress: projectData.statut === "Terminé" ? 100 : projectData.statut === "En cours" ? 50 : 0,
        }
        setProjects([...projects, newProject])
      }
      closeModal()
    } catch (error) {
      console.error("Error saving project:", error)
    }
  }

  const deleteProject = async (id) => {
    if (window.confirm("Delete this project?")) {
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
        return "bg-amber-100/60 text-amber-700 border border-amber-200/50"
      case "En cours":
        return "bg-blue-100/60 text-blue-700 border border-blue-200/50"
      case "Terminé":
        return "bg-emerald-100/60 text-emerald-700 border border-emerald-200/50"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  const getPriorityColor = (priorite) => {
    switch (priorite) {
      case "haute":
        return "bg-red-100/60 text-red-700 border border-red-200/50"
      case "moyenne":
        return "bg-yellow-100/60 text-yellow-700 border border-yellow-200/50"
      case "faible":
        return "bg-blue-100/60 text-blue-700 border border-blue-200/50"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-3 border-slate-300 border-t-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading your dreams...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-10 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
            <h1 className="text-6xl md:text-7xl font-black text-slate-900">
              Les Rêves
            </h1>
          </div>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl">
            Transform your creative vision into reality. Track, manage, and celebrate your projects.
          </p>
          <div className="flex flex-wrap gap-8 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-slate-500 text-xs font-semibold uppercase">Projects</div>
                <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-slate-500 text-xs font-semibold uppercase">Hours</div>
                <div className="text-2xl font-bold text-slate-900">{stats.totalHours}h</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-slate-500 text-xs font-semibold uppercase">Avg Progress</div>
                <div className="text-2xl font-bold text-slate-900">{stats.avgProgress}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-12 border-b border-slate-200">
          {["overview", "process"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
                activeTab === tab
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
      

        {/* Main Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Projects List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl border border-slate-200/50 p-8 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-900">Projects</h2>
                  <button
                    onClick={() => openModal()}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl transition-all font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <Plus className="w-5 h-5" />
                    New
                  </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm bg-slate-50"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm bg-slate-50"
                  >
                    <option value="">All Status</option>
                    <option value="À faire">To Do</option>
                    <option value="En cours">In Progress</option>
                    <option value="Terminé">Completed</option>
                  </select>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm bg-slate-50"
                  >
                    <option value="">All Priority</option>
                    <option value="haute">High</option>
                    <option value="moyenne">Medium</option>
                    <option value="faible">Low</option>
                  </select>
                </div>

                {/* Projects */}
                <div className="space-y-3">
                  {filteredProjects.map((project) => (
                    <div
                      key={project.id}
                      className="border border-slate-200/50 rounded-2xl p-5 hover:bg-slate-50 hover:border-slate-300 transition-all group hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-slate-700">{project.titre}</h3>
                          <p className="text-sm text-slate-600 line-clamp-1">{project.description}</p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openModal(project)}
                            className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProject(project.id)}
                            className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getStatusColor(project.statut)}`}>
                          {project.statut}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getPriorityColor(project.priorite)}`}>
                          {project.priorite}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-600 font-medium">Progress</span>
                          <span className="font-bold text-slate-900">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-slate-900 to-slate-700 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredProjects.length === 0 && (
                  <div className="text-center py-16 text-slate-500">
                    <Search className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="font-semibold text-lg">No projects found</p>
                    <p className="text-sm">Try adjusting your filters or create a new project</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200/50 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <h3 className="text-sm font-bold text-slate-600 uppercase tracking-widest">Insights</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Avg Progress", value: `${stats.avgProgress}%`, color: "from-purple-50 to-purple-100" },
                    { label: "Hours Invested", value: `${stats.totalHours}h`, color: "from-blue-50 to-blue-100" },
                    {
                      label: "Success Rate",
                      value: `${stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%`,
                      color: "from-emerald-50 to-emerald-100",
                    },
                  ].map((insight, i) => (
                    <div key={i} className={`bg-gradient-to-r ${insight.color} rounded-xl p-4`}>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-slate-700">{insight.label}</span>
                        <span className="text-lg font-black text-slate-900">{insight.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/50 p-8 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Analytics</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-widest">Progress by Project</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} />
                        <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#f1f5f9",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="progress" fill="#1e293b" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-widest">Monthly Evolution</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748b" }} />
                        <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#f1f5f9",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="projects"
                          stroke="#1e293b"
                          strokeWidth={2}
                          dot={{ fill: "#1e293b", r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-slate-700/50 p-6 shadow-sm text-white">
                <h3 className="text-lg font-bold mb-3">About Les Rêves</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Transform your creative vision into reality. Track, manage, and celebrate every step of your creative journey. 
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "process" && (
          <div className="bg-white rounded-3xl border border-slate-200/50 p-8 shadow-sm">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Process Overview</h2>
            <div className="space-y-6">
              {projects.map((project) => (
                <div key={project.id} className="border border-slate-200/50 rounded-2xl p-6 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{project.titre}</h3>
                      <p className="text-slate-600 text-sm">{project.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-slate-900">{project.progress}%</div>
                      <div className="text-xs text-slate-500 font-semibold">Progress</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: "To Do", active: project.statut === "À faire", icon: Clock, color: "amber" },
                      { label: "In Progress", active: project.statut === "En cours", icon: AlertCircle, color: "blue" },
                      { label: "Completed", active: project.statut === "Terminé", icon: CheckCircle, color: "emerald" },
                    ].map((stage, i) => {
                      const Icon = stage.icon
                      const colorMap = {
                        amber: "bg-amber-50 border-amber-200 text-amber-700",
                        blue: "bg-blue-50 border-blue-200 text-blue-700",
                        emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
                        gray: "bg-slate-50 border-slate-200 text-slate-500",
                      }
                      return (
                        <div
                          key={i}
                          className={`border-2 rounded-xl p-4 transition-all ${
                            stage.active
                              ? `${colorMap[stage.color]} font-bold`
                              : `${colorMap["gray"]}`
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            <span className="text-xs font-semibold">{stage.label}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-slate-900 to-slate-700 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl border border-slate-200/50 p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Progress by Project</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#f1f5f9",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="progress" fill="#1e293b" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/50 p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Monthly Evolution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#f1f5f9",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="projects"
                    stroke="#1e293b"
                    strokeWidth={3}
                    dot={{ fill: "#1e293b", r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke="#64748b"
                    strokeWidth={2}
                    dot={{ fill: "#64748b", r: 4 }}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <ProjectModal
          project={editingProject}
          onSave={saveProject}
          onClose={closeModal}
        />
      )}
    </div>
  )
}

const ProjectModal = ({ project, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    titre: project?.titre || "",
    description: project?.description || "",
    statut: project?.statut || "À faire",
    priorite: project?.priorite || "moyenne",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 border border-slate-200/50">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">
          {project ? "Edit Project" : "Create Project"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-widest">
              Title
            </label>
            <input
              type="text"
              required
              value={formData.titre}
              onChange={(e) =>
                setFormData({ ...formData, titre: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-base bg-slate-50"
              placeholder="Your project title..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-widest">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-base h-28 resize-none bg-slate-50"
              placeholder="Describe your project..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-widest">
                Status
              </label>
              <select
                value={formData.statut}
                onChange={(e) =>
                  setFormData({ ...formData, statut: e.target.value })
                }
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-base bg-slate-50"
              >
                <option value="À faire">To Do</option>
                <option value="En cours">In Progress</option>
                <option value="Terminé">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-widest">
                Priority
              </label>
              <select
                value={formData.priorite}
                onChange={(e) =>
                  setFormData({ ...formData, priorite: e.target.value })
                }
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-base bg-slate-50"
              >
                <option value="faible">Low</option>
                <option value="moyenne">Medium</option>
                <option value="haute">High</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-base font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all text-base font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EnhancedDashboard