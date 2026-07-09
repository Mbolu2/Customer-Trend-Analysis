// Shared Types for the PowerBI Production Dashboard

export type ChartType = 'bar' | 'line' | 'pie' | 'scatter' | 'kpi' | 'gauge' | 'table';

export interface Widget {
  id: string;
  title: string;
  type: ChartType;
  xAxisField: string;
  yAxisField: string;
  colorTheme?: string;
  w: number; // grid column width (1 to 12)
  h: number; // height unit (e.g., small, medium, large)
  kpiField?: string;
  kpiCalc?: 'sum' | 'avg' | 'count' | 'latest' | 'min' | 'max';
  explanation?: string; // AI metadata explanation
  isAiGenerated?: boolean;
}

export interface ReportTab {
  id: string;
  name: string;
  iconName?: string;
  widgets: Widget[];
}

export interface AIAnalysisResult {
  summary: string;
  insights: Array<{
    title: string;
    description: string;
    severity: 'critical' | 'warning' | 'info';
    metric?: string;
  }>;
  suggestedVisual?: {
    title: string;
    chartType: ChartType;
    xAxisField: string;
    yAxisField: string;
    explanation: string;
  };
}

export interface FilterState {
  field: string;
  value: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
}

export type ColorThemeName = 'powerbi_classic' | 'steel_blue' | 'emerald_industrial' | 'amber_energy' | 'carbon_dark';
