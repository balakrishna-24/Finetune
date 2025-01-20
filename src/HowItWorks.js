import React from 'react';
import { useNavigate } from 'react-router-dom';

function HowItWorks() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <button 
        onClick={() => navigate('/')} 
        className="back-button"
      >
        Back to Main
      </button>

      <div className="title-section">
        <h1 className="main-title">How It Works</h1>
        <p className="subtitle">Guide to using our conversion tools</p>
      </div>

      <div className="content-container">
        <section className="content-section">
          <h2>Text to JSONL Converter</h2>
          
          <div className="feature-block">
            <h3>Single Chat Format</h3>
            <p>Perfect for simple Q&A pairs:</p>
            <ul>
              <li>Enter user message and assistant response pairs</li>
              <li>Separate each pair with a blank line</li>
              <li>Optional system message for context</li>
              <li>Automatically formats to JSONL</li>
            </ul>
          </div>

          <div className="feature-block">
            <h3>Multi Chat Format</h3>
            <p>Ideal for longer conversations:</p>
            <ul>
              <li>Support for multiple message exchanges</li>
              <li>Separate conversations with triple newlines</li>
              <li>Maintains conversation flow</li>
              <li>Perfect for training complex dialogue models</li>
            </ul>
          </div>

          <div className="feature-block">
            <h3>JSON to JSONL Converter</h3>
            <p>Convert JSON arrays to JSONL format:</p>
            <ul>
              <li>Paste your JSON array</li>
              <li>Automatic conversion to JSONL</li>
              <li>Download formatted results</li>
              <li>Validates JSON structure</li>
            </ul>
          </div>

          <div className="feature-block">
            <h3>JSON Validator</h3>
            <p>Ensure your JSON is correctly formatted:</p>
            <ul>
              <li>Real-time validation</li>
              <li>Detailed error messages</li>
              <li>Auto-formatting</li>
              <li>Line number references</li>
            </ul>
          </div>
        </section>

        <section className="content-section">
          <h2>Best Practices</h2>
          <ul>
            <li>Always review the converted output before downloading</li>
            <li>Use system messages to provide context when needed</li>
            <li>Keep conversations focused and coherent</li>
            <li>Validate JSON structure before conversion</li>
            <li>Maintain consistent formatting in your input</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default HowItWorks;