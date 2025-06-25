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
    avgReading: number | null;
    readingsCount: number;
    normalPercent: number;
    highPercent: number;
    lowPercent: number;
    avgGlucose: number;
}

interface Settings {
    glucoseUnit: 'mg/dL' | 'mmol/L';
    lowThreshold: number;
    highThreshold: number;
    reminderEnabled: boolean;
    reminderTime: string[];
    themeColor: string;
    notificationEnabled: boolean;
    biometricLogin: boolean;
    autoBackupEnabled: boolean;
    dataRetention: '1year' | '2years' | '5years' | 'indefinite';
}