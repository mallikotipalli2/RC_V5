import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Landing } from './pages/Landing';
import { RandomChat } from './pages/RandomChat';
import { ChipDual } from './pages/ChipDual';
import { About } from './pages/About';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { SafeGuide } from './pages/SafeGuide';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Chat page has its own layout (no header/footer) */}
          <Route path="/chat" element={<RandomChat />} />
          
          {/* All other pages have standard layout */}
          <Route path="*" element={
            <>
              <Header />
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/chip-dual" element={<ChipDual />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/safe-guide" element={<SafeGuide />} />
              </Routes>
              <Footer />
            </>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
