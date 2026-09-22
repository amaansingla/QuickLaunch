import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function PublicPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [signedUp, setSignedUp] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${slug}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchProduct();
  }, [slug]);

  async function handleSignup(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${slug}/signups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      if (!res.ok) throw new Error('Signup failed');
      setSignedUp(true);
    } catch (err) {
      setError(err.message);
    }
  }

  if (error) return <p>{error}</p>;
  if (!product) return <p>Loading...</p>;

  const bullets = [product.bullet_1, product.bullet_2, product.bullet_3].filter(Boolean);

  return (
    <div className="public-page">
      <div className="public-card">
        <h1 className="title-case">{product.name}</h1>
        <p className="public-oneliner title-case">{product.one_liner}</p>
        <hr className="public-divider" />

        {bullets.length > 0 && (
          <ul className="public-bullets">
            {bullets.map((b, i) => (
              <li key={i} className="title-case">{b}</li>
            ))}
          </ul>
        )}

        {signedUp ? (
          <p className="public-success">You're on the list!</p>
        ) : (
          <form className="public-signup" onSubmit={handleSignup}>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            <button type="submit">Join waitlist</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default PublicPage;