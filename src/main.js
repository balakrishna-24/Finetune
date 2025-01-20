import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './App.css';

function App() {
  const [format, setFormat] = useState('single');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isSystemMessageOpen, setIsSystemMessageOpen] = useState(false);
  const [systemMessage, setSystemMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle format change
  const handleFormatChange = (newFormat) => {
    setFormat(newFormat);
    setInputText('');
    setOutputText('');
    setError('');
  };

  // Handle system message changes
  const handleSystemMessageChange = (e) => {
    setSystemMessage(e.target.value);
  };

  // Handle input text changes
  const handleInputTextChange = (e) => {
    const newText = e.target.value;
    if (newText.split('\n').length <= 10000) {
      setInputText(newText);
    }
  };

  const handleSingleChatConvert = () => {
    try {
      setError('');
      const blocks = inputText.trim().split('\n\n').filter(block => block.trim());
      
      if (blocks.length === 0) {
        setError('Please enter some text to convert.');
        return;
      }

      const jsonlData = blocks.map(block => {
        const lines = block.split('\n').filter(line => line.trim());
        
        if (lines.length !== 2) {
          throw new Error('Each conversation must have exactly one user message and one assistant response.');
        }

        const messages = [];
        if (isSystemMessageOpen && systemMessage.trim()) {
          messages.push({ role: "system", content: systemMessage.trim() });
        }
        messages.push({ role: "user", content: lines[0].trim() });
        messages.push({ role: "assistant", content: lines[1].trim() });

        return { messages };
      });

      setOutputText(jsonlData.map(data => JSON.stringify(data)).join('\n'));
    } catch (error) {
      setError(error.message);
      setOutputText('');
    }
  };

  const handleMultiChatConvert = () => {
    try {
      setError('');
      const conversations = inputText.trim().split('\n\n\n').filter(conv => conv.trim());
      
      if (conversations.length === 0) {
        setError('Please enter some text to convert.');
        return;
      }

      const jsonlData = conversations.map(conversation => {
        const exchanges = conversation.split('\n\n').filter(ex => ex.trim());
        const messages = [];

        if (isSystemMessageOpen && systemMessage.trim()) {
          messages.push({ role: "system", content: systemMessage.trim() });
        }

        exchanges.forEach(exchange => {
          const parts = exchange.split('\n').filter(part => part.trim());
          
          if (parts.length !== 2) {
            throw new Error('Each exchange must have a user message and an assistant response.');
          }

          messages.push({ role: "user", content: parts[0].trim() });
          messages.push({ role: "assistant", content: parts[1].trim() });
        });

        return { messages };
      });

      setOutputText(jsonlData.map(data => JSON.stringify(data)).join('\n'));
    } catch (error) {
      setError(error.message);
      setOutputText('');
    }
  };

  const handleConvert = () => {
    if (format === 'single') {
      handleSingleChatConvert();
    } else {
      handleMultiChatConvert();
    }
  };

  const handleDownload = () => {
    if (!outputText) return;
    
    const blob = new Blob([outputText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${format}_chat_converted.jsonl`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Calculate line count
  const lineCount = inputText.split('\n').length;

  return (
    <div className="App">
      <div className="title-section">
        <h1 className="main-title">Text to JSONL Converter</h1>
        <p className="subtitle">for AI Training</p>
      </div>

      <div className="format-selector">
        <button 
          className={`format-button ${format === 'single' ? 'active' : ''}`}
          onClick={() => handleFormatChange('single')}
        >
          Single Chat
        </button>
        <button 
          className={`format-button ${format === 'multi' ? 'active' : ''}`}
          onClick={() => handleFormatChange('multi')}
        >
          Multi Chat
        </button>
      </div>
      
      <div className="converter-container">
        <div className="text-area-section">
          <div className="system-message-section">
            <button 
              className="system-message-toggle"
              onClick={() => setIsSystemMessageOpen(!isSystemMessageOpen)}
            >
              System Message {isSystemMessageOpen ? '▼' : '▶'}
            </button>
            
            {isSystemMessageOpen && (
              <textarea
                value={systemMessage}
                onChange={handleSystemMessageChange}
                className="system-message-input"
                placeholder="Enter system message (e.g., You are a helpful assistant)"
                spellCheck="false"
              />
            )}
          </div>

          <label>
            Text Editor 
            <span className="line-count">{lineCount}/10000 lines</span>
          </label>
          <textarea
            value={inputText}
            onChange={handleInputTextChange}
            placeholder={format === 'single' ? 
              `Enter conversation pairs separated by blank lines:

User message here
Assistant response here

Another user message
Another assistant response` :
              `Enter multi-turn conversations separated by triple newlines:

User message 1
Assistant response 1

User message 2
Assistant response 2


Next conversation
Assistant response`}
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
            Convert to JSONL
          </button>
          {outputText && (
            <button onClick={handleDownload} className="download-button">
              Download JSONL
            </button>
          )}
        </div>

        <div className="text-area-section">
          <label>Output JSONL</label>
          <textarea
            value={outputText}
            readOnly
            className="output-area"
            placeholder="Converted JSONL will appear here..."
            spellCheck="false"
          />
        </div>
      </div>

      <div className="bottom-section">
        <div className="instructions-section">
          <h2>Instructions</h2>
          <div className="instruction-steps">
            <div className="step">
              <h3>1. Choose Format</h3>
              <p>Select Single Chat for simple Q&A pairs or Multi Chat for conversations with multiple exchanges.</p>
            </div>
            <div className="step">
              <h3>2. Enter System Message (Optional)</h3>
              <p>Click on System Message to add context for your AI model.</p>
            </div>
            <div className="step">
              <h3>3. Input Your Text</h3>
              <p>For Single Chat: Enter pairs of messages separated by blank lines.</p>
              <p>For Multi Chat: Enter conversations separated by triple newlines.</p>
            </div>
            <div className="step">
              <h3>4. Convert and Download</h3>
              <p>Click Convert to JSONL and use the Download button to save your file.</p>
            </div>
          </div>
        </div>

        <div className="other-tools-section">
          <h2>Other Tools</h2>
          <div className="tools-list">
            <div className="tool-item">
              <h3>JSON to JSONL Converter</h3>
              <p>Convert JSON arrays to JSONL format.</p>
              <button 
                className="tool-link" 
                onClick={() => {
                  navigate('/json-converter');
                  window.scrollTo(0, 0);
                }}
              >
                Try now
              </button>
            </div>
            <div className="tool-item">
              <h3>JSON Validator</h3>
              <p>Validate and format your JSON data.</p>
              <button 
                className="tool-link"
                onClick={() => navigate('/json-validator')}
              >
                Try Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="footer-links">
        <div className="footer-content">
          <span className="copyright">© 2025 JSONLint.com</span>
          <div className="links">
            <Link to="/how-it-works" className="footer-link">How It Works</Link>
            <span className="separator">•</span>
            <Link to="/privacy-policy" className="footer-link">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;