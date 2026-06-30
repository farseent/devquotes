import { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [quotes, setQuotes] = useState([]);
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    const res = await axios.get(`${API}/api/quotes`);
    setQuotes(res.data);
  };

  const handleSubmit = async () => {
    setError('');

    if (!text || !author) {
      setError('Both fields are required.');
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API}/api/quotes`, { text, author });
      setText('');
      setAuthor('');
      fetchQuotes();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>💬 DevQuotes</h1>

      <div style={{ marginBottom: '24px' }}>
        <input
          placeholder="Quote"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
        />
        <input
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          {loading ? 'Posting...' : 'Post Quote'}
        </button>
      </div>

      <div>
        {quotes.length === 0 && <p>No quotes yet. Be the first!</p>}
        {quotes.map((q) => (
          <div
            key={q._id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '12px',
            }}
          >
            <p style={{ margin: 0 }}>"{q.text}"</p>
            <small style={{ color: '#888' }}>— {q.author}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;