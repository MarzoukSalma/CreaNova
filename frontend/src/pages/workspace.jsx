"use client"

import { useState, useEffect } from "react"
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  X,
  Clock,
  Target,
  Music,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Calendar,
  CheckCircle2,
  Circle,
  Loader,
  AlertCircle,
  Trash2,
  Zap,
  Flame,
} from "lucide-react"
import api from "../api/api"

const WorkspacePage = () => {
  // Pomodoro timer state
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [cycles, setCycles] = useState(0)
  const [pomodoroLength, setPomodoroLength] = useState(25)

  // Tasks state
  const [currentTask, setCurrentTask] = useState(null)
  const [tasks, setTasks] = useState([])
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTask, setNewTask] = useState({
    titre: "",
    accorder: "",
  })

  // UI state
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [musicEnabled, setMusicEnabled] = useState(false)
  const [selectedPlaylist, setSelectedPlaylist] = useState("chill")

  // Statistics state
  const [weeklyHistory, setWeeklyHistory] = useState([])

  // API state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [availableProjects, setAvailableProjects] = useState([])

  const playlists = {
    chill: { name: "Musique Chill", icon: "🎵" },
    focus: { name: "Deep Focus", icon: "🧠" },
    nature: { name: "Sons de la Nature", icon: "🌿" },
    coffee: { name: "Café Jazz", icon: "☕" },
    rain: { name: "Pluie Relaxante", icon: "🌧️" },
  }

  const pomodoroOptions = [15, 25, 30, 45, 60]

  const loadInitialData = async () => {
    setLoading(true)
    setError(null)

    try {
      setWeeklyHistory(generateMockHistory())
      await loadAvailableProjects()
      await loadTasks()
    } catch (err) {
      setError("Erreur lors du chargement des données")
      console.error("Error loading initial data:", err)
    } finally {
      setLoading(false)
    }
  }

  const generateMockHistory = () => [
    { day: "Lundi", tasks: 3, timeSpent: 120, pomodoros: 5 },
    { day: "Mardi", tasks: 2, timeSpent: 95, pomodoros: 4 },
    { day: "Mercredi", tasks: 4, timeSpent: 150, pomodoros: 6 },
    { day: "Jeudi", tasks: 1, timeSpent: 45, pomodoros: 2 },
    { day: "Vendredi", tasks: 3, timeSpent: 110, pomodoros: 4 },
    { day: "Samedi", tasks: 2, timeSpent: 80, pomodoros: 3 },
    { day: "Dimanche", tasks: 1, timeSpent: 30, pomodoros: 1 },
  ]

  const loadAvailableProjects = async () => {
    try {
      const response = await api.get("/dreams")
      const dreams = response?.data || []
      const projectOptions = dreams
        .slice()
        .reverse()
        .map((dream) => ({
          id: dream.id,
          titre: dream.titre || dream.title || "Projet sans titre",
        }))
      setAvailableProjects(projectOptions)
    } catch (err) {
      console.warn("Could not load available projects:", err)
      setAvailableProjects([])
    }
  }

  const loadTasks = async () => {
    try {
      const response = await api.get("/workspaces")
      const workspaces = response?.data || []
      const formattedTasks = workspaces
        .slice()
        .reverse()
        .map((workspace) => ({
          id: workspace.id,
          titre: workspace.titre,
          accorder: workspace.accorder || "",
          completed: workspace.completed || false,
          completedAt: workspace.completedAt ? new Date(workspace.completedAt) : null,
          timeSpent: workspace.timeSpent || 0,
          pomodoros: workspace.pomodoros || 0,
        }))
      setTasks(formattedTasks)
    } catch (err) {
      console.error("Error loading tasks:", err)
    }
  }

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    let interval = null
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      if (isBreak) {
        setTimeLeft(pomodoroLength * 60)
        setIsBreak(false)
      } else {
        setTimeLeft(5 * 60)
        setIsBreak(true)
        setCycles((prev) => prev + 1)
        if (currentTask) {
          updateTaskTime(currentTask.id, pomodoroLength)
        }
      }
      setIsRunning(false)
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft, isBreak, pomodoroLength, currentTask])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Escape" && isFocusMode) {
        setIsFocusMode(false)
      }
    }
    document.addEventListener("keydown", handleKeyPress)
    return () => document.removeEventListener("keydown", handleKeyPress)
  }, [isFocusMode])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const addTask = async () => {
    if (!newTask.titre.trim()) return

    setLoading(true)
    setError(null)

    try {
      const taskData = {
        titre: newTask.titre,
        accorder: newTask.accorder,
        completed: false,
        dateCreation: new Date().toISOString(),
      }

      const response = await api.post("/workspaces", taskData)

      if (response.error) {
        setError("Erreur lors de la création de la tâche")
        console.error("Error creating task:", response.error)
        return
      }

      const createdTask = {
        id: response.data?.id || Date.now(),
        ...taskData,
        timeSpent: 0,
        pomodoros: 0,
      }

      setTasks((prev) => [createdTask, ...prev])
      setNewTask({ titre: "", accorder: "" })
      setIsAddingTask(false)
    } catch (err) {
      setError("Erreur lors de la création de la tâche")
      console.error("Error creating task:", err)
    } finally {
      setLoading(false)
    }
  }

  const toggleTask = async (id) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return

    setLoading(true)
    setError(null)

    try {
      const updatedTaskData = {
        ...task,
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null,
      }

      const response = await api.put(`/workspaces/${id}`, updatedTaskData)

      if (response.error) {
        setError("Erreur lors de la mise à jour de la tâche")
        console.error("Error updating task:", response.error)
        return
      }

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                ...task,
                completed: !task.completed,
                completedAt: !task.completed ? new Date() : null,
              }
            : task
        )
      )
    } catch (err) {
      setError("Erreur lors de la mise à jour de la tâche")
      console.error("Error updating task:", err)
    } finally {
      setLoading(false)
    }
  }

  const startTaskPomodoro = (task) => {
    setCurrentTask(task)
    setTimeLeft(pomodoroLength * 60)
    setIsBreak(false)
    setIsRunning(true)
    setIsFocusMode(true)
  }

  const updateTaskTime = async (taskId, minutes) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    try {
      const updatedTaskData = {
        ...task,
        timeSpent: (task.timeSpent || 0) + minutes,
        pomodoros: (task.pomodoros || 0) + 1,
      }

      const response = await api.put(`/workspaces/${taskId}`, updatedTaskData)

      if (!response.error) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  timeSpent: updatedTaskData.timeSpent,
                  pomodoros: updatedTaskData.pomodoros,
                }
              : task
          )
        )
      }
    } catch (err) {
      console.error("Error updating task time:", err)
    }
  }

  const deleteTask = async (taskId) => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.delete(`/workspaces/${taskId}`)

      if (response.error) {
        setError("Erreur lors de la suppression de la tâche")
        console.error("Error deleting task:", response.error)
        return
      }

      setTasks((prev) => prev.filter((task) => task.id !== taskId))

      if (currentTask?.id === taskId) {
        setCurrentTask(null)
        setIsRunning(false)
        setTimeLeft(pomodoroLength * 60)
      }
    } catch (err) {
      setError("Erreur lors de la suppression de la tâche")
      console.error("Error deleting task:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading && tasks.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-slate-600 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Chargement de votre espace de travail...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isFocusMode
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          : "bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1
                className={`text-6xl md:text-7xl font-black mb-3 ${
                  isFocusMode
                    ? "text-white"
                    : "bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent"
                }`}
              >
                Espace de Travail
              </h1>
              <p className={`text-lg ${isFocusMode ? "text-slate-300" : "text-slate-600"}`}>
                Restez concentré, accomplissez vos tâches
              </p>
            </div>

            <button
              onClick={() => setIsFocusMode(!isFocusMode)}
              className={`p-3 rounded-2xl transition-all duration-300 ${
                isFocusMode
                  ? "bg-white/10 text-white hover:bg-white/20"
                  : "bg-white shadow-lg text-slate-700 hover:shadow-xl"
              }`}
            >
              {isFocusMode ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100/80 border border-red-200 rounded-2xl flex items-center gap-2 text-red-700 backdrop-blur-sm">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
              <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {!isFocusMode ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tasks Column */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl border border-slate-200/50 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                    <Target className="w-8 h-8 text-slate-700" />
                    Mes Tâches
                  </h3>
                  <button
                    onClick={() => setIsAddingTask(true)}
                    disabled={loading}
                    className={`bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl transition-all font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <Plus className="w-5 h-5" />
                    Nouvelle tâche
                  </button>
                </div>

                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-5 rounded-2xl border transition-all group hover:shadow-md ${
                        task.completed
                          ? "bg-emerald-50 border-emerald-200/50"
                          : currentTask?.id === task.id
                          ? "bg-slate-100 border-slate-300 ring-2 ring-slate-300/50"
                          : "bg-white border-slate-200/50 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <button
                            onClick={() => toggleTask(task.id)}
                            disabled={loading}
                            className="transition-all disabled:opacity-50 flex-shrink-0"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                            ) : (
                              <Circle className="w-6 h-6 text-slate-400 hover:text-slate-600" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <h4
                              className={`font-semibold text-base truncate ${
                                task.completed ? "line-through text-slate-500" : "text-slate-900"
                              }`}
                            >
                              {task.titre}
                            </h4>
                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                              {task.accorder && (
                                <span className="text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                                  📁 {task.accorder}
                                </span>
                              )}
                              {task.timeSpent > 0 && (
                                <span className="text-xs text-slate-700 font-medium bg-slate-100 px-3 py-1 rounded-full">
                                  🍅 {task.pomodoros} × {task.timeSpent}min
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => deleteTask(task.id)}
                            disabled={loading}
                            className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all duration-300 disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          {!task.completed && (
                            <button
                              onClick={() => startTaskPomodoro(task)}
                              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-all font-semibold text-sm flex items-center gap-1 transform hover:scale-105"
                            >
                              <Play className="w-4 h-4" />
                              Start
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {tasks.length === 0 && !loading && (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🎯</div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Prêt à être productif ?</h4>
                      <p className="text-slate-600 mb-6">Ajoutez votre première tâche et lancez un pomodoro</p>
                      <button
                        onClick={() => setIsAddingTask(true)}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl transition-all font-semibold shadow-md"
                      >
                        Créer ma première tâche
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Pomodoro */}
              <div className="bg-white rounded-3xl border border-slate-200/50 p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
                  <Clock className="w-6 h-6 text-slate-700" />
                  Pomodoro
                </h3>

                <div className="grid grid-cols-5 gap-2 mb-6">
                  {pomodoroOptions.map((minutes) => (
                    <button
                      key={minutes}
                      onClick={() => {
                        setPomodoroLength(minutes)
                        setTimeLeft(minutes * 60)
                        setIsRunning(false)
                      }}
                      className={`p-2 rounded-xl text-center transition-all text-xs font-bold ${
                        pomodoroLength === minutes
                          ? "bg-slate-900 text-white shadow-md"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {minutes}m
                    </button>
                  ))}
                </div>

                <div className="text-center mb-6">
                  <div className={`text-5xl font-mono font-bold mb-4 ${isBreak ? "text-emerald-600" : "text-slate-900"}`}>
                    {formatTime(timeLeft)}
                  </div>

                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setIsRunning(!isRunning)
                      }}
                      className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all transform hover:scale-105 ${
                        !currentTask
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                          : isRunning
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-emerald-500 hover:bg-emerald-600 text-white"
                      }`}
                    >
                      {isRunning ? (
                        <>
                          <Pause className="w-4 h-4 inline mr-1" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 inline mr-1" />
                          Start
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setTimeLeft(pomodoroLength * 60)
                        setIsRunning(false)
                        setIsBreak(false)
                      }}
                      className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-4 p-3 bg-slate-100 rounded-lg">
                    <p className="text-xs text-slate-600">
                      {currentTask ? (
                        <span className="font-semibold text-slate-900">🎯 {currentTask.titre.substring(0, 20)}</span>
                      ) : (
                        <span>Sélectionnez une tâche</span>
                      )}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      Cycles: <span className="font-bold text-slate-900">{cycles}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Music */}
              <div className="bg-white rounded-3xl border border-slate-200/50 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Music className="w-6 h-6 text-slate-700" />
                    Ambiance
                  </h3>
                  <button
                    onClick={() => setMusicEnabled(!musicEnabled)}
                    className={`p-2 rounded-lg transition-all ${
                      musicEnabled ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {musicEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                </div>

                <div className="space-y-2">
                  {Object.entries(playlists).map(([key, playlist]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedPlaylist(key)}
                      className={`w-full p-3 rounded-lg text-left transition-all text-sm font-medium ${
                        selectedPlaylist === key
                          ? "bg-slate-900 text-white shadow-md"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <span className="text-lg mr-2">{playlist.icon}</span>
                      {playlist.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weekly Stats */}
              <div className="bg-white rounded-3xl border border-slate-200/50 p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
                  <Flame className="w-6 h-6 text-orange-500" />
                  Cette Semaine
                </h3>

                <div className="space-y-2 mb-4">
                  {weeklyHistory.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{day.day}</p>
                        <p className="text-xs text-slate-500">{day.tasks} tâches • {day.pomodoros} 🍅</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">{day.timeSpent}min</p>
                        <div className="w-16 h-1 bg-slate-200 rounded-full mt-1">
                          <div
                            className="h-1 bg-slate-900 rounded-full"
                            style={{
                              width: `${Math.min((day.timeSpent / 180) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg text-white">
                  <p className="text-xs text-slate-300 mb-2">Total cette semaine</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold">
                        {weeklyHistory.reduce((acc, day) => acc + day.timeSpent, 0)}min
                      </p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">
                        {weeklyHistory.reduce((acc, day) => acc + day.pomodoros, 0)} 🍅
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Focus Mode */
          <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center z-50">
            <div className="absolute top-6 right-6 flex gap-3">
              <button
                onClick={() => {
                  setTimeLeft(pomodoroLength * 60)
                  setIsRunning(false)
                  setIsBreak(false)
                }}
                className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
              <button
                onClick={() => setIsFocusMode(false)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
              >
                <Minimize2 className="w-5 h-5" />
                Quitter
              </button>
            </div>

            <div className="text-center text-white max-w-4xl px-6">
              <div className="mb-12">
                <div className={`text-9xl font-mono font-bold mb-8 ${isBreak ? "text-emerald-400" : "text-white"}`}>
                  {formatTime(timeLeft)}
                </div>

                <div className="flex justify-center gap-6 mb-12">
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`px-12 py-6 rounded-2xl text-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      isRunning ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"
                    }`}
                  >
                    {isRunning ? (
                      <>
                        <Pause className="w-6 h-6 inline mr-3" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-6 h-6 inline mr-3" />
                        Start
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="text-center mb-8">
                <p className="text-3xl mb-6 font-semibold">
                  {isBreak ? "☕ Pause bien méritée !" : `🎯 Focus sur: ${currentTask?.titre}`}
                </p>
                {selectedPlaylist && musicEnabled && (
                  <p className="text-lg opacity-70">🎵 {playlists[selectedPlaylist].name} en cours...</p>
                )}
              </div>

              <div className="text-center text-sm opacity-60">
                <p>
                  Pomodoro {pomodoroLength}min • Cycles: {cycles}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Add Task Modal */}
        {isAddingTask && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border border-slate-200/50">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Nouvelle Tâche</h2>
                <button
                  onClick={() => setIsAddingTask(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest">
                    Tâche *
                  </label>
                  <input
                    type="text"
                    value={newTask.titre}
                    onChange={(e) => setNewTask((prev) => ({ ...prev, titre: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-base bg-slate-50"
                    placeholder="Ex: Créer la page d'accueil..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest">
                    Projet associé
                  </label>
                  <select
                    value={newTask.accorder}
                    onChange={(e) =>
                      setNewTask((prev) => ({
                        ...prev,
                        accorder: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-base bg-slate-50"
                  >
                    <option value="">Sélectionner un projet</option>
                    <option value="libre">🆓 Libre (sans projet)</option>
                    {availableProjects.map((project) => (
                      <option key={project.id} value={project.titre}>
                        📁 {project.titre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setIsAddingTask(false)}
                  className="flex-1 px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-semibold"
                >
                  Annuler
                </button>
                <button
                  onClick={addTask}
                  disabled={loading}
                  className={`flex-1 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-semibold transform hover:scale-105 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Création..." : "Créer la tâche"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WorkspacePage