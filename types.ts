
export enum AndroidVersion {
  PIE_9 = '9.0',
  Q_10 = '10.0',
  R_11 = '11.1',
}

export enum BuildType {
  LINEAGE_OS = 'LineageOS',
  ARROW_OS = 'ArrowOS',
  AOSP = 'AOSP',
  DERPFEST = 'DerpFest',
  CUSTOM = 'Custom',
}

export interface BuildConfiguration {
  outputName: string;
  androidVersion: AndroidVersion;
  buildType: BuildType;
  customRepos?: {
    device: string;
    vendor: string;
    kernel: string;
    manifest: string;
    branch: string;
  };
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}

export enum BuildStatus {
  IDLE = 'IDLE',
  INITIALIZING = 'INITIALIZING',
  SYNCING = 'SYNCING',
  PATCHING = 'PATCHING',
  BUILDING = 'BUILDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}
