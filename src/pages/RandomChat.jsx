import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { ChipButton, ChipIconButton } from '../components/ChipButton';
import { ChipIcon } from '../components/ChipIcon';
import { sanitizeName } from '../utils/nameModeration';
import './RandomChat.css';

const CHAT_STATES = {
  SEARCHING: 'searching',
  CONNECTED: 'connected',
  TYPING: 'typing',
  DISCONNECTED: 'disconnected'
};

export const RandomChat = () => {
  const location = useLocation();
  const userName = sanitizeName(location.state?.userName || 'RandomChip');
  
  const [state, setState] = useState(CHAT_STATES.SEARCHING);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [partnerName, setPartnerName] = useState('RandomChip');
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [showNextConfirm, setShowNextConfirm] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const adEnabled = false; // Toggle for ad strip during dev
  const { theme, toggleTheme } = useTheme();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPartnerTyping]);

  // Auto-focus input when connected
  useEffect(() => {
    if (state === CHAT_STATES.CONNECTED && inputRef.current) {
      inputRef.current.focus();
    }
  }, [state]);

  // Simulate connection (demo mode)
  useEffect(() => {
    if (state === CHAT_STATES.SEARCHING) {
      const timer = setTimeout(() => {
        setState(CHAT_STATES.CONNECTED);
        addSystemMessage('Connected to RandomChip');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const addSystemMessage = (text) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'system',
      text,
      timestamp: new Date()
    }]);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      text,
      timestamp: new Date()
    }]);
  };

  const addPartnerMessage = (text) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'partner',
      text,
      timestamp: new Date()
    }]);
  };

  const handleSend = () => {
    if (!inputValue.trim() || state !== CHAT_STATES.CONNECTED) return;

    addUserMessage(inputValue);
    setInputValue('');

    // Demo: Simulate partner response
    setTimeout(() => {
      setIsPartnerTyping(true);
      setTimeout(() => {
        setIsPartnerTyping(false);
        const responses = [
          'Hey there!',
          'Interesting...',
          'Tell me more',
          'Cool!',
          'That\'s fascinating',
          'I see what you mean'
        ];
        addPartnerMessage(responses[Math.floor(Math.random() * responses.length)]);
      }, 1500);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNextChip = () => {
    if (!showNextConfirm) {
      setShowNextConfirm(true);
      setTimeout(() => setShowNextConfirm(false), 3000); // Reset after 3s
      return;
    }
    
    // Confirmed - disconnect
    addSystemMessage('Chip disconnected');
    setState(CHAT_STATES.DISCONNECTED);
    setShowNextConfirm(false);
    setTimeout(() => {
      setMessages([]);
      setState(CHAT_STATES.SEARCHING);
      setPartnerName('RandomChip');
    }, 1000);
  };

  const handleReqPhoto = () => {
    if (state === CHAT_STATES.CONNECTED) {
      addSystemMessage('Photo request sent to Chip');
    }
  };

  const handleReport = () => {
    if (state === CHAT_STATES.CONNECTED) {
      setShowReportModal(true);
    }
  };

  const handleReportSubmit = () => {
    if (!reportReason) return;
    
    // TODO: Backend implementation
    // Store in DB: { ip, location, chatLogs, reason, timestamp }
    // IP will be used for temporary bans
    // Location for policy improvements
    
    addSystemMessage(`Chip reported for ${reportReason}. Thank you for keeping RandomChips safe.`);
    setShowReportModal(false);
    setReportReason('');
    setTimeout(() => handleNextChip(), 1500);
  };

  return (
    <div className="random-chat-page">
      {/* Header Zone */}
      <header className="chat-header">
        <Link to="/" className="header-left">
          <ChipIcon size={32} className="chip-logo-small" />
          <span className="logo-text">RandomChips</span>
        </Link>
        
        <div className="header-actions">
          <ChipIconButton 
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="theme-toggle-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {theme === 'dark' ? (
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              ) : (
                <>
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </>
              )}
            </svg>
          </ChipIconButton>
        </div>
      </header>

      {/* Ad Strip */}
      {adEnabled && (
        <div className="ad-strip">
          <div className="ad-placeholder">
            Advertisement Space
          </div>
        </div>
      )}

      {/* Chat Display Zone */}
      <div className="chat-display">
        <div className="messages-container">
          {state === CHAT_STATES.SEARCHING && messages.length === 0 && (
            <div className="system-message centered fade-in">
              Finding a fresh Chip…
            </div>
          )}
          
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`message ${message.type} fade-in`}
            >
              <div className="message-text">{message.text}</div>
              <div className="message-timestamp">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          
          {isPartnerTyping && (
            <div className="typing-indicator fade-in">
              Chip is typing…
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Zone */}
      <div className="chat-input-zone">
        <div className="input-container">
          <input
            ref={inputRef}
            type="text"
            className="chat-input"
            placeholder={state === CHAT_STATES.CONNECTED ? "Type your message…" : "Waiting for connection…"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={state !== CHAT_STATES.CONNECTED}
          />
          <ChipButton 
            variant="primary" 
            onClick={handleSend}
            disabled={!inputValue.trim() || state !== CHAT_STATES.CONNECTED}
          >
            SEND
          </ChipButton>
        </div>
        
        <div className="input-actions">
          <ChipButton 
            onClick={handleNextChip} 
            className={`action-btn ${showNextConfirm ? 'confirm-btn' : ''}`}
          >
            {showNextConfirm ? 'New Chip? Yes!' : 'Next Chip'}
          </ChipButton>
          <ChipButton onClick={handleReqPhoto} disabled={state !== CHAT_STATES.CONNECTED} className="action-btn">
            Req Photo
          </ChipButton>
          <ChipButton onClick={handleReport} disabled={state !== CHAT_STATES.CONNECTED} className="action-btn">
            Report Chip
          </ChipButton>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="report-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Report Chip</h3>
            <p className="modal-subtitle">Help us keep RandomChips safe</p>
            
            <div className="report-options">
              <label className={`report-option ${reportReason === 'Threat' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="report"
                  value="Threat"
                  checked={reportReason === 'Threat'}
                  onChange={(e) => setReportReason(e.target.value)}
                />
                <span>Threat / Violence</span>
              </label>
              
              <label className={`report-option ${reportReason === 'Inappropriate' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="report"
                  value="Inappropriate"
                  checked={reportReason === 'Inappropriate'}
                  onChange={(e) => setReportReason(e.target.value)}
                />
                <span>Inappropriate Content</span>
              </label>
              
              <label className={`report-option ${reportReason === 'Spam' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="report"
                  value="Spam"
                  checked={reportReason === 'Spam'}
                  onChange={(e) => setReportReason(e.target.value)}
                />
                <span>Spam / Advertising</span>
              </label>
              
              <label className={`report-option ${reportReason === 'Other' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="report"
                  value="Other"
                  checked={reportReason === 'Other'}
                  onChange={(e) => setReportReason(e.target.value)}
                />
                <span>Other</span>
              </label>
            </div>
            
            <div className="modal-actions">
              <ChipButton onClick={() => setShowReportModal(false)} className="modal-btn">
                Cancel
              </ChipButton>
              <ChipButton 
                onClick={handleReportSubmit} 
                variant="primary" 
                disabled={!reportReason}
                className="modal-btn"
              >
                Submit Report
              </ChipButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
