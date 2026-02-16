import { memo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import { User, MapPin } from "lucide-react";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

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

interface WorldMapProps {
  locations: LocationPoint[];
}

export function WorldMapComponent({ locations }: WorldMapProps) {
  return (
    <div className="w-full h-full relative bg-[#020617] cursor-crosshair">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 160, center: [20, 15] }}
        className="w-full h-full"
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rpiKey || geo.properties?.name}
                geography={geo}
                fill="#0f172a"
                stroke="#1e293b"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none", transition: 'all 500ms' },
                  hover: { fill: "#1e293b", outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
        {locations.map((point) => (
          <PulseMarker key={point.id} point={point} />
        ))}
      </ComposableMap>

      {/* Decorative Overlay */}
      <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-[inherit]" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
    </div>
  );
}

function PulseMarker({ point }: { point: LocationPoint }) {
  const [isHovered, setIsHovered] = useState(false);
  const color = point.isNigeria ? "hsl(160, 84%, 35%)" : "hsl(45, 93%, 47%)";

  return (
    <Marker
      coordinates={[point.lng, point.lat]}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.circle
        r={10}
        fill={color}
        fillOpacity={0.15}
        animate={{ r: [10, 24, 10], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
      />

      <motion.circle
        r={5}
        fill={color}
        animate={{ r: [5, 7, 5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="shadow-2xl"
      />

      <g className="cursor-pointer">
        <circle r={8} fill="#000" stroke={color} strokeWidth={1.5} />
        {point.avatarUrl ? (
          <clipPath id={`avatar-clip-${point.id}`}>
            <circle r={7} />
          </clipPath>
        ) : null}

        <g clipPath={point.avatarUrl ? `url(#avatar-clip-${point.id})` : undefined}>
          {point.avatarUrl ? (
            <image
              href={point.avatarUrl}
              x={-7}
              y={-7}
              width={14}
              height={14}
              preserveAspectRatio="xMidYMid slice"
            />
          ) : (
            <User
              x={-5}
              y={-5}
              width={10}
              height={10}
              className="text-white/40"
              style={{ color: "rgba(255,255,255,0.4)" }}
            />
          )}
        </g>
      </g>

      <AnimatePresence>
        {isHovered && (
          <g>
            <motion.foreignObject
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              x={12}
              y={-65}
              width={220}
              height={90}
            >
              <div className="bg-black/80 backdrop-blur-2xl border border-white/10 p-3 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] flex flex-col gap-2 ring-1 ring-white/5 relative">
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-black/80 border-l border-b border-white/10 rotate-45" />

                <div className="flex items-center justify-between gap-3 relative">
                  <span className="font-heading font-black text-[12px] text-white tracking-tight truncate max-w-[120px]">{point.userName}</span>
                  {point.lga && (
                    <span className="bg-primary/20 text-primary border border-primary/20 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest whitespace-nowrap">
                      {point.lga}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-white/40 relative">
                  <MapPin className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest truncate">{point.locationName}</span>
                </div>
              </div>
            </motion.foreignObject>
          </g>
        )}
      </AnimatePresence>
    </Marker>
  );
}

export const WorldMap = memo(WorldMapComponent);
