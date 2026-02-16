import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, MapPin, Users, Activity } from "lucide-react";
import { getFlagForLocation } from "@/lib/countryFlags";
import { motion } from "framer-motion";

interface LocationData {
  id: string;
  locationName: string;
  lastSeen: string;
}

interface AnalyticsSidebarProps {
  locations: LocationData[];
  totalCount: number;
}

export function AnalyticsSidebar({ locations, totalCount }: AnalyticsSidebarProps) {
  const cityMap: Record<string, number> = {};
  locations.forEach((loc) => {
    if (loc.locationName) {
      cityMap[loc.locationName] = (cityMap[loc.locationName] || 0) + 1;
    }
  });
  const topCities = Object.entries(cityMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const recentCheckins = [...locations]
    .sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime())
    .slice(0, 8);

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6 overflow-y-auto no-scrollbar bg-black/20 backdrop-blur-3xl border-l border-white/5">
      <div className="flex items-center justify-between group">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <h2 className="font-heading font-black text-xs uppercase tracking-[0.2em] text-white/50 group-hover:text-white transition-colors">Real-time Pulse</h2>
        </div>
        <Activity className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors duration-500" />
      </div>

      <div className="space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4">
          <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.3 }}>
            <Card className="bg-white/[0.03] border-white/5 rounded-3xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Users className="w-12 h-12 text-primary" />
              </div>
              <CardContent className="p-6">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Global Reach</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black tracking-tighter text-white">{totalCount.toLocaleString()}</span>
                  <span className="text-[10px] font-bold text-primary">+12%</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.3 }}>
            <Card className="bg-white/[0.03] border-white/5 rounded-3xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Activity className="w-12 h-12 text-primary" />
              </div>
              <CardContent className="p-6">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Active Now</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black tracking-tighter text-white">{locations.length}</span>
                  <div className="flex gap-0.5 items-center">
                    <div className="w-1 h-1 rounded-full bg-primary animate-ping" />
                    <span className="text-[10px] font-bold text-primary uppercase">Live</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Top Hubs */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
            <Globe className="w-3 h-3" /> Leading Hubs
          </h3>
          <div className="space-y-3">
            {topCities.length === 0 && <p className="text-[10px] font-bold text-white/20 italic">Awaiting telemetry...</p>}
            {topCities.map(([city, count], i) => (
              <div key={city} className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] transition-all cursor-default group">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-white/20 w-4">{i + 1}</span>
                  <span className="text-lg">{getFlagForLocation(city)}</span>
                  <span className="text-xs font-bold text-white/70 group-hover:text-white transition-colors truncate max-w-[100px]">{city}</span>
                </div>
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/10">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Feed */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
            <MapPin className="w-3 h-3" /> Telegram Feed
          </h3>
          <div className="space-y-4">
            {recentCheckins.length === 0 && <p className="text-[10px] font-bold text-white/20 italic">Searching for signals...</p>}
            {recentCheckins.map((loc, idx) => (
              <motion.div
                key={loc.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="flex items-center gap-3 group"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover:border-primary/30 transition-colors">
                  <span className="text-sm">{getFlagForLocation(loc.locationName || "")}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-bold text-white/80 truncate group-hover:text-white transition-colors">{loc.locationName || "Satellite"}</span>
                  <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">
                    {new Date(loc.lastSeen).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div className="ml-auto w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
