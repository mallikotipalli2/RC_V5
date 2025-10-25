import './ChipButton.css';

export const ChipButton = ({ children, onClick, variant = 'default', className = '', ...props }) => {
  return (
    <button 
      className={`chip-button ${variant} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export const ChipIconButton = ({ children, onClick, title, className = '', ...props }) => {
  return (
    <button 
      className={`chip-icon-button ${className}`}
      onClick={onClick}
      title={title}
      {...props}
    >
      {children}
    </button>
  );
};
