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
    project: "",
  
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

  // Load initial data
  const loadInitialData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Generate mock history
      setWeeklyHistory(generateMockHistory())
      
      // Load available projects
      await loadAvailableProjects()

      // Load existing tasks
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

  // Load available projects from Dreams API
  const loadAvailableProjects = async () => {
  try {
    const response = await api.get("/dreams")
    console.log("Dreams API response:", response)  // <-- check this

    const dreams = response?.data || []
    console.log("Mapped dreams:", dreams)  // <-- check this

   const projectOptions = dreams
  .slice() // crée une copie pour ne pas muter l'original
  .reverse() // inverse l'ordre
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


  // GET - Load all tasks
  const loadTasks = async () => {
    try {
      const response = await api.get("/workspaces")

      if (response.error) {
        console.error("Error loading tasks:", response.error)
        return
      }


      const workspaces = response?.data || []
      const formattedTasks = workspaces.slice() // crée une copie pour ne pas muter l'original
  .reverse() // inverse l'ordre
  .map((workspace) => ({
        id: workspace.id,
        titre: workspace.titre,
        project: workspace.accorder || "",
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

  // Load data on component mount
  useEffect(() => {
    loadInitialData()
  }, [])

  // Timer effect
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

  // Focus mode escape key handler
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Escape" && isFocusMode) {
        setIsFocusMode(false)
      }
    }

    document.addEventListener("keydown", handleKeyPress)
    return () => document.removeEventListener("keydown", handleKeyPress)
  }, [isFocusMode])

  // Helper functions
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // POST - Create new task (fixed endpoint)
  const addTask = async () => {
    if (!newTask.titre.trim()) return

    setLoading(true)
    setError(null)

    try {
      const taskData = {
        titre: newTask.titre,
        accorder: newTask.project,
        completed: false,
        dateCreation: new Date().toISOString(),
      
      }

      // Fixed: Use correct endpoint path
      const response = await api.post("/workspaces", taskData)

      if (response.error) {
        setError("Erreur lors de la création de la tâche")
        console.error("Error creating task:", response.error)
        return
      }

      // Add the new task to state with the returned ID
      const createdTask = {
        id: response.data?.id || Date.now(),
        ...taskData,
        dateCreation: new Date(taskData.createdAt),
      }

      setTasks((prev) => [createdTask, ...prev])
    
setNewTask({ titre: "", project: "" })
      
      setIsAddingTask(false)

    } catch (err) {
      setError("Erreur lors de la création de la tâche")
      console.error("Error creating task:", err)
    } finally {
      setLoading(false)
    }
  }

  // PUT - Update task (fixed endpoint)
  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return

    setLoading(true)
    setError(null)

    try {
      const updatedTaskData = {
        ...task,
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null,
      }

      // Fixed: Use correct endpoint path with workspaces prefix
      const response = await api.put(`/workspaces/${id}`, updatedTaskData)

      if (response.error) {
        setError("Erreur lors de la mise à jour de la tâche")
        console.error("Error updating task:", response.error)
        return
      }

      // Update local state
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                ...task,
                completed: !task.completed,
                completedAt: !task.completed ? new Date() : null,
              }
            : task,
        ),
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
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    try {
      const updatedTaskData = {
        ...task,
        timeSpent: (task.timeSpent || 0) + minutes,
        pomodoros: (task.pomodoros || 0) + 1,
      }

      // Update via API
      const response = await api.put(`/workspaces/${taskId}`, updatedTaskData)

      if (!response.error) {
        // Update local state only if API call succeeds
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  timeSpent: updatedTaskData.timeSpent,
                  pomodoros: updatedTaskData.pomodoros,
                }
              : task,
          ),
        )
      }
    } catch (err) {
      console.error("Error updating task time:", err)
    }
  }

  // DELETE - Delete task (fixed endpoint)
  const deleteTask = async (taskId) => {
    setLoading(true)
    setError(null)

    try {
      // Fixed: Use correct endpoint path with workspaces prefix
      const response = await api.delete(`/workspaces/${taskId}`)

      if (response.error) {
        setError("Erreur lors de la suppression de la tâche")
        console.error("Error deleting task:", response.error)
        return
      }

      // Remove from local state
      setTasks((prev) => prev.filter((task) => task.id !== taskId))

      // Clear current task if it was the deleted one
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement de votre espace de travail...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isFocusMode
          ? "bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900"
          : "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
      }`}
    >
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              {/* Removed offline mode indicator */}
            </div>

            <button
              onClick={() => setIsFocusMode(!isFocusMode)}
              className={`p-3 rounded-2xl transition-all duration-300 ${
                isFocusMode
                  ? "bg-white bg-opacity-20 text-white hover:bg-opacity-30"
                  : "bg-white shadow-lg text-gray-700 hover:shadow-xl"
              }`}
            >
              {isFocusMode ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-2xl flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
              <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <h1
            className={`text-4xl font-bold mb-2 ${
              isFocusMode ? "text-white" : "bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            }`}
          >
            🚀 Espace de Travail Créatif
          </h1>
          <p className={`text-lg ${isFocusMode ? "text-gray-300" : "text-gray-600"}`}>
            Choisissez votre tâche, lancez votre pomodoro, concentrez-vous !
          </p>
        </div>

        {!isFocusMode ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tasks Column */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl p-6 h-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Target className="w-7 h-7 text-purple-500" />
                    Mes Tâches du Jour
                  </h3>
                  <button
                    onClick={() => setIsAddingTask(true)}
                    disabled={loading}
                    className={`bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-md ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <Plus className="w-5 h-5" />
                    Nouvelle tâche
                  </button>
                </div>

                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-5 rounded-2xl border-2 transition-all ${
                        task.completed
                          ? "bg-green-50 border-green-200"
                          : currentTask?.id === task.id
                            ? "bg-purple-50 border-purple-300 ring-2 ring-purple-200"
                            : "bg-gray-50 border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <button 
                            onClick={() => toggleTask(task.id)} 
                            disabled={loading}
                            className="transition-all disabled:opacity-50"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="w-6 h-6 text-green-500" />
                            ) : (
                              <Circle className="w-6 h-6 text-gray-400 hover:text-purple-500" />
                            )}
                          </button>

                          <div className="flex-1">
                            <h4
                              className={`font-semibold text-lg ${
                                task.completed ? "line-through text-gray-500" : "text-gray-800"
                              }`}
                            >
                              {task.titre}
                            </h4>
                            <div className="flex items-center gap-4 mt-2">
                              {task.project && (
                                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                  📁 {task.project}
                                </span>
                              )}
                             
                              {task.timeSpent > 0 && (
                                <span className="text-sm text-purple-600 font-medium">
                                  🍅 {task.pomodoros} × {task.timeSpent}min
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => deleteTask(task.id)}
                            disabled={loading}
                            className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-all duration-300 disabled:opacity-50"
                            titre="Supprimer la tâche"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          {!task.completed && (
                            <button
                              onClick={() => startTaskPomodoro(task)}
                              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
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
                      <h4 className="text-xl font-bold text-gray-800 mb-2">Prêt à être productif ?</h4>
                      <p className="text-gray-600 mb-6">Ajoutez votre première tâche et lancez un pomodoro !</p>
                      <button
                        onClick={() => setIsAddingTask(true)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-2xl hover:shadow-lg transition-all duration-300 shadow-md"
                      >
                        Créer ma première tâche
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Configuration & Stats Column */}
            <div className="space-y-6">
              {/* Pomodoro Configuration */}
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <Clock className="w-6 h-6 text-purple-500" />
                  Pomodoro
                </h3>

                <div className="grid grid-cols-5 gap-2 mb-4">
                  {pomodoroOptions.map((minutes) => (
                    <button
                      key={minutes}
                      onClick={() => {
                        setPomodoroLength(minutes)
                        setTimeLeft(minutes * 60)
                        setIsRunning(false)
                      }}
                      className={`p-2 rounded-xl text-center transition-all shadow-sm ${
                        pomodoroLength === minutes
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <div className="font-bold text-sm">{minutes}</div>
                      <div className="text-xs">min</div>
                    </button>
                  ))}
                </div>

                <div className="text-center">
                  <div
                    className={`text-4xl font-mono font-bold mb-3 ${isBreak ? "text-green-500" : "text-purple-600"}`}
                  >
                    {formatTime(timeLeft)}
                  </div>

                  <div className="flex justify-center gap-3 mb-3">
                    <button
                      onClick={() => {
                        if (currentTask) {
                          setIsRunning(!isRunning)
                        } else {
                          setIsRunning(!isRunning)
                          setIsBreak(false)
                        }
                      }}
                      className={`px-6 py-2 rounded-2xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                        !currentTask
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : isRunning
                            ? "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-lg"
                            : "bg-gradient-to-r from-green-500 to-teal-500 text-white hover:shadow-lg"
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
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-center text-gray-600 text-sm">
                    <p className="mb-1">
                      {currentTask ? (
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium text-xs">
                          🎯{" "}
                          {currentTask.titre.length > 20
                            ? currentTask.titre.substring(0, 20) + "..."
                            : currentTask.titre}
                        </span>
                      ) : (
                        <span className="text-gray-500 text-xs">Sélectionnez une tâche</span>
                      )}
                    </p>
                    <p className="text-xs">
                      Cycles: <span className="font-bold text-purple-600">{cycles}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Audio Controls */}
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Music className="w-6 h-6 text-purple-500" />
                    Ambiance
                  </h3>
                  <button
                    onClick={() => setMusicEnabled(!musicEnabled)}
                    className={`p-2 rounded-lg transition-all ${
                      musicEnabled ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {musicEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(playlists).map(([key, playlist]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedPlaylist(key)}
                      className={`p-3 rounded-xl text-left transition-all shadow-sm ${
                        selectedPlaylist === key
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{playlist.icon}</span>
                        <span className="font-medium text-sm">{playlist.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Weekly History */}
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <Calendar className="w-6 h-6 text-purple-500" />
                  Cette Semaine
                </h3>

                <div className="space-y-3">
                  {weeklyHistory.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{day.day}</p>
                        <p className="text-xs text-gray-500">
                          {day.tasks} tâches • {day.pomodoros} 🍅
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-purple-600">{day.timeSpent}min</p>
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full mt-1">
                          <div
                            className="h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                            style={{
                              width: `${Math.min((day.timeSpent / 180) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl">
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Total cette semaine</p>
                    <div className="flex items-center justify-center gap-3">
                      <div>
                        <p className="text-lg font-bold text-purple-600">
                          {weeklyHistory.reduce((acc, day) => acc + day.timeSpent, 0)}
                          min
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-orange-500">
                          {weeklyHistory.reduce((acc, day) => acc + day.pomodoros, 0)} 🍅
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Focus Mode */
          <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center z-50">
            <div className="absolute top-6 right-6 flex gap-3">
              <button
                onClick={() => {
                  setTimeLeft(pomodoroLength * 60)
                  setIsRunning(false)
                  setIsBreak(false)
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
              <button
                onClick={() => setIsFocusMode(false)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
              >
                <Minimize2 className="w-5 h-5" />
                Quitter
              </button>
            </div>

            <div className="text-center text-white max-w-4xl px-6">
              <div className="mb-12">
                <div className={`text-8xl font-mono font-bold mb-8 ${isBreak ? "text-green-400" : "text-purple-400"}`}>
                  {formatTime(timeLeft)}
                </div>

                <div className="flex justify-center gap-6 mb-12">
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`px-12 py-6 rounded-3xl text-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
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
                  Pomodoro {pomodoroLength}min • Cycles complétés: {cycles}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Add Task Modal */}
        {isAddingTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Nouvelle Tâche</h2>
                <button
                  onClick={() => setIsAddingTask(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aujourd'hui je veux travailler sur... *
                  </label>
                  <input
                    type="text"
                    value={newTask.titre}
                    onChange={(e) => setNewTask((prev) => ({ ...prev, titre: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Ex: Créer la page d'accueil..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Projet associé (optionnel)</label>
                  <select
                    value={newTask.project}
                    onChange={(e) =>
                      setNewTask((prev) => ({
                        ...prev,
                        project: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Sélectionner un projet</option>
                    <option value="libre">🆓 Libre (sans projet spécifique)</option>
                    {availableProjects.map((project) => (
                      <option key={project.id} value={project.titre}>
                        📁 {project.titre}
                      </option>
                    ))}
                  </select>
                </div>

              
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setIsAddingTask(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={addTask}
                  disabled={loading}
                  className={`flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 ${
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