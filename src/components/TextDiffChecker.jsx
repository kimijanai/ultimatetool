import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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

  return (
    <div className="tool-container text-diff-checker-container">
      <Link to="/" className="back-to-home">Back to Home</Link>
      <h2>Text Diff Checker</h2>
      <p>Compare two text blocks line by line or word by word, with visual highlights to quickly spot differences.</p>
      <div className="input-group" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label htmlFor="diff-a">Text A</label>
          <textarea
            id="diff-a"
            rows={6}
            placeholder="Enter first text block"
            value={textA}
            onChange={e => setTextA(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label htmlFor="diff-b">Text B</label>
          <textarea
            id="diff-b"
            rows={6}
            placeholder="Enter second text block"
            value={textB}
            onChange={e => setTextB(e.target.value)}
            style={{ width: '100%' }}
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