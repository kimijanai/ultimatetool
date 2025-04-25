import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Import components
import Home from './components/Home';
import JSONFormatter from './components/JSONFormatter';
import EncoderDecoder from './components/EncoderDecoder';
import RegexValidator from './components/RegexValidator';
import SaltEncodeDecode from './components/SaltEncodeDecode';
import HalfWidthFullWidthConverter from './components/HalfWidthFullWidthConverter';
import TextDiffChecker from './components/TextDiffChecker';
import SecurePasswordGenerator from './components/SecurePasswordGenerator';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">DevSupport Toolbox</Link>
            <div className="nav-links">
              <Link to="/json-formatter" className="nav-link">JSON Formatter</Link>
              <Link to="/encoder-decoder" className="nav-link">Encoder/Decoder</Link>
              <Link to="/regex-validator" className="nav-link">Regex Validator</Link>
              <Link to="/salt-encode-decode" className="nav-link">Salt Encode/Decode</Link>
              <Link to="/half-width-full-width" className="nav-link">Half-Width/Full-Width</Link>
              <Link to="/text-diff-checker" className="nav-link">Text Diff Checker</Link>
              <Link to="/secure-password-generator" className="nav-link">Secure Password Generator</Link>
            </div>
          </div>
        </nav>

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/json-formatter" element={<JSONFormatter />} />
            <Route path="/encoder-decoder" element={<EncoderDecoder />} />
            <Route path="/regex-validator" element={<RegexValidator />} />
            <Route path="/salt-encode-decode" element={<SaltEncodeDecode />} />
            <Route path="/half-width-full-width" element={<HalfWidthFullWidthConverter />} />
            <Route path="/text-diff-checker" element={<TextDiffChecker />} />
            <Route path="/secure-password-generator" element={<SecurePasswordGenerator />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;