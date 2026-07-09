import React, { useState } from 'react';
import { Sparkles, Loader2, Play, AlertTriangle, Info, CheckCircle, ArrowRight, CornerDownLeft } from 'lucide-react';
import { AIAnalysisResult, Widget, ChartType } from '../types';

interface AiCopilotProps {
  datasetId: string;
  datasetName: string;
  sampleData: Array<Record<string, any>>;
  columns: Array<{ name: string; type: string; description: string }>;
  onAddWidget: (widget: Omit<Widget, 'id'>) => void;
}

export const AiCopilot: React.FC<AiCopilotProps> = ({
  datasetId,
  datasetName,
  sampleData,
  columns,
  onAddWidget
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Template suggestions based on dataset
  const getTemplates = () => {
    if (datasetId === 'customer_demographics') {
      return [
        { label: 'States & Demographics Spending', q: 'Identify which states generate the highest gross sales revenue, analyze spending averages by age bracket, and outline gender spending disparities.' },
        { label: 'Category Purchase Distribution', q: 'Summarize product category preferences. Which age brackets or gender segments spend the most on Accessories vs Clothing?' }
      ];
    } else if (datasetId === 'subscription_analysis') {
      return [
        { label: 'Loyalty Review & Gateway Insights', q: 'Analyze the average review ratings of subscribers. Which payment methods are favored by loyal members and what is the typical frequency?' },
        { label: 'Promo Code & Spend Yield Impact', q: 'Assess how promo codes or discounts influence total purchase amounts and review ratings for subscribed loyalty accounts.' }
      ];
    } else {
      return [
        { label: 'Seasonal Item Purchasing Cycle', q: 'Track seasonal item sales and colors. What product categories peak in Winter vs Summer and what are the size preferences?' },
        { label: 'Fulfillment vs Frequency Correlation', q: 'Determine if shipping choices (such as Express or Store Pickup) correlate with higher purchase frequencies or prior order volumes.' }
      ];
    }
  };

  const handleAnalyze = async (promptText: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          datasetId,
          datasetName,
          sampleData,
          columns,
          query: promptText
        })
      });

      if (!response.ok) {
        throw new Error('Analysis request failed on server.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to connect to the AI analyst on the server. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  // Simple Markdown inline style converter for rendering AI output cleanly without external packages
  const renderMarkdown = (md: string) => {
    return md.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('###')) {
        return <h4 key={idx} className="text-sm font-bold text-slate-100 mt-4 mb-2">{trimmed.replace('###', '')}</h4>;
      }
      if (trimmed.startsWith('##')) {
        return <h3 key={idx} className="text-base font-bold text-slate-50 mt-5 mb-2 border-b border-[#1e293b] pb-1">{trimmed.replace('##', '')}</h3>;
      }
      if (trimmed.startsWith('#')) {
        return <h2 key={idx} className="text-lg font-black text-white mt-6 mb-3">{trimmed.replace('#', '')}</h2>;
      }
      if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
        // Parse bold elements in lists
        const cleanText = trimmed.substring(1).trim();
        return (
          <li key={idx} className="text-xs text-slate-300 ml-4 list-disc mb-1.5 leading-relaxed">
            {parseBoldText(cleanText)}
          </li>
        );
      }
      if (trimmed === '') {
        return <div key={idx} className="h-2" />;
      }
      return <p key={idx} className="text-xs text-slate-300 mb-2 leading-relaxed">{parseBoldText(trimmed)}</p>;
    });
  };

  const parseBoldText = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-bold text-slate-100">{part}</strong> : part);
  };

  const deployWidget = () => {
    if (!result?.suggestedVisual) return;
    const { title, chartType, xAxisField, yAxisField, explanation } = result.suggestedVisual;
    onAddWidget({
      title,
      type: chartType,
      xAxisField,
      yAxisField,
      w: 6, // default half width
      h: 1, // medium height
      explanation,
      isAiGenerated: true
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#020617] border-l border-[#1e293b]">
      {/* Header */}
      <div className="p-4 bg-[#0f172a] border-b border-[#1e293b] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-500/10 text-indigo-400 rounded-lg p-1.5 flex items-center justify-center animate-pulse border border-indigo-500/20">
            <Sparkles className="w-4 h-4 fill-indigo-400 stroke-indigo-500" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">AI Report Analyst</h3>
            <p className="text-[10px] text-slate-400 font-mono">Powered by Gemini 3.5 Flash</p>
          </div>
        </div>
      </div>

      {/* Query Console */}
      <div className="p-4 bg-[#0f172a] border-b border-[#1e293b] shrink-0">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 font-mono">
          Natural Language DAX Analyst
        </span>
        
        <div className="flex gap-2 relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Ask a question about the ${datasetName}... e.g. "Find high downtime shifts"`}
            className="w-full text-xs text-slate-200 bg-[#020617] placeholder-slate-500 border border-[#1e293b] rounded-xl p-3 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none h-20 pr-10 font-mono"
            id="text-ai-query"
          />
          <button
            onClick={() => handleAnalyze(query)}
            disabled={loading || !query.trim()}
            className="absolute right-2.5 bottom-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-[#1e293b] text-white p-1.5 rounded-lg transition-colors flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
            title="Execute AI Query"
            id="btn-submit-ai-query"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
            ) : (
              <Play className="w-4 h-4 fill-current shrink-0" />
            )}
          </button>
        </div>

        {/* Suggestion Chips */}
        <div className="mt-3 flex flex-col gap-1.5">
          <span className="text-[10px] font-medium text-slate-400 font-mono">Or Select Analysis Template:</span>
          <div className="flex flex-col gap-1">
            {getTemplates().map((t, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(t.q);
                  handleAnalyze(t.q);
                }}
                disabled={loading}
                className="text-left text-[10px] bg-[#020617] hover:bg-[#1e293b] border border-[#1e293b] hover:border-indigo-500/50 text-slate-300 hover:text-slate-100 px-2.5 py-1.5 rounded-lg transition-all line-clamp-1 cursor-pointer disabled:opacity-50 font-sans"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Results Display */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-[#020617]">
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <div>
              <p className="text-xs font-semibold text-slate-200">Gemini is analyzing consumer trends...</p>
              <p className="text-[10px] text-slate-400 mt-1 max-w-[200px] leading-tight font-mono">Compiling demographic spending curves, seasonal behavior, & review ratings</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl p-3 text-xs leading-relaxed font-mono">
            <p className="font-semibold">{error}</p>
            <button 
              onClick={() => handleAnalyze(query)}
              className="mt-2 text-[10px] font-bold text-rose-400 underline block cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        )}

        {!loading && !error && !result && (
          <div className="flex flex-col items-center justify-center text-center text-slate-500 py-16 gap-3">
            <div className="bg-indigo-500/10 rounded-full p-4 border border-indigo-500/5">
              <Sparkles className="w-8 h-8 text-indigo-400/50 stroke-1" />
            </div>
            <div className="max-w-[220px]">
              <h4 className="text-xs font-semibold text-slate-300">Copilot Ready</h4>
              <p className="text-[10px] text-slate-400 leading-normal mt-1">
                Select an analysis template above or write a custom query to let AI mine anomalies and build PowerBI charts.
              </p>
            </div>
          </div>
        )}

        {result && (
          <div className="flex flex-col gap-4 animate-fade-in">
            {/* 1. Bullet Point Alerts */}
            {result.insights && result.insights.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  Critical Alerts & Anomaly Mining
                </span>
                <div className="flex flex-col gap-1.5">
                  {result.insights.map((ins, idx) => (
                    <div 
                      key={idx} 
                      className={`flex gap-2.5 p-2.5 rounded-xl border ${
                        ins.severity === 'critical'
                          ? 'bg-rose-500/10 border-rose-500/20 text-rose-200'
                          : ins.severity === 'warning'
                          ? 'bg-amber-500/10 border-amber-500/20 text-amber-200'
                          : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-200'
                      }`}
                    >
                      {ins.severity === 'critical' ? (
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      ) : ins.severity === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      ) : (
                        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-1">
                          <h5 className="font-bold text-xs truncate">{ins.title}</h5>
                          {ins.metric && (
                            <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-slate-900/60 rounded-md shrink-0 font-mono text-slate-300">
                              {ins.metric}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] mt-0.5 opacity-90 leading-tight">{ins.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Suggested Report Widget (PowerBI design suggestion) */}
            {result.suggestedVisual && (
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex flex-col gap-2 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 fill-indigo-500/30 animate-pulse" />
                    <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest font-mono">
                      Recommended PowerBI Visual
                    </span>
                  </div>
                  <span className="text-[9px] font-bold bg-indigo-500 text-white px-2 py-0.5 rounded text-[9px] font-bold font-mono tracking-wider">
                    {result.suggestedVisual.chartType}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-100 text-xs mt-1">
                    {result.suggestedVisual.title}
                  </h4>
                  <div className="flex gap-4 text-[10px] font-mono text-slate-400 mt-1 pb-1 border-b border-slate-800">
                    <div>X-Axis: <span className="font-bold text-slate-200">{result.suggestedVisual.xAxisField}</span></div>
                    <div>Y-Axis: <span className="font-bold text-slate-200">{result.suggestedVisual.yAxisField}</span></div>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-normal mt-2.5 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/40">
                    {result.suggestedVisual.explanation}
                  </p>
                </div>

                <button
                  onClick={deployWidget}
                  className="mt-1 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md font-mono tracking-wide"
                >
                  Deploy suggested visual to active tab
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* 3. Executive Markdown Summary */}
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 shadow-lg">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 border-b border-slate-800 pb-1.5 font-mono">
                Executive Analysis Report
              </span>
              <div className="prose prose-sm max-w-none">
                {renderMarkdown(result.summary)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
