import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UpgradeModal from './UpgradeModal';
import { Experiment } from '../types';
import { Plus, Calendar, Target, TrendingUp, Clock, CheckCircle, Play, Pause, BarChart3 } from 'lucide-react';

const Experiments: React.FC = () => {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [newExperiment, setNewExperiment] = useState({
    title: '',
    description: '',
    hypothesis: '',
    metrics: [{ name: 'Conversion Rate', target: 5, unit: '%' }]
  });

  const experiments: Experiment[] = [
    {
      id: '1',
      userId: user?.id || '',
      title: 'Landing Page A/B Test',
      description: 'Testing two different headlines to improve conversion rates',
      hypothesis: 'A more specific headline will increase conversion by 15%',
      status: 'running',
      startDate: '2024-01-15',
      metrics: [
        { name: 'Conversion Rate', value: 3.2, target: 5.0, unit: '%' },
        { name: 'Click-through Rate', value: 8.5, target: 10.0, unit: '%' }
      ],
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      userId: user?.id || '',
      title: 'Email Sequence Optimization',
      description: 'Testing different email timing and content',
      hypothesis: 'Shorter emails with clearer CTAs will improve engagement',
      status: 'completed',
      startDate: '2024-01-01',
      endDate: '2024-01-14',
      metrics: [
        { name: 'Open Rate', value: 24.5, target: 20.0, unit: '%' },
        { name: 'Click Rate', value: 4.2, target: 3.5, unit: '%' }
      ],
      createdAt: '2024-01-01'
    }
  ];

  const canCreateExperiment = () => {
    if (user?.tier === 'free') return false;
    if (user?.tier === 'pro') return experiments.filter(e => e.status === 'running').length < 1;
    return true; // Premium has unlimited
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Play className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'paused': return <Pause className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleCreateExperiment = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would save the experiment
    setShowCreateForm(false);
    setNewExperiment({
      title: '',
      description: '',
      hypothesis: '',
      metrics: [{ name: 'Conversion Rate', target: 5, unit: '%' }]
    });
  };

  // Feature gate: Experiments are only available for Pro and Premium users
  if (user?.tier === 'free') {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Target className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Create Your First Experiment</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Complete your free coaching session first, then upgrade to Pro to start running experiments and validate your startup ideas with data-driven insights.
          </p>
          <div className="bg-white rounded-xl shadow-sm p-8 max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Experiment Features:</h3>
            <ul className="text-left space-y-3 text-gray-600">
              <li className="flex items-center">
                <Target className="h-5 w-5 text-purple-600 mr-3" />
                Hypothesis-driven testing
              </li>
              <li className="flex items-center">
                <BarChart3 className="h-5 w-5 text-blue-600 mr-3" />
                Real-time metrics tracking
              </li>
              <li className="flex items-center">
                <TrendingUp className="h-5 w-5 text-green-600 mr-3" />
                Success measurement
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-orange-600 mr-3" />
                Detailed results analysis
              </li>
            </ul>
            <button 
              disabled={user?.questionsAnswered < 3}
              onClick={() => {
                setShowUpgradeModal(true);
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold mt-6 hover:shadow-lg transition-all duration-200"
            >
              Upgrade to Pro
            </button>
          </div>
        </div>
        
        <UpgradeModal 
          isOpen={showUpgradeModal} 
          onClose={() => setShowUpgradeModal(false)} 
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Experiments</h1>
          <p className="text-gray-600 mt-1">Design, run, and analyze experiments to validate your ideas</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          disabled={!canCreateExperiment()}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Experiment
        </button>
      </div>

      {/* Create Experiment Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Experiment</h2>
              <form onSubmit={handleCreateExperiment} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experiment Title
                  </label>
                  <input
                    type="text"
                    value={newExperiment.title}
                    onChange={(e) => setNewExperiment({...newExperiment, title: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Landing Page Conversion Test"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newExperiment.description}
                    onChange={(e) => setNewExperiment({...newExperiment, description: e.target.value})}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Describe what you're testing and why..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hypothesis
                  </label>
                  <textarea
                    value={newExperiment.hypothesis}
                    onChange={(e) => setNewExperiment({...newExperiment, hypothesis: e.target.value})}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="If I change X, then Y will happen because..."
                    required
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg"
                  >
                    Create Experiment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Experiments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {experiments.map((experiment) => (
          <div key={experiment.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{experiment.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{experiment.description}</p>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(experiment.status)}`}>
                  {getStatusIcon(experiment.status)}
                  <span className="ml-1 capitalize">{experiment.status}</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Hypothesis:</h4>
              <p className="text-sm text-gray-600 italic">"{experiment.hypothesis}"</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Metrics:</h4>
              {experiment.metrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{metric.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {metric.value}{metric.unit}
                    </span>
                    <span className="text-xs text-gray-500">
                      / {metric.target}{metric.unit}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${
                      metric.value >= metric.target ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Started {new Date(experiment.startDate).toLocaleDateString()}
              </div>
              {experiment.endDate && (
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Ended {new Date(experiment.endDate).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {experiments.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No experiments yet</h3>
          <p className="text-gray-600 mb-6">Create your first experiment to start validating your ideas</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg"
          >
            Create Your First Experiment
          </button>
        </div>
      )}
    </div>
  );
};

export default Experiments;