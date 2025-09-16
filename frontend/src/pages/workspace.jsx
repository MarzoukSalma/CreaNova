import React, { useState, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  X,
  Check,
  Clock,
  Target,
  Music,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Circle,
  Loader,
  Save,
  AlertCircle,
  Trash2,
} from "lucide-react";
import api from "../api/api.jsx";

const WorkspacePage = () => {
  // État pour le minuteur Pomodoro
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [pomodoroLength, setPomodoroLength] = useState(25);

  // État pour les tâches
  const [currentTask, setCurrentTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    project: "",
    priority: "medium",
  });

  // État pour l'interface
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState("chill");

  // État pour l'historique et statistiques
  const [weeklyHistory, setWeeklyHistory] = useState([]);
  const [workspaceStats, setWorkspaceStats] = useState(null);

  // État pour l'API
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState(null);
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);

  // Projets/Dreams existan
  const dreamslist = async (userId) => {
    if (!userId) {
      console.log("userid makayenxi");

      return [];
    }
    try {
      const existingProjects = await api.get("/dreams");
      return existingProjects.data || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des projets:", error);
      return [];
    }
  };
  const playlists = {
    chill: { name: "Musique Chill", icon: "🎵" },
    focus: { name: "Deep Focus", icon: "🧠" },
    nature: { name: "Sons de la Nature", icon: "🌿" },
    coffee: { name: "Café Jazz", icon: "☕" },
    rain: { name: "Pluie Relaxante", icon: "🌧️" },
  };

  const pomodoroOptions = [15, 25, 30, 45, 60];

  // ========== FONCTIONS BACKEND ==========

  // Créer un nouveau workspace
  const createNewWorkspace = async () => {
    try {
      const response = await api.post("/workspaces", {
        name: `Workspace ${new Date().toLocaleDateString()}`,
        description: "Mon espace de travail créatif",
        data: JSON.stringify({
          tasks: [],
          cycles: 0,
          musicEnabled: false,
          selectedPlaylist: "chill",
          pomodoroLength: 25,
          createdAt: new Date().toISOString(),
        }),
      });

      const newWorkspace = response.data.data || response.data;
      setCurrentWorkspaceId(newWorkspace.id);
      return newWorkspace;
    } catch (err) {
      console.error("Erreur création workspace:", err);
      throw err;
    }
  };

  // Charger les statistiques
  const loadStats = async () => {
    try {
      const response = await api.get("/stats/weekly");
      const stats = response.data;

      if (stats.data) {
        setWeeklyHistory(stats.data.weeklyHistory || []);
        setWorkspaceStats(stats.data);
      }
    } catch (err) {
      console.warn("Impossible de charger les statistiques:", err);
      // Générer des données de demo si l'API stats n'existe pas
      setWeeklyHistory([
        { day: "Lun", tasks: 3, pomodoros: 6, timeSpent: 150 },
        { day: "Mar", tasks: 2, pomodoros: 4, timeSpent: 100 },
        { day: "Mer", tasks: 4, pomodoros: 8, timeSpent: 200 },
        { day: "Jeu", tasks: 1, pomodoros: 2, timeSpent: 50 },
        { day: "Ven", tasks: 5, pomodoros: 10, timeSpent: 250 },
        { day: "Sam", tasks: 2, pomodoros: 3, timeSpent: 75 },
        { day: "Dim", tasks: 1, pomodoros: 1, timeSpent: 25 },
      ]);
    }
  };

  // Fonction principale de chargement des données
  const loadWorkspaceData = useCallback(async () => {
    if (loading) return; // Éviter les appels multiples

    setLoading(true);
    setError(null);

    try {
      // 1. Récupérer les workspaces existants
      const workspacesResponse = await api.get("/workspaces/");
      const workspaces =
        workspacesResponse.data.data || workspacesResponse.data;

      let workspaceId;
      let workspaceData = null;

      if (Array.isArray(workspaces) && workspaces.length > 0) {
        // Prendre le dernier workspace (le plus récent)
        const latestWorkspace = workspaces.sort(
          (a, b) =>
            new Date(b.created_at || b.createdAt) -
            new Date(a.created_at || a.createdAt)
        )[0];

        workspaceId = latestWorkspace.id;
        setCurrentWorkspaceId(workspaceId);

        // 2. Charger les données du workspace
        const workspaceResponse = await api.get(`/workspaces/${workspaceId}`);
        workspaceData = workspaceResponse.data.data || workspaceResponse.data;
      } else {
        // 3. Créer un nouveau workspace si aucun n'existe
        const newWorkspace = await createNewWorkspace();
        workspaceId = newWorkspace.id;
        workspaceData = newWorkspace;
      }

      // 4. Appliquer les données du workspace
      if (workspaceData && workspaceData.data) {
        try {
          const savedData =
            typeof workspaceData.data === "string"
              ? JSON.parse(workspaceData.data)
              : workspaceData.data;

          console.log("Données chargées:", savedData);

          // Restaurer l'état depuis les données sauvegardées
          setTasks(Array.isArray(savedData.tasks) ? savedData.tasks : []);
          setCycles(savedData.cycles || 0);
          setMusicEnabled(savedData.musicEnabled || false);
          setSelectedPlaylist(savedData.selectedPlaylist || "chill");
          setPomodoroLength(savedData.pomodoroLength || 25);
          setTimeLeft((savedData.pomodoroLength || 25) * 60);

          setLastSaved(new Date(savedData.lastUpdated || Date.now()));
        } catch (parseError) {
          console.warn("Erreur parsing données workspace:", parseError);
          // Utiliser des valeurs par défaut si le parsing échoue
          setTasks([]);
        }
      }

      // 5. Charger les statistiques
      await loadStats();
    } catch (err) {
      console.error("Erreur lors du chargement:", err);
      setError(
        `Erreur de chargement: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // Sauvegarder les données dans le workspace
  const saveWorkspaceData = useCallback(
    async (force = false) => {
      if (!currentWorkspaceId || (!autoSave && !force) || saving) return;

      setSaving(true);
      try {
        const dataToSave = {
          tasks,
          cycles,
          musicEnabled,
          selectedPlaylist,
          pomodoroLength,
          lastUpdated: new Date().toISOString(),
        };

        console.log("Sauvegarde des données:", dataToSave);

        await api.put(`/workspaces/${currentWorkspaceId}`, {
          data: JSON.stringify(dataToSave),
        });

        setLastSaved(new Date());
        setError(null);
      } catch (err) {
        console.error("Erreur lors de la sauvegarde:", err);
        setError(
          `Erreur de sauvegarde: ${err.response?.data?.message || err.message}`
        );
      } finally {
        setSaving(false);
      }
    },
    [
      currentWorkspaceId,
      tasks,
      cycles,
      musicEnabled,
      selectedPlaylist,
      pomodoroLength,
      autoSave,
      saving,
    ]
  );

  // ========== GESTION DES TÂCHES ==========

  // Ajouter une nouvelle tâche
  const addTask = async () => {
    if (!newTask.title.trim()) return;

    const task = {
      id: Date.now(),
      title: newTask.title.trim(),
      project: newTask.project,
      priority: newTask.priority,
      completed: false,
      createdAt: new Date().toISOString(),
      timeSpent: 0,
      pomodoros: 0,
    };

    setTasks((prev) => [task, ...prev]);
    setNewTask({ title: "", project: "", priority: "medium" });
    setIsAddingTask(false);

    // Envoyer au backend
    try {
      await api.post(`/`, task); // <-- ici, la route vers ton backend
    } catch (err) {
      console.error("Erreur lors de l'envoi de la tâche au backend:", err);
    }

    // Sauvegarde locale
    setTimeout(() => saveWorkspaceData(true), 100);
  };

  // Basculer l'état d'une tâche
  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date().toISOString() : null,
            }
          : task
      )
    );
  };

  // Supprimer une tâche
  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    if (currentTask?.id === id) {
      setCurrentTask(null);
      setIsRunning(false);
    }
  };

  // Démarrer un pomodoro pour une tâche
  const startTaskPomodoro = (task) => {
    setCurrentTask(task);
    setTimeLeft(pomodoroLength * 60);
    setIsBreak(false);
    setIsRunning(true);
    setIsFocusMode(true);
  };

  // Mettre à jour le temps passé sur une tâche
  const updateTaskTime = (taskId, minutes) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              timeSpent: task.timeSpent + minutes,
              pomodoros: task.pomodoros + 1,
            }
          : task
      )
    );
  };

  // ========== EFFETS ==========

  // Charger les données au montage
  useEffect(() => {
    loadWorkspaceData();
  }, [loadWorkspaceData]);

  // Auto-sauvegarde avec debounce
  useEffect(() => {
    if (currentWorkspaceId && autoSave) {
      const saveTimer = setTimeout(() => {
        saveWorkspaceData();
      }, 2000);

      return () => clearTimeout(saveTimer);
    }
  }, [
    tasks,
    cycles,
    musicEnabled,
    selectedPlaylist,
    pomodoroLength,
    currentWorkspaceId,
    saveWorkspaceData,
    autoSave,
  ]);

  // Gestion du minuteur Pomodoro
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Fin du minuteur
      if (isBreak) {
        // Fin de pause - retour au travail
        setTimeLeft(pomodoroLength * 60);
        setIsBreak(false);
      } else {
        // Fin de pomodoro - début de pause
        setTimeLeft(5 * 60);
        setIsBreak(true);
        setCycles((prev) => prev + 1);

        // Mettre à jour le temps de la tâche courante
        if (currentTask) {
          updateTaskTime(currentTask.id, pomodoroLength);
        }
      }
      setIsRunning(false);

      // Notification (si supporté)
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(isBreak ? "Pause terminée !" : "Pomodoro terminé !", {
          body: isBreak ? "Retour au travail !" : "Temps pour une pause !",
          icon: "/favicon.ico",
        });
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak, pomodoroLength, currentTask]);

  // Gestion de la touche Échap en mode focus
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Escape" && isFocusMode) {
        setIsFocusMode(false);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [isFocusMode]);

  // Demander la permission pour les notifications
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // ========== FONCTIONS UTILITAIRES ==========

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "from-red-400 to-red-600";
      case "medium":
        return "from-yellow-400 to-orange-500";
      case "low":
        return "from-green-400 to-green-600";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case "high":
        return "🔥 Urgent";
      case "medium":
        return "⚡ Important";
      case "low":
        return "🌱 Plus tard";
      default:
        return "📝 Normal";
    }
  };

  // Gestion de la sauvegarde manuelle
  const handleManualSave = () => {
    saveWorkspaceData(true);
  };

  // ========== RENDER ==========

  if (loading && !currentWorkspaceId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">
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
          : "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
      }`}
    >
      <div className="max-w-7xl mx-auto p-6">
        {/* Header avec contrôles de sauvegarde */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleManualSave}
                disabled={saving}
                className={`p-3 rounded-2xl transition-all duration-300 ${
                  isFocusMode
                    ? "bg-white bg-opacity-20 text-white hover:bg-opacity-30"
                    : "bg-white shadow-lg text-gray-700 hover:shadow-xl"
                } ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
                title="Sauvegarder maintenant"
              >
                {saving ? (
                  <Loader className="w-6 h-6 animate-spin" />
                ) : (
                  <Save className="w-6 h-6" />
                )}
              </button>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="autosave"
                    checked={autoSave}
                    onChange={(e) => setAutoSave(e.target.checked)}
                    className="rounded"
                  />
                  <label
                    htmlFor="autosave"
                    className={`text-sm ${
                      isFocusMode ? "text-white" : "text-gray-600"
                    }`}
                  >
                    Auto-sauvegarde
                  </label>
                </div>

                {lastSaved && (
                  <span
                    className={`text-xs ${
                      isFocusMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Dernière sauvegarde: {lastSaved.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsFocusMode(!isFocusMode)}
              className={`p-3 rounded-2xl transition-all duration-300 ${
                isFocusMode
                  ? "bg-white bg-opacity-20 text-white hover:bg-opacity-30"
                  : "bg-white shadow-lg text-gray-700 hover:shadow-xl"
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

          {/* Affichage des erreurs */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-2xl flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1 text-left">{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <h1
            className={`text-4xl font-bold mb-2 ${
              isFocusMode
                ? "text-white"
                : "bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            }`}
          >
            🚀 Espace de Travail Créatif
          </h1>
          <p
            className={`text-lg ${
              isFocusMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Choisissez votre tâche, lancez votre pomodoro, concentrez-vous !
          </p>
        </div>

        {!isFocusMode ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne 1 - Mes Tâches */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl p-6 h-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Target className="w-7 h-7 text-purple-500" />
                    Mes Tâches du Jour
                  </h3>
                  <button
                    onClick={() => setIsAddingTask(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
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
                            className="transition-all"
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
                                task.completed
                                  ? "line-through text-gray-500"
                                  : "text-gray-800"
                              }`}
                            >
                              {task.title}
                            </h4>
                            <div className="flex items-center gap-4 mt-2">
                              {task.project && (
                                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                  📁 {task.project}
                                </span>
                              )}
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded-full bg-gradient-to-r ${getPriorityColor(
                                  task.priority
                                )} text-white`}
                              >
                                {getPriorityText(task.priority)}
                              </span>
                              {task.timeSpent > 0 && (
                                <span className="text-sm text-purple-600 font-medium">
                                  🍅 {task.pomodoros} × {task.timeSpent}min
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {!task.completed && (
                            <button
                              onClick={() => startTaskPomodoro(task)}
                              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                            >
                              <Play className="w-4 h-4" />
                              Start
                            </button>
                          )}

                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                            title="Supprimer la tâche"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {tasks.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🎯</div>
                      <h4 className="text-xl font-bold text-gray-800 mb-2">
                        Prêt à être productif ?
                      </h4>
                      <p className="text-gray-600 mb-6">
                        Ajoutez votre première tâche et lancez un pomodoro !
                      </p>
                      <button
                        onClick={() => setIsAddingTask(true)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-2xl hover:shadow-lg transition-all duration-300"
                      >
                        Créer ma première tâche
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Colonne 2 - Configuration & Suivi */}
            <div className="space-y-6">
              {/* Configuration Pomodoro */}
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
                        setPomodoroLength(minutes);
                        setTimeLeft(minutes * 60);
                        setIsRunning(false);
                      }}
                      className={`p-2 rounded-xl text-center transition-all ${
                        pomodoroLength === minutes
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
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
                    className={`text-4xl font-mono font-bold mb-3 ${
                      isBreak ? "text-green-500" : "text-purple-600"
                    }`}
                  >
                    {formatTime(timeLeft)}
                  </div>

                  <div className="flex justify-center gap-3 mb-3">
                    <button
                      onClick={() => setIsRunning(!isRunning)}
                      disabled={!currentTask && !isRunning}
                      className={`px-6 py-2 rounded-2xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                        !currentTask && !isRunning
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
                        setTimeLeft(pomodoroLength * 60);
                        setIsRunning(false);
                        setIsBreak(false);
                      }}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-all"
                      title="Reset minuteur"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-center text-gray-600 text-sm">
                    <p className="mb-1">
                      {currentTask ? (
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium text-xs">
                          🎯{" "}
                          {currentTask.title.length > 20
                            ? currentTask.title.substring(0, 20) + "..."
                            : currentTask.title}
                        </span>
                      ) : (
                        <span className="text-gray-500 text-xs">
                          Sélectionnez une tâche
                        </span>
                      )}
                    </p>
                    <p className="text-xs">
                      Cycles:{" "}
                      <span className="font-bold text-purple-600">
                        {cycles}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Contrôles Audio */}
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Music className="w-6 h-6 text-purple-500" />
                    Ambiance
                  </h3>
                  <button
                    onClick={() => setMusicEnabled(!musicEnabled)}
                    className={`p-2 rounded-lg transition-all ${
                      musicEnabled
                        ? "bg-purple-100 text-purple-600"
                        : "bg-gray-100 text-gray-400"
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
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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

              {/* Historique Hebdomadaire */}
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <Calendar className="w-6 h-6 text-purple-500" />
                  Cette Semaine
                </h3>

                <div className="space-y-3">
                  {weeklyHistory.map((day, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl"
                    >
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">
                          {day.day}
                        </p>
                        <p className="text-xs text-gray-500">
                          {day.tasks} tâches • {day.pomodoros} 🍅
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-purple-600">
                          {day.timeSpent}min
                        </p>
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full mt-1">
                          <div
                            className="h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                            style={{
                              width: `${Math.min(
                                (day.timeSpent / 180) * 100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl">
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">
                      Total cette semaine
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <div>
                        <p className="text-lg font-bold text-purple-600">
                          {weeklyHistory.reduce(
                            (acc, day) => acc + day.timeSpent,
                            0
                          )}
                          min
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-orange-500">
                          {weeklyHistory.reduce(
                            (acc, day) => acc + day.pomodoros,
                            0
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
          /* Mode Focus Plein Écran */
          <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center z-50">
            {/* Boutons en haut à droite */}
            <div className="absolute top-6 right-6 flex gap-3">
              <button
                onClick={() => {
                  setTimeLeft(pomodoroLength * 60);
                  setIsRunning(false);
                  setIsBreak(false);
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
                <div
                  className={`text-8xl font-mono font-bold mb-8 ${
                    isBreak ? "text-green-400" : "text-purple-400"
                  }`}
                >
                  {formatTime(timeLeft)}
                </div>

                <div className="flex justify-center gap-6 mb-12">
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`px-12 py-6 rounded-3xl text-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      isRunning
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
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
                  {isBreak
                    ? "☕ Pause bien méritée !"
                    : currentTask
                    ? `🎯 Focus sur: ${currentTask.title}`
                    : "🎯 Choisissez une tâche pour commencer"}
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

        {/* Modal Nouvelle Tâche */}
        {isAddingTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Nouvelle Tâche
                </h2>
                <button
                  onClick={() => setIsAddingTask(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addTask();
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aujourd'hui je veux travailler sur... *
                    </label>
                    <input
                      type="text"
                      value={newWorkspace.title}
                      onChange={(e) =>
                        setnewWorkspace((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Ex: Créer la page d'accueil..."
                      autoFocus
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Sélectionner un projet</option>
                      {dreamslist().map((project, index) => (
                        <option key={index} value={project}>
                          {project}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Niveau de priorité
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["low", "medium", "high"].map((priority) => (
                        <button
                          key={priority}
                          type="button"
                          onClick={() =>
                            setNewTask((prev) => ({ ...prev, priority }))
                          }
                          className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                            newTask.priority === priority
                              ? `bg-gradient-to-r ${getPriorityColor(
                                  priority
                                )} text-white`
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {getPriorityText(priority)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsAddingTask(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={saving || !newTask.title.trim()}
                    className={`flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 ${
                      saving || !newTask.title.trim()
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {saving ? "Création..." : "Créer la tâche"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspacePage;
