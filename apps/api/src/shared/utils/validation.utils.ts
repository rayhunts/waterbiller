/**
 * Validation utility functions
 */
export class ValidationUtils {
  /**
   * Validate meter reading (current >= previous)
   */
  static isValidReading(currentReading: number, previousReading: number): boolean {
    return currentReading >= previousReading;
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format (basic)
   */
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
  }

  /**
   * Generate account number
   */
  static generateAccountNumber(): string {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `WB${timestamp}${random}`;
  }

  /**
   * Generate meter number
   */
  static generateMeterNumber(): string {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `MTR${timestamp}${random}`;
  }
}
