interface Reading {
  id: number;
  glucose: number;
  time: string;
  notes: string;
  timestamp: Date;
  category: 'low' | 'normal' | 'high';
}

interface Stats {
    latestReading: number | null;
    averageReading: number | null;
    readingsCount: number;
    normalPercent: number;
    highPercent: number;
    lowPercent: number;
    avgGlucose: number;
}