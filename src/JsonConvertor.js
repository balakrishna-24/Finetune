import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function JsonConverter() {
  const navigate = useNavigate();
  const [format, setFormat] = useState('jsonToJsonl');
  const [jsonInputText, setJsonInputText] = useState('');
  const [jsonlInputText, setJsonlInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [error, setError] = useState('');

  // Reset state when switching formats
  const handleFormatChange = (newFormat) => {
    setFormat(newFormat);
    setOutputText('');
    setError('');
  };

  const handleConvert = () => {
    setError('');
    try {
      if (format === 'jsonToJsonl') {
        // Convert JSON to JSONL
        const jsonData = JSON.parse(jsonInputText);
        if (Array.isArray(jsonData)) {
          const jsonlOutput = jsonData.map(item => JSON.stringify(item)).join('\n');
          setOutputText(jsonlOutput);
        } else {
          setOutputText(JSON.stringify(jsonData));
        }
      } else {
        // Convert JSONL to JSON
        const lines = jsonlInputText.trim().split('\n').filter(line => line.trim() !== '');
        const jsonArray = lines.map(line => JSON.parse(line.trim()));
        setOutputText(JSON.stringify(jsonArray, null, 2));
      }
    } catch (error) {
      setError('Error: ' + error.message);
      setOutputText('');
    }
  };

  // Calculate line count based on current format
  const lineCount = format === 'jsonToJsonl' 
    ? jsonInputText.split('\n').length 
    : jsonlInputText.split('\n').length;

  return (
    <div className="App">
      <button 
        onClick={() => navigate('/')} 
        className="back-button"
      >
        Back to Main
      </button>

      <div className="title-section">
        <h1 className="main-title">Format Converter</h1>
        <p className="subtitle">Convert between JSON and JSONL</p>
      </div>

      <div className="ad-space">
        {/* Ad content goes here */}
      </div>

      <div className="format-selector">
        <button 
          className={`format-button ${format === 'jsonToJsonl' ? 'active' : ''}`}
          onClick={() => handleFormatChange('jsonToJsonl')}
        >
          JSON to JSONL
        </button>
        <button 
          className={`format-button ${format === 'jsonlToJson' ? 'active' : ''}`}
          onClick={() => handleFormatChange('jsonlToJson')}
        >
          JSONL to JSON
        </button>
      </div>

      <div className="converter-container">
        <div className="text-area-section">
          <div className="text-area-header">
            <label>
              Input {format === 'jsonToJsonl' ? 'JSON' : 'JSONL'}
            </label>
            <span className="line-count">{lineCount}/5000 lines</span>
          </div>
          <textarea
            value={format === 'jsonToJsonl' ? jsonInputText : jsonlInputText}
            onChange={(e) => {
              if (format === 'jsonToJsonl') {
                setJsonInputText(e.target.value);
              } else {
                setJsonlInputText(e.target.value);
              }
            }}
            placeholder={format === 'jsonToJsonl' ? 
              'Paste your JSON array here...' : 
              'Paste your JSONL content here...'}
            className="input-area"
            spellCheck="false"
          />
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <div className="button-group">
          <button onClick={handleConvert} className="convert-button">
            Convert to {format === 'jsonToJsonl' ? 'JSONL' : 'JSON'}
          </button>
        </div>

        <div className="text-area-section">
          <label>Output {format === 'jsonToJsonl' ? 'JSONL' : 'JSON'}</label>
          <textarea
            value={outputText}
            readOnly
            className="output-area"
            placeholder="Converted format will appear here..."
            spellCheck="false"
          />
        </div>
      </div>

      <div className="instructions">
        <p>
          📝 {format === 'jsonToJsonl' 
            ? "Paste your JSON array here. The converter will transform it into JSONL format." 
            : "Paste your JSONL content here. The converter will transform it into JSON format."}
        </p>
      </div>
    </div>
  );
}

export default JsonConverter;