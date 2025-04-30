import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Hashids from 'hashids';

function emptyElement() {
  return {
    form: { id: '' },
    documents: [{ template_id: '' }],
    authenticators: [{
      type: '',
      user_id: '',
      root_index: '',
      level: 1,
      is_power_approver: false,
      allow_closest_admin: false,
      include_all_admin: false
    }]
  };
}

function JsonStructureBuilder() {
  const [elements, setElements] = useState([emptyElement()]);
  const [jsonOutput, setJsonOutput] = useState('');
  const [notification, setNotification] = useState('');
  const [csvData, setCsvData] = useState([]);
  const [saltKey, setSaltKey] = useState('');

  const handleCsvUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const lines = e.target.result.split('\n');
        const data = lines.map(line => {
          const [id, email, name] = line.split(',');
          const hashids = new Hashids(saltKey, 12);
          const hashed = hashids.encode(parseInt(id, 10));
          return { id, hashed, email, name };
        });
        setCsvData(data);
      };
      reader.readAsText(file);
    }
  };

  // Function to rehash IDs with new salt key
  const rehashIds = () => {
    if (csvData.length > 0) {
      const hashids = new Hashids(saltKey, 12);
      const updatedData = csvData.map(row => ({
        ...row,
        hashed: hashids.encode(parseInt(row.id, 10))
      }));
      setCsvData(updatedData);
      setNotification('Data rehashed with new salt key!');
      setTimeout(() => setNotification(''), 2000);
    }
  };

  // Handlers for form.id
  const handleFormIdChange = (idx, value) => {
    const updated = [...elements];
    updated[idx].form.id = value;
    setElements(updated);
  };

  // Handlers for documents
  const handleDocumentChange = (elIdx, docIdx, value) => {
    const updated = [...elements];
    updated[elIdx].documents[docIdx].template_id = value;
    setElements(updated);
  };
  const addDocument = (elIdx) => {
    const updated = [...elements];
    updated[elIdx].documents.push({ template_id: '' });
    setElements(updated);
  };
  const removeDocument = (elIdx, docIdx) => {
    const updated = [...elements];
    updated[elIdx].documents.splice(docIdx, 1);
    setElements(updated);
  };

  // Handlers for authenticators
  const handleAuthenticatorChange = (elIdx, authIdx, field, value) => {
    const updated = [...elements];
    updated[elIdx].authenticators[authIdx][field] = value;
    setElements(updated);
  };
  const addAuthenticator = (elIdx) => {
    const updated = [...elements];
    updated[elIdx].authenticators.push({
      type: '',
      user_id: '',
      root_index: '',
      level: 1,
      is_power_approver: false,
      allow_closest_admin: false,
      include_all_admin: false
    });
    setElements(updated);
  };
  const removeAuthenticator = (elIdx, authIdx) => {
    const updated = [...elements];
    updated[elIdx].authenticators.splice(authIdx, 1);
    setElements(updated);
  };

  // Handlers for top-level elements
  const addElement = () => setElements([...elements, emptyElement()]);
  const removeElement = (idx) => setElements(elements.filter((_, i) => i !== idx));

  // Utility to recursively remove keys with blank string values
  function removeBlankFields(obj) {
    if (Array.isArray(obj)) {
      return obj
        .map(removeBlankFields)
        .filter(item => !(typeof item === 'object' && Object.keys(item).length === 0));
    } else if (typeof obj === 'object' && obj !== null) {
      const newObj = {};
      Object.entries(obj).forEach(([key, value]) => {
        if (value === '') {
          // skip blank string fields
          return;
        }
        const cleaned = removeBlankFields(value);
        // Only add if not an empty object/array or a valid value
        if (
          (typeof cleaned === 'object' && cleaned !== null && Object.keys(cleaned).length === 0 && !Array.isArray(cleaned)) ||
          (Array.isArray(cleaned) && cleaned.length === 0)
        ) {
          return;
        }
        newObj[key] = cleaned;
      });
      return newObj;
    }
    return obj;
  }

  // Generate JSON
  const handleGenerate = () => {
    const cleaned = removeBlankFields(elements);
    setJsonOutput(JSON.stringify(cleaned, null, 2));
  };

  // Copy JSON to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonOutput).then(() => {
      setNotification('JSON copied to clipboard!');
      setTimeout(() => setNotification(''), 2000); // Clear notification after 2 seconds
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  // Minify JSON
  const minifyJson = () => {
    const cleaned = removeBlankFields(elements);
    setJsonOutput(JSON.stringify(cleaned));
  };

  // Format JSON
  const formatJson = () => {
    const cleaned = removeBlankFields(elements);
    setJsonOutput(JSON.stringify(cleaned, null, 2));
  };

  return (
    <div className="tool-container json-structure-builder-container" style={{ fontFamily: 'Arial, sans-serif', color: '#444' }}>
      <Link to="/" className="back-to-home" style={{ textDecoration: 'none', color: '#5A5A5A', marginBottom: 16 }}>Back to Home</Link>
      <h2 style={{ color: '#5A5A5A' }}>承認フロー作成</h2>
      <p style={{ fontSize: '16px', marginBottom: 24, color: '#666' }}>UIで承認フロー作成</p>
      
      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        {/* Left side: Steps */}
        <div style={{ flex: 2, minWidth: 0 }}>
          {elements.map((el, elIdx) => (
            <div key={elIdx} style={{ border: '1px solid #ddd', padding: 16, marginBottom: 16, borderRadius: 8, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)', backgroundColor: '#f9f9f9' }}>
              <h3 style={{ color: '#777', marginBottom: '12px' }}>Step {elIdx + 1}</h3>
              {/* Form ID section */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '6px' }}>Form ID: </label>
                <input
                  type="text"
                  value={el.form.id}
                  onChange={e => handleFormIdChange(elIdx, e.target.value)}
                  style={{ width: '100%', maxWidth: '300px', padding: '8px', borderRadius: 4, border: '1px solid #ccc', backgroundColor: '#fff' }}
                />
              </div>
              {/* Documents section */}
              <div style={{ marginBottom: '16px' }}>
                <strong style={{ color: '#555', display: 'block', marginBottom: '8px' }}>Documents:</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
                  {el.documents.map((doc, docIdx) => (
                    <div key={docIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="template_id"
                        value={doc.template_id}
                        onChange={e => handleDocumentChange(elIdx, docIdx, e.target.value)}
                        style={{ flex: '1', maxWidth: '300px', padding: '8px', borderRadius: 4, border: '1px solid #ccc', backgroundColor: '#fff' }}
                      />
                      <button 
                        onClick={() => removeDocument(elIdx, docIdx)} 
                        disabled={el.documents.length === 1} 
                        style={{ padding: '8px 12px', borderRadius: 4, backgroundColor: '#d9534f', color: '#fff', border: 'none', cursor: el.documents.length === 1 ? 'not-allowed' : 'pointer', fontSize: '14px', opacity: el.documents.length === 1 ? 0.6 : 1 }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => addDocument(elIdx)} 
                    style={{ alignSelf: 'flex-start', padding: '8px 12px', borderRadius: 4, backgroundColor: '#5cb85c', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                  >
                    Add Document
                  </button>
                </div>
              </div>
              {/* Authenticators section */}
              <div style={{ marginBottom: '16px' }}>
                <strong style={{ color: '#555', display: 'block', marginBottom: '8px' }}>Authenticators:</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '8px' }}>
                  {el.authenticators.map((auth, authIdx) => (
                    <div key={authIdx} style={{ border: '1px solid #eee', padding: '12px', borderRadius: 4, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)', backgroundColor: '#f9f9f9' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                        <div>
                          <label style={{ fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '4px' }}>Type: </label>
                          <select
                            value={auth.type}
                            onChange={e => handleAuthenticatorChange(elIdx, authIdx, 'type', e.target.value)}
                            style={{ width: '100%', padding: '8px', borderRadius: 4, border: '1px solid #ccc', backgroundColor: '#fff' }}
                          >
                            <option value="">Select type</option>
                            <option value="admin">admin</option>
                            <option value="root_admin">root_admin</option>
                          </select>
                        </div>
                        
                        <div>
                          <label style={{ fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '4px' }}>User ID: </label>
                          <input
                            type="text"
                            placeholder="user_id"
                            value={auth.user_id}
                            onChange={e => handleAuthenticatorChange(elIdx, authIdx, 'user_id', e.target.value)}
                            style={{ width: '100%', padding: '8px', borderRadius: 4, border: '1px solid #ccc', backgroundColor: '#fff' }}
                          />
                        </div>
                        
                        {auth.type === 'root_admin' && (
                          <div>
                            <label style={{ fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '4px' }}>
                              Root Index: <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                              type="number"
                              placeholder="root_index"
                              value={auth.root_index}
                              required
                              onChange={e => handleAuthenticatorChange(elIdx, authIdx, 'root_index', e.target.value)}
                              style={{ width: '100%', padding: '8px', borderRadius: 4, border: '1px solid #ccc', backgroundColor: '#fff', borderColor: !auth.root_index ? 'red' : '#ccc' }}
                            />
                            {!auth.root_index && (
                              <span style={{ color: 'red', fontSize: 12 }}>Required for root_admin</span>
                            )}
                          </div>
                        )}
                        
                        <div>
                          <label style={{ fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '4px' }}>Level: </label>
                          <select
                            value={auth.level}
                            onChange={e => handleAuthenticatorChange(elIdx, authIdx, 'level', Number(e.target.value))}
                            style={{ width: '100%', padding: '8px', borderRadius: 4, border: '1px solid #ccc', backgroundColor: '#fff' }}
                          >
                            {[1, 2, 3, 4, 5].map(lvl => (
                              <option key={lvl} value={lvl}>{lvl}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <label style={{ fontSize: 14, fontWeight: 'bold', color: '#555' }}>
                          <input
                            type="checkbox"
                            checked={auth.is_power_approver}
                            onChange={e => handleAuthenticatorChange(elIdx, authIdx, 'is_power_approver', e.target.checked)}
                            style={{ width: 16, height: 16, marginRight: '6px' }}
                          />
                          Is Power Approver
                        </label>
                        <label style={{ fontSize: 14, fontWeight: 'bold', color: '#555' }}>
                          <input
                            type="checkbox"
                            checked={auth.allow_closest_admin || false}
                            onChange={e => handleAuthenticatorChange(elIdx, authIdx, 'allow_closest_admin', e.target.checked)}
                            style={{ width: 16, height: 16, marginRight: '6px' }}
                          />
                          Allow Closest Admin
                        </label>
                        <label style={{ fontSize: 14, fontWeight: 'bold', color: '#555' }}>
                          <input
                            type="checkbox"
                            checked={auth.include_all_admin || false}
                            onChange={e => handleAuthenticatorChange(elIdx, authIdx, 'include_all_admin', e.target.checked)}
                            style={{ width: 16, height: 16, marginRight: '6px' }}
                          />
                          Include All Admin
                        </label>
                        <button 
                          onClick={() => removeAuthenticator(elIdx, authIdx)} 
                          disabled={el.authenticators.length === 1} 
                          style={{ padding: '8px 12px', borderRadius: 4, backgroundColor: '#d9534f', color: '#fff', border: 'none', cursor: el.authenticators.length === 1 ? 'not-allowed' : 'pointer', fontSize: '14px', opacity: el.authenticators.length === 1 ? 0.6 : 1 }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => addAuthenticator(elIdx)} 
                    style={{ alignSelf: 'flex-start', padding: '8px 12px', borderRadius: 4, backgroundColor: '#5cb85c', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                  >
                    Add Authenticator
                  </button>
                </div>
              </div>
              
              <button 
                onClick={() => removeElement(elIdx)} 
                disabled={elements.length === 1} 
                style={{ marginTop: 8, padding: '8px 12px', borderRadius: 4, backgroundColor: '#d9534f', color: '#fff', border: 'none', cursor: elements.length === 1 ? 'not-allowed' : 'pointer', fontSize: '14px', opacity: elements.length === 1 ? 0.6 : 1 }}
              >
                Remove Element
              </button>
            </div>
          ))}
          <button 
            onClick={addElement} 
            style={{ marginBottom: 16, padding: '10px 16px', borderRadius: 4, backgroundColor: '#0275d8', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '16px' }}
          >
            Add Top-level Element
          </button>
        </div>
        {/* Right side: Hash Salt Key and CSV in a card box */}
        <div style={{
          flex: 1,
          minWidth: 280,
          border: '1px solid #ddd',
          borderRadius: 8,
          boxShadow: '0 4px 8px rgba(0,0,0,0.07)',
          backgroundColor: '#f9f9f9',
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {/* Salt Key Input Section */}
          <div>
            <label style={{ fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '6px' }}>Hash Salt Key:</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                value={saltKey}
                onChange={(e) => setSaltKey(e.target.value)}
                style={{ flex: '1', maxWidth: '500px', padding: '8px', borderRadius: 4, border: '1px solid #ccc', backgroundColor: '#fff' }}
              />
              {csvData.length > 0 && (
                <button
                  onClick={rehashIds}
                  style={{ padding: '8px 12px', borderRadius: 4, backgroundColor: '#5bc0de', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                >
                  Rehash Data
                </button>
              )}
            </div>
          </div>
          {/* CSV Upload Section */}
          <div>
            <label style={{ fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '6px' }}>Upload CSV:</label>
            <input type="file" accept=".csv" onChange={handleCsvUpload} style={{ padding: '8px', borderRadius: 4, border: '1px solid #ccc', backgroundColor: '#fff' }} />
          </div>
          {/* Display CSV Data */}
          {csvData.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '0' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Hashed</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Email</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {csvData.map((row, index) => (
                    <tr key={index}>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.id}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.hashed}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.email}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        <button 
          onClick={handleGenerate} 
          style={{ padding: '10px 16px', borderRadius: 4, backgroundColor: '#0275d8', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '16px' }}
        >
          Generate JSON
        </button>
        
        {jsonOutput && (
          <>
            <button 
              onClick={copyToClipboard} 
              style={{ padding: '10px 16px', borderRadius: 4, backgroundColor: '#5bc0de', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '16px' }}
            >
              Copy Generated JSON
            </button>
            <button 
              onClick={minifyJson} 
              style={{ padding: '10px 16px', borderRadius: 4, backgroundColor: '#f0ad4e', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '16px' }}
            >
              Minify JSON
            </button>
            <button 
              onClick={formatJson} 
              style={{ padding: '10px 16px', borderRadius: 4, backgroundColor: '#5bc0de', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '16px' }}
            >
              Format JSON
            </button>
          </>
        )}
      </div>
      
      {notification && (
        <div style={{ marginTop: 16, color: '#5cb85c', fontWeight: 'bold' }}>
          {notification}
        </div>
      )}
      
      {jsonOutput && (
        <div style={{ marginTop: 16 }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Generated JSON:</label>
          <pre style={{ background: '#f7f7f7', padding: 16, borderRadius: 4, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)', color: '#333', overflowX: 'auto' }}>{jsonOutput}</pre>
        </div>
      )}
    </div>
  );
}

export default JsonStructureBuilder;