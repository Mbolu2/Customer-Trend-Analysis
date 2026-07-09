import React, { useState, useEffect, useRef } from 'react';
import { 
  datasets as defaultDatasets, 
  Dataset,
  generateRow
} from './data/datasets';
import { 
  Widget, 
  ReportTab, 
  ColorThemeName 
} from './types';
import { DashboardWidget } from './components/DashboardWidget';
import { AiCopilot } from './components/AiCopilot';
import { 
  Database, 
  Sparkles, 
  Play, 
  Pause, 
  Plus, 
  Upload, 
  Download, 
  RefreshCw, 
  Eye, 
  Filter, 
  BarChart4, 
  Gauge, 
  FileSpreadsheet, 
  Layers, 
  Check, 
  ChevronRight,
  Sparkle
} from 'lucide-react';

const PALETTES: Record<ColorThemeName, string[]> = {
  powerbi_classic: ['#6366f1', '#10b981', '#f59e0b', '#38bdf8', '#f43f5e'],
  steel_blue: ['#3b82f6', '#60a5fa', '#38bdf8', '#0ea5e9', '#1d4ed8'],
  emerald_industrial: ['#10b981', '#34d399', '#059669', '#a7f3d0', '#064e3b'],
  amber_energy: ['#fbbf24', '#f59e0b', '#78350f', '#fef08a', '#b45309'],
  carbon_dark: ['#64748b', '#94a3b8', '#cbd5e1', '#475569', '#0f172a']
};

export default function App() {
  const [datasets, setDatasets] = useState<Dataset[]>(defaultDatasets);
  const [activeDatasetId, setActiveDatasetId] = useState<string>('customer_demographics');
  const [activeData, setActiveData] = useState<Array<Record<string, any>>>([]);
  const [simulating, setSimulating] = useState(true);
  const [theme, setTheme] = useState<ColorThemeName>('powerbi_classic');
  const [activeTabId, setActiveTabId] = useState<string>('tab_overview');
  const [shiftFilter, setShiftFilter] = useState<string>('ALL');
  const [isUploading, setIsUploading] = useState(false);
  const [refreshedTime, setRefreshedTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setRefreshedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);
  
  // Custom Widget Creator States
  const [widgetTitle, setWidgetTitle] = useState('');
  const [widgetType, setWidgetType] = useState<'bar' | 'line' | 'pie' | 'scatter' | 'kpi' | 'gauge' | 'table'>('bar');
  const [xAxisField, setXAxisField] = useState('');
  const [yAxisField, setYAxisField] = useState('');
  const [widgetWidth, setWidgetWidth] = useState<number>(6);
  const [kpiCalc, setKpiCalc] = useState<'sum' | 'avg' | 'count' | 'latest' | 'min' | 'max'>('latest');

  // Load selected dataset
  const activeDataset = datasets.find(d => d.id === activeDatasetId) || datasets[0];

  useEffect(() => {
    if (activeDataset) {
      setActiveData([...activeDataset.data]);
      // Auto-populate custom widget fields with default columns
      const cols = activeDataset.columns;
      if (cols.length > 1) {
        setXAxisField(cols[0].name); // Timestamp or ID
        setYAxisField(cols[Math.floor(cols.length / 2)].name); // Numeric KPI
      }
    }
  }, [activeDatasetId, datasets]);

  // Real-time telemetry generator
  useEffect(() => {
    if (!simulating) return;
    const interval = setInterval(() => {
      setActiveData(prev => {
        if (prev.length === 0) return prev;
        
        const latest = prev[prev.length - 1];
        const nextTime = new Date(new Date(latest.Timestamp).getTime() + 15 * 60000); // add 15 minutes
        
        // Dynamic deterministic fluctuations of checkout data
        let nextRecord: Record<string, any>;
        if (activeDatasetId === 'customer_demographics') {
          nextRecord = generateRow(prev.length);
        } else if (activeDatasetId === 'subscription_analysis') {
          nextRecord = generateRow(prev.length);
          nextRecord['Subscription Status'] = 'Yes';
          nextRecord['Purchase Amount (USD)'] = Math.floor(nextRecord['Purchase Amount (USD)'] * 1.25);
          nextRecord['Previous Purchases'] = Math.floor(nextRecord['Previous Purchases'] * 1.5) + 5;
        } else if (activeDatasetId === 'seasonal_favorites') {
          nextRecord = generateRow(prev.length);
          if (nextRecord['Season'] === 'Winter') {
            nextRecord['Item Purchased'] = prev.length % 2 === 0 ? 'Sweater' : 'Coat';
            nextRecord['Category'] = prev.length % 2 === 0 ? 'Clothing' : 'Outerwear';
          } else if (nextRecord['Season'] === 'Summer') {
            nextRecord['Item Purchased'] = prev.length % 2 === 0 ? 'Sandals' : 'Shorts';
            nextRecord['Category'] = prev.length % 2 === 0 ? 'Footwear' : 'Clothing';
          }
        } else {
          // Uploaded custom dataset - append a row with same columns if possible
          nextRecord = { ...latest, Timestamp: nextTime.toISOString() };
          if (nextRecord['Customer ID']) nextRecord['Customer ID'] = Number(nextRecord['Customer ID']) + 1;
          if (nextRecord['Purchase Amount (USD)']) {
            const current = Number(nextRecord['Purchase Amount (USD)']);
            nextRecord['Purchase Amount (USD)'] = Math.max(10, current + Math.floor(Math.random() * 10 - 5));
          }
        }

        nextRecord.Timestamp = nextTime.toISOString();
        return [...prev.slice(1), nextRecord]; // slide history window
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, [simulating, activeDatasetId]);

  // Seed PowerBI Report Page Tabs
  const [tabs, setTabs] = useState<Record<string, ReportTab>>({
    customer_demographics: {
      id: 'customer_demographics',
      name: 'Retail Overview & Demographics',
      widgets: [
        { id: 'w1', title: 'Total Sales Revenue (USD)', type: 'kpi', xAxisField: 'Timestamp', yAxisField: 'Purchase Amount (USD)', w: 4, h: 1, kpiCalc: 'sum' },
        { id: 'w2', title: 'Sales Volume Footprint by State', type: 'table', xAxisField: 'Location', yAxisField: 'Purchase Amount (USD)', w: 8, h: 1 },
        { id: 'w3', title: 'Age Distribution of Gross Spend', type: 'bar', xAxisField: 'Age', yAxisField: 'Purchase Amount (USD)', w: 6, h: 1 },
        { id: 'w4', title: 'Sales by Product Classification', type: 'pie', xAxisField: 'Category', yAxisField: 'Purchase Amount (USD)', w: 6, h: 1 }
      ]
    },
    subscription_analysis: {
      id: 'subscription_analysis',
      name: 'Subscriber Loyalty Behavior',
      widgets: [
        { id: 'w10', title: 'Subscribers Average Review Rating', type: 'gauge', xAxisField: 'Timestamp', yAxisField: 'Review Rating', w: 4, h: 1, kpiCalc: 'avg' },
        { id: 'w11', title: 'Spend by Gateway Preference', type: 'bar', xAxisField: 'Payment Method', yAxisField: 'Purchase Amount (USD)', w: 8, h: 1 },
        { id: 'w12', title: 'Fulfillment Class Distribution', type: 'pie', xAxisField: 'Shipping Type', yAxisField: 'Purchase Amount (USD)', w: 6, h: 1 },
        { id: 'w13', title: 'Prior Order Volume by Frequency Index', type: 'table', xAxisField: 'Frequency of Purchases', yAxisField: 'Previous Purchases', w: 6, h: 1 }
      ]
    },
    seasonal_favorites: {
      id: 'seasonal_favorites',
      name: 'Seasonal Catalog Preferences',
      widgets: [
        { id: 'w20', title: 'Product Catalog Feedback Average', type: 'gauge', xAxisField: 'Timestamp', yAxisField: 'Review Rating', w: 4, h: 1, kpiCalc: 'avg' },
        { id: 'w21', title: 'Seasonal Buyer Activity Pulse', type: 'bar', xAxisField: 'Season', yAxisField: 'Purchase Amount (USD)', w: 8, h: 1 },
        { id: 'w22', title: 'Top Demand Product Colors', type: 'pie', xAxisField: 'Color', yAxisField: 'Purchase Amount (USD)', w: 6, h: 1 },
        { id: 'w23', title: 'Size Curve Sizing Analysis', type: 'bar', xAxisField: 'Size', yAxisField: 'Purchase Amount (USD)', w: 6, h: 1 }
      ]
    }
  });

  const activeTab = tabs[activeDatasetId] || { id: activeDatasetId, name: 'Report Page', widgets: [] };

  // Handlers for adding/removing custom visuals
  const handleAddWidget = (newWidget: Omit<Widget, 'id'>) => {
    const id = `widget_custom_${Date.now()}`;
    const widget: Widget = { ...newWidget, id };
    
    setTabs(prev => {
      const active = prev[activeDatasetId] || { id: activeDatasetId, name: 'Report Page', widgets: [] };
      return {
        ...prev,
        [activeDatasetId]: {
          ...active,
          widgets: [...active.widgets, widget]
        }
      };
    });
  };

  const handleDeleteWidget = (id: string) => {
    setTabs(prev => {
      const active = prev[activeDatasetId];
      if (!active) return prev;
      return {
        ...prev,
        [activeDatasetId]: {
          ...active,
          widgets: active.widgets.filter(w => w.id !== id)
        }
      };
    });
  };

  // Drag and drop or click to configure custom widgets
  const handleSubmitWidgetForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!widgetTitle.trim() || !xAxisField || !yAxisField) return;

    handleAddWidget({
      title: widgetTitle,
      type: widgetType,
      xAxisField,
      yAxisField,
      w: widgetWidth,
      h: 1,
      kpiCalc
    });

    // Reset form
    setWidgetTitle('');
  };

  // Premium CSV Uploader & Map Engine
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) {
        setIsUploading(false);
        return;
      }

      // Quick parsing engine
      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      if (lines.length < 2) {
        alert('Invalid CSV structure. Make sure headers exist.');
        setIsUploading(false);
        return;
      }

      const headers = lines[0].split(',').map(h => h.replace(/^["']|["']$/g, '').trim());
      const parsedData = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.replace(/^["']|["']$/g, '').trim());
        const row: Record<string, any> = {};
        headers.forEach((header, index) => {
          const val = values[index];
          if (val !== undefined && val !== '') {
            const num = Number(val);
            row[header] = isNaN(num) ? val : num;
          } else {
            row[header] = '';
          }
        });
        // Guarantee standard Timestamp field for line trend charting
        if (!row.Timestamp) {
          row.Timestamp = new Date().toISOString();
        }
        return row;
      });

      // Construct dynamic catalog
      const newDatasetId = `uploaded_csv_${Date.now()}`;
      const newDataset: Dataset = {
        id: newDatasetId,
        name: file.name.replace('.csv', ' Report'),
        description: `Imported CSV metadata with ${parsedData.length} active logging events.`,
        category: 'Custom Uploads',
        columns: headers.map(h => ({
          name: h,
          type: typeof parsedData[0][h] === 'number' ? 'number' : 'string',
          description: `Custom field ${h} mapped from CSV.`
        })),
        data: parsedData
      };

      setDatasets(prev => [...prev, newDataset]);
      
      // Auto register a basic blank Tab page
      setTabs(prev => ({
        ...prev,
        [newDatasetId]: {
          id: newDatasetId,
          name: `${file.name.substring(0, 15)}... Analytics`,
          widgets: [
            { id: `w_up_1_${Date.now()}`, title: `Distribution of ${headers[0]}`, type: 'bar', xAxisField: headers[0], yAxisField: headers[1] || headers[0], w: 12, h: 1 }
          ]
        }
      }));

      setActiveDatasetId(newDatasetId);
      setIsUploading(false);
    };
    reader.readAsText(file);
  };

  // Mock PDF Generation / Layout Print Export
  const triggerPrintExport = () => {
    window.print();
  };

  // Filter local telemetry data before feeding Recharts
  const getFilteredData = () => {
    if (shiftFilter === 'ALL') return activeData;
    return activeData.filter(d => d.Shift === shiftFilter);
  };

  const filteredData = getFilteredData();

  return (
    <div id="pbi-app-container" className="min-h-screen bg-[#020617] flex flex-col font-sans select-none print:bg-white text-slate-100">
      
      {/* 1. TOP BENTO RIBBON BAR */}
      <header className="bg-[#0f172a] text-white py-3 px-6 flex items-center justify-between border-b border-[#1e293b] shrink-0 print:hidden shadow-lg">
        <div className="flex items-center gap-4">
          {/* Custom Bento Emblem Logo */}
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-xl text-white shadow-md shadow-indigo-600/20 shrink-0">
            Σ
          </div>
          <div>
            <h1 className="font-bold text-base uppercase tracking-tight text-slate-100">Live Production Intelligence</h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider">
              DASHBOARD ID: PRD-X092 // REFRESHED: {refreshedTime || 'LOADING...'}
            </p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end mr-3">
            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">Global Health</span>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-slate-300">OPERATIONAL</span>
            </div>
          </div>

          {/* CSV File Input */}
          <label className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 hover:text-white px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-md">
            <Upload className="w-3.5 h-3.5" />
            <span>{isUploading ? 'Loading...' : 'Upload CSV'}</span>
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleCsvUpload} 
              className="hidden" 
              disabled={isUploading}
              id="input-csv-upload"
            />
          </label>

          {/* PDF Report Export Button */}
          <button
            onClick={triggerPrintExport}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/10 cursor-pointer"
            id="btn-pdf-export"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </header>

      {/* 2. SUB NAVIGATION / TELEMETRY STATUS BAR */}
      <section className="bg-[#0f172a]/90 backdrop-blur-md border-b border-[#1e293b] px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden shadow-md">
        <div className="flex items-center gap-4">
          {/* Dataset Dropdown Selection */}
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider">Active Dataset:</span>
            <select
              value={activeDatasetId}
              onChange={(e) => setActiveDatasetId(e.target.value)}
              className="bg-[#020617] border border-[#1e293b] hover:border-indigo-500/50 text-xs font-semibold text-slate-200 px-3 py-1.5 rounded-lg outline-hidden focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer font-mono"
              id="select-dataset"
            >
              {datasets.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.category})</option>
              ))}
            </select>
          </div>

          <div className="h-5 w-[1px] bg-[#1e293b]" />

          {/* Theme Palette Chooser */}
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider">Palette:</span>
            <div className="flex gap-1.5">
              {Object.keys(PALETTES).map(paletteName => (
                <button
                  key={paletteName}
                  onClick={() => setTheme(paletteName as ColorThemeName)}
                  className={`w-4.5 h-4.5 rounded-full border transition-all ${
                    theme === paletteName ? 'ring-2 ring-indigo-500 border-[#020617] scale-115 shadow-md shadow-indigo-500/10' : 'border-[#1e293b] hover:scale-110'
                  }`}
                  style={{ backgroundColor: PALETTES[paletteName as ColorThemeName][0] }}
                  title={`Apply ${paletteName.replace('_', ' ')} Theme`}
                  id={`btn-theme-${paletteName}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Live Simulation Controls */}
        <div className="flex items-center gap-3 bg-[#020617] border border-[#1e293b] rounded-xl px-3.5 py-1.5 shadow-inner">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${simulating ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${simulating ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              {simulating ? 'Live Telemetry Active' : 'Process Paused'}
            </span>
          </div>

          <button
            onClick={() => setSimulating(!simulating)}
            className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
              simulating 
                ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20' 
                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
            }`}
            id="btn-toggle-simulation"
          >
            {simulating ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
            <span>{simulating ? 'Pause' : 'Resume'}</span>
          </button>
        </div>
      </section>

      {/* 3. MAIN DASHBOARD CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden w-full relative">
        
        {/* LEFT COLUMN: VISUAL DESIGNER AND FIELDS SELECTION */}
        <aside className="w-64 bg-[#0f172a] border-r border-[#1e293b] overflow-y-auto shrink-0 flex flex-col justify-between print:hidden shadow-md">
          {/* Visual Designer Section */}
          <div className="p-5 border-b border-[#1e293b] flex-1">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#1e293b]">
              <BarChart4 className="w-4 h-4 text-indigo-400" />
              <h2 className="font-bold text-xs text-slate-200 uppercase tracking-widest font-mono">Visual Designer</h2>
            </div>

            <form onSubmit={handleSubmitWidgetForm} className="space-y-3.5">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Visual Title</label>
                <input
                  type="text"
                  value={widgetTitle}
                  onChange={(e) => setWidgetTitle(e.target.value)}
                  placeholder="e.g. OEE vs Shift Analysis"
                  className="w-full mt-1.5 bg-[#020617] border border-[#1e293b] hover:border-indigo-500/30 text-xs text-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition-all font-mono placeholder-slate-500"
                  id="input-widget-title"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Chart Type</label>
                <select
                  value={widgetType}
                  onChange={(e) => setWidgetType(e.target.value as any)}
                  className="w-full mt-1.5 bg-[#020617] border border-[#1e293b] text-xs text-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer font-mono"
                  id="select-widget-type"
                >
                  <option value="bar">Bar Chart (Aggregated)</option>
                  <option value="line">Line Trend (Chronological)</option>
                  <option value="pie">Pie Chart (Composition)</option>
                  <option value="scatter">Scatter Plot (Correlation)</option>
                  <option value="kpi">KPI Card Indicator</option>
                  <option value="gauge">Radial Gauge Dial</option>
                  <option value="table">Matrix Data Table</option>
                </select>
              </div>

              {/* Aggregation Settings for KPI Card */}
              {(widgetType === 'kpi' || widgetType === 'gauge') && (
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">KPI Aggregation</label>
                  <select
                    value={kpiCalc}
                    onChange={(e) => setKpiCalc(e.target.value as any)}
                    className="w-full mt-1.5 bg-[#020617] border border-[#1e293b] text-xs text-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer font-mono"
                    id="select-kpi-calc"
                  >
                    <option value="latest">Latest Raw Value</option>
                    <option value="sum">Sum of Values</option>
                    <option value="avg">Average of Values</option>
                    <option value="min">Minimum Value</option>
                    <option value="max">Maximum Value</option>
                    <option value="count">Count of Records</option>
                  </select>
                </div>
              )}

              {/* Axes Mapping Settings */}
              {widgetType !== 'kpi' && widgetType !== 'gauge' && (
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    {widgetType === 'scatter' ? 'X Axis Axis (Scatter)' : 'Axis (X-Axis)'}
                  </label>
                  <select
                    value={xAxisField}
                    onChange={(e) => setXAxisField(e.target.value)}
                    className="w-full mt-1.5 bg-[#020617] border border-[#1e293b] text-xs text-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer font-mono"
                    id="select-xaxis-field"
                  >
                    {activeDataset.columns.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  {widgetType === 'kpi' || widgetType === 'gauge' ? 'KPI Value (Y-Axis)' : 'Values (Y-Axis)'}
                </label>
                <select
                  value={yAxisField}
                  onChange={(e) => setYAxisField(e.target.value)}
                  className="w-full mt-1.5 bg-[#020617] border border-[#1e293b] text-xs text-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer font-mono"
                  id="select-yaxis-field"
                >
                  {activeDataset.columns.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Width Size</label>
                <select
                  value={widgetWidth}
                  onChange={(e) => setWidgetWidth(Number(e.target.value))}
                  className="w-full mt-1.5 bg-[#020617] border border-[#1e293b] text-xs text-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer font-mono"
                  id="select-widget-width"
                >
                  <option value={3}>Small Card (Span 3)</option>
                  <option value={4}>Medium Card (Span 4)</option>
                  <option value={6}>Half Width Screen (Span 6)</option>
                  <option value={12}>Full Width Screen (Span 12)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full mt-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/15 cursor-pointer font-mono uppercase tracking-wider"
                id="btn-add-visual"
              >\n                <Plus className="w-4 h-4 shrink-0" />
                <span>Build Visual</span>
              </button>
            </form>
          </div>

          {/* Active Dataset Fields Checklist */}
          <div className="p-5 border-t border-[#1e293b] bg-[#020617]/40">
            <div className="flex items-center gap-2 mb-3 pb-1 border-b border-[#1e293b]">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <h2 className="font-bold text-xs text-slate-300 uppercase tracking-widest font-mono">Dataset Fields</h2>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {activeDataset.columns.map(c => {
                const isMappedX = c.name === xAxisField;
                const isMappedY = c.name === yAxisField;

                return (
                  <div 
                    key={c.name} 
                    onClick={() => {
                      if (xAxisField === c.name) {
                        setYAxisField(c.name);
                      } else {
                        setXAxisField(c.name);
                      }
                    }}
                    className={`flex items-center justify-between p-2 rounded-lg text-[10px] transition-all cursor-pointer border ${
                      isMappedX 
                        ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300 font-bold' 
                        : isMappedY
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-bold'
                        : 'bg-[#0f172a] border-[#1e293b]/60 hover:bg-[#1e293b] text-slate-400 hover:text-slate-200'
                    }`}
                    title={c.description}
                  >
                    <span className="truncate max-w-[130px] font-mono">{c.name}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[8px] px-1 bg-[#020617] text-slate-400 border border-[#1e293b]/40 rounded-sm uppercase tracking-wide font-mono scale-90">{c.type}</span>
                      {isMappedX && <span className="text-[8px] bg-indigo-600 text-white font-bold px-1 rounded-xs">X</span>}
                      {isMappedY && <span className="text-[8px] bg-amber-500 text-white font-bold px-1 rounded-xs">Y</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* CENTER SECTION: REPORT CANVAS CONTAINER */}
        <main className="flex-1 overflow-y-auto flex flex-col min-w-0 bg-[#020617] print:bg-white relative">
          
          {/* Quick Page Level Filter Strip */}
          {activeDatasetId === 'automotive_assembly' && (
            <div className="bg-[#0f172a]/90 backdrop-blur-md border-b border-[#1e293b] px-6 py-2.5 flex items-center justify-between shrink-0 print:hidden shadow-md text-slate-200">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Report Page Filters:</span>
                
                {/* Shift Filter selector */}
                <div className="flex items-center gap-1 ml-2">
                  <span className="text-[10px] text-slate-400 font-mono">Shift Scope:</span>
                  <select
                    value={shiftFilter}
                    onChange={(e) => setShiftFilter(e.target.value)}
                    className="bg-[#020617] border border-[#1e293b] hover:border-indigo-500/50 text-[10px] font-bold text-slate-200 rounded-md px-2 py-1 focus:outline-hidden font-mono"
                    id="select-shift-filter"
                  >
                    <option value="ALL">All Shifts (Cumulative)</option>
                    <option value="Shift_1_Morning">Shift 1 (Morning)</option>
                    <option value="Shift_2_Afternoon">Shift 2 (Afternoon)</option>
                    <option value="Shift_3_Night">Shift 3 (Night)</option>
                  </select>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-medium font-mono">
                Active Telemetry records: <span className="font-mono text-indigo-400 font-bold">{filteredData.length} logs</span>
              </div>
            </div>
          )}

          {/* REPORT CANVAS STAGE */}
          <div className="flex-1 p-6 relative w-full overflow-x-hidden">
            {/* Visual Header card showing dataset profile */}
            <div className="bg-[#0f172a] rounded-xl border border-[#1e293b] p-5 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-lg">
              <div>
                <span className="text-[9px] font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-sm uppercase tracking-wider font-mono">
                  {activeDataset.category} Category
                </span>
                <h2 className="text-base font-extrabold text-slate-100 tracking-tight mt-1.5 uppercase tracking-wide">
                  {activeTab.name}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5 max-w-2xl leading-normal">
                  {activeDataset.description} Use the sidebar to create custom telemetry components or let the AI Copilot perform deep trend analysis.
                </p>
              </div>

              <div className="bg-[#020617]/60 rounded-lg p-2.5 border border-[#1e293b] shrink-0 flex items-center gap-3 font-mono">
                <div className="text-center">
                  <span className="text-[9px] text-slate-500 block font-semibold uppercase tracking-wider">Columns</span>
                  <span className="text-sm font-black text-indigo-400">{activeDataset.columns.length}</span>
                </div>
                <div className="h-6 w-[1px] bg-[#1e293b]" />
                <div className="text-center">
                  <span className="text-[9px] text-slate-500 block font-semibold uppercase tracking-wider">Rows</span>
                  <span className="text-sm font-black text-indigo-400">{activeData.length}</span>
                </div>
              </div>
            </div>

            {/* BENTO GRID OF POWERBI REPORT CARDS */}
            <div className="grid grid-cols-12 gap-5 w-full">
              {activeTab.widgets.map(w => {
                // Determine widget column span class
                let spanClass = 'col-span-12';
                if (w.w === 3) spanClass = 'col-span-12 sm:col-span-6 md:col-span-3';
                else if (w.w === 4) spanClass = 'col-span-12 sm:col-span-6 md:col-span-4';
                else if (w.w === 6) spanClass = 'col-span-12 md:col-span-6';
                else if (w.w === 8) spanClass = 'col-span-12 md:col-span-8';

                return (
                  <div key={w.id} className={`${spanClass} animate-fade-in`}>
                    <DashboardWidget
                      widget={w}
                      data={filteredData}
                      onDelete={handleDeleteWidget}
                      colorPalette={PALETTES[theme]}
                    />
                  </div>
                );
              })}

              {activeTab.widgets.length === 0 && (
                <div className="col-span-12 bg-[#0f172a]/40 rounded-xl border border-dashed border-[#1e293b] p-12 text-center flex flex-col items-center justify-center gap-3 text-slate-500">
                  <BarChart4 className="w-12 h-12 stroke-1 text-indigo-500/30" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-300 font-mono uppercase tracking-wider">Empty Page Canvas</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm">
                      Use the Visual Designer on the left to map X & Y columns, or let the AI Copilot discover anomalous variables and push dynamic visualizers.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Tabs strip resembling real desktop PowerBI report pages */}
          <div className="bg-[#0f172a] border-t border-[#1e293b] px-4 py-2 flex items-center justify-between shrink-0 print:hidden select-none">
            <div className="flex items-center gap-1.5 overflow-x-auto pr-4">
              {datasets.map(d => {
                const isActive = d.id === activeDatasetId;
                const tabTitle = tabs[d.id]?.name || `${d.name} Analytics`;

                return (
                  <button
                    key={d.id}
                    onClick={() => setActiveDatasetId(d.id)}
                    className={`px-4 py-2 rounded-t-md text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border-t-2 ${
                      isActive 
                        ? 'bg-[#020617] text-slate-100 border-indigo-500 shadow-inner' 
                        : 'bg-[#0f172a] hover:bg-[#1e293b]/50 text-slate-400 border-transparent hover:text-slate-200'
                    }`}
                    id={`tab-button-${d.id}`}
                  >
                    <Layers className="w-3.5 h-3.5 shrink-0" />
                    <span>{tabTitle}</span>
                  </button>
                );
              })}
            </div>

            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest hidden md:block select-none font-mono">
              Report Canvas 100% Zoom
            </div>
          </div>
        </main>

        {/* RIGHT COLUMN: RECHART COPILOT & BOTTLENECK ANALYSIS */}
        <aside className="w-96 overflow-y-auto shrink-0 flex flex-col print:hidden shadow-xs">
          <AiCopilot
            datasetId={activeDatasetId}
            datasetName={activeDataset.name}
            sampleData={activeData}
            columns={activeDataset.columns}
            onAddWidget={handleAddWidget}
          />
        </aside>

      </div>
    </div>
  );
}
