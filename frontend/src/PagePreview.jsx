function PagePreview({ name, oneLiner, bullets }) {
  const filledBullets = bullets.filter((b) => b.trim() !== '');

  return (
    <div className="preview-card">
      <div className="preview-chrome">Preview</div>
      <div className="preview-body">
        <h2>{name || 'Your product name'}</h2>
        <p className="preview-oneliner">{oneLiner || 'Your one-liner goes here'}</p>

        {filledBullets.length > 0 && (
          <ul className="preview-bullets">
            {filledBullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}

        <div className="preview-signup">
          <input type="email" placeholder="you@example.com" disabled />
          <button disabled>Join waitlist</button>
        </div>
      </div>
    </div>
  );
}

export default PagePreview;