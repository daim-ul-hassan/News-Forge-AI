export interface UserSettings {
  theme: "system" | "light" | "dark";
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
}
