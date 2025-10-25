/* Chip/Fries Icon Component */
export const ChipIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* French fry/chip shape */}
    <path 
      d="M8 3 L10 3 L11 21 L9 21 Z" 
      fill="currentColor" 
      opacity="0.9"
    />
    <path 
      d="M12 2 L14 2 L15 21 L13 21 Z" 
      fill="currentColor"
    />
    <path 
      d="M16 4 L18 4 L17 21 L15 21 Z" 
      fill="currentColor" 
      opacity="0.8"
    />
    {/* Glow effect */}
    <path 
      d="M8 3 L10 3 L11 21 L9 21 Z M12 2 L14 2 L15 21 L13 21 Z M16 4 L18 4 L17 21 L15 21 Z" 
      stroke="currentColor" 
      strokeWidth="0.5" 
      opacity="0.5"
    />
  </svg>
);

/* Alternative: Potato Chip Icon */
export const PotatoChipIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Wavy chip shape */}
    <path 
      d="M4 12 Q6 8, 8 10 T12 12 Q14 14, 16 12 T20 10 Q19 14, 16 16 T12 14 Q10 12, 8 14 T4 12 Z" 
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.9"
    />
    {/* Inner detail */}
    <ellipse cx="10" cy="12" rx="1.5" ry="1" fill="currentColor" opacity="0.5"/>
    <ellipse cx="14" cy="13" rx="1" ry="1.5" fill="currentColor" opacity="0.5"/>
  </svg>
);
