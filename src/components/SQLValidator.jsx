import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// You need to install sql-formatter: npm install sql-formatter
import { format as sqlFormat } from 'sql-formatter';

function SQLValidator() {
  const [sql, setSQL] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleFormat = () => {
    setError('');
    try {
      setResult(sqlFormat(sql));
    } catch (e) {
      setError('Format error: ' + e.message);
    }
  };

  const handleMinify = () => {
  setError('');
  try {
    // Simple minify: remove newlines and extra spaces
    setResult(sql.replace(/\s+/g, ' ').trim());
  } catch (e) {
    setError('Minify error: ' + e.message);
  }
};

  const handleValidate = () => {
    setError('');
    // Basic validation: check for common SQL keywords
    if (!sql.trim()) {
      setError('SQL query is empty.');
      return;
    }
    const keywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER'];
    const hasKeyword = keywords.some(kw => sql.toUpperCase().includes(kw));
    if (!hasKeyword) {
      setError('SQL does not appear to contain a valid statement.');
    } else {
      setResult('SQL appears valid (basic check).');
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 1200);
      });
    }
  };

  return (
    <div className="tool-container sql-validator-container">
      <Link to="/" className="back-to-home">Back to Home</Link>
      <h2>SQL Query Validator & Formatter</h2>
      <p>Input your SQL query below. Format, minify, or validate your SQL easily.</p>
      <div className="input-group">
        <label htmlFor="sql-query">SQL Query</label>
        <textarea
          id="sql-query"
          rows={8}
          placeholder="Enter your SQL query here"
          value={sql}
          onChange={e => setSQL(e.target.value)}
        />
      </div>
      <div style={{ display: 'flex', gap: '8px', margin: '12px 0' }}>
        <button onClick={handleFormat}>Format</button>
        <button onClick={handleMinify}>Minify</button>
        <button onClick={handleValidate}>Validate</button>
      </div>
      {error && <div className="error-message">{error}</div>}
      {result && (
        <div className="result-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <strong>Result:</strong>
            <button onClick={handleCopy} style={{ fontSize: 13, padding: '2px 10px' }}>
              {copySuccess ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}

export default SQLValidator;