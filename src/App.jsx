import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Import components
import Home from './components/Home';
import JsonStructureBuilder from './components/JsonStructureBuilder';
import JSONFormatter from './components/JSONFormatter';
import EncoderDecoder from './components/EncoderDecoder';
import RegexValidator from './components/RegexValidator';
import SaltEncodeDecode from './components/SaltEncodeDecode';
import HalfWidthFullWidthConverter from './components/HalfWidthFullWidthConverter';
import TextDiffChecker from './components/TextDiffChecker';
import SecurePasswordGenerator from './components/SecurePasswordGenerator';
import SQLValidator from './components/SQLValidator';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="sidebar">
          <div className="sidebar-container">
            <Link to="/" className="sidebar-logo">DevSupport Toolbox</Link>
            <div className="sidebar-links">
              <Link to="/json-structure-builder" className="sidebar-link">承認フロー作成</Link>
              <Link to="/json-formatter" className="sidebar-link">JSON Formatter</Link>
              <Link to="/encoder-decoder" className="sidebar-link">B-crypt Hash</Link>
              <Link to="/regex-validator" className="sidebar-link">Regex Validator</Link>
              <Link to="/salt-encode-decode" className="sidebar-link">Salt Encode/Decode</Link>
              <Link to="/half-width-full-width" className="sidebar-link">Half-Width/Full-Width</Link>
              <Link to="/text-diff-checker" className="sidebar-link">Text Diff Checker</Link>
              <Link to="/secure-password-generator" className="sidebar-link">Secure Password Generator</Link>
              <Link to="/sql-formatter" className="sidebar-link">SQL Formatter</Link>
            </div>
          </div>
        </nav>

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/json-structure-builder" element={<JsonStructureBuilder />} />
            <Route path="/json-formatter" element={<JSONFormatter />} />
            <Route path="/encoder-decoder" element={<EncoderDecoder />} />
            <Route path="/regex-validator" element={<RegexValidator />} />
            <Route path="/salt-encode-decode" element={<SaltEncodeDecode />} />
            <Route path="/half-width-full-width" element={<HalfWidthFullWidthConverter />} />
            <Route path="/text-diff-checker" element={<TextDiffChecker />} />
            <Route path="/secure-password-generator" element={<SecurePasswordGenerator />} />
            <Route path="/sql-formatter" element={<SQLValidator />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;