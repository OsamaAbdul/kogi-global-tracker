// Map of country names to flag emojis
const COUNTRY_FLAGS: Record<string, string> = {
  "nigeria": "🇳🇬", "united states": "🇺🇸", "united kingdom": "🇬🇧", "canada": "🇨🇦",
  "germany": "🇩🇪", "france": "🇫🇷", "south africa": "🇿🇦", "ghana": "🇬🇭",
  "kenya": "🇰🇪", "india": "🇮🇳", "china": "🇨🇳", "japan": "🇯🇵", "australia": "🇦🇺",
  "brazil": "🇧🇷", "italy": "🇮🇹", "spain": "🇪🇸", "netherlands": "🇳🇱",
  "sweden": "🇸🇪", "norway": "🇳🇴", "denmark": "🇩🇰", "finland": "🇫🇮",
  "ireland": "🇮🇪", "portugal": "🇵🇹", "switzerland": "🇨🇭", "belgium": "🇧🇪",
  "austria": "🇦🇹", "poland": "🇵🇱", "russia": "🇷🇺", "turkey": "🇹🇷",
  "egypt": "🇪🇬", "morocco": "🇲🇦", "uae": "🇦🇪", "united arab emirates": "🇦🇪",
  "saudi arabia": "🇸🇦", "singapore": "🇸🇬", "malaysia": "🇲🇾", "indonesia": "🇮🇩",
  "south korea": "🇰🇷", "mexico": "🇲🇽", "argentina": "🇦🇷", "colombia": "🇨🇴",
  "chile": "🇨🇱", "cameroon": "🇨🇲", "senegal": "🇸🇳", "tanzania": "🇹🇿",
  "ethiopia": "🇪🇹", "uganda": "🇺🇬", "rwanda": "🇷🇼", "benin": "🇧🇯",
  "togo": "🇹🇬", "niger": "🇳🇪", "côte d'ivoire": "🇨🇮", "ivory coast": "🇨🇮",
  "new zealand": "🇳🇿", "philippines": "🇵🇭", "thailand": "🇹🇭", "vietnam": "🇻🇳",
  "pakistan": "🇵🇰", "bangladesh": "🇧🇩", "sri lanka": "🇱🇰", "qatar": "🇶🇦",
  "kuwait": "🇰🇼", "bahrain": "🇧🇭", "oman": "🇴🇲", "jordan": "🇯🇴",
  "lebanon": "🇱🇧", "israel": "🇮🇱", "czech republic": "🇨🇿", "czechia": "🇨🇿",
  "romania": "🇷🇴", "hungary": "🇭🇺", "greece": "🇬🇷", "ukraine": "🇺🇦",
};

export function getFlagForLocation(locationName: string): string {
  const lower = locationName.toLowerCase();
  // Country is typically after the last comma
  const parts = lower.split(",").map((s) => s.trim());
  const country = parts[parts.length - 1];
  return COUNTRY_FLAGS[country] || "🌍";
}
