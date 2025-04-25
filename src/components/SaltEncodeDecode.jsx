import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function addSalt(text, salt) {
  return `${salt}${text}${salt}`;
}

function removeSalt(text, salt) {
  if (text.startsWith(salt) && text.endsWith(salt)) {
    return text.slice(salt.length, -salt.length);
  }
  return text;
}

function SaltEncodeDecode() {
  const [input, setInput] = useState('');
  const [salt, setSalt] = useState('SALT123');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState('encode');

  const handleEncode = () => {
    setResult(addSalt(input, salt));
    setMode('encode');
  };

  const handleDecode = () => {
    setResult(removeSalt(input, salt));
    setMode('decode');
  };

  const handleInputChange = (e) => setInput(e.target.value);
  const handleSaltChange = (e) => setSalt(e.target.value);

  return (
    <div className="tool-container salt-encode-decode-container">
      <Link to="/" className="back-to-home">Back to Home</Link>
      <h2>Salt Encode/Decode Utility</h2>
      <p>Encode and decode text using salt-based algorithms.</p>
      <div className="input-group">
        <label htmlFor="salt-input">Input Text</label>
        <textarea
          id="salt-input"
          rows={3}
          placeholder="Enter text to encode/decode"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button onClick={handleEncode} disabled={!input.trim()}>Encode</button>
        <button onClick={handleDecode} disabled={!input.trim()}>Decode</button>
      </div>
      <div className="result-container" style={{ marginTop: '1.5rem' }}>
        <label htmlFor="salt-result"><strong>Result:</strong></label>
        <textarea
          id="salt-result"
          rows={3}
          value={result}
          readOnly
          style={{ width: '100%', marginTop: '0.5rem' }}
        />
      </div>
    </div>
  );
}

export default SaltEncodeDecode;