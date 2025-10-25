import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useTheme } from '../context/ThemeContext';
import { ChipButton, ChipIconButton } from '../components/ChipButton';
import { ChipIcon } from '../components/ChipIcon';
import { sanitizeName } from '../utils/nameModeration';
import './RandomChat.css';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://rcv5-production.up.railway.app' 
    : 'http://localhost:3000');

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
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
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

  // Initialize Socket.io connection
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      query: { userName }
    });
    
    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('Connected to server');
      console.log('Emitting search event...');
      socket.emit('search');
    });

    socket.on('connected', ({ partnerName: pName, sessionId: sId }) => {
      console.log('Matched with partner:', pName);
      setPartnerName(pName);
      setSessionId(sId);
      setState(CHAT_STATES.CONNECTED);
      addSystemMessage(`Connected to ${pName}`);
    });

    socket.on('message', ({ message }) => {
      addPartnerMessage(message);
    });

    socket.on('partner_typing', () => {
      setIsPartnerTyping(true);
    });

    socket.on('partner_stopped_typing', () => {
      setIsPartnerTyping(false);
    });

    socket.on('partner_disconnected', () => {
      addSystemMessage('Chip disconnected');
      setState(CHAT_STATES.DISCONNECTED);
      setTimeout(() => {
        setMessages([]);
        setState(CHAT_STATES.SEARCHING);
        setPartnerName('RandomChip');
        setSessionId(null);
        socket.emit('search');
      }, 2000);
    });

    socket.on('banned', ({ reason, duration }) => {
      addSystemMessage(`You have been temporarily banned: ${reason}. Please come back later.`);
      setState(CHAT_STATES.DISCONNECTED);
      setTimeout(() => {
        window.location.href = '/';
      }, 5000);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [userName]);

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
    if (!inputValue.trim() || state !== CHAT_STATES.CONNECTED || !socketRef.current) return;

    const message = inputValue.trim();
    addUserMessage(message);
    socketRef.current.emit('message', { message });
    setInputValue('');

    // Stop typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    socketRef.current.emit('stop_typing');
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);

    if (!socketRef.current || state !== CHAT_STATES.CONNECTED) return;

    // Send typing indicator
    socketRef.current.emit('typing');

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit('stop_typing');
    }, 2000);
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
    
    // Confirmed - disconnect and search for new partner
    if (socketRef.current) {
      socketRef.current.emit('next');
    }
    
    addSystemMessage('Finding new Chip...');
    setState(CHAT_STATES.SEARCHING);
    setShowNextConfirm(false);
    setMessages([]);
    setPartnerName('RandomChip');
    setSessionId(null);
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

  const handleReportSubmit = async () => {
    if (!reportReason || !sessionId) return;
    
    try {
      // Submit report to backend
      const response = await fetch(`${SOCKET_URL}/api/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          reason: reportReason
        })
      });

      if (response.ok) {
        addSystemMessage(`Chip reported for ${reportReason}. Thank you for keeping RandomChips safe.`);
      } else {
        addSystemMessage('Failed to submit report. Please try again.');
      }
    } catch (error) {
      console.error('Report submission error:', error);
      addSystemMessage('Failed to submit report. Please try again.');
    }
    
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
              {partnerName || 'Chip'} is typing…
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
            onChange={handleInputChange}
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
