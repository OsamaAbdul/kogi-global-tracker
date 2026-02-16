import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Globe, Loader2, Check } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

import { KOGI_LGAS } from "@/lib/kogi-constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isKogite, setIsKogite] = useState(false);
  const [lga, setLga] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin && isKogite && !lga) {
      toast({ title: "LGA Required", description: "Please select your Kogi LGA of origin", variant: "destructive" });
      return;
    }

    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: "Login failed", description: error.message, variant: "destructive" });
      }
    } else {
      const { error } = await signUp(email, password, displayName, isKogite, isKogite ? lga : undefined);
      if (error) {
        toast({ title: "Signup failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Welcome Kogite!", description: "Verify your email to join the global pulse." });
      }
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="glass-card border-white/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] backdrop-blur-3xl overflow-hidden rounded-[2rem] relative">
        <div className="absolute top-0 left-0 w-full h-1 kogi-gradient opacity-80" />

        <CardHeader className="text-center space-y-4 pt-10 pb-6">
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto w-16 h-16 rounded-[1.25rem] kogi-gradient flex items-center justify-center mb-2 shadow-[0_10px_20px_rgba(16,185,129,0.3)] relative group cursor-default"
          >
            <div className="absolute inset-0 rounded-[1.25rem] bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            <Globe className="w-8 h-8 text-white" />
          </motion.div>
          <div className="space-y-1.5">
            <CardTitle className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-white/70">
              {isLogin ? "Kogi Global Tracker" : "Register Now"}
            </CardTitle>
            <CardDescription className="text-muted-foreground font-medium text-sm">
              {isLogin ? "Access the global Diaspora network" : "Join the global network of Kogi people"}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-white/5 border-white/10 h-12 rounded-xl focus-visible:ring-primary/30 transition-all text-sm font-medium"
                    required={!isLogin}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@kogi.gov.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10 h-12 rounded-xl focus-visible:ring-primary/30 transition-all text-sm font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Password</Label>
                {isLogin && <button type="button" className="text-[10px] font-bold text-primary hover:text-white transition-colors uppercase tracking-wider">Forgot?</button>}
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/10 h-12 rounded-xl focus-visible:ring-primary/30 transition-all text-sm font-medium"
                required
                minLength={6}
              />
            </div>

            {!isLogin && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4 pt-4 border-t border-white/5 mt-4"
              >
                <div className="flex items-center space-x-3 bg-primary/5 p-4 rounded-2xl border border-primary/10 hover:bg-primary/[0.08] transition-colors cursor-pointer group" onClick={() => setIsKogite(!isKogite)}>
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 ${isKogite ? 'bg-primary border-primary' : 'border-white/10 bg-transparent'}`}>
                    <AnimatePresence>
                      {isKogite && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                          <Check className="w-3.5 h-3.5 text-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <Label className="text-sm font-bold cursor-pointer select-none">
                    Kogi State Citizen 🇳🇬
                  </Label>
                </div>

                <AnimatePresence>
                  {isKogite && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-2"
                    >
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">LGA of Origin</Label>
                      <Select value={lga} onValueChange={setLga} required>
                        <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl text-sm font-medium shadow-sm">
                          <SelectValue placeholder="Identify your LGA" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[250px] glass-card border-white/10 rounded-2xl shadow-2xl backdrop-blur-3xl overflow-hidden p-2">
                          {KOGI_LGAS.map((item) => (
                            <SelectItem key={item} value={item} className="rounded-lg py-3 text-sm font-medium cursor-pointer transition-colors focus:bg-primary/10 focus:text-foreground">
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
              <Button type="submit" className="w-full kogi-gradient text-white font-black text-sm uppercase tracking-widest h-14 rounded-2xl shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(16,185,129,0.4)] transition-all duration-500 mt-6 relative overflow-hidden group" disabled={loading}>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? "Sign In" : "Get Started")}
              </Button>
            </motion.div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-xs font-bold text-muted-foreground hover:text-white transition-all duration-300 uppercase tracking-widest group"
              >
                {isLogin ? "Need an account?" : "Have an account?"}{" "}
                <span className="text-primary group-hover:underline ml-1">
                  {isLogin ? "Create one" : "Sign in here"}
                </span>
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      <p className="mt-8 text-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-40">
        Privacy First • Diaspora Powered • 2026
      </p>
    </motion.div>
  );
}
