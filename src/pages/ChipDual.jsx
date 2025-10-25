import './ChipDual.css';

export const ChipDual = () => {
  return (
    <div className="chip-dual-page">
      <div className="wip-container">
        <div className="bouncing-chip">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <rect x="10" y="10" width="80" height="80" rx="16" 
                  fill="none" stroke="currentColor" strokeWidth="3"/>
            <circle cx="50" cy="50" r="20" fill="currentColor" opacity="0.3"/>
            <circle cx="50" cy="50" r="10" fill="currentColor"/>
          </svg>
        </div>
        <h1 className="glow-text">Chip Dual</h1>
        <p className="wip-message">Work In Progress — Stay Tuned Chip!</p>
        <p className="wip-subtitle">
          Double the conversation, double the mystery. Coming soon to RandomChips.
        </p>
      </div>
    </div>
  );
};
