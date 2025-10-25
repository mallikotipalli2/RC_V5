import './StaticPage.css';

export const Privacy = () => {
  return (
    <div className="static-page">
      <div className="container">
        <h1 className="page-title glow-text">Privacy Policy</h1>
        
        <section className="content-section">
          <p><em>Last updated: October 26, 2025</em></p>
        </section>

        <section className="content-section">
          <h2>Our Commitment to Privacy</h2>
          <p>
            RandomChips is built on the principle of anonymity. We believe your conversations should be private, 
            and your identity should remain yours.
          </p>
        </section>

        <section className="content-section">
          <h2>What We DON'T Collect</h2>
          <ul>
            <li>No email addresses or account information</li>
            <li>No names or personal identifiers</li>
            <li>No location tracking</li>
            <li>No persistent user profiles</li>
          </ul>
        </section>

        <section className="content-section">
          <h2>What We Do Collect</h2>
          <ul>
            <li>Temporary session data for active connections</li>
            <li>Anonymous usage statistics to improve the service</li>
            <li>Reported content for safety and moderation purposes</li>
          </ul>
        </section>

        <section className="content-section">
          <h2>Data Retention</h2>
          <p>
            All chat data is temporary and is not stored after your session ends. 
            We do not maintain logs of conversations.
          </p>
        </section>

        <section className="content-section">
          <h2>Cookies and Storage</h2>
          <p>
            We use minimal local storage only for theme preferences. No tracking cookies are used.
          </p>
        </section>

        <section className="content-section">
          <h2>Third-Party Services</h2>
          <p>
            RandomChips does not share your data with third parties for advertising or tracking purposes.
          </p>
        </section>

        <section className="content-section">
          <h2>Changes to This Policy</h2>
          <p>
            We may update this policy as RandomChips evolves. Continued use of the service constitutes acceptance of any changes.
          </p>
        </section>
      </div>
    </div>
  );
};
