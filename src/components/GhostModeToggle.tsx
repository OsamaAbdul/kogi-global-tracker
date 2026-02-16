import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Ghost } from "lucide-react";
import { motion } from "framer-motion";

interface GhostModeToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function GhostModeToggle({ enabled, onToggle }: GhostModeToggleProps) {
  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all duration-500 border ${enabled ? 'bg-primary/10 border-primary/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
      <motion.div
        animate={{ scale: enabled ? 1.1 : 1, rotate: enabled ? [0, 10, -10, 0] : 0 }}
        transition={{ duration: 0.5 }}
      >
        <Ghost className={`w-4 h-4 transition-colors duration-500 ${enabled ? "text-primary shadow-primary" : "text-white/40"}`} />
      </motion.div>
      <Label htmlFor="ghost-mode" className="text-[10px] font-black uppercase tracking-widest cursor-pointer select-none text-white/70">
        Ghost Mode
      </Label>
      <Switch
        id="ghost-mode"
        checked={enabled}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-primary"
      />
    </div>
  );
}
