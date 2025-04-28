import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function RegexValidator() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('');
  const [testString, setTestString] = useState('');
  const [error, setError] = useState('');
  const [matches, setMatches] = useState(null);

  const handleValidate = () => {
    setError('');
    setMatches(null);
    try {
      let flagsWithG = flags.includes('g') ? flags : flags + 'g';
      const regex = new RegExp(pattern, flagsWithG);
      const result = [...testString.matchAll(regex)];
      setMatches(result.length > 0 ? result : []);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="tool-container regex-validator-container">
      <Link to="/" className="back-to-home">Back to Home</Link>
      <h2>Regex Validator & Generator</h2>
      <p>Build, test, and validate regular expressions with enhanced functionality.</p>
      <div className="input-group">
        <label htmlFor="regex-pattern">Regular Expression Pattern</label>
        <input
          id="regex-pattern"
          type="text"
          placeholder="e.g. ^[a-zA-Z0-9]+$"
          value={pattern}
          onChange={e => setPattern(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label htmlFor="regex-flags">Flags (optional)</label>
        <input
          id="regex-flags"
          type="text"
          placeholder="e.g. gim"
          value={flags}
          onChange={e => setFlags(e.target.value)}
          maxLength={5}
        />
      </div>
      <div className="input-group">
        <label htmlFor="test-string">Test String</label>
        <textarea
          id="test-string"
          rows={4}
          placeholder="Enter text to test against the regex"
          value={testString}
          onChange={e => setTestString(e.target.value)}
        />
      </div>
      <button onClick={handleValidate}>Validate</button>
      {error && <div className="error-message">{error}</div>}
      {matches && (
        <div className="result-container">
          <strong>Matches:</strong>
          {matches.length === 0 ? (
            <div>No matches found.</div>
          ) : (
            <ul>
              {matches.map((m, idx) => (
                <li key={idx}>
                  <code>{m[0]}</code> at index {m.index}
                  {m.length > 1 && (
                    <ul>
                      {m.slice(1).map((g, gidx) => (
                        <li key={gidx}>Group {gidx + 1}: <code>{g}</code></li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default RegexValidator;