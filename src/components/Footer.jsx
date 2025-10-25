import { Link } from 'react-router-dom';
import './Footer.css';

export const Footer = () => {
  return (
    <footer className="footer">
      <ul className="footer-links">
        <li><Link to="/privacy">Privacy Policy</Link></li>
        <li><Link to="/terms">Terms of Service</Link></li>
        <li><Link to="/safe-guide">Safety Guide</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
      <p className="footer-copyright">RandomChips &copy; 2025</p>
    </footer>
  );
};
