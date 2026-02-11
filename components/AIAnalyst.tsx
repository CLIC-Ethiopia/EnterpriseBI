import React, { useState } from 'react';
import { DepartmentData } from '../types';
import { generateDashboardInsights } from '../services/geminiService';
import { Sparkles, Send, Loader2, X, MessageSquarePlus, RefreshCw, GraduationCap } from 'lucide-react';

interface AIAnalystProps {
  department: DepartmentData;
  isOpen: boolean;
  onClose: () => void;
}

const AIAnalyst: React.FC<AIAnalystProps> = ({ department, isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (textToAnalyze?: string) => {
    const finalText = textToAnalyze || query;
    if (!finalText.trim()) return;

    setLoading(true);
    // If selecting a prompt, we want to clear the previous response to show it's a new action
    setResponse(null); 
    
    // Set query in input if it came from a button click for visual feedback
    if (textToAnalyze) setQuery(textToAnalyze);

    const result = await generateDashboardInsights(department, finalText);
    setResponse(result);
    setLoading(false);
    
    // Optional: Clear query after sending, but keeping it allows user to edit/refine
    // setQuery(''); 
  };

  const handlePromptClick = (prompt: string) => {
    handleAnalyze(prompt);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6" />
          <h2 className="font-bold text-lg">Prof. Fad</h2>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900/50">
        
        {/* Empty State / Welcome Screen */}
        {!response && !loading && (
          <div className="flex flex-col h-full">
            <div className="text-center text-gray-500 dark:text-gray-400 mt-4 mb-8">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-gray-900 dark:text-white font-semibold mb-2">Hello, I'm Prof. Fad</h3>
              <p className="text-sm">I am your intelligent assistant. I can analyze metrics, forecast trends, or identify risks for {department.name}.</p>
            </div>

            {/* Suggested Prompts */}
            {department.suggestedPrompts && department.suggestedPrompts.length > 0 && (
              <div className="space-y-3 mt-auto">
                 <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Suggested Actions</p>
                 {department.suggestedPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePromptClick(prompt)}
                      className="w-full text-left p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                         <span className="text-sm text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{prompt}</span>
                         <MessageSquarePlus className="w-4 h-4 text-gray-300 group-hover:text-indigo-500" />
                      </div>
                    </button>
                 ))}
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600 dark:text-indigo-400 mb-4" />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 animate-pulse">Prof. Fad is analyzing...</p>
          </div>
        )}

        {response && (
          <div className="space-y-4">
             {/* Query Bubble */}
             <div className="flex justify-end">
                <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-[85%] text-sm shadow-sm">
                   {query}
                </div>
             </div>

             {/* Response Bubble */}
             <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-none p-5 shadow-sm max-w-[95%]">
                   <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
                         <GraduationCap className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Prof. Fad Insight</span>
                   </div>
                   <div className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-line">
                      {response}
                   </div>
                </div>
             </div>
             
             {/* Follow up hint */}
             <div className="text-center pt-6 pb-2">
                <button 
                   onClick={() => { setResponse(null); setQuery(''); }} 
                   className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-lg text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors shadow-sm"
                >
                   <RefreshCw className="w-4 h-4" />
                   Ask another question
                </button>
             </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="relative">
          <input
            type="text"
            className="w-full pl-4 pr-12 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 text-sm placeholder-gray-500 dark:placeholder-gray-400 transition-shadow"
            placeholder="Ask Prof. Fad a question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
          />
          <button
            onClick={() => handleAnalyze()}
            disabled={loading || !query.trim()}
            className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAnalyst;