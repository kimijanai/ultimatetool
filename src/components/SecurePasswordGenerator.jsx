import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function SecurePasswordGenerator() {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!charset) {
      setError('Please select at least one character type.');
      setPassword('');
      return;
    }
    let pwd = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      pwd += charset[randomIndex];
    }
    setPassword(pwd);
    setError('');
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="encoder-decoder-container">
      <Link to="/" className="back-to-home">Back to Home</Link>
      <h2>Secure Password Generator</h2>
      <div className="encoder-section">
        <div className="input-group">
          <label>Password Length:</label>
          <input
            type="number"
            min="4"
            max="64"
            value={length}
            onChange={e => setLength(Number(e.target.value))}
          />
        </div>
        <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}><input type="checkbox" checked={includeUppercase} onChange={e => setIncludeUppercase(e.target.checked)} /> Uppercase (A-Z)</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}><input type="checkbox" checked={includeLowercase} onChange={e => setIncludeLowercase(e.target.checked)} /> Lowercase (a-z)</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}><input type="checkbox" checked={includeNumbers} onChange={e => setIncludeNumbers(e.target.checked)} /> Numbers (0-9)</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}><input type="checkbox" checked={includeSymbols} onChange={e => setIncludeSymbols(e.target.checked)} /> Symbols (!@#$...)</label>
          </div>
        </div>
        <button onClick={generatePassword}>Generate Password</button>
        {password && (
          <div className="result-container">
            <pre>{password}</pre>
            <button className="copy-button" onClick={copyToClipboard}>{copied ? 'Copied!' : 'Copy Password'}</button>
          </div>
        )}
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}

export default SecurePasswordGenerator;