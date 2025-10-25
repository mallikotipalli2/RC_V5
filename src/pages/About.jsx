import './StaticPage.css';

export const About = () => {
  return (
    <div className="static-page">
      <div className="container">
        <h1 className="page-title glow-text">About RandomChips</h1>
        
        <section className="content-section">
          <h2>What is RandomChips?</h2>
          <p>
            RandomChips is an anonymous chat platform where every human is a Chip, and every unknown person is a RandomChip. 
            We believe in instant, genuine connections without the baggage of identity.
          </p>
        </section>

        <section className="content-section">
          <h2>Our Philosophy</h2>
          <p>
            <strong>Every human = Chip</strong><br/>
            <strong>Unknown person = RandomChip</strong>
          </p>
          <p>
            We've designed RandomChips to be fast, minimal, and privacy-first. No accounts, no tracking, no heavy UI distractions. 
            Just you and a RandomChip, talking in a digital void.
          </p>
        </section>

        <section className="content-section">
          <h2>Design Aesthetic</h2>
          <p>
            Our neon glowing chip outlines and futuristic design create a unique atmosphere. 
            Messages appear as centered plain text with distinct colors, making conversations feel like 
            teleporting into random minds.
          </p>
        </section>

        <section className="content-section">
          <h2>Coming Soon</h2>
          <p>
            <strong>Chip Dual:</strong> Talk to two Chips at once. Double the conversation, double the mystery.
          </p>
        </section>
      </div>
    </div>
  );
};
