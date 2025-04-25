import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function toFullWidth(str) {
  return str.replace(/[!-~]/g, ch => String.fromCharCode(ch.charCodeAt(0) + 0xFEE0));
}

function toHalfWidth(str) {
  return str.replace(/[！-～]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0));
}

function HalfWidthFullWidthConverter() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState('toFull');

  const handleConvert = () => {
    if (mode === 'toFull') {
      setResult(toFullWidth(input));
    } else {
      setResult(toHalfWidth(input));
    }
  };

  const handleClear = () => {
    setInput('');
    setResult('');
  };

  return (
    <div className="tool-container halfwidth-fullwidth-converter-container">
      <Link to="/" className="back-to-home">Back to Home</Link>
      <h2>Half-Width/Full-Width Converter</h2>
      <p>Seamlessly convert characters between half-width and full-width formats—perfect for multilingual and localization scenarios.</p>
      <div className="input-group">
        <label htmlFor="hwfw-input">Input Text</label>
        <textarea
          id="hwfw-input"
          rows={3}
          placeholder="Enter text to convert"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Conversion Mode</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="radio"
              name="mode"
              value="toFull"
              checked={mode === 'toFull'}
              onChange={() => setMode('toFull')}
            />
            Half-Width → Full-Width
          </label>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="radio"
              name="mode"
              value="toHalf"
              checked={mode === 'toHalf'}
              onChange={() => setMode('toHalf')}
            />
            Full-Width → Half-Width
          </label>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button onClick={handleConvert} disabled={!input.trim()}>Convert</button>
        <button onClick={handleClear} type="button">Clear</button>
      </div>
      <div className="result-container" style={{ marginTop: '1.5rem' }}>
        <label htmlFor="hwfw-result"><strong>Result:</strong></label>
        <textarea
          id="hwfw-result"
          rows={3}
          value={result}
          readOnly
          style={{ width: '100%', marginTop: '0.5rem' }}
        />
      </div>
    </div>
  );
}

export default HalfWidthFullWidthConverter;