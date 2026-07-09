import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Widget, ChartType } from '../types';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  FileText, 
  Settings, 
  Trash2, 
  Maximize2,
  Sparkles,
  Database,
  Gauge
} from 'lucide-react';

interface DashboardWidgetProps {
  widget: Widget;
  data: Array<Record<string, any>>;
  onDelete: (id: string) => void;
  colorPalette: string[];
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  widget,
  data,
  onDelete,
  colorPalette
}) => {
  // Helper to format values for display
  const formatValue = (val: any) => {
    if (typeof val === 'number') {
      const field = widget.yAxisField.toLowerCase();
      const isCash = field.includes('amount') || field.includes('usd') || field.includes('price') || field.includes('sales');
      const isRating = field.includes('rating');

      let formatted = '';
      if (val > 1000) formatted = val.toLocaleString(undefined, { maximumFractionDigits: 0 });
      else formatted = val.toLocaleString(undefined, { maximumFractionDigits: 1 });

      if (isCash) return `$${formatted}`;
      if (isRating) return `${formatted} ★`;
      return formatted;
    }
    return String(val);
  };

  // 1. Calculate KPI Metrics for KPI visuals
  const getKpiData = () => {
    if (data.length === 0) return { val: 'N/A', change: '0%', trend: 'neutral' as const };

    const { xAxisField, yAxisField, kpiCalc = 'latest' } = widget;
    
    // Extract numeric values for calculation
    const values = data.map(d => Number(d[yAxisField])).filter(v => !isNaN(v));
    
    if (values.length === 0) {
      // Fallback if not a number - get latest string representation
      const latestVal = data[data.length - 1]?.[yAxisField];
      return { 
        val: latestVal !== undefined ? String(latestVal) : 'N/A', 
        change: '0%', 
        trend: 'neutral' as const 
      };
    }

    let calculatedVal = 0;
    switch (kpiCalc) {
      case 'sum':
        calculatedVal = values.reduce((sum, v) => sum + v, 0);
        break;
      case 'avg':
        calculatedVal = values.reduce((sum, v) => sum + v, 0) / values.length;
        break;
      case 'min':
        calculatedVal = Math.min(...values);
        break;
      case 'max':
        calculatedVal = Math.max(...values);
        break;
      case 'count':
        calculatedVal = values.length;
        break;
      case 'latest':
      default:
        calculatedVal = values[values.length - 1];
        break;
    }

    // Estimate change compared to previous half
    let pctChange = 0;
    let trend: 'up' | 'down' | 'neutral' = 'neutral';
    
    if (values.length >= 2) {
      const mid = Math.floor(values.length / 2);
      const firstHalf = values.slice(0, mid);
      const secondHalf = values.slice(mid);
      const avgFirst = firstHalf.reduce((sum, v) => sum + v, 0) / firstHalf.length;
      const avgSecond = secondHalf.reduce((sum, v) => sum + v, 0) / secondHalf.length;

      if (avgFirst !== 0) {
        pctChange = ((avgSecond - avgFirst) / avgFirst) * 100;
        if (pctChange > 0.5) trend = 'up';
        else if (pctChange < -0.5) trend = 'down';
      }
    }

    const formattedVal = calculatedVal > 1000 
      ? calculatedVal.toLocaleString(undefined, { maximumFractionDigits: 0 }) 
      : calculatedVal.toLocaleString(undefined, { maximumFractionDigits: 1 });

    // Format suffix/prefix if looks like percentage, temperature, currency, or rating
    let suffix = '';
    let prefix = '';
    const field = yAxisField.toLowerCase();
    
    if (field.includes('amount') || field.includes('usd') || field.includes('price') || field.includes('sales')) {
      prefix = '$';
    } else if (field.includes('rating')) {
      suffix = ' ★';
    } else if (field.includes('pct') || field.includes('rate') || field.includes('efficiency')) {
      suffix = '%';
    } else if (field.includes('temp') || field.includes('_c')) {
      suffix = '°C';
    } else if (field.includes('power') || field.includes('_kw')) {
      suffix = ' kW';
    } else if (field.includes('yield_kwh')) {
      suffix = ' kWh';
    } else if (field.includes('min')) {
      suffix = 'm';
    }

    return {
      val: `${prefix}${formattedVal}${suffix}`,
      change: `${pctChange >= 0 ? '+' : ''}${pctChange.toFixed(1)}%`,
      trend
    };
  };

  // Aggregate data for Pie Chart or grouped summaries
  const getAggregatedData = () => {
    const { xAxisField, yAxisField } = widget;
    const groups: Record<string, { name: string; value: number; count: number }> = {};

    data.forEach(item => {
      const key = String(item[xAxisField] || 'Unknown');
      const val = Number(item[yAxisField]);
      if (isNaN(val)) return;

      if (!groups[key]) {
        groups[key] = { name: key, value: 0, count: 0 };
      }
      groups[key].value += val;
      groups[key].count += 1;
    });

    return Object.values(groups).map(g => ({
      name: g.name,
      value: parseFloat((g.value / (widget.type === 'pie' ? 1 : g.count)).toFixed(1)) // Sum for pie, avg for others
    })).slice(0, 8); // top 8 to avoid clutter
  };

  const aggregatedData = getAggregatedData();
  const kpiStats = widget.type === 'kpi' || widget.type === 'gauge' ? getKpiData() : null;

  return (
    <div 
      id={`widget-${widget.id}`}
      className={`bg-[#0f172a] rounded-xl border border-[#1e293b] shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-500/30 transition-all duration-300 flex flex-col overflow-hidden relative group p-5 min-h-[300px] h-full text-slate-200`}
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between mb-3 border-b border-[#1e293b] pb-2.5">
        <div className="flex items-center gap-2 overflow-hidden">
          {widget.isAiGenerated && (
            <div className="bg-amber-500/10 text-amber-400 rounded-md p-1 flex items-center justify-center shrink-0 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          )}
          <h3 className="font-semibold text-slate-300 text-xs uppercase tracking-wider truncate" title={widget.title}>
            {widget.title}
          </h3>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onDelete(widget.id)}
            className="text-slate-400 hover:text-rose-400 rounded-md p-1 hover:bg-[#1e293b] transition-colors"
            title="Remove Visual"
            id={`btn-delete-widget-${widget.id}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Widget Contents based on Visual Type */}
      <div className="flex-1 min-h-0 w-full relative">
        {data.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-2">
            <Database className="w-8 h-8 stroke-1" />
            <span className="text-xs">No active production data loaded</span>
          </div>
        ) : (
          <>
            {/* BAR CHART */}
            {widget.type === 'bar' && (
              <ResponsiveContainer width="100%" height="95%">
                <BarChart data={data.slice(-15)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis 
                    dataKey={widget.xAxisField} 
                    tickFormatter={(tick) => {
                      if (typeof tick === 'string' && tick.includes('T')) {
                        return new Date(tick).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      }
                      return tick;
                    }}
                    tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                    stroke="#1e293b"
                  />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} stroke="#1e293b" width={35} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', fontSize: '11px', color: '#f8fafc' }}
                    labelFormatter={(label) => {
                      if (typeof label === 'string' && label.includes('T')) {
                        return new Date(label).toLocaleString();
                      }
                      return label;
                    }}
                  />
                  <Bar dataKey={widget.yAxisField} fill={colorPalette[0]} radius={[4, 4, 0, 0]}>
                    {data.slice(-15).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colorPalette[index % colorPalette.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}

            {/* LINE CHART */}
            {widget.type === 'line' && (
              <ResponsiveContainer width="100%" height="95%">
                <LineChart data={data.slice(-20)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis 
                    dataKey={widget.xAxisField} 
                    tickFormatter={(tick) => {
                      if (typeof tick === 'string' && tick.includes('T')) {
                        return new Date(tick).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      }
                      return tick;
                    }}
                    tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                    stroke="#1e293b"
                  />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} stroke="#1e293b" width={35} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', fontSize: '11px', color: '#f8fafc' }}
                    labelFormatter={(label) => {
                      if (typeof label === 'string' && label.includes('T')) {
                        return new Date(label).toLocaleString();
                      }
                      return label;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={widget.yAxisField} 
                    stroke={colorPalette[0]} 
                    strokeWidth={2.5} 
                    dot={{ r: 3, fill: colorPalette[0], strokeWidth: 1 }} 
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}

            {/* PIE CHART */}
            {widget.type === 'pie' && (
              <ResponsiveContainer width="100%" height="95%">
                <PieChart>
                  <Pie
                    data={aggregatedData}
                    cx="50%"
                    cy="50%"
                    innerRadius="40%"
                    outerRadius="75%"
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {aggregatedData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colorPalette[index % colorPalette.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', fontSize: '11px', color: '#f8fafc' }} />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '9px', marginTop: '10px', color: '#94a3b8' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}

            {/* SCATTER PLOT */}
            {widget.type === 'scatter' && (
              <ResponsiveContainer width="100%" height="95%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis 
                    type="number" 
                    dataKey={widget.xAxisField} 
                    name={widget.xAxisField} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} 
                    stroke="#1e293b"
                  />
                  <YAxis 
                    type="number" 
                    dataKey={widget.yAxisField} 
                    name={widget.yAxisField} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} 
                    stroke="#1e293b"
                    width={35}
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', fontSize: '11px', color: '#f8fafc' }}
                  />
                  <Scatter name="Production Batches" data={data} fill={colorPalette[0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colorPalette[index % colorPalette.length]} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            )}

            {/* KPI CARD */}
            {widget.type === 'kpi' && kpiStats && (
              <div className="absolute inset-0 flex flex-col justify-between py-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                      {widget.kpiCalc || 'Latest'} ({widget.yAxisField})
                    </span>
                    <div className="text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mt-2.5 animate-fade-in font-mono">
                      {kpiStats.val}
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    kpiStats.trend === 'up' 
                      ? 'bg-emerald-500/10 text-emerald-400' 
                      : kpiStats.trend === 'down'
                      ? 'bg-rose-500/10 text-rose-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {kpiStats.trend === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
                    {kpiStats.trend === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
                    {kpiStats.change}
                  </div>
                </div>

                {/* Micro trend lines */}
                <div className="h-12 w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.slice(-15)}>
                      <Line 
                        type="monotone" 
                        dataKey={widget.yAxisField} 
                        stroke={kpiStats.trend === 'up' ? '#10b981' : kpiStats.trend === 'down' ? '#f43f5e' : '#64748b'} 
                        strokeWidth={2} 
                        dot={false} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* RADIAL GAUGE */}
            {widget.type === 'gauge' && kpiStats && (() => {
              const rawStr = kpiStats.val.replace(/[$,\s★]/g, '');
              const numericVal = parseFloat(rawStr);
              const isRating = widget.yAxisField.toLowerCase().includes('rating');
              const isSpend = widget.yAxisField.toLowerCase().includes('amount') || widget.yAxisField.toLowerCase().includes('usd');
              
              let target = 85;
              let targetLabel = "85%";
              if (isRating) {
                target = 4.5;
                targetLabel = "4.5 ★";
              } else if (isSpend) {
                target = 6500; // Target aggregate store spend
                targetLabel = "$6,500";
              }

              const percentOfTarget = isNaN(numericVal) ? 0 : Math.min(100, (numericVal / target) * 100);
              const isGood = percentOfTarget >= 90;

              return (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    {/* Recharts Pie mimicking gauge */}
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { value: percentOfTarget },
                            { value: 100 - percentOfTarget }
                          ]}
                          cx="50%"
                          cy="50%"
                          startAngle={180}
                          endAngle={0}
                          innerRadius="70%"
                          outerRadius="90%"
                          dataKey="value"
                        >
                          <Cell fill={isGood ? '#10b981' : '#f59e0b'} />
                          <Cell fill="#1e293b" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute flex flex-col items-center justify-center text-center mt-6">
                      <span className="text-2xl font-black text-slate-50 font-mono">{kpiStats.val}</span>
                      <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">Target: {targetLabel}</span>
                    </div>
                  </div>
                  <div className="text-center -mt-2">
                    <span className="text-[10px] font-semibold text-slate-400 font-mono">
                      {isRating ? `${(numericVal).toFixed(1)} / 5.0 Stars` : `${percentOfTarget.toFixed(0)}% Objective Met`}
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* MATRIX DATA TABLE */}
            {widget.type === 'table' && (
              <div className="absolute inset-0 overflow-y-auto overflow-x-auto rounded-lg border border-[#1e293b] mt-1 max-h-[92%]">
                <table className="min-w-full divide-y divide-[#1e293b]/50 text-[10px]">
                  <thead className="bg-[#1e293b]/50 sticky top-0 font-semibold text-slate-300">
                    <tr>
                      <th className="px-2 py-1.5 text-left uppercase tracking-wider">{widget.xAxisField}</th>
                      <th className="px-2 py-1.5 text-right uppercase tracking-wider">{widget.yAxisField}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#0f172a] divide-y divide-[#1e293b]/30 text-slate-300">
                    {data.slice(-15).reverse().map((row, index) => (
                      <tr key={index} className="hover:bg-[#1e293b]/30 transition-colors">
                        <td className="px-2 py-1.5 font-medium truncate max-w-[120px]">
                          {row[widget.xAxisField] && row[widget.xAxisField].includes('T')
                            ? new Date(row[widget.xAxisField]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : String(row[widget.xAxisField])}
                        </td>
                        <td className="px-2 py-1.5 text-right font-mono text-slate-50 font-bold">
                          {formatValue(row[widget.yAxisField])}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Widget Footer - AI explanation tooltip */}
      {widget.explanation && (
        <div className="mt-2 text-[10px] text-amber-300 bg-amber-500/10 rounded-lg p-1.5 border border-amber-500/20 flex gap-1 items-start">
          <Sparkles className="w-3 h-3 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
          <span className="leading-tight line-clamp-2">{widget.explanation}</span>
        </div>
      )}
    </div>
  );
};
