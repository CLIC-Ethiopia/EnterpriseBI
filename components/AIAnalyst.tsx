import React, { useState } from 'react';
import { DepartmentData } from '../types';
import { generateDashboardInsights } from '../services/geminiService';
import { Sparkles, Send, Loader2, X } from 'lucide-react';

interface AIAnalystProps {
  department: DepartmentData;
  isOpen: boolean;
  onClose: () => void;
}

const AIAnalyst: React.FC<AIAnalystProps> = ({ department, isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await generateDashboardInsights(department, query);
    setResponse(result);
    setLoading(false);
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <h2 className="font-bold text-lg">AI Analyst</h2>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900/50">
        {!response && !loading && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-indigo-300 dark:text-indigo-400" />
            <p className="text-sm">Ask me to analyze the current dashboard metrics, identifying trends, risks, or opportunities.</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400 mb-2" />
            <p className="text-xs text-gray-500 dark:text-gray-400">Analyzing data...</p>
          </div>
        )}

        {response && (
          <div className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600">
            <div className="flex items-start gap-3 mb-2">
              <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-300 uppercase tracking-wider mb-1">Insight</p>
                <div className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed prose prose-sm max-w-none">
                  {response}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="relative">
          <input
            type="text"
            className="w-full pl-4 pr-12 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 text-sm placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Ask about this data..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !query.trim()}
            className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAnalyst;