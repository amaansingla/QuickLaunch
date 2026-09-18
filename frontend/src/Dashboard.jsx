import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function Dashboard() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSignups() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${slug}/signups`);
        if (!res.ok) throw new Error('Could not load signups');
        const result = await res.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchSignups();
  }, [slug]);

  if (error) return <p>{error}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto' }}>
      <h1>Dashboard for {slug}</h1>
      <p>Total signups: {data.count}</p>

      {data.count === 0 ? (
        <p>No signups yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Email</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Signed up</th>
            </tr>
          </thead>
          <tbody>
            {data.signups.map((s, i) => (
              <tr key={i}>
                <td>{s.email}</td>
                <td>{new Date(s.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;