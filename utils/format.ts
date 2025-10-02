const SUFFIXES = ["", "K", "M", "B", "T", "q", "Q", "s", "S", "O", "N", "d", "U", "D"];

export function formatNumber(value: number): string {
  if (value < 1000) {
    if (Number.isInteger(value) || value === 0) return value.toString();
    if (value < 10) return value.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
    return value.toFixed(1).replace(/\.0$/, '');
  }

  const tier = Math.floor(Math.log10(value) / 3);
  
  if (tier >= SUFFIXES.length) {
      return value.toExponential(2);
  }

  const suffix = SUFFIXES[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = value / scale;

  return scaled.toFixed(2) + suffix;
}

export function formatDuration(ms: number): string {
    if (ms <= 0) return "0s";
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 && parts.length < 2) parts.push(`${seconds}s`);
    
    return parts.join(' ') || "0s";
}