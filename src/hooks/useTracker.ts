import { useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentPosition, reverseGeocode, offsetCoords } from "@/lib/geolocation";
import { useAuth } from "@/hooks/useAuth";

interface TrackerOptions {
    ghostMode?: boolean;
}

export function useTracker({ ghostMode = false }: TrackerOptions = {}) {
    const { user } = useAuth();
    const lastUpdateRef = useRef<number>(0);
    const MIN_UPDATE_INTERVAL = 2 * 60 * 1000; // 2 minutes

    const track = useCallback(async (forcedLat?: number, forcedLng?: number) => {
        // Check if verified Kogite
        const isVerifiedAnonymous = localStorage.getItem("kogite_verified") === "true";
        const isVerifiedUser = user?.user_metadata?.is_kogite === true;

        if (!isVerifiedAnonymous && !isVerifiedUser) {
            console.log("Not a verified Kogite, skipping track.");
            return;
        }

        const now = Date.now();
        if (now - lastUpdateRef.current < MIN_UPDATE_INTERVAL && !forcedLat) {
            return;
        }

        console.log("Tracking cycle triggered for Kogite...");
        let guestId = localStorage.getItem("guest_id");
        if (!guestId) {
            guestId = crypto.randomUUID();
            localStorage.setItem("guest_id", guestId);
        }

        try {
            let lat: number, lng: number;

            if (forcedLat !== undefined && forcedLng !== undefined) {
                lat = forcedLat;
                lng = forcedLng;
            } else {
                const pos = await getCurrentPosition();
                lat = pos.coords.latitude;
                lng = pos.coords.longitude;
            }

            console.log("Acquired position:", { lat, lng });

            if (ghostMode) {
                const offset = offsetCoords(lat, lng, 3); // 3km offset
                lat = offset.lat;
                lng = offset.lng;
            }

            // Default to Nigeria-ish if we get zeros (fallback error)
            if (lat === 0 && lng === 0) {
                lat = 9.082;
                lng = 8.6753;
            }

            const locationName = await reverseGeocode(lat, lng);
            const userLga = user?.user_metadata?.lga || localStorage.getItem("kogite_lga");

            const upsertData: any = {
                location_name: locationName,
                coords: `POINT(${lng} ${lat})`,
                latitude: lat,
                longitude: lng,
                is_active: true,
                ghost_mode: ghostMode,
                is_kogite: true, // We already checked verification above
                lga: userLga,
                last_seen: new Date().toISOString(),
            };

            if (user) {
                upsertData.user_id = user.id;
                upsertData.anonymous_id = null;
            } else {
                upsertData.anonymous_id = guestId;
                upsertData.user_id = null;
            }

            const { error } = await supabase.from("kogite_locations").upsert(
                upsertData,
                { onConflict: user ? "user_id" : "anonymous_id" }
            );

            if (!error) {
                lastUpdateRef.current = now;
            }
        } catch (err) {
            console.error("Tracker failed:", err);
        }
    }, [user, ghostMode]);

    useEffect(() => {
        // Initial track
        track();

        // Heartbeat interval (every 15 mins to refresh last_seen even if stationary)
        const interval = setInterval(() => track(), 15 * 60 * 1000);

        // Continuous watch if supported
        let watchId: number | null = null;
        if (navigator.geolocation && !ghostMode) {
            watchId = navigator.geolocation.watchPosition(
                (pos) => track(pos.coords.latitude, pos.coords.longitude),
                (err) => console.warn("WatchPosition error:", err),
                { enableHighAccuracy: false, timeout: 30000, maximumAge: 60000 }
            );
        }

        return () => {
            clearInterval(interval);
            if (watchId !== null) navigator.geolocation.clearWatch(watchId);
        };
    }, [track, ghostMode]);
}
