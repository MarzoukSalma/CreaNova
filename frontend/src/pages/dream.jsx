import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Filter, TrendingUp, Clock, CheckCircle, AlertCircle, Edit, Trash2, PieChart, BarChart3 } from 'lucide-react';
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import Navbar  from '../components/navbar'; 

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data initialization
  useEffect(() => {
    const sampleProjects = [
      {
        id: 1,
        titre: "Roman fantastique",
        description: "Écrire un roman de fantasy sur un monde où la magie est alimentée par les émotions humaines.",
        dateCreation: new Date('2024-01-15'),
        statut: "En cours",
        priorite: "haute",
        progress: 65
      },
      {
        id: 2,
        titre: "Série de peintures abstraites",
        description: "Créer une série de 12 toiles abstraites représentant les 12 mois de l'année.",
        dateCreation: new Date('2024-02-20'),
        statut: "À faire",
        priorite: "moyenne",
        progress: 0
      },
      {
        id: 3,
        titre: "Podcast sur l'art contemporain",
        description: "Lancer un podcast hebdomadaire interviewant des artistes contemporains.",
        dateCreation: new Date('2024-01-10'),
        statut: "Terminé",
        priorite: "haute",
        progress: 100
      },
      {
        id: 4,
        titre: "Jardin de sculptures",
        description: "Aménager un espace dans mon jardin avec des sculptures en métal recyclé.",
        dateCreation: new Date('2024-03-01'),
        statut: "En cours",
        priorite: "faible",
        progress: 30
      },
      {
        id: 5,
        titre: "Album photo artistique",
        description: "Créer un livre photo avec mes meilleures œuvres photographiques de l'année.",
        dateCreation: new Date('2024-02-05'),
        statut: "À faire",
        priorite: "moyenne",
        progress: 10
      }
    ];
    setProjects(sampleProjects);
  }, []);

  // Get filtered projects
  const filteredProjects = projects.filter(project => {
    const statusMatch = !statusFilter || project.statut === statusFilter;
    const priorityMatch = !priorityFilter || project.priorite === priorityFilter;
    return statusMatch && priorityMatch;
  });

  // Statistics
  const stats = {
    total: projects.length,
    todo: projects.filter(p => p.statut === 'À faire').length,
    inProgress: projects.filter(p => p.statut === 'En cours').length,
    completed: projects.filter(p => p.statut === 'Terminé').length
  };

  // Data for charts
  const pieData = [
    { name: 'À faire', value: stats.todo, color: '#fbbf24' },
    { name: 'En cours', value: stats.inProgress, color: '#3b82f6' },
    { name: 'Terminé', value: stats.completed, color: '#10b981' }
  ];

  const progressData = projects.map(p => ({
    name: p.titre.length > 15 ? p.titre.substring(0, 15) + '...' : p.titre,
    progress: p.progress,
    priorite: p.priorite
  }));

  const monthlyData = [
    { month: 'Jan', projets: 2 },
    { month: 'Fév', projets: 3 },
    { month: 'Mar', projets: 1 },
    { month: 'Avr', projets: 0 },
    { month: 'Mai', projets: 0 },
    { month: 'Juin', projets: 0 }
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

  const saveProject = (projectData) => {
    if (editingProject) {
      setProjects(projects.map(p => 
        p.id === editingProject.id 
          ? { ...p, ...projectData }
          : p
      ));
    } else {
      const newProject = {
        id: Date.now(),
        dateCreation: new Date(),
        progress: 0,
        ...projectData
      };
      setProjects([...projects, newProject]);
    }
    closeModal();
  };

  const deleteProject = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const getStatusColor = (statut) => {
    switch(statut) {
      case 'À faire': return 'bg-yellow-100 text-yellow-800';
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Terminé': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priorite) => {
    switch(priorite) {
      case 'haute': return 'bg-red-100 text-red-800';
      case 'moyenne': return 'bg-yellow-100 text-yellow-800';
      case 'faible': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */} 
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            ✨ Les Rêves
          </h1>
          <p className="text-lg text-gray-600">Dashboard - Gestion des Projets Créatifs</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <TrendingUp className="inline w-5 h-5 mr-2" />
              Vue d'ensemble
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'calendar'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <Calendar className="inline w-5 h-5 mr-2" />
              Calendrier
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <BarChart3 className="inline w-5 h-5 mr-2" />
              Analytiques
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Projets</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="bg-blue-400 rounded-full p-3">
                <PieChart className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">À faire</p>
                <p className="text-3xl font-bold">{stats.todo}</p>
              </div>
              <div className="bg-yellow-400 rounded-full p-3">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm">En cours</p>
                <p className="text-3xl font-bold">{stats.inProgress}</p>
              </div>
              <div className="bg-indigo-400 rounded-full p-3">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Terminés</p>
                <p className="text-3xl font-bold">{stats.completed}</p>
              </div>
              <div className="bg-green-400 rounded-full p-3">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Projects List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Mes Projets</h2>
                  <button
                    onClick={() => openModal()}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Nouveau
                  </button>
                </div>

                {/* Filters */}
                <div className="flex gap-4 mb-6">
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

                {/* Projects Grid */}
                <div className="space-y-4">
                  {filteredProjects.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">{project.titre}</h3>
                          <p className="text-gray-600 text-sm">
                            Créé le {project.dateCreation.toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal(project)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProject(project.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{project.description}</p>
                      
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.statut)}`}>
                            {project.statut}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(project.priorite)}`}>
                            {project.priorite}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                          {project.progress}%
                        </span>
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
              </div>
            </div>

            {/* Charts Sidebar */}
            <div className="space-y-6">
              {/* Pie Chart */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Répartition des Projets</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <RechartsPieChart>
                    <Tooltip />
                    <RechartsPieChart data={pieData} cx="50%" cy="50%" outerRadius={70}>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </RechartsPieChart>
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {pieData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini Calendar */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Calendrier
                </h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {selectedDate.getDate()}
                  </div>
                  <div className="text-gray-600">
                    {selectedDate.toLocaleDateString('fr-FR', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Progress Chart */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Progression des Projets</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="progress" fill="url(#gradient)" />
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Monthly Trends */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Projets par Mois</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="projets" 
                      stroke="#8884d8" 
                      strokeWidth={3}
                      dot={{ fill: '#8884d8', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Calendar className="w-7 h-7" />
              Calendrier des Projets
            </h2>
            <div className="grid grid-cols-7 gap-4 mb-4">
              {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
                <div key={day} className="text-center font-semibold text-gray-600 py-2">
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
                  {i > 6 && i < 28 ? i - 6 : ''}
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
    </div>
  );
};

// Project Modal Component
const ProjectModal = ({ project, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    titre: project?.titre || '',
    description: project?.description || '',
    statut: project?.statut || 'À faire',
    priorite: project?.priorite || 'moyenne'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {project ? 'Modifier le Projet' : 'Nouveau Projet'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre *
            </label>
            <input
              type="text"
              required
              value={formData.titre}
              onChange={(e) => setFormData({...formData, titre: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Titre de votre projet..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 h-24"
              placeholder="Décrivez votre projet..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut *
              </label>
              <select
                required
                value={formData.statut}
                onChange={(e) => setFormData({...formData, statut: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="À faire">À faire</option>
                <option value="En cours">En cours</option>
                <option value="Terminé">Terminé</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priorité *
              </label>
              <select
                required
                value={formData.priorite}
                onChange={(e) => setFormData({...formData, priorite: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;