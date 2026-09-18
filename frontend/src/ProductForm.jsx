import { useState } from 'react';
import PagePreview from './PagePreview';

function ProductForm() {
  const [name, setName] = useState('');
  const [oneLiner, setOneLiner] = useState('');
  const [bullet1, setBullet1] = useState('');
  const [bullet2, setBullet2] = useState('');
  const [bullet3, setBullet3] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          oneLiner,
          bullets: [bullet1, bullet2, bullet3],
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong');
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
      <div style={{ flex: 1 }}>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Product name</label>
            <br />
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. QuickLaunch" />
          </div>

          <div>
            <label>One-liner</label>
            <br />
            <input type="text" value={oneLiner} onChange={(e) => setOneLiner(e.target.value)} placeholder="e.g. Launch a waitlist page in 5 minutes" />
          </div>

          <div>
            <label>Feature 1</label>
            <br />
            <input type="text" value={bullet1} onChange={(e) => setBullet1(e.target.value)} />
          </div>

          <div>
            <label>Feature 2</label>
            <br />
            <input type="text" value={bullet2} onChange={(e) => setBullet2(e.target.value)} />
          </div>

          <div>
            <label>Feature 3</label>
            <br />
            <input type="text" value={bullet3} onChange={(e) => setBullet3(e.target.value)} />
          </div>

          <button type="submit">Create page</button>
        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {result && (
          <p>
            Page created! Your URL slug is: <strong>{result.slug}</strong>
          </p>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <PagePreview name={name} oneLiner={oneLiner} bullets={[bullet1, bullet2, bullet3]} />
      </div>
    </div>
  );
}

export default ProductForm;