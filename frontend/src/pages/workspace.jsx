import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import api from '../api/api.jsx'; // Import de l'API

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
  const [error, setError] = useState(null);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState(null);
  const [autoSave, setAutoSave] = useState(true);

  // Projets/Dreams existants (simulation)
  const existingProjects = [
    "Application Mobile",
    "Site Web Portfolio",
    "Livre de Recettes",
    "Podcast Créatif",
    "Cours en Ligne",
    "Blog Personnel",
  ];

  const playlists = {
    chill: { name: "Musique Chill", icon: "🎵" },
    focus: { name: "Deep Focus", icon: "🧠" },
    nature: { name: "Sons de la Nature", icon: "🌿" },
    coffee: { name: "Café Jazz", icon: "☕" },
    rain: { name: "Pluie Relaxante", icon: "🌧️" },
  };

  const pomodoroOptions = [15, 25, 30, 45, 60];

  // Fonction pour charger les données du workspace
  const loadWorkspaceData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Récupérer les workspaces de l'utilisateur
      const workspacesResponse = await api.get('/workspaces');
   const workspaces = workspacesResponse.data.data || workspacesResponse.data;
      
      // Si il y a des workspaces, prendre le premier ou créer un nouveau
      let workspaceId;
      if (workspaces.length > 0) {
        workspaceId = workspaces[0].id;
        setCurrentWorkspaceId(workspaceId);
        
        // Charger les détails du workspace
        const workspaceResponse = await api.get(`/workspaces/${workspaceId}`);
        const workspaceData = workspaceResponse.data;
        
        // Charger les données sauvegardées
        if (workspaceData.data) {
          const savedData = JSON.parse(workspaceData.data);
          setTasks(savedData.tasks || []);
          setCycles(savedData.cycles || 0);
          setMusicEnabled(savedData.musicEnabled || false);
          setSelectedPlaylist(savedData.selectedPlaylist || "chill");
          setPomodoroLength(savedData.pomodoroLength || 25);
        }
      } else {
        // Créer un nouveau workspace
        await createNewWorkspace();
      }

      // Charger les statistiques
      await loadStats();
      
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour créer un nouveau workspace
  const createNewWorkspace = async () => {
    try {
      const response = await api.post('/workspaces', {
        name: `Workspace ${new Date().toLocaleDateString()}`,
        description: 'Espace de travail pomodoro',
        data: JSON.stringify({
          tasks: [],
          cycles: 0,
          musicEnabled: false,
          selectedPlaylist: "chill",
          pomodoroLength: 25
        })
      });
      
      setCurrentWorkspaceId(response.data.id);
      return response.data.id;
    } catch (err) {
      console.error('Erreur lors de la création du workspace:', err);
      setError('Erreur lors de la création du workspace');
    }
  };

  // Fonction pour sauvegarder les données
/* const saveWorkspaceData = async () => {
    if (!currentWorkspaceId || !autoSave) return;
    
    try {
      const dataToSave = {
        tasks,
        cycles,
        musicEnabled,
        selectedPlaylist,
        pomodoroLength,
        lastUpdated: new Date().toISOString()
      };

      await api.put(`/workspaces/${currentWorkspaceId}`, {
        data: JSON.stringify(dataToSave)
      });
      
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError('Erreur lors de la sauvegarde');
    }
  };*/

  // Fonction pour charger les statistiques
  const loadStats = async () => {
    try {
      const response = await api.get('/workspaces/stats');
      setWorkspaceStats(response.data);
      
      // Simuler l'historique hebdomadaire (à remplacer par de vraies données)
      const mockHistory = [
        { day: "Lundi", tasks: 3, timeSpent: 120, pomodoros: 5 },
        { day: "Mardi", tasks: 2, timeSpent: 95, pomodoros: 4 },
        { day: "Mercredi", tasks: 4, timeSpent: 150, pomodoros: 6 },
        { day: "Jeudi", tasks: 1, timeSpent: 45, pomodoros: 2 },
        { day: "Vendredi", tasks: 3, timeSpent: 110, pomodoros: 4 },
        { day: "Samedi", tasks: 2, timeSpent: 80, pomodoros: 3 },
        { day: "Dimanche", tasks: 1, timeSpent: 30, pomodoros: 1 },
      ];
      setWeeklyHistory(mockHistory);
    } catch (err) {
      console.error('Erreur lors du chargement des stats:', err);
    }
  };

  // Effet pour charger les données au montage
  useEffect(() => {
    loadWorkspaceData();
  }, []);

  // Effet pour sauvegarder automatiquement les changements
  useEffect(() => {
    if (currentWorkspaceId) {
      const saveTimer = setTimeout(() => {
        saveWorkspaceData();
      }, 2000); // Sauvegarde après 2 secondes d'inactivité

      return () => clearTimeout(saveTimer);
    }
  }, [tasks, cycles, musicEnabled, selectedPlaylist, pomodoroLength, currentWorkspaceId]);

  // Effet pour le minuteur
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

  // Effet pour gérer la touche Échap en mode focus
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape' && isFocusMode) {
        setIsFocusMode(false);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isFocusMode]);

  // Formatage du temps
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Gestion des tâches
  const addTask = async () => {
    if (!newTask.title.trim()) return;

    const task = {
      id: Date.now(),
      ...newTask,
      completed: false,
      createdAt: new Date(),
      timeSpent: 0,
      pomodoros: 0,
    };

    setTasks((prev) => [task, ...prev]);
    setNewTask({ title: "", project: "", priority: "medium" });
    setIsAddingTask(false);
  };

  const toggleTask = (id) => {
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
    );
  };

  const startTaskPomodoro = (task) => {
    setCurrentTask(task);
    setTimeLeft(pomodoroLength * 60);
    setIsBreak(false);
    setIsRunning(true);
    setIsFocusMode(true);
  };

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

  // Fonction pour sauvegarder manuellement
  const handleManualSave = async () => {
    setLoading(true);
    await saveWorkspaceData();
    setLoading(false);
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

  if (loading && !currentWorkspaceId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement de votre espace de travail...</p>
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
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleManualSave}
                disabled={loading}
                className={`p-3 rounded-2xl transition-all duration-300 ${
                  isFocusMode
                    ? "bg-white bg-opacity-20 text-white hover:bg-opacity-30"
                    : "bg-white shadow-lg text-gray-700 hover:shadow-xl"
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <Loader className="w-6 h-6 animate-spin" />
                ) : (
                  <Save className="w-6 h-6" />
                )}
              </button>
              
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
                  className={`text-sm ${isFocusMode ? 'text-white' : 'text-gray-600'}`}
                >
                  Auto-sauvegarde
                </label>
              </div>
            </div>
            
            <button
              onClick={() => setIsFocusMode(!isFocusMode)}
              className={`p-3 rounded-2xl transition-all duration-300 ${
                isFocusMode
                  ? "bg-white bg-opacity-20 text-white hover:bg-opacity-30"
                  : "bg-white shadow-lg text-gray-700 hover:shadow-xl"
              }`}
            >
              {isFocusMode ? (
                <Minimize2 className="w-6 h-6" />
              ) : (
                <Maximize2 className="w-6 h-6" />
              )}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-2xl flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
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

                        {!task.completed && (
                          <button
                            onClick={() => startTaskPomodoro(task)}
                            className="ml-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                          >
                            <Play className="w-4 h-4" />
                            Start
                          </button>
                        )}
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
                      onClick={() => {
                        if (currentTask) {
                          setIsRunning(!isRunning);
                        } else {
                          setIsRunning(!isRunning);
                          setIsBreak(false);
                        }
                      }}
                      className={`px-6 py-2 rounded-2xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                        !currentTask 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : isRunning 
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-lg' 
                          : 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:shadow-lg'
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
                        <span className="text-gray-500 text-xs">Sélectionnez une tâche</span>
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
                  {isBreak ? '☕ Pause bien méritée !' : `🎯 Focus sur: ${currentTask?.title}`}
                </p>
                {selectedPlaylist && musicEnabled && (
                  <p className="text-lg opacity-70">
                    🎵 {playlists[selectedPlaylist].name} en cours...
                  </p>
                )}
              </div>

              <div className="text-center text-sm opacity-60">
                <p>Pomodoro {pomodoroLength}min • Cycles complétés: {cycles}</p>
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

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aujourd'hui je veux travailler sur... *
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Ex: Créer la page d'accueil..."
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
                    {existingProjects.map((project, index) => (
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
                  onClick={() => setIsAddingTask(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={addTask}
                  disabled={loading}
                  className={`flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Création...' : 'Créer la tâche'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspacePage;