import './StaticPage.css';

export const Terms = () => {
  return (
    <div className="static-page">
      <div className="container">
        <h1 className="page-title glow-text">Terms of Service</h1>
        
        <section className="content-section">
          <p><em>Last updated: October 26, 2025</em></p>
        </section>

        <section className="content-section">
          <h2>Acceptance of Terms</h2>
          <p>
            By accessing and using RandomChips, you accept and agree to be bound by these Terms of Service.
          </p>
        </section>

        <section className="content-section">
          <h2>Service Description</h2>
          <p>
            RandomChips provides anonymous, instant chat connections between users ("Chips"). 
            The service is provided "as is" without warranties of any kind.
          </p>
        </section>

        <section className="content-section">
          <h2>User Conduct</h2>
          <p>You agree NOT to:</p>
          <ul>
            <li>Share personal information that could identify yourself or others</li>
            <li>Engage in harassment, hate speech, or abusive behavior</li>
            <li>Share illegal, harmful, or explicit content</li>
            <li>Spam, advertise, or solicit other users</li>
            <li>Attempt to compromise the security of the service</li>
            <li>Use the service for any unlawful purpose</li>
          </ul>
        </section>

        <section className="content-section">
          <h2>Content</h2>
          <p>
            You are responsible for all content you share through RandomChips. 
            We reserve the right to remove content and terminate access for violations of these terms.
          </p>
        </section>

        <section className="content-section">
          <h2>Reporting and Moderation</h2>
          <p>
            Users can report inappropriate behavior. Reported content may be reviewed, 
            and action may be taken including connection termination or service bans.
          </p>
        </section>

        <section className="content-section">
          <h2>Age Requirement</h2>
          <p>
            You must be at least 13 years old to use RandomChips. Users under 18 should have parental supervision.
          </p>
        </section>

        <section className="content-section">
          <h2>Disclaimer</h2>
          <p>
            RandomChips is not responsible for user conduct or content. 
            Use the service at your own risk and exercise caution when chatting with strangers.
          </p>
        </section>

        <section className="content-section">
          <h2>Termination</h2>
          <p>
            We reserve the right to terminate or suspend access to the service at any time, 
            for any reason, without notice.
          </p>
        </section>

        <section className="content-section">
          <h2>Changes to Terms</h2>
          <p>
            These terms may be updated periodically. Continued use of RandomChips constitutes acceptance of modified terms.
          </p>
        </section>
      </div>
    </div>
  );
};
