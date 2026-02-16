import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Globe, ShieldCheck } from "lucide-react";
import { KOGI_LGAS } from "@/lib/kogi-constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

interface VisitorVerificationProps {
    onVerify: (isKogite: boolean, lga?: string) => void;
}

export function VisitorVerification({ onVerify }: VisitorVerificationProps) {
    const [open, setOpen] = useState(false);
    const [isKogite, setIsKogite] = useState(false);
    const [lga, setLga] = useState("");

    useEffect(() => {
        const verified = localStorage.getItem("kogite_verified");
        if (!verified) {
            setOpen(true);
        }
    }, []);

    const handleConfirm = () => {
        localStorage.setItem("kogite_verified", isKogite ? "true" : "false");
        if (isKogite) {
            localStorage.setItem("kogite_lga", lga);
        }
        onVerify(isKogite, lga);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md bg-black/60 backdrop-blur-3xl border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden rounded-[2.5rem] p-0 gap-0">
                <div className="absolute top-0 left-0 w-full h-1.5 kogi-gradient opacity-60" />

                <div className="p-10 space-y-8">
                    <DialogHeader className="space-y-6">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="mx-auto w-20 h-20 rounded-[1.5rem] kogi-gradient flex items-center justify-center shadow-[0_15px_30px_rgba(16,185,129,0.3)]"
                        >
                            <ShieldCheck className="w-10 h-10 text-white" />
                        </motion.div>
                        <div className="text-center space-y-3">
                            <DialogTitle className="text-3xl font-heading font-black tracking-tight text-white uppercase">
                                Identity Check
                            </DialogTitle>
                            <DialogDescription className="text-white/40 font-bold uppercase tracking-widest text-[10px]">
                                Connect to the global Diaspora network
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <div className="space-y-6">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className={`flex items-center space-x-4 p-5 rounded-3xl border transition-all duration-500 cursor-pointer ${isKogite ? 'bg-primary/10 border-primary/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                            onClick={() => setIsKogite(!isKogite)}
                        >
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${isKogite ? 'bg-primary border-primary' : 'bg-transparent border-white/20'}`}>
                                {isKogite && <Globe className="w-4 h-4 text-white" />}
                            </div>
                            <Label className="text-sm font-black text-white/80 cursor-pointer select-none">
                                I am of Kogi Heritage 🇳🇬
                            </Label>
                        </motion.div>

                        <AnimatePresence>
                            {isKogite && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2 px-1">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">
                                            Heritage Root (LGA)
                                        </Label>
                                        <Select onValueChange={setLga}>
                                            <SelectTrigger className="bg-white/5 border-white/5 h-14 rounded-2xl text-white font-bold focus:ring-primary/20">
                                                <SelectValue placeholder="Select Origin" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-black/90 backdrop-blur-3xl border-white/10 rounded-2xl shadow-2xl">
                                                {KOGI_LGAS.map((item) => (
                                                    <SelectItem key={item} value={item} className="text-white/70 hover:text-white transition-colors focus:bg-primary/20">
                                                        {item}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <p className="text-[9px] font-bold text-primary/60 uppercase tracking-widest text-center px-4 leading-relaxed">
                                        Verified Citizens gain full access to the global interactive pulse map.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <DialogFooter className="sm:justify-center">
                        <Button
                            onClick={handleConfirm}
                            className="w-full kogi-gradient text-white font-black text-xs uppercase tracking-widest h-14 rounded-2xl shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(16,185,129,0.4)] transition-all duration-500"
                            disabled={isKogite && !lga}
                        >
                            {isKogite ? "Claim Presence" : "Explore as Guest"}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
