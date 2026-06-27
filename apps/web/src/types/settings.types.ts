export interface UserSettings {
  theme: "system" | "light" | "dark";
  density?: "comfortable" | "compact" | "dense";
  effectsEnabled?: boolean;
  notifications: {
    research: boolean;
    trends: boolean;
    opportunities: boolean;
  };
  aiPreferences: {
    providerOrder: string[];
    defaultModel: string;
    streaming: boolean;
  };
  /** Mirrors profiles.display_name for cross-table availability */
  displayName?: string;
}
