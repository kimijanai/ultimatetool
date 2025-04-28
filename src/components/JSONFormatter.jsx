import React, { useState, useEffect, useRef } from 'react';
import './JSONFormatter.css';
import { Link } from 'react-router-dom';

function JSONFormatter() {
  // State for left JSON box
  const [jsonInputLeft, setJsonInputLeft] = useState('');
  const [formattedJsonLeft, setFormattedJsonLeft] = useState('');
  const [errorLeft, setErrorLeft] = useState(null);
  const [treeDataLeft, setTreeDataLeft] = useState(null);
  const [searchQueryLeft, setSearchQueryLeft] = useState('');
  const [searchResultsLeft, setSearchResultsLeft] = useState([]);
  const [currentSearchIndexLeft, setCurrentSearchIndexLeft] = useState(0);
  
  // State for right JSON box
  const [jsonInputRight, setJsonInputRight] = useState('');
  const [formattedJsonRight, setFormattedJsonRight] = useState('');
  const [errorRight, setErrorRight] = useState(null);
  const [treeDataRight, setTreeDataRight] = useState(null);
  const [searchQueryRight, setSearchQueryRight] = useState('');
  const [searchResultsRight, setSearchResultsRight] = useState([]);
  const [currentSearchIndexRight, setCurrentSearchIndexRight] = useState(0);
  
  // Shared state
  const [viewModeLeft, setViewModeLeft] = useState('code'); // 'tree', 'code'
  const [viewModeRight, setViewModeRight] = useState('code'); // 'tree', 'code'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNode, setDraggedNode] = useState(null);
  const fileInputLeftRef = useRef(null);
  const fileInputRightRef = useRef(null);
  const activeBox = useRef('left'); // Track which box is active for search
  
  // Process JSON input whenever it changes
  useEffect(() => {
    if (jsonInputLeft) {
      try {
        const parsedJson = JSON.parse(jsonInputLeft);
        setTreeDataLeft(parsedJson);
        setErrorLeft(null);
      } catch (err) {
        setErrorLeft(`Invalid JSON: ${err.message}`);
        setTreeDataLeft(null);
      }
    }
  }, [jsonInputLeft]);
  
  useEffect(() => {
    if (jsonInputRight) {
      try {
        const parsedJson = JSON.parse(jsonInputRight);
        setTreeDataRight(parsedJson);
        setErrorRight(null);
      } catch (err) {
        setErrorRight(`Invalid JSON: ${err.message}`);
        setTreeDataRight(null);
      }
    }
  }, [jsonInputRight]);

  // Format and validate JSON
  const handleFormatJson = (side) => {
    const input = side === 'left' ? jsonInputLeft : jsonInputRight;
    const setInput = side === 'left' ? setJsonInputLeft : setJsonInputRight;
    const setFormatted = side === 'left' ? setFormattedJsonLeft : setFormattedJsonRight;
    const setError = side === 'left' ? setErrorLeft : setErrorRight;
    const setTreeData = side === 'left' ? setTreeDataLeft : setTreeDataRight;

    if (!input.trim()) {
      setError('Please enter JSON data');
      return;
    }

    try {
      const parsedJson = JSON.parse(input);
      const prettyJson = JSON.stringify(parsedJson, null, 2);
      setInput(prettyJson);
      setTreeData(parsedJson);
      setError(null);
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
      setTreeData(null);
    }
  };

  const handleMinifyJson = (side) => {
    const input = side === 'left' ? jsonInputLeft : jsonInputRight;
    const setInput = side === 'left' ? setJsonInputLeft : setJsonInputRight;
    const setFormatted = side === 'left' ? setFormattedJsonLeft : setFormattedJsonRight;
    const setError = side === 'left' ? setErrorLeft : setErrorRight;
    const setTreeData = side === 'left' ? setTreeDataLeft : setTreeDataRight;

    if (!input.trim()) {
      setError('Please enter JSON data');
      return;
    }

    try {
      const parsedJson = JSON.parse(input);
      const minifiedJson = JSON.stringify(parsedJson);
      setInput(minifiedJson);
      setTreeData(parsedJson);
      setError(null);
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
      setTreeData(null);
    }
  };

  // Handle file import
  const handleFileImport = (event, side) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          if (side === 'left') {
            setJsonInputLeft(e.target.result);
          } else {
            setJsonInputRight(e.target.result);
          }
        } catch (err) {
          if (side === 'left') {
            setErrorLeft('Error reading file');
          } else {
            setErrorRight('Error reading file');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  // Handle URL import
  const handleUrlImport = (side) => {
    const url = prompt('Enter URL to fetch JSON from:');
    if (url) {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (side === 'left') {
            setJsonInputLeft(JSON.stringify(data));
          } else {
            setJsonInputRight(JSON.stringify(data));
          }
        })
        .catch(err => {
          if (side === 'left') {
            setErrorLeft(`Error fetching from URL: ${err.message}`);
          } else {
            setErrorRight(`Error fetching from URL: ${err.message}`);
          }
        });
    }
  };

  // Handle clipboard import
  const handleClipboardImport = async (side) => {
    try {
      const text = await navigator.clipboard.readText();
      if (side === 'left') {
        setJsonInputLeft(text);
      } else {
        setJsonInputRight(text);
      }
    } catch (err) {
      if (side === 'left') {
        setErrorLeft('Error reading from clipboard');
      } else {
        setErrorRight('Error reading from clipboard');
      }
    }
  };

  // Handle file export
  const handleFileExport = (side) => {
    const formattedJson = side === 'left' ? formattedJsonLeft : formattedJsonRight;
    if (!formattedJson) return;
    
    const blob = new Blob([formattedJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted-json-${side}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle search for left box
  const handleSearchLeft = () => {
    if (!searchQueryLeft || !jsonInputLeft) {
      setSearchResultsLeft([]);
      return;
    }

    const results = [];
    let position = -1;
    let lastIndex = 0;

    while ((position = jsonInputLeft.toLowerCase().indexOf(searchQueryLeft.toLowerCase(), lastIndex)) !== -1) {
      results.push(position);
      lastIndex = position + 1;
    }

    setSearchResultsLeft(results);
    setCurrentSearchIndexLeft(results.length > 0 ? 0 : -1);
  };

  // Handle search for right box
  const handleSearchRight = () => {
    if (!searchQueryRight || !jsonInputRight) {
      setSearchResultsRight([]);
      return;
    }

    const results = [];
    let position = -1;
    let lastIndex = 0;

    while ((position = jsonInputRight.toLowerCase().indexOf(searchQueryRight.toLowerCase(), lastIndex)) !== -1) {
      results.push(position);
      lastIndex = position + 1;
    }

    setSearchResultsRight(results);
    setCurrentSearchIndexRight(results.length > 0 ? 0 : -1);
  };

  // Navigate through search results
  const navigateSearch = (side, direction) => {
    if (side === 'left') {
      if (searchResultsLeft.length === 0) return;
      let newIndex = currentSearchIndexLeft + (direction === 'next' ? 1 : -1);
      if (newIndex >= searchResultsLeft.length) newIndex = 0;
      if (newIndex < 0) newIndex = searchResultsLeft.length - 1;
      setCurrentSearchIndexLeft(newIndex);

      // Scroll to the search result in the left textarea
      const textArea = document.querySelector('.json-box:first-child .json-code-view');
      if (textArea) {
        const position = searchResultsLeft[newIndex];
        textArea.focus();
        textArea.setSelectionRange(position, position + searchQueryLeft.length);
      }
    } else {
      if (searchResultsRight.length === 0) return;
      let newIndex = currentSearchIndexRight + (direction === 'next' ? 1 : -1);
      if (newIndex >= searchResultsRight.length) newIndex = 0;
      if (newIndex < 0) newIndex = searchResultsRight.length - 1;
      setCurrentSearchIndexRight(newIndex);

      // Scroll to the search result in the right textarea
      const textArea = document.querySelector('.json-box:last-child .json-code-view');
      if (textArea) {
        const position = searchResultsRight[newIndex];
        textArea.focus();
        textArea.setSelectionRange(position, position + searchQueryRight.length);
      }
    }
  };

  // Render tree view
  const renderTreeView = (data, path = '') => {
    if (data === null) return <div className="tree-node">null</div>;
    
    if (typeof data !== 'object') {
      return <div className="tree-node tree-value">{JSON.stringify(data)}</div>;
    }
    
    if (Array.isArray(data)) {
      return (
        <div className="tree-node tree-array">
          <div className="tree-label" onClick={() => toggleNode(path)}>Array [{data.length}]</div>
          <div className="tree-children">
            {data.map((item, index) => (
              <div key={`${path}-${index}`} className="tree-item"
                   draggable={true}
                   onDragStart={(e) => handleDragStart(e, `${path}[${index}]`)}
                   onDragOver={handleDragOver}
                   onDrop={(e) => handleDrop(e, `${path}[${index}]`)}>
                <div className="tree-key">[{index}]:</div>
                {renderTreeView(item, `${path}[${index}]`)}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return (
      <div className="tree-node tree-object">
        <div className="tree-label" onClick={() => toggleNode(path)}>Object {`{${Object.keys(data).length}}`}</div>
        <div className="tree-children">
          {Object.entries(data).map(([key, value]) => (
            <div key={`${path}-${key}`} className="tree-item"
                 draggable={true}
                 onDragStart={(e) => handleDragStart(e, `${path}.${key}`)}
                 onDragOver={handleDragOver}
                 onDrop={(e) => handleDrop(e, `${path}.${key}`)}>
              <div className="tree-key">"{key}":</div>
              {renderTreeView(value, path ? `${path}.${key}` : key)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Toggle tree node expansion
  const toggleNode = (path) => {
    // Implementation to expand/collapse tree nodes
  };

  // Drag and drop handlers
  const handleDragStart = (e, path) => {
    setIsDragging(true);
    setDraggedNode(path);
    e.dataTransfer.setData('text/plain', path);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetPath) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (draggedNode === targetPath) return;
    
    // Implementation to move nodes in the JSON structure
    // This would require a deep copy of the JSON data and manipulation
    // based on the source and target paths
  };

  return (
    <div className="tool-container json-formatter-container">
      <Link to="/" className="back-to-home">Back to Home</Link>
      <h2>JSON Formatter & Visual Editor</h2>
      
      

      
      <div className="json-boxes-container">
        {/* Left JSON Box */}
        <div className="json-box">
          <h3>JSON Box 1</h3>
          <div className="search-bar">
            <input
              type="text"
              value={searchQueryLeft}
              onChange={(e) => {
                setSearchQueryLeft(e.target.value);
                if (e.target.value === '') setSearchResultsLeft([]);
              }}
              onKeyUp={(e) => {
                if (e.key === 'Enter') handleSearchLeft();
              }}
              placeholder="Search in JSON..."
            />
            <div className="search-navigation">
              <button onClick={() => navigateSearch('left', 'prev')} disabled={searchResultsLeft.length === 0}>&lt;</button>
              <button onClick={() => navigateSearch('left', 'next')} disabled={searchResultsLeft.length === 0}>&gt;</button>
              <span>{searchResultsLeft.length > 0 ? `${currentSearchIndexLeft + 1}/${searchResultsLeft.length}` : ''}</span>
            </div>
          </div>
          <div className="box-toolbar">
            <button onClick={() => handleFormatJson('left')}>Format</button>
            <button onClick={() => handleMinifyJson('left')}>Minify</button>
            <button 
              onClick={() => navigator.clipboard.writeText(jsonInputLeft)}
              disabled={!jsonInputLeft}
            >
              Copy
            </button>
            <button onClick={() => fileInputLeftRef.current.click()}>Import</button>
            <input 
              type="file" 
              ref={fileInputLeftRef} 
              style={{ display: 'none' }} 
              accept=".json,application/json" 
              onChange={(e) => handleFileImport(e, 'left')} 
            />
            <button onClick={() => handleFileExport('left')} disabled={!formattedJsonLeft}>Export</button>
            <button 
              onClick={() => {
                activeBox.current = 'left';
                setViewModeLeft(viewModeLeft === 'tree' ? 'code' : 'tree');
              }}
              className={viewModeLeft === 'tree' ? 'active' : ''}
            >
              Tree View
            </button>
          </div>
          
          <div className="json-content">
            {viewModeLeft === 'tree' && treeDataLeft ? (
              <div className="tree-view-container">
                <div className="tree-view">
                  {renderTreeView(treeDataLeft)}
                </div>
              </div>
            ) : (
              <div className="code-view-container">
                <div className="json-code-view-container">
                  <div className="line-numbers">
                    {jsonInputLeft.split('\n').map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}                    
                  </div>
                  <textarea
                    className={`json-code-view ${errorLeft ? 'error' : ''}`}
                    value={jsonInputLeft}
                    onChange={(e) => setJsonInputLeft(e.target.value)}
                    placeholder="Enter JSON here"
                    onClick={() => activeBox.current = 'left'}
                  />
                </div>
                {errorLeft && <p className="error-message">{errorLeft}</p>}
              </div>
            )}
          </div>
        </div>
        
        {/* Right JSON Box */}
        <div className="json-box">
          <h3>JSON Box 2</h3>
          <div className="search-bar">
            <input
              type="text"
              value={searchQueryRight}
              onChange={(e) => {
                setSearchQueryRight(e.target.value);
                if (e.target.value === '') setSearchResultsRight([]);
              }}
              onKeyUp={(e) => {
                if (e.key === 'Enter') handleSearchRight();
              }}
              placeholder="Search in JSON..."
            />
            <div className="search-navigation">
              <button onClick={() => navigateSearch('right', 'prev')} disabled={searchResultsRight.length === 0}>&lt;</button>
              <button onClick={() => navigateSearch('right', 'next')} disabled={searchResultsRight.length === 0}>&gt;</button>
              <span>{searchResultsRight.length > 0 ? `${currentSearchIndexRight + 1}/${searchResultsRight.length}` : ''}</span>
            </div>
          </div>
          <div className="box-toolbar">
            <button onClick={() => handleFormatJson('right')}>Format</button>
            <button onClick={() => handleMinifyJson('right')}>Minify</button>
            <button 
              onClick={() => navigator.clipboard.writeText(jsonInputRight)}
              disabled={!jsonInputRight}
            >
              Copy
            </button>
            <button onClick={() => fileInputRightRef.current.click()}>Import</button>
            <input 
              type="file" 
              ref={fileInputRightRef} 
              style={{ display: 'none' }} 
              accept=".json,application/json" 
              onChange={(e) => handleFileImport(e, 'right')} 
            />
            <button onClick={() => handleFileExport('right')} disabled={!formattedJsonRight}>Export</button>
            <button 
              onClick={() => {
                activeBox.current = 'right';
                setViewModeRight(viewModeRight === 'tree' ? 'code' : 'tree');
              }}
              className={viewModeRight === 'tree' ? 'active' : ''}
            >
              Tree View
            </button>
          </div>
          
          <div className="json-content">
            {viewModeRight === 'tree' && treeDataRight ? (
              <div className="tree-view-container">
                <div className="tree-view">
                  {renderTreeView(treeDataRight)}
                </div>
              </div>
            ) : (
              <div className="code-view-container">
                <div className="json-code-view-container">
                  <div className="line-numbers">
                    {jsonInputRight.split('\n').map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}                    
                  </div>
                  <textarea
                    className={`json-code-view ${errorRight ? 'error' : ''}`}
                    value={jsonInputRight}
                    onChange={(e) => setJsonInputRight(e.target.value)}
                    placeholder="Enter JSON here"
                    onClick={() => activeBox.current = 'right'}
                  />
                </div>
                {errorRight && <p className="error-message">{errorRight}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JSONFormatter;