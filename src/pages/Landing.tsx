import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AuthForm } from "@/components/AuthForm";
import { Globe, MapPin, Shield, Zap, Activity } from "lucide-react";
import { WorldMap } from "@/components/WorldMap";
import { AnalyticsSidebar } from "@/components/AnalyticsSidebar";
import { supabase } from "@/integrations/supabase/client";
import { useTracker } from "@/hooks/useTracker";

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
  const str = String(coords);
  const match = str.match(/POINT\(([^ ]+) ([^ ]+)\)/);
  if (match) {
    return { lng: parseFloat(match[1]), lat: parseFloat(match[2]) };
  }
  return null;
}

import { VisitorVerification } from "@/components/VisitorVerification";

export default function Landing() {
  const [locations, setLocations] = useState<any[]>([]);

  // Start real-time tracking for visitors (only if verified)
  useTracker();

  const fetchLocations = async () => {
    const query = supabase
      .from("kogite_locations")
      .select("id, latitude, longitude, location_name, is_active, is_kogite, profiles(display_name, avatar_url, lga)")
      .eq("is_active", true)
      .eq("is_kogite", true) as any;

    const { data, error } = await query;

    if (error) return;
    if (data) setLocations(data);
  };

  useEffect(() => {
    fetchLocations();
    const channel = supabase
      .channel("landing-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "kogite_locations" }, fetchLocations)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const mapPoints: LocationPoint[] = locations.map((loc: any) => {
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
  }).filter(Boolean) as LocationPoint[];

  const analyticData = locations.map((loc: any) => ({
    id: loc.id,
    locationName: loc.location_name || "Unknown",
    lastSeen: loc.last_seen || new Date().toISOString(),
  }));

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[0%] right-[-10%] w-[30%] h-[50%] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="w-10 h-10 rounded-xl kogi-gradient flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)] group-hover:scale-105 transition-transform duration-500">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-xl leading-none tracking-tight">Kogi Global Tracker</span>
              <span className="text-[10px] font-bold text-primary/80 uppercase tracking-widest mt-0.5">Anywhere, Anytime</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Global Pulse', 'About Network', 'Innovation'].map((item) => (
              <button key={item} className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors">
                {item}
              </button>
            ))}
            <div className="w-px h-4 bg-white/10" />
            <button className="text-xs font-black uppercase tracking-widest px-6 py-2.5 rounded-full border border-white/10 hover:bg-white/5 transition-all">
              Login
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-20">
        {/* Hero Section */}
        <section className="relative px-6 py-24 md:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="lg:col-span-7 space-y-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <Zap className="w-3 h-3 animate-pulse" />
                2026 Innovation Challenge Powered
              </div>

              <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tighter">
                Mapping the <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-emerald-400 to-primary">
                  Kogi Diaspora
                </span>
              </h1>

              <p className="text-white/50 text-xl max-w-xl leading-relaxed font-medium">
                Connect. Track. Evolve. Join the real-time global network of Kogi citizens.
                A high-fidelity bridge between heritage and innovation.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
                {[
                  { icon: MapPin, label: "Live Markers" },
                  { icon: Shield, label: "Ghost Mode" },
                  { icon: Globe, label: "Global Presence" },
                  { icon: Zap, label: "Real-time Sync" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="group relative">
                    <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex flex-col items-center gap-3 text-center bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-primary/20 transition-all cursor-default">
                      <Icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-500" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">{label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="lg:col-span-5 relative"
            >
              <div className="absolute -inset-10 bg-primary/20 rounded-full blur-[100px] opacity-20 animate-pulse" />
              <AuthForm />
            </motion.div>
          </div>
        </section>

        {/* Interactive Pulse Section */}
        <section className="py-24 px-6 border-t border-white/5 relative bg-white/[0.02]">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Global Pulse</h2>
                <p className="text-white/40 text-lg font-medium max-w-md uppercase tracking-wider text-xs">
                  Real-time activity from verified Kogites worldwide.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-3xl font-black text-primary">{locations.length}</span>
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Active Members</span>
                </div>
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary animate-pulse" />
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-8 h-[700px]">
              <div className="lg:col-span-3 glass-morphism rounded-[2.5rem] overflow-hidden group">
                <div className="absolute top-6 left-6 z-20 pointer-events-none">
                  <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Live Worldwide Feed</span>
                  </div>
                </div>
                <WorldMap locations={mapPoints} />
              </div>

              <div className="lg:col-span-1 glass-morphism rounded-[2.5rem] overflow-hidden flex flex-col">
                <AnalyticsSidebar locations={analyticData} totalCount={locations.length} />
              </div>
            </div>
          </div>
        </section>

        {/* Innovative Roadmap Section */}
        <section className="py-32 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-12">
            <div className="w-px h-24 bg-gradient-to-b from-transparent via-primary to-transparent" />
            <h3 className="text-2xl md:text-4xl font-black tracking-tight max-w-2xl leading-snug">
              Built for the <br />
              <span className="text-white/40 uppercase text-xs font-bold tracking-[0.3em] block mt-4">32-Year Development Plan</span>
            </h3>
            <p className="text-white/30 text-sm max-w-lg leading-relaxed">
              KGT Pulse is not just a tool; it's a digital cornerstone for the Kogi State Innovation Challenge,
              connecting our global talent to local growth.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 py-20 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg kogi-gradient flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-black text-lg">KGT</span>
          </div>

          <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
            {['Privacy Policy', 'Terms of Use', 'Contact Support', 'Developer Portal'].map((item) => (
              <a key={item} href="#" className="hover:text-primary transition-colors">{item}</a>
            ))}
          </div>

          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
            © 2026 KOGI STATE GOVERNEMNT • INNOVATION CHALLENGE
          </p>
        </div>
      </footer>

      {/* Verification Modal for Visitors */}
      <VisitorVerification onVerify={() => { fetchLocations(); }} />
    </div>
  );
}
