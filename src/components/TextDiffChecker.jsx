import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './TextDiffChecker.css';

function diffLines(a, b) {
  const aLines = a.split('\n');
  const bLines = b.split('\n');
  const maxLen = Math.max(aLines.length, bLines.length);
  const result = [];
  for (let i = 0; i < maxLen; i++) {
    if (aLines[i] === bLines[i]) {
      result.push({ type: 'equal', text: aLines[i] || '' });
    } else if (aLines[i] === undefined) {
      result.push({ type: 'added', text: bLines[i] });
    } else if (bLines[i] === undefined) {
      result.push({ type: 'removed', text: aLines[i] });
    } else {
      result.push({ type: 'removed', text: aLines[i] });
      result.push({ type: 'added', text: bLines[i] });
    }
  }
  return result;
}

function TextDiffChecker() {
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [diff, setDiff] = useState([]);
  const [showResult, setShowResult] = useState(false);

  // Refs for file input
  const fileInputARef = useRef(null);
  const fileInputBRef = useRef(null);

  const handleCompare = () => {
    setDiff(diffLines(textA, textB));
    setShowResult(true);
  };

  const handleClear = () => {
    setTextA('');
    setTextB('');
    setDiff([]);
    setShowResult(false);
  };

  // Handle file import for each box
  const handleFileImport = (event, side) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (side === 'A') {
          setTextA(e.target.result);
        } else {
          setTextB(e.target.result);
        }
      };
      reader.readAsText(file);
    }
  };

  // Helper to render line numbers
  const renderLineNumbers = (text) => {
    return (
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: 40,
          padding: '14px 5px',
          background: '#f5f5f5',
          borderRight: '1px solid #ddd',
          fontFamily: 'monospace',
          fontSize: 14,
          lineHeight: '1.5',
          textAlign: 'right',
          color: '#999',
          userSelect: 'none',
          overflow: 'hidden'
        }}
      >
        {text.split('\n').map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
    );
  };

  return (
    <div className="tool-container text-diff-checker-container">
      <Link to="/" className="back-to-home">Back to Home</Link>
      <h2>Text Diff Checker</h2>
      <p>Compare two text blocks line by line or word by word, with visual highlights to quickly spot differences.</p>
      <div className="input-group">
        {/* Text A Box */}
        <div className="diff-box">
          <label htmlFor="diff-a" className="diff-label">Text A</label>
          <div className="diff-textarea-wrapper">
            <div className="diff-line-numbers">
              {textA.split('\n').map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <textarea
              id="diff-a"
              className="diff-textarea"
              rows={20}
              placeholder="Enter first text block"
              value={textA}
              onChange={e => setTextA(e.target.value)}
            />
          </div>
          <button type="button" className="diff-import-btn" onClick={() => fileInputARef.current.click()}>Import</button>
          <input
            type="file"
            ref={fileInputARef}
            style={{ display: 'none' }}
            accept=".txt,text/plain"
            onChange={e => handleFileImport(e, 'A')}
          />
        </div>
        {/* Text B Box */}
        <div className="diff-box">
          <label htmlFor="diff-b" className="diff-label">Text B</label>
          <div className="diff-textarea-wrapper">
            <div className="diff-line-numbers">
              {textB.split('\n').map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <textarea
              id="diff-b"
              className="diff-textarea"
              rows={20}
              placeholder="Enter second text block"
              value={textB}
              onChange={e => setTextB(e.target.value)}
            />
          </div>
          <button type="button" className="diff-import-btn" onClick={() => fileInputBRef.current.click()}>Import</button>
          <input
            type="file"
            ref={fileInputBRef}
            style={{ display: 'none' }}
            accept=".txt,text/plain"
            onChange={e => handleFileImport(e, 'B')}
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button onClick={handleCompare} disabled={!textA.trim() && !textB.trim()}>Compare</button>
        <button onClick={handleClear} type="button">Clear</button>
      </div>
      {showResult && (
        <div className="result-container" style={{ marginTop: '1.5rem' }}>
          <label><strong>Diff Result:</strong></label>
          <pre style={{ background: '#f7f7f7', padding: '1rem', borderRadius: 4, overflowX: 'auto' }}>
            {diff.length === 0 ? (
              <span style={{ color: '#888' }}>No differences found.</span>
            ) : (
              diff.map((line, idx) => {
                if (line.type === 'equal') {
                  return <div key={idx} style={{ color: '#222' }}>{'  '}{line.text}</div>;
                } else if (line.type === 'added') {
                  return <div key={idx} style={{ background: '#e6ffed', color: '#22863a' }}>+ {line.text}</div>;
                } else if (line.type === 'removed') {
                  return <div key={idx} style={{ background: '#ffeef0', color: '#b31d28' }}>- {line.text}</div>;
                } else {
                  return null;
                }
              })
            )}
          </pre>
        </div>
      )}
    </div>
  );
}

export default TextDiffChecker;