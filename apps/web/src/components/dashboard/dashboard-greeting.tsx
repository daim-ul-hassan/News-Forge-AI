"use client";

import { useEffect, useState } from "react";
import { useProfile } from "@/hooks/use-profile";

export function DashboardGreeting() {
  const { profile } = useProfile();
  const [dateTime, setDateTime] = useState<{
    dayName: string;
    date: string;
    time: string;
    timezone: string;
  } | null>(null);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      // Day of week
      const dayName = now.toLocaleDateString("en-US", { weekday: "long" });

      // Date in DD/MM/YYYY
      const date = now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      // Local time
      const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      // Timezone
      let timezone = "UTC+05:00"; // fallback
      try {
        const timeZoneString = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const abbr = new Intl.DateTimeFormat("en-US", {
          timeZone: timeZoneString,
          timeZoneName: "shortOffset",
        })
          .formatToParts(now)
          .find((p) => p.type === "timeZoneName")?.value;

        if (abbr) {
          timezone = abbr;
        } else {
          timezone = timeZoneString;
        }
      } catch {
        // fallback to UTC+05:00
      }

      setDateTime({ dayName, date, time, timezone });
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!dateTime) return null;

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  })();

  return (
    <div className="mb-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {greeting}, {profile?.displayName || "Creator"} 👋
        </h1>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>{dateTime.dayName}, {dateTime.date}</p>
          <p>{dateTime.time} • {dateTime.timezone}</p>
        </div>
      </div>
    </div>
  );
}
