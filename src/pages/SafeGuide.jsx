import './StaticPage.css';

export const SafeGuide = () => {
  return (
    <div className="static-page">
      <div className="container">
        <h1 className="page-title glow-text">Safety Guide</h1>
        
        <section className="content-section">
          <h2>Stay Safe on RandomChips</h2>
          <p>
            While RandomChips is designed for anonymous, fun conversations, it's important to stay safe online. 
            Follow these guidelines to protect yourself.
          </p>
        </section>

        <section className="content-section">
          <h2>Protect Your Identity</h2>
          <ul>
            <li><strong>Never share personal information:</strong> No real names, addresses, phone numbers, email, or social media accounts</li>
            <li><strong>Don't share photos:</strong> Even if requested, avoid sharing images that could identify you</li>
            <li><strong>Be vague about location:</strong> Don't reveal your city, school, workplace, or specific locations</li>
            <li><strong>Create no patterns:</strong> Don't share details that could be pieced together to identify you</li>
          </ul>
        </section>

        <section className="content-section">
          <h2>Recognize Red Flags</h2>
          <p>Disconnect immediately if someone:</p>
          <ul>
            <li>Asks for personal information repeatedly</li>
            <li>Makes you uncomfortable with inappropriate content</li>
            <li>Tries to move the conversation off RandomChips</li>
            <li>Sends threats or harassment</li>
            <li>Shares illegal or harmful content</li>
          </ul>
        </section>

        <section className="content-section">
          <h2>Use the Tools</h2>
          <ul>
            <li><strong>Next Chip:</strong> Don't hesitate to skip to a new connection if you're uncomfortable</li>
            <li><strong>Report Chip:</strong> Report users who violate our terms or make you feel unsafe</li>
            <li><strong>Trust your instincts:</strong> If something feels wrong, disconnect</li>
          </ul>
        </section>

        <section className="content-section">
          <h2>For Young Users</h2>
          <p>
            If you're under 18, please use RandomChips with parental supervision. 
            Talk to a trusted adult if you encounter anything that makes you uncomfortable.
          </p>
        </section>

        <section className="content-section">
          <h2>Remember</h2>
          <p>
            RandomChips is for fun, anonymous conversations. Keep it light, keep it safe, 
            and respect other Chips. Your safety is your responsibility.
          </p>
        </section>

        <section className="content-section">
          <h2>Need Help?</h2>
          <p>
            If you've experienced harassment or threats, please report it to appropriate authorities. 
            RandomChips is not a substitute for professional help or law enforcement.
          </p>
        </section>
      </div>
    </div>
  );
};
