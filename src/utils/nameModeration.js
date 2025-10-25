// Comprehensive name moderation system
// Blocks: underage mentions, incest terms, abusive content, phone numbers, special chars

const BLOCKED_PATTERNS = {
  // Age-related patterns (under 18) - Only block clear underage indicators
  underage: [
    /\b(1[0-7]|[0-9])\b/,  // Block numbers 0-17 anywhere as standalone
    /\b\d{1,2}(yo|yr|yrs|years?old)\b/i,  // age indicator with numbers (15yo, 17yearsold, etc)
    /\b(kid|child)(ren)?\b/i,  // kid, child, kids, children - clearly underage terms
    /\bminor\b/i,  // legal term for underage
  ],
  
  // Family/incest terms with common variations - FIXED to require full word matches
  incest: [
    /\b(dad|daddy|father|papa|pops?)\b/i,
    /\b(mom|mommy|mother|mama|mum)\b/i,
    /\b(sis|sister|bro|brother)\b/i,
    /\b(son|daughter|child|kid)(ren)?\b/i,
    /\b(uncle|aunt|cousin|nephew|niece)s?\b/i,
    /\b(step)?(dad|mom|sis|bro|son|daughter)\b/i,
    /\b(family|relative|incest)\b/i,
  ],
  
  // Young variations
  young: [
    /\b(young|yng|yong|yung|youth|juvenile)\b/i,
    /\b(minor|underage|jailbait|loli|shota)\b/i,
  ],
  
  // Explicit/abusive content
  explicit: [
    /\b(fuck|shit|bitch|ass|dick|cock|pussy|cunt|slut|whore|rape|porn)\b/i,
    /\b(nude|naked|sex|sexy|horny|kinky|nsfw)\b/i,
    /\b(anal|oral|blow|suck|cum|orgasm)\b/i,
  ],
  
  // Phone numbers - various international formats
  phone: [
    /\b\d{10,}\b/,  // 10+ consecutive digits
    /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/,  // US format: 555-555-5555
    /\b\+?\d{1,3}[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b/,  // International: +1-555-5555
    /\b\(\d{3}\)[-.\s]?\d{3}[-.\s]?\d{4}\b/,  // (555) 555-5555
  ],
  
  // Special characters (allow only letters and numbers)
  specialChars: [
    /[^a-zA-Z0-9]/,  // Anything that's not alphanumeric
  ],
};

/**
 * Validates a username against all moderation rules
 * @param {string} name - The username to validate
 * @returns {Object} { isValid: boolean, reason: string }
 */
export function validateName(name) {
  if (!name || name.trim() === '') {
    return { isValid: true, reason: '' }; // Empty is ok, will use default
  }
  
  const trimmedName = name.trim();
  
  // Empty is allowed (will use default "RandomChip")
  if (trimmedName.length === 0) {
    return { isValid: true, reason: '' };
  }
  
  // Check length (1-20 characters)
  if (trimmedName.length > 20) {
    return { 
      isValid: false, 
      reason: 'Name must be 1-20 characters' 
    };
  }
  
  // Check for spaces
  if (/\s/.test(trimmedName)) {
    return { 
      isValid: false, 
      reason: 'No spaces allowed' 
    };
  }
  
  // Check special characters
  for (const pattern of BLOCKED_PATTERNS.specialChars) {
    if (pattern.test(trimmedName)) {
      return { 
        isValid: false, 
        reason: 'Only letters and numbers allowed' 
      };
    }
  }
  
  // Check phone numbers
  for (const pattern of BLOCKED_PATTERNS.phone) {
    if (pattern.test(trimmedName)) {
      return { 
        isValid: false, 
        reason: 'Phone numbers not allowed' 
      };
    }
  }
  
  // Check underage patterns
  for (const pattern of BLOCKED_PATTERNS.underage) {
    if (pattern.test(trimmedName)) {
      return { 
        isValid: false, 
        reason: 'Age-related content not allowed' 
      };
    }
  }
  
  // Check young variations
  for (const pattern of BLOCKED_PATTERNS.young) {
    if (pattern.test(trimmedName)) {
      return { 
        isValid: false, 
        reason: 'Age-related content not allowed' 
      };
    }
  }
  
  // Check incest terms
  for (const pattern of BLOCKED_PATTERNS.incest) {
    if (pattern.test(trimmedName)) {
      return { 
        isValid: false, 
        reason: 'Inappropriate content detected' 
      };
    }
  }
  
  // Check explicit content
  for (const pattern of BLOCKED_PATTERNS.explicit) {
    if (pattern.test(trimmedName)) {
      return { 
        isValid: false, 
        reason: 'Inappropriate language detected' 
      };
    }
  }
  
  return { isValid: true, reason: '' };
}

/**
 * Sanitizes a name for display (fallback to default if invalid)
 * @param {string} name - The username to sanitize
 * @returns {string} Sanitized name or 'RandomChip'
 */
export function sanitizeName(name) {
  const validation = validateName(name);
  if (!validation.isValid || !name || name.trim() === '') {
    return 'RandomChip';
  }
  return name.trim();
}
