import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { WorldMap } from "@/components/WorldMap";
import { AnalyticsSidebar } from "@/components/AnalyticsSidebar";
import { GhostModeToggle } from "@/components/GhostModeToggle";
import { Button } from "@/components/ui/button";
import { Globe, LogOut, Loader2, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCurrentPosition, reverseGeocode, offsetCoords } from "@/lib/geolocation";
import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface LocationRow {
  id: string;
  user_id: string | null;
  location_name: string | null;
  coords: unknown;
  latitude: number | string | null;
  longitude: number | string | null;
  is_active: boolean | null;
  is_kogite: boolean | null;
  lga: string | null;
  ghost_mode: boolean | null;
  last_seen: string | null;
  profiles?: {
    display_name: string | null;
    avatar_url: string | null;
    lga: string | null;
  } | null;
}

interface LocationPoint {
  id: string;
  lat: number;
  lng: number;
  locationName: string;
  userName: string;
  avatarUrl?: string | null;
  lga?: string | null;
  isNigeria: boolean;
}

function parseCoords(coords: unknown): { lat: number; lng: number } | null {
  if (!coords) return null;
  // PostGIS returns WKT or GeoJSON; with supabase-js it comes as string
  const str = String(coords);
  // Match POINT(lng lat)
  const match = str.match(/POINT\(([^ ]+) ([^ ]+)\)/);
  if (match) {
    return { lng: parseFloat(match[1]), lat: parseFloat(match[2]) };
  }
  return null;
}

import { useTracker } from "@/hooks/useTracker";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [locations, setLocations] = useState<LocationRow[]>([]);
  const [ghostMode, setGhostMode] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  // Use the centralized real-time tracker
  useTracker({ ghostMode });

  // Fetch all locations
  const fetchLocations = useCallback(async () => {
    const { data } = await (supabase
      .from("kogite_locations")
      .select("id, latitude, longitude, location_name, is_active, is_kogite, profiles(display_name, avatar_url, lga)")
      .eq("is_active", true)
      .eq("is_kogite", true) as any);
    if (data) setLocations(data as any[]);
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  useEffect(() => {
    const channel = supabase
      .channel("locations-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "kogite_locations" }, () => {
        fetchLocations();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchLocations]);

  const handleGhostToggle = (enabled: boolean) => {
    setGhostMode(enabled);
    toast({
      title: enabled ? "Ghost Mode Active" : "Ghost Mode Off",
      description: enabled ? "Your location is now slightly blurred on the map." : "Your exact location is now visible.",
    });
  };

  const mapPoints: LocationPoint[] = locations
    .map((loc) => {
      const lat = Number(loc.latitude);
      const lng = Number(loc.longitude);
      if (isNaN(lat) || isNaN(lng)) return null;
      return {
        id: loc.id,
        lat,
        lng,
        locationName: loc.location_name || "Unknown",
        userName: loc.profiles?.display_name || (loc.user_id ? "Authenticated User" : "Guest"),
        avatarUrl: loc.profiles?.avatar_url,
        lga: loc.profiles?.lga || loc.lga,
        isNigeria: loc.location_name?.toLowerCase().includes("nigeria") ?? false,
      };
    })
    .filter(Boolean) as LocationPoint[];

  const analyticData = locations.map((loc) => ({
    id: loc.id,
    locationName: loc.location_name || "Unknown",
    lastSeen: loc.last_seen || new Date().toISOString(),
  }));

  return (
    <div className="h-screen flex flex-col bg-black text-white selection:bg-primary/30 overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[0%] right-[-10%] w-[30%] h-[50%] bg-primary/3 rounded-full blur-[100px]" />
      </div>

      {/* Modern Header */}
      <header className="relative w-full h-20 px-6 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-2xl z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl kogi-gradient flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.25)]">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-lg leading-none tracking-tight">KOGI GLOBAL TRACKER</span>
              <span className="text-[9px] font-black text-primary/80 uppercase tracking-[0.2em] mt-1 flex items-center gap-1.5">
                {geoLoading && <Loader2 className="w-2.5 h-2.5 animate-spin" />}
                Verified Network
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <GhostModeToggle enabled={ghostMode} onToggle={handleGhostToggle} />

          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="w-11 h-11 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 transition-all">
                  <Activity className="w-5 h-5 text-primary" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0 w-[85%] max-w-[400px] border-l border-white/5 bg-black">
                <div className="h-full">
                  <AnalyticsSidebar locations={analyticData} totalCount={locations.length} />
                </div>
              </SheetContent>
            </Sheet>
          )}

          <div className="w-px h-6 bg-white/10 hidden sm:block mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 transition-all h-11 px-4 rounded-xl flex gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Map View */}
        <motion.div
          className="flex-1 relative group"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          <div className="h-full w-full bg-black/20">
            <WorldMap locations={mapPoints} />
          </div>

          {/* Map Overlay Decor */}
          <div className="absolute top-6 left-6 pointer-events-none">
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/70">Live Satellite Feed</span>
            </div>
          </div>
        </motion.div>

        {/* Intelligence Sidebar */}
        <aside className="hidden lg:block w-[400px] h-full overflow-hidden">
          <AnalyticsSidebar locations={analyticData} totalCount={locations.length} />
        </aside>
      </div>
    </div>
  );
}
