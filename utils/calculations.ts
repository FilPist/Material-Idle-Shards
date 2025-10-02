export const calculateCost = (base: number, multiplier: number, count: number): number => {
  return Math.floor(base * Math.pow(multiplier, count));
};

export const calculateBulkCost = (base: number, multiplier: number, startLevel: number, amount: number): number => {
  if (amount <= 0) return 0;
  // For geometric series, direct formula is faster than a loop
  if (multiplier !== 1) {
    return Math.floor(base * Math.pow(multiplier, startLevel) * (Math.pow(multiplier, amount) - 1) / (multiplier - 1));
  }
  return base * amount;
};

export const calculateMaxAffordable = (base: number, multiplier: number, startLevel: number, shards: number): number => {
    if (shards < calculateCost(base, multiplier, startLevel)) return 0;

    let amount = 0;
    if (multiplier > 1) {
        // Derived from geometric series sum formula: S = a * (r^n - 1) / (r - 1)
        // We solve for n (amount): n = log_r(S * (r - 1) / a + 1)
        const a = base * Math.pow(multiplier, startLevel);
        const logArg = (shards * (multiplier - 1)) / a + 1;
        if (logArg < 1) return 0;
        amount = Math.floor(Math.log(logArg) / Math.log(multiplier));
    } else { // multiplier is 1 or less
        amount = Math.floor(shards / base);
    }
    
    if (amount <= 0) return 0;

    // The formula gives an estimate, binary search or iterative check for precision
    while (calculateBulkCost(base, multiplier, startLevel, amount) > shards) {
        amount--;
    }
    
    // Check if we can afford one more after rounding, to be safe
    while (calculateBulkCost(base, multiplier, startLevel, amount + 1) <= shards) {
        amount++;
    }

    return amount;
};