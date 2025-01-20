import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

function PrivacyPolicy() {
  const navigate = useNavigate();

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
        <h1 className="main-title">Privacy Policy</h1>
        <p className="subtitle">Last updated: January 19, 2025</p>
      </div>

      <div className="page-container">
        <div className="content-container">
          <section className="content-section">
            <h2>Our Commitment to Privacy</h2>
            <p>We are committed to protecting your privacy and ensuring the security of your data. Our tools operate entirely in your browser, and we do not store or transmit your data to any servers.</p>
          </section>

          <section className="content-section">
            <h2>Data Collection and Usage</h2>
            <ul>
              <li>All text processing occurs locally in your browser</li>
              <li>We do not store your input text or converted output</li>
              <li>No data is transmitted to our servers</li>
              <li>No cookies are used for tracking</li>
              <li>No personal information is collected</li>
            </ul>
          </section>

          <section className="content-section">
            <h2>How Our Tools Work</h2>
            <p>Our conversion tools and validators operate entirely client-side:</p>
            <ul>
              <li>Text to JSONL conversion happens in your browser</li>
              <li>JSON validation is performed locally</li>
              <li>Downloaded files are saved directly to your device</li>
              <li>No cloud processing or storage is involved</li>
            </ul>
          </section>

          <section className="content-section">
            <h2>Data Security</h2>
            <p>We take several measures to ensure your data remains private:</p>
            <ul>
              <li>No server uploads or downloads</li>
              <li>No data persistence between sessions</li>
              <li>All processing happens locally</li>
              <li>Your data is cleared when you close the page</li>
            </ul>
          </section>

          <section className="content-section">
            <h2>Updates to Privacy Policy</h2>
            <p>We may update this privacy policy from time to time. Any changes will be reflected on this page with an updated date.</p>
          </section>

          <section className="content-section">
            <h2>Contact Us</h2>
            <p>If you have any questions about our privacy policy or data practices, please contact us at:</p>
            <ul>
              <li>Email: support@jsonlint.com</li>
              <li>GitHub: <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="link">github.com/yourusername</a></li>
            </ul>
          </section>
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
    </div>
  );
}

export default PrivacyPolicy;