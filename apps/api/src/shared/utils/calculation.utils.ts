/**
 * Billing calculation utilities with tiered pricing
 */

export interface BillBreakdown {
  units: number;
  rate: number;
  amount: number;
}

export interface BillCalculation {
  subtotal: number;
  baseCharge: number;
  total: number;
  breakdown: BillBreakdown[];
}

export class BillingCalculator {
  private static readonly TIERS = [
    { max: 10, rate: 2 },
    { max: 50, rate: 3 },
    { max: Infinity, rate: 4 },
  ];
  private static readonly BASE_CHARGE = 5;

  /**
   * Calculate bill amount using tiered pricing
   * Tier 1: 0-10 units = $2/unit
   * Tier 2: 11-50 units = $3/unit
   * Tier 3: 50+ units = $4/unit
   * Base charge: $5
   */
  static calculateBillAmount(consumption: number): BillCalculation {
    let remaining = consumption;
    let subtotal = 0;
    const breakdown: BillBreakdown[] = [];
    let previousMax = 0;

    for (const tier of this.TIERS) {
      if (remaining <= 0) break;

      const unitsInTier = Math.min(remaining, tier.max - previousMax);
      const amount = unitsInTier * tier.rate;

      subtotal += amount;
      breakdown.push({
        units: unitsInTier,
        rate: tier.rate,
        amount,
      });

      remaining -= unitsInTier;
      previousMax = tier.max;
    }

    return {
      subtotal,
      baseCharge: this.BASE_CHARGE,
      total: subtotal + this.BASE_CHARGE,
      breakdown,
    };
  }

  /**
   * Calculate consumption from meter readings
   */
  static calculateConsumption(currentReading: number, previousReading: number): number {
    return currentReading - previousReading;
  }

  /**
   * Get base charge
   */
  static getBaseCharge(): number {
    return this.BASE_CHARGE;
  }

  /**
   * Get pricing tiers
   */
  static getTiers() {
    return [...this.TIERS];
  }
}
