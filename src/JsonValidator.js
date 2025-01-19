import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function JsonValidator() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [error, setError] = useState('');
  const [errorLine, setErrorLine] = useState(null);
  const textAreaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Sync text area and line numbers height
  useEffect(() => {
    const updateLineNumbersHeight = () => {
      if (textAreaRef.current && lineNumbersRef.current) {
        lineNumbersRef.current.style.height = `${textAreaRef.current.clientHeight}px`;
      }
    };

    updateLineNumbersHeight();
    window.addEventListener('resize', updateLineNumbersHeight);
    return () => window.removeEventListener('resize', updateLineNumbersHeight);
  }, [inputText]);

  // Memoize line numbers calculation
  const inputLineNumbers = useMemo(() => {
    const lines = inputText.split('\n');
    return lines.length === 1 && lines[0] === '' ? [] : lines.map((_, index) => index + 1);
  }, [inputText]);

  const outputLineNumbers = useMemo(() => {
    const lines = outputText.split('\n');
    return lines.length === 1 && lines[0] === '' ? [] : lines.map((_, index) => index + 1);
  }, [outputText]);

  // Enhanced error handling with more detailed messages
  const getDetailedError = (error, text) => {
    const lines = text.split('\n');
    let lineNumber = 1;
    let position = 0;
    let columnNumber = 0;
    
    const posMatch = error.message.match(/position (\d+)/);
    if (posMatch) {
      position = parseInt(posMatch[1]);
      for (let i = 0; i < lines.length; i++) {
        if (position > lines[i].length + 1) {
          position -= lines[i].length + 1;
          lineNumber++;
        } else {
          columnNumber = position;
          break;
        }
      }
    }

    const errorTypes = {
      'Unexpected token': {
        message: (token) => `Error at line ${lineNumber}, column ${columnNumber}:
• Found unexpected ${token || 'character'}
• Common fixes:
  - Check for missing or extra commas
  - Ensure property names are in double quotes
  - Verify matching brackets/braces
  - Remove trailing commas
• Context: "${lines[lineNumber - 1]?.trim() || ''}"`,
      },
      'Unexpected end of JSON': {
        message: () => `Error at line ${lineNumber}:
• JSON structure is incomplete
• Common fixes:
  - Check for missing closing brackets } or ]
  - Ensure all quotes are properly closed
  - Verify all arrays and objects are closed
• Context: "${lines[lineNumber - 1]?.trim() || ''}"`,
      },
      'Unexpected string': {
        message: () => `Error at line ${lineNumber}, column ${columnNumber}:
• Invalid string format detected
• Common fixes:
  - Ensure property names are in double quotes
  - Check for missing commas between properties
  - Remove any trailing commas
  - Verify string value formatting
• Context: "${lines[lineNumber - 1]?.trim() || ''}"`,
      },
      'Expected property name': {
        message: () => `Error at line ${lineNumber}:
• Invalid property structure
• Common fixes:
  - Add double quotes around property names
  - Check for missing colons after property names
  - Ensure proper comma usage between properties
• Context: "${lines[lineNumber - 1]?.trim() || ''}"`,
      }
    };

    // Find matching error type or use default
    for (const [key, handler] of Object.entries(errorTypes)) {
      if (error.message.includes(key)) {
        const token = error.message.match(/token (\S+)/)?.[1];
        return {
          message: handler.message(token),
          line: lineNumber
        };
      }
    }

    // Default error message if no specific match
    return {
      message: `Error at line ${lineNumber}:
• ${error.message}
• Check line for proper JSON syntax
• Context: "${lines[lineNumber - 1]?.trim() || ''}"`,
      line: lineNumber
    };
  };

  const handleTextChange = (e) => {
    setInputText(e.target.value);
    setError('');
    setOutputText('');
    setErrorLine(null);
  };

  const handleScroll = (e) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.target.scrollTop;
    }
  };

  const validateAndFormatJSON = () => {
    if (!inputText.trim()) {
      setError('❌ Please enter JSON to validate');
      setErrorLine(null);
      return;
    }

    try {
      const parsed = JSON.parse(inputText);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutputText(formatted);
      setError('✅ Valid JSON format');
      setErrorLine(null);
    } catch (error) {
      const detailedError = getDetailedError(error, inputText);
      setError(`❌ ${detailedError.message}`);
      setErrorLine(detailedError.line);
      setOutputText('');
    }
  };

  return (
    <div className="App">
      <button 
        onClick={() => navigate('/')} 
        className="back-button"
        aria-label="Navigate back to main page"
      >
        Back to Main
      </button>

      <div className="title-section">
        <h1 className="main-title">JSON Validator</h1>
        <p className="subtitle">Validate and format JSON data</p>
      </div>

      <div className="converter-container">
        <div className="text-area-section">
          <div className="text-area-header">
            <label htmlFor="json-input">Input JSON</label>
            <span className="line-count">
              Lines: {inputLineNumbers.length || 0}
            </span>
          </div>
          
          <div className="editor-wrapper">
            <div className="line-numbers" ref={lineNumbersRef}>
              {inputLineNumbers.map(num => (
                <div 
                  key={num} 
                  className={`line-number ${errorLine === num ? 'error-line' : ''}`}
                >
                  {num}
                </div>
              ))}
            </div>
            <textarea
              id="json-input"
              ref={textAreaRef}
              value={inputText}
              onChange={handleTextChange}
              onScroll={handleScroll}
              className="text-editor"
              spellCheck="false"
              placeholder="Paste your JSON here to validate..."
              aria-label="JSON input textarea"
            />
          </div>
        </div>

        {error && (
          <div 
            className={`validation-message ${error.includes('✅') ? 'success' : 'error'}`}
            role="alert"
            style={{ whiteSpace: 'pre-line' }}
          >
            {error}
          </div>
        )}

        <div className="button-group">
          <button 
            onClick={validateAndFormatJSON}
            className="convert-button"
            aria-label="Validate JSON"
          >
            Validate JSON
          </button>
        </div>

        {outputText && (
          <div className="text-area-section">
            <label htmlFor="json-output">Formatted Output</label>
            <div className="editor-wrapper">
              <div className="line-numbers">
                {outputLineNumbers.map(num => (
                  <div key={num} className="line-number">
                    {num}
                  </div>
                ))}
              </div>
              <textarea
                id="json-output"
                value={outputText}
                readOnly
                className="text-editor"
                spellCheck="false"
                aria-label="Formatted JSON output"
              />
            </div>
          </div>
        )}
      </div>

      <div className="instructions">
        <p>
          📝 Paste your JSON to validate its structure and format. The validator will check for syntax errors and proper JSON formatting.
        </p>
      </div>
    </div>
  );
}

export default JsonValidator;