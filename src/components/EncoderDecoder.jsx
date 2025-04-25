import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import './EncoderDecoder.css';
import { Link } from 'react-router-dom';

function EncoderDecoder() {
  const [textToHash, setTextToHash] = useState('');
  const [bcryptCost, setBcryptCost] = useState(12);
  const [bcryptHash, setBcryptHash] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [verifyHash, setVerifyHash] = useState('');
  const [verifyResult, setVerifyResult] = useState('');
  const [error, setError] = useState('');

  const generateBcryptHash = async () => {
    try {
      const salt = await bcrypt.genSalt(bcryptCost);
      const hash = await bcrypt.hash(textToHash, salt);
      setBcryptHash(hash);
      setError('');
    } catch (err) {
      setError('Error generating bcrypt hash: ' + err.message);
    }
  };

  const verifyBcryptHash = async () => {
    try {
      const isMatch = await bcrypt.compare(verifyPassword, verifyHash);
      setVerifyResult(isMatch ? 'Password matches!' : 'Password does not match.');
      setError('');
    } catch (err) {
      setError('Error verifying password: ' + err.message);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="tool-container encoder-decoder-container">
      <Link to="/" className="back-to-home">Back to Home</Link>
      <h2>Encoder/Decoder</h2>
      <h2>Encoder/Decoder Utility</h2>
      
      <div className="encoder-section">
        <h3>Bcrypt Hash Generator</h3>
        <div className="input-group">
          <input
            type="text"
            value={textToHash}
            onChange={(e) => setTextToHash(e.target.value)}
            placeholder="Enter text to hash"
          />
          <label>Cost Factor (4-31):</label>
          <input
            type="number"
            min="4"
            max="31"
            value={bcryptCost}
            onChange={(e) => setBcryptCost(Number(e.target.value))}
          />
          <button onClick={generateBcryptHash}>Generate Hash</button>
        </div>
        {bcryptHash && (
          <div className="result-container">
            <pre>{bcryptHash}</pre>
            <button className="copy-button" onClick={() => copyToClipboard(bcryptHash)}>Copy Hash</button>
          </div>
        )}
      </div>

      <div className="encoder-section">
        <h3>Bcrypt Hash Verifier</h3>
        <div className="input-group">
          <input
            type="text"
            value={verifyPassword}
            onChange={(e) => setVerifyPassword(e.target.value)}
            placeholder="Enter password to verify"
          />
          <input
            type="text"
            value={verifyHash}
            onChange={(e) => setVerifyHash(e.target.value)}
            placeholder="Enter hash to verify against"
          />
          <button onClick={verifyBcryptHash}>Verify Password</button>
        </div>
        {verifyResult && <div className={`result-container ${verifyResult.includes('matches') ? 'success-message' : 'error-message'}`}>{verifyResult}</div>}
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default EncoderDecoder;