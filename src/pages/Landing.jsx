import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ChipButton } from '../components/ChipButton';
import { ChipIcon } from '../components/ChipIcon';
import { validateName } from '../utils/nameModeration';
import './Landing.css';

export const Landing = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [nameError, setNameError] = useState('');
  const [ageConfirmed, setAgeConfirmed] = useState(false);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setUserName(value);
    
    // Real-time validation
    const validation = validateName(value);
    setNameError(validation.isValid ? '' : validation.reason);
  };

  const handleStartChat = (e) => {
    e.preventDefault();
    
    // Final validation before navigation
    if (!ageConfirmed) {
      return; // Button should be disabled anyway
    }
    
    const validation = validateName(userName);
    if (!validation.isValid && userName.trim() !== '') {
      setNameError(validation.reason);
      return;
    }
    
    // Navigate to chat with name parameter
    const finalName = userName.trim() || 'RandomChip';
    navigate('/chat', { state: { userName: finalName } });
  };

  return (
    <main className="landing-main">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container text-center">
          <div className="hero-logo">
            <div className="chip-logo-large">
              <svg width="140" height="160" viewBox="0 0 140 160" className="chip-svg">
                {/* Red Fries Container/Cup */}
                <defs>
                  <linearGradient id="cupGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#dc2626', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#b91c1c', stopOpacity: 1}} />
                  </linearGradient>
                </defs>
                
                <path d="M40 95 L35 145 C35 150 38 155 43 155 L97 155 C102 155 105 150 105 145 L100 95 Z" 
                      fill="url(#cupGradient)" 
                      stroke="#991b1b" 
                      strokeWidth="2"
                      className="fries-cup"/>
                
                {/* Yellow stripes on cup */}
                <rect x="38" y="105" width="64" height="2.5" fill="#fbbf24" opacity="0.7"/>
                
                {/* RC Letters - Simple and integrated */}
                <text x="50" y="128" 
                      fontFamily="Arial, sans-serif" 
                      fontSize="20" 
                      fontWeight="bold" 
                      fill="#fef3c7"
                      stroke="#fbbf24"
                      strokeWidth="1">R</text>
                
                <text x="67" y="128" 
                      fontFamily="Arial, sans-serif" 
                      fontSize="20" 
                      fontWeight="bold" 
                      fill="#fef3c7"
                      stroke="#fbbf24"
                      strokeWidth="1">C</text>
                
                <rect x="37" y="138" width="66" height="2.5" fill="#fbbf24" opacity="0.7"/>
                
                {/* French Fries - More realistic shape */}
                {/* Fry 1 - Left side */}
                <path d="M48 40 L44 45 L46 90 L52 90 L54 45 Z" 
                      fill="#fbbf24" 
                      stroke="#d97706"
                      strokeWidth="1"
                      className="fry fry-1"/>
                <rect x="46" y="38" width="6" height="5" rx="1" fill="#f59e0b" className="fry fry-1"/>
                
                {/* Fry 2 - Center Left */}
                <path d="M58 25 L54 30 L56 90 L62 90 L64 30 Z" 
                      fill="#fbbf24"
                      stroke="#d97706"
                      strokeWidth="1"
                      className="fry fry-2"/>
                <rect x="56" y="23" width="6" height="5" rx="1" fill="#f59e0b" className="fry fry-2"/>
                
                {/* Fry 3 - Center (tallest) */}
                <path d="M68 15 L64 20 L66 90 L72 90 L74 20 Z" 
                      fill="#fbbf24"
                      stroke="#d97706"
                      strokeWidth="1"
                      className="fry fry-3"/>
                <rect x="66" y="13" width="6" height="5" rx="1" fill="#f59e0b" className="fry fry-3"/>
                
                {/* Fry 4 - Center Right */}
                <path d="M78 30 L74 35 L76 90 L82 90 L84 35 Z" 
                      fill="#fbbf24"
                      stroke="#d97706"
                      strokeWidth="1"
                      className="fry fry-4"/>
                <rect x="76" y="28" width="6" height="5" rx="1" fill="#f59e0b" className="fry fry-4"/>
                
                {/* Fry 5 - Right side */}
                <path d="M88 45 L84 50 L86 90 L92 90 L94 50 Z" 
                      fill="#fbbf24"
                      stroke="#d97706"
                      strokeWidth="1"
                      className="fry fry-5"/>
                <rect x="86" y="43" width="6" height="5" rx="1" fill="#f59e0b" className="fry fry-5"/>
                
                {/* Salt Particles - More visible */}
                <circle cx="50" cy="55" r="2" fill="white" className="salt" opacity="0.9"/>
                <circle cx="70" cy="45" r="2.5" fill="white" className="salt" opacity="0.9"/>
                <circle cx="62" cy="65" r="1.5" fill="white" className="salt" opacity="0.8"/>
                <circle cx="80" cy="60" r="2" fill="white" className="salt" opacity="0.9"/>
                <circle cx="58" cy="50" r="1.5" fill="white" className="salt" opacity="0.8"/>
                <circle cx="75" cy="70" r="2" fill="white" className="salt" opacity="0.9"/>
                <circle cx="85" cy="55" r="1.5" fill="white" className="salt" opacity="0.8"/>
              </svg>
            </div>
          </div>
          
          <h1 className="hero-title glow-text">RandomChips</h1>
          <p className="hero-tagline">Hop between Chips instantly</p>
        </div>
      </section>

      {/* Feature Section - Simplified Bar */}
      <section className="features-section">
        <div className="container">
          <div className="chat-feature-bar">
            <div className="feature-bar-content">
              <div className="feature-bar-icon">
                <ChipIcon size={48} />
              </div>
              <div className="feature-bar-text">
                <h2>Random Chat</h2>
                <p>Connect with a random Chip instantly</p>
              </div>
              
              {/* Name Input */}
              <div className="name-input-wrapper">
                <input
                  type="text"
                  className={`name-input ${nameError ? 'error' : ''}`}
                  placeholder="RandomChip"
                  value={userName}
                  onChange={handleNameChange}
                  maxLength={20}
                />
                {nameError && <span className="name-error">{nameError}</span>}
              </div>
              
              {/* Start Chat Button */}
              <ChipButton 
                variant="primary" 
                className="feature-bar-cta"
                onClick={handleStartChat}
                disabled={!ageConfirmed || (nameError && userName.trim() !== '')}
              >
                Start Chat
              </ChipButton>
            </div>
            
            {/* Age Confirmation Checkbox */}
            <div className="age-confirmation">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={ageConfirmed}
                  onChange={(e) => setAgeConfirmed(e.target.checked)}
                />
                <span className="checkbox-text">
                  I confirm I am 18+ and read the{' '}
                  <Link to="/privacy" className="policy-link">Privacy Policy</Link>,{' '}
                  <Link to="/terms" className="policy-link">Terms of Service</Link> &{' '}
                  <Link to="/safety" className="policy-link">Safety Guide</Link>.
                </span>
              </label>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
