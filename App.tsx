
import React, { useState, useEffect } from 'react';
import { SurveyTemplate, SurveyResponse } from './types';
import { SurveyBuilder } from './components/SurveyBuilder';
import { SurveyForm } from './components/SurveyForm';
import { Dashboard } from './components/Dashboard';
import { DataList } from './components/DataList';
import { AIReportGenerator } from './components/AIReportGenerator';
import { Welcome } from './components/Welcome';
import { PenTool, Layout, Database, FileText, PieChart, Home } from 'lucide-react';

const TEMPLATE_KEY = 'aisurvey_templates';
const RESPONSE_KEY = 'aisurvey_responses';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'builder' | 'collect' | 'data' | 'dashboard' | 'ai'>('home');
  const [templates, setTemplates] = useState<SurveyTemplate[]>([]);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);

  useEffect(() => {
    const storedTemp = localStorage.getItem(TEMPLATE_KEY);
    const storedResp = localStorage.getItem(RESPONSE_KEY);
    if (storedTemp) setTemplates(JSON.parse(storedTemp));
    if (storedResp) setResponses(JSON.parse(storedResp));
  }, []);

  const saveTemplate = (template: SurveyTemplate) => {
    const newTemplates = [...templates, template];
    setTemplates(newTemplates);
    localStorage.setItem(TEMPLATE_KEY, JSON.stringify(newTemplates));
    setActiveTab('collect'); // Auto-switch to collect to test it
  };

  const saveResponse = (response: SurveyResponse) => {
    const newResponses = [response, ...responses];
    setResponses(newResponses);
    localStorage.setItem(RESPONSE_KEY, JSON.stringify(newResponses));
  };

  const deleteResponse = (id: string) => {
    const newResponses = responses.filter(r => r.id !== id);
    setResponses(newResponses);
    localStorage.setItem(RESPONSE_KEY, JSON.stringify(newResponses));
  };

  const NavButton = ({ tab, icon: Icon, label }: { tab: typeof activeTab, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors
        ${activeTab === tab 
          ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' 
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
    >
      <Icon size={18} className="mr-2" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16 items-center">
                <div 
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setActiveTab('home')}
                >
                    <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
                        <Layout size={24} />
                    </div>
                    <span className="text-xl font-bold text-gray-800 tracking-tight hidden sm:inline">AI Survey<span className="text-indigo-600">Architect</span></span>
                </div>
                
                <nav className="flex space-x-1 h-full overflow-x-auto custom-scrollbar">
                    <NavButton tab="home" icon={Home} label="Accueil" />
                    <NavButton tab="builder" icon={PenTool} label="Conception" />
                    <NavButton tab="collect" icon={FileText} label="Collecte" />
                    <NavButton tab="dashboard" icon={PieChart} label="Analyses" />
                    <NavButton tab="data" icon={Database} label="Données" />
                    <NavButton tab="ai" icon={Layout} label="Rapport IA" />
                </nav>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'home' && <Welcome templates={templates} responses={responses} onNavigate={(tab) => setActiveTab(tab)} />}
        {activeTab === 'builder' && <SurveyBuilder onSave={saveTemplate} />}
        {activeTab === 'collect' && <SurveyForm templates={templates} onSubmit={saveResponse} />}
        {activeTab === 'dashboard' && <Dashboard templates={templates} responses={responses} />}
        {activeTab === 'data' && <DataList templates={templates} responses={responses} onDelete={deleteResponse} />}
        {activeTab === 'ai' && <AIReportGenerator templates={templates} responses={responses} />}
      </main>
    </div>
  );
};

export default App;
