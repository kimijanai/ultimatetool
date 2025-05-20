import React, { useState } from 'react';

const formats = [
  { label: 'YYYY/MM/DD HH:mm', value: 'YYYY/MM/DD HH:mm' },
  { label: 'YYYY-MM-DD HH:mm:ss', value: 'YYYY-MM-DD HH:mm:ss' },
  { label: 'Unix Timestamp', value: 'X' },
  { label: 'ISO 8601', value: 'ISO' }
];

function formatDate(date, format) {
  if (format === 'YYYY/MM/DD HH:mm') {
    return (
      date.getFullYear() +
      '/' +
      String(date.getMonth() + 1).padStart(2, '0') +
      '/' +
      String(date.getDate()).padStart(2, '0') +
      ' ' +
      String(date.getHours()).padStart(2, '0') +
      ':' +
      String(date.getMinutes()).padStart(2, '0')
    );
  }
  if (format === 'YYYY-MM-DD HH:mm:ss') {
    return (
      date.getFullYear() +
      '-' +
      String(date.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(date.getDate()).padStart(2, '0') +
      ' ' +
      String(date.getHours()).padStart(2, '0') +
      ':' +
      String(date.getMinutes()).padStart(2, '0') +
      ':' +
      String(date.getSeconds()).padStart(2, '0')
    );
  }
  if (format === 'X') {
    return Math.floor(date.getTime() / 1000).toString();
  }
  if (format === 'ISO') {
    return date.toISOString();
  }
  return date.toString();
}

const TimeGenerator = () => {
  const [format, setFormat] = useState('YYYY/MM/DD HH:mm');
  const [value, setValue] = useState('');

  const handleGenerate = () => {
    const now = new Date();
    setValue(formatDate(now, format));
  };

  const handleCopy = () => {
    if (value) {
      navigator.clipboard.writeText(value);
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 24, background: '#fff', maxWidth: 400 }}>
      <h3 style={{ marginBottom: 16 }}>Time Generator</h3>
      <div style={{ marginBottom: 16 }}>
        {formats.map(f => (
          <label key={f.value} style={{ marginRight: 16 }}>
            <input
              type="radio"
              name="time-format"
              value={f.value}
              checked={format === f.value}
              onChange={() => setFormat(f.value)}
              style={{ marginRight: 4 }}
            />
            {f.label}
          </label>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={value}
          readOnly
          style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc', background: '#f9f9f9' }}
        />
        <button onClick={handleCopy} style={{ padding: '8px 12px', borderRadius: 4, background: '#5bc0de', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Copy
        </button>
      </div>
      <button onClick={handleGenerate} style={{ padding: '8px 16px', borderRadius: 4, background: '#5cb85c', color: '#fff', border: 'none', cursor: 'pointer' }}>
        Generate
      </button>
    </div>
  );
};

export default TimeGenerator;