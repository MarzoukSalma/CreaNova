"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../api/api";

const WorkspacePage = () => {
  // Pomodoro timer state
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [pomodoroLength, setPomodoroLength] = useState(25);

  // Tasks state
  const [currentTask, setCurrentTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    titre: "",
    project: "",
  });

  // UI state
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState("chill");

  // Statistics state
  const [weeklyHistory, setWeeklyHistory] = useState([]);

  // API state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableProjects, setAvailableProjects] = useState([]);

  const playlists = {
    chill: { name: "Musique Chill", icon: "🎵" },
    focus: { name: "Deep Focus", icon: "🧠" },
    nature: { name: "Sons de la Nature", icon: "🌿" },
    coffee: { name: "Café Jazz", icon: "☕" },
    rain: { name: "Pluie Relaxante", icon: "🌧️" },
  };

  const pomodoroOptions = [15, 25, 30, 45, 60];

  // Load initial data
  const loadInitialData = async () => {
    setLoading(true);
    setError(null);

    try {
      setWeeklyHistory(generateMockHistory());
      await loadAvailableProjects();
      await loadTasks();
    } catch (err) {
      setError("Erreur lors du chargement des données");
      console.error("Error loading initial data:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateMockHistory = () => [
    { day: "Lundi", tasks: 3, timeSpent: 120, pomodoros: 5 },
    { day: "Mardi", tasks: 2, timeSpent: 95, pomodoros: 4 },
    { day: "Mercredi", tasks: 4, timeSpent: 150, pomodoros: 6 },
    { day: "Jeudi", tasks: 1, timeSpent: 45, pomodoros: 2 },
    { day: "Vendredi", tasks: 3, timeSpent: 110, pomodoros: 4 },
    { day: "Samedi", tasks: 2, timeSpent: 80, pomodoros: 3 },
    { day: "Dimanche", tasks: 1, timeSpent: 30, pomodoros: 1 },
  ];

  const loadAvailableProjects = async () => {
    try {
      const response = await api.get("/dreams");
      const dreams = response?.data || [];
      const projectOptions = dreams
        .slice()
        .reverse()
        .map((dream) => ({
          id: dream.id,
          titre: dream.titre || dream.title || "Projet sans titre",
        }));
      setAvailableProjects(projectOptions);
    } catch (err) {
      console.warn("Could not load available projects:", err);
      setAvailableProjects([]);
    }
  };

  const loadTasks = async () => {
    try {
      const response = await api.get("/workspaces");
      if (response.error) {
        console.error("Error loading tasks:", response.error);
        return;
      }
      const workspaces = response?.data || [];
      const formattedTasks = workspaces
        .slice()
        .reverse()
        .map((workspace) => ({
          id: workspace.id,
          titre: workspace.titre,
          project: workspace.accorder || "",
          completed: workspace.completed || false,
          completedAt: workspace.completedAt
            ? new Date(workspace.completedAt)
            : null,
          timeSpent: workspace.timeSpent || 0,
          pomodoros: workspace.pomodoros || 0,
        }));
      setTasks(formattedTasks);
    } catch (err) {
      console.error("Error loading tasks:", err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (isBreak) {
        setTimeLeft(pomodoroLength * 60);
        setIsBreak(false);
      } else {
        setTimeLeft(5 * 60);
        setIsBreak(true);
        setCycles((prev) => prev + 1);
        if (currentTask) {
          updateTaskTime(currentTask.id, pomodoroLength);
        }
      }
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak, pomodoroLength, currentTask]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Escape" && isFocusMode) {
        setIsFocusMode(false);
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [isFocusMode]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const addTask = async () => {
    if (!newTask.titre.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const taskData = {
        titre: newTask.titre,
        accorder: newTask.project,
        completed: false,
        dateCreation: new Date().toISOString(),
      };
      const response = await api.post("/workspaces", taskData);
      if (response.error) {
        setError("Erreur lors de la création de la tâche");
        console.error("Error creating task:", response.error);
        return;
      }
      const createdTask = {
        id: response.data?.id || Date.now(),
        ...taskData,
        dateCreation: new Date(taskData.createdAt),
      };
      setTasks((prev) => [createdTask, ...prev]);
      setNewTask({ titre: "", project: "" });
      setIsAddingTask(false);
    } catch (err) {
      setError("Erreur lors de la création de la tâche");
      console.error("Error creating task:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    setLoading(true);
    setError(null);
    try {
      const updatedTaskData = {
        ...task,
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null,
      };
      const response = await api.put(`/workspaces/${id}`, updatedTaskData);
      if (response.error) {
        setError("Erreur lors de la mise à jour de la tâche");
        console.error("Error updating task:", response.error);
        return;
      }
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
      );
    } catch (err) {
      setError("Erreur lors de la mise à jour de la tâche");
      console.error("Error updating task:", err);
    } finally {
      setLoading(false);
    }
  };

  const startTaskPomodoro = (task) => {
    setCurrentTask(task);
    setTimeLeft(pomodoroLength * 60);
    setIsBreak(false);
    setIsRunning(true);
    setIsFocusMode(true);
  };

  const updateTaskTime = async (taskId, minutes) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    try {
      const updatedTaskData = {
        ...task,
        timeSpent: (task.timeSpent || 0) + minutes,
        pomodoros: (task.pomodoros || 0) + 1,
      };
      const response = await api.put(`/workspaces/${taskId}`, updatedTaskData);
      if (!response.error) {
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
        );
      }
    } catch (err) {
      console.error("Error updating task time:", err);
    }
  };

  const deleteTask = async (taskId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/workspaces/${taskId}`);
      if (response.error) {
        setError("Erreur lors de la suppression de la tâche");
        console.error("Error deleting task:", response.error);
        return;
      }
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      if (currentTask?.id === taskId) {
        setCurrentTask(null);
        setIsRunning(false);
        setTimeLeft(pomodoroLength * 60);
      }
    } catch (err) {
      setError("Erreur lors de la suppression de la tâche");
      console.error("Error deleting task:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="min-h-screen bg-[#080c1a] flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-400">
            Chargement de votre espace de travail...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isFocusMode
          ? "bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900"
          : "bg-[#080c1a] text-slate-300"
      }`}
    >
      {/* Background blobs (only in normal mode) */}
      {!isFocusMode && (
        <>
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute top-[-18%] left-[-12%] w-[50%] h-[50%] bg-blue-900/12 blur-[150px] rounded-full" />
            <div className="absolute bottom-[-18%] right-[-12%] w-[45%] h-[45%] bg-violet-900/10 blur-[150px] rounded-full" />
            <div className="absolute top-[40%] right-[10%] w-[25%] h-[25%] bg-pink-900/8 blur-[120px] rounded-full" />
          </div>

          {/* Floating particles */}
          <div className="fixed inset-0 pointer-events-none z-0">
            {[...Array(20)].map((_, i) => (
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
        </>
      )}

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3" />
            <button
              onClick={() => setIsFocusMode(!isFocusMode)}
              className={`p-3 rounded-2xl transition-all duration-300 ${
                isFocusMode
                  ? "bg-white bg-opacity-20 text-white hover:bg-opacity-30"
                  : "bg-[#0a0e1a] border border-[#1e2540] text-slate-300 hover:border-blue-500/50"
              }`}
              title={isFocusMode ? "Quitter le mode focus" : "Mode focus"}
            >
              {isFocusMode ? (
                <Minimize2 className="w-6 h-6" />
              ) : (
                <Maximize2 className="w-6 h-6" />
              )}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-[10px] uppercase tracking-[0.3em] mb-4">
              <span>🚀</span>
              <span>Espace de Travail</span>
            </div>
            <h1
              className={`text-4xl md:text-5xl font-extralight tracking-tight mb-2 ${
                isFocusMode ? "text-white" : "text-white"
              }`}
            >
              Espace de{" "}
              <span className="font-serif italic text-violet-400">Travail</span>
            </h1>
            <p
              className={`text-sm ${isFocusMode ? "text-gray-300" : "text-slate-400"}`}
            >
              Choisissez votre tâche, lancez votre pomodoro, concentrez-vous !
            </p>
          </motion.div>
        </div>

        {!isFocusMode ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tasks Column */}
            <div className="lg:col-span-2">
              <div className="bg-[#0a0e1a] border border-[#1e2540] rounded-3xl p-6 h-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-light text-white flex items-center gap-2">
                    <Target className="w-7 h-7 text-violet-400" />
                    Mes Tâches du Jour
                  </h3>
                  <button
                    onClick={() => setIsAddingTask(true)}
                    disabled={loading}
                    className={`bg-gradient-to-r from-blue-600 to-violet-600 text-white px-6 py-3 rounded-2xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 flex items-center gap-2 ${
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
                      className={`p-5 rounded-2xl border transition-all ${
                        task.completed
                          ? "bg-emerald-500/10 border-emerald-500/30"
                          : currentTask?.id === task.id
                            ? "bg-violet-500/10 border-violet-500/40 ring-2 ring-violet-500/20"
                            : "bg-[#0f1323] border-[#1e2540] hover:border-blue-500/30"
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
                              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                            ) : (
                              <Circle className="w-6 h-6 text-slate-500 hover:text-violet-400" />
                            )}
                          </button>

                          <div className="flex-1">
                            <h4
                              className={`font-medium text-lg ${
                                task.completed
                                  ? "line-through text-slate-500"
                                  : "text-white"
                              }`}
                            >
                              {task.titre}
                            </h4>
                            <div className="flex items-center gap-4 mt-2">
                              {task.project && (
                                <span className="text-xs text-slate-400 bg-[#1a1f35] px-3 py-1 rounded-full">
                                  📁 {task.project}
                                </span>
                              )}
                              {task.timeSpent > 0 && (
                                <span className="text-xs text-violet-400 font-medium">
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
                            className="p-2 text-slate-500 hover:text-red-400 rounded-xl hover:bg-red-500/10 transition-all duration-300 disabled:opacity-50"
                            title="Supprimer la tâche"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          {!task.completed && (
                            <button
                              onClick={() => startTaskPomodoro(task)}
                              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-2xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 flex items-center gap-2"
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
                      <h4 className="text-xl font-light text-white mb-2">
                        Prêt à être productif ?
                      </h4>
                      <p className="text-slate-400 mb-6 text-sm">
                        Ajoutez votre première tâche et lancez un pomodoro !
                      </p>
                      <button
                        onClick={() => setIsAddingTask(true)}
                        className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-8 py-3 rounded-2xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
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
              <div className="bg-[#0a0e1a] border border-[#1e2540] rounded-3xl p-6">
                <h3 className="text-xl font-light text-white flex items-center gap-2 mb-4">
                  <Clock className="w-6 h-6 text-violet-400" />
                  Pomodoro
                </h3>

                <div className="grid grid-cols-5 gap-2 mb-4">
                  {pomodoroOptions.map((minutes) => (
                    <button
                      key={minutes}
                      onClick={() => {
                        setPomodoroLength(minutes);
                        setTimeLeft(minutes * 60);
                        setIsRunning(false);
                      }}
                      className={`p-2 rounded-xl text-center transition-all ${
                        pomodoroLength === minutes
                          ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20"
                          : "bg-[#0f1323] border border-[#1e2540] text-slate-400 hover:border-blue-500/30"
                      }`}
                    >
                      <div className="font-bold text-sm">{minutes}</div>
                      <div className="text-xs">min</div>
                    </button>
                  ))}
                </div>

                <div className="text-center">
                  <div
                    className={`text-4xl font-mono font-bold mb-3 ${isBreak ? "text-emerald-400" : "text-violet-400"}`}
                  >
                    {formatTime(timeLeft)}
                  </div>

                  <div className="flex justify-center gap-3 mb-3">
                    <button
                      onClick={() => {
                        if (currentTask) {
                          setIsRunning(!isRunning);
                        } else {
                          setIsRunning(!isRunning);
                          setIsBreak(false);
                        }
                      }}
                      className={`px-6 py-2 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                        !currentTask
                          ? "bg-[#1a1f35] text-slate-600 cursor-not-allowed"
                          : isRunning
                            ? "bg-gradient-to-r from-red-600 to-pink-600 text-white hover:shadow-lg hover:shadow-red-500/20"
                            : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-lg hover:shadow-emerald-500/20"
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
                        setTimeLeft(pomodoroLength * 60);
                        setIsRunning(false);
                        setIsBreak(false);
                      }}
                      className="px-3 py-2 bg-[#0f1323] border border-[#1e2540] text-slate-400 rounded-2xl hover:border-blue-500/30 transition-all"
                      title="Reset minuteur"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-center text-slate-400 text-sm">
                    <p className="mb-1">
                      {currentTask ? (
                        <span className="bg-violet-500/10 border border-violet-500/30 text-violet-400 px-3 py-1 rounded-full font-medium text-xs">
                          🎯{" "}
                          {currentTask.titre.length > 20
                            ? currentTask.titre.substring(0, 20) + "..."
                            : currentTask.titre}
                        </span>
                      ) : (
                        <span className="text-slate-600 text-xs">
                          Sélectionnez une tâche
                        </span>
                      )}
                    </p>
                    <p className="text-xs">
                      Cycles:{" "}
                      <span className="font-bold text-violet-400">
                        {cycles}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Audio Controls */}
              <div className="bg-[#0a0e1a] border border-[#1e2540] rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-light text-white flex items-center gap-2">
                    <Music className="w-6 h-6 text-violet-400" />
                    Ambiance
                  </h3>
                  <button
                    onClick={() => setMusicEnabled(!musicEnabled)}
                    className={`p-2 rounded-lg transition-all ${
                      musicEnabled
                        ? "bg-violet-500/20 text-violet-400"
                        : "bg-[#0f1323] text-slate-500"
                    }`}
                  >
                    {musicEnabled ? (
                      <Volume2 className="w-4 h-4" />
                    ) : (
                      <VolumeX className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(playlists).map(([key, playlist]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedPlaylist(key)}
                      className={`p-3 rounded-xl text-left transition-all ${
                        selectedPlaylist === key
                          ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20"
                          : "bg-[#0f1323] border border-[#1e2540] text-slate-400 hover:border-blue-500/30"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{playlist.icon}</span>
                        <span className="font-medium text-sm">
                          {playlist.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Weekly History */}
              <div className="bg-[#0a0e1a] border border-[#1e2540] rounded-3xl p-6">
                <h3 className="text-xl font-light text-white flex items-center gap-2 mb-4">
                  <Calendar className="w-6 h-6 text-violet-400" />
                  Cette Semaine
                </h3>

                <div className="space-y-3">
                  {weeklyHistory.map((day, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-[#0f1323] rounded-2xl"
                    >
                      <div>
                        <p className="font-medium text-white text-sm">
                          {day.day}
                        </p>
                        <p className="text-xs text-slate-500">
                          {day.tasks} tâches • {day.pomodoros} 🍅
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-violet-400">
                          {day.timeSpent}min
                        </p>
                        <div className="w-12 h-1.5 bg-[#1a1f35] rounded-full mt-1">
                          <div
                            className="h-1.5 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
                            style={{
                              width: `${Math.min((day.timeSpent / 180) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-gradient-to-r from-violet-500/10 to-pink-500/10 border border-violet-500/20 rounded-2xl">
                  <div className="text-center">
                    <p className="text-xs text-slate-500 mb-1">
                      Total cette semaine
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <div>
                        <p className="text-lg font-bold text-violet-400">
                          {weeklyHistory.reduce(
                            (acc, day) => acc + day.timeSpent,
                            0,
                          )}
                          min
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-orange-400">
                          {weeklyHistory.reduce(
                            (acc, day) => acc + day.pomodoros,
                            0,
                          )}{" "}
                          🍅
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
                  setTimeLeft(pomodoroLength * 60);
                  setIsRunning(false);
                  setIsBreak(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
              <button
                onClick={() => setIsFocusMode(false)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                <Minimize2 className="w-5 h-5" />
                Quitter
              </button>
            </div>

            <div className="text-center text-white max-w-4xl px-6">
              <div className="mb-12">
                <div
                  className={`text-8xl font-mono font-bold mb-8 ${isBreak ? "text-emerald-400" : "text-violet-400"}`}
                >
                  {formatTime(timeLeft)}
                </div>

                <div className="flex justify-center gap-6 mb-12">
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`px-12 py-6 rounded-3xl text-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      isRunning
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-emerald-600 hover:bg-emerald-700"
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
                <p className="text-3xl mb-6 font-light">
                  {isBreak
                    ? "☕ Pause bien méritée !"
                    : `🎯 Focus sur: ${currentTask?.titre}`}
                </p>
                {selectedPlaylist && musicEnabled && (
                  <p className="text-lg opacity-70">
                    🎵 {playlists[selectedPlaylist].name} en cours...
                  </p>
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
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-[#0f1323] border border-[#1e2540] rounded-3xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-light text-white">
                  Nouvelle Tâche
                </h2>
                <button
                  onClick={() => setIsAddingTask(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-light text-slate-400 mb-2 uppercase tracking-wider">
                    Aujourd'hui je veux travailler sur... *
                  </label>
                  <input
                    type="text"
                    value={newTask.titre}
                    onChange={(e) =>
                      setNewTask((prev) => ({ ...prev, titre: e.target.value }))
                    }
                    className="w-full px-4 py-3 bg-[#0a0e1a] border border-[#1e2540] rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    placeholder="Ex: Créer la page d'accueil..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-slate-400 mb-2 uppercase tracking-wider">
                    Projet associé (optionnel)
                  </label>
                  <select
                    value={newTask.project}
                    onChange={(e) =>
                      setNewTask((prev) => ({
                        ...prev,
                        project: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 bg-[#0a0e1a] border border-[#1e2540] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                  >
                    <option value="" className="bg-[#0f1323]">
                      Sélectionner un projet
                    </option>
                    <option value="libre" className="bg-[#0f1323]">
                      🆓 Libre (sans projet spécifique)
                    </option>
                    {availableProjects.map((project) => (
                      <option
                        key={project.id}
                        value={project.titre}
                        className="bg-[#0f1323]"
                      >
                        📁 {project.titre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setIsAddingTask(false)}
                  className="flex-1 px-6 py-3 border border-[#1e2540] text-slate-300 rounded-xl hover:border-slate-600 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={addTask}
                  disabled={loading}
                  className={`flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Création..." : "Créer la tâche"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspacePage;
