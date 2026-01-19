export type CardType = "visa" | "mastercard" | "amex" | "unknown";

export interface CardValidation {
  isValid: boolean;
  type: CardType;
  message?: string;
}

/**
 * Detect card type from card number
 */
export function detectCardType(cardNumber: string): CardType {
  const cleaned = cardNumber.replace(/\s/g, "");

  // Visa: starts with 4
  if (/^4/.test(cleaned)) {
    return "visa";
  }

  // Mastercard: starts with 51-55 or 2221-2720
  if (/^5[1-5]/.test(cleaned) || /^2(22[1-9]|2[3-9]\d|[3-6]\d{2}|7[01]\d|720)/.test(cleaned)) {
    return "mastercard";
  }

  // Amex: starts with 34 or 37
  if (/^3[47]/.test(cleaned)) {
    return "amex";
  }

  return "unknown";
}

/**
 * Format card number with spaces
 */
export function formatCardNumber(value: string, cardType: CardType): string {
  const cleaned = value.replace(/\s/g, "");

  if (cardType === "amex") {
    // Amex: 4-6-5 format (e.g., 3782 822463 10005)
    const match = cleaned.match(/(\d{1,4})(\d{1,6})?(\d{1,5})?/);
    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join(" ");
    }
  } else {
    // Visa/Mastercard: 4-4-4-4 format
    const match = cleaned.match(/(\d{1,4})(\d{1,4})?(\d{1,4})?(\d{1,4})?/);
    if (match) {
      return [match[1], match[2], match[3], match[4]].filter(Boolean).join(" ");
    }
  }

  return cleaned;
}

/**
 * Validate card number using Luhn algorithm
 */
export function validateCardNumber(cardNumber: string): CardValidation {
  const cleaned = cardNumber.replace(/\s/g, "");
  const cardType = detectCardType(cleaned);

  // Check if empty
  if (!cleaned) {
    return { isValid: false, type: cardType, message: "Card number is required" };
  }

  // Check length based on card type
  if (cardType === "amex" && cleaned.length !== 15) {
    return { isValid: false, type: cardType, message: "Amex card must be 15 digits" };
  }

  if ((cardType === "visa" || cardType === "mastercard") && cleaned.length !== 16) {
    return { isValid: false, type: cardType, message: "Card number must be 16 digits" };
  }

  if (cardType === "unknown") {
    return { isValid: false, type: cardType, message: "Card type not supported" };
  }

  // Luhn algorithm validation
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  const isValid = sum % 10 === 0;

  return {
    isValid,
    type: cardType,
    message: isValid ? undefined : "Invalid card number",
  };
}

/**
 * Format expiry date MM/YY
 */
export function formatExpiryDate(value: string): string {
  const cleaned = value.replace(/\D/g, "");

  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  }

  return cleaned;
}

/**
 * Validate expiry date
 */
export function validateExpiryDate(expiry: string): { isValid: boolean; message?: string } {
  const cleaned = expiry.replace(/\D/g, "");

  if (cleaned.length !== 4) {
    return { isValid: false, message: "Expiry date must be MM/YY format" };
  }

  const month = parseInt(cleaned.slice(0, 2), 10);
  const year = parseInt(cleaned.slice(2, 4), 10);

  if (month < 1 || month > 12) {
    return { isValid: false, message: "Invalid month" };
  }

  // Check if card is expired
  const now = new Date();
  const currentYear = now.getFullYear() % 100; // Last 2 digits
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return { isValid: false, message: "Card has expired" };
  }

  return { isValid: true };
}

/**
 * Format CVC
 */
export function formatCVC(value: string, cardType: CardType): string {
  const cleaned = value.replace(/\D/g, "");
  const maxLength = cardType === "amex" ? 4 : 3;
  return cleaned.slice(0, maxLength);
}

/**
 * Validate CVC
 */
export function validateCVC(cvc: string, cardType: CardType): { isValid: boolean; message?: string } {
  const cleaned = cvc.replace(/\D/g, "");
  const expectedLength = cardType === "amex" ? 4 : 3;

  if (cleaned.length !== expectedLength) {
    return {
      isValid: false,
      message: `CVC must be ${expectedLength} digits for ${cardType.toUpperCase()}`,
    };
  }

  return { isValid: true };
}

/**
 * Validate cardholder name
 */
export function validateCardholderName(name: string): { isValid: boolean; message?: string } {
  const trimmed = name.trim();

  if (!trimmed) {
    return { isValid: false, message: "Cardholder name is required" };
  }

  if (trimmed.length < 3) {
    return { isValid: false, message: "Name must be at least 3 characters" };
  }

  // Check if name contains at least one space (first and last name)
  if (!/\s/.test(trimmed)) {
    return { isValid: false, message: "Please enter full name (first and last)" };
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
    return { isValid: false, message: "Name contains invalid characters" };
  }

  return { isValid: true };
}
