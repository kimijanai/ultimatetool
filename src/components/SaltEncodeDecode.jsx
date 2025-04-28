import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Hashids from 'hashids';

const SERVER_SALT = ''; // Set your server salt here if needed
const ENCODE_LENGTH = 12; // Adjust to match your backend's ENCODE_LENGTH

function SaltEncodeDecode() {
  const [input, setInput] = useState('');
  const [salt, setSalt] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState('encode');

  const handleEncode = () => {
    const num = parseInt(input, 10);
    if (isNaN(num)) {
      setResult('Input must be a number for encoding.');
      return;
    }
    const hashids = new Hashids(SERVER_SALT + salt, ENCODE_LENGTH);
    setResult(hashids.encode(num));
    setMode('encode');
  };

  const handleDecode = () => {
    const hashids = new Hashids(SERVER_SALT + salt, ENCODE_LENGTH);
    const decoded = hashids.decode(input);
    setResult(decoded.length > 0 ? decoded[0].toString() : '0');
    setMode('decode');
  };

  const handleInputChange = (e) => setInput(e.target.value);
  const handleSaltChange = (e) => setSalt(e.target.value);

  return (
    <div className="tool-container salt-encode-decode-container">
      <Link to="/" className="back-to-home">Back to Home</Link>
      <h2>Salt Encode/Decode Utility (Hashids)</h2>
      <p>Encode a number to a salted hash or decode a salted hash to a number using Hashids.</p>
      <div className="input-group">
        <label htmlFor="salt-input">{mode === 'encode' ? 'Input Number' : 'Input Hash'}</label>
        <textarea
          id="salt-input"
          rows={3}
          placeholder={mode === 'encode' ? "Enter number to encode" : "Enter hash to decode"}
          value={input}
          onChange={handleInputChange}
        />
      </div>
      <div className="input-group">
        <label htmlFor="salt-key">Salt Key</label>
        <input
          type="text"
          id="salt-key"
          placeholder="Enter salt key"
          value={salt}
          onChange={handleSaltChange}
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