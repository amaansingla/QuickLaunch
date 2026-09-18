function PagePreview({ name, oneLiner, bullets }) {
  const filledBullets = bullets.filter((b) => b.trim() !== '');

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '24px', minHeight: '300px' }}>
      <h2>{name || 'Your product name'}</h2>
      <p>{oneLiner || 'Your one-liner goes here'}</p>

      {filledBullets.length > 0 && (
        <ul>
          {filledBullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: '24px' }}>
        <input type="email" placeholder="you@example.com" disabled />
        <button disabled>Join waitlist</button>
      </div>
    </div>
  );
}

export default PagePreview;