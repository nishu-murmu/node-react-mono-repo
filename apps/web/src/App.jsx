import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch items from the API
  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/items'); // Proxied to http://localhost:3001/api/items
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setItems(data);
    } catch (e) {
      console.error("Failed to fetch items:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Add a new item
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) {
      alert('Item name cannot be empty');
      return;
    }
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newItemName }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `HTTP error! status: ${response.status}`);
      }
      // const addedItem = await response.json(); // Already received in the response from POST
      setNewItemName(''); // Clear input field
      fetchItems(); // Refresh the list of items
    } catch (e) {
      console.error("Failed to add item:", e);
      setError(e.message);
      alert(`Failed to add item: ${e.message}`);
    }
  };

  // Fetch items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Items Manager</h1>
      </header>
      <main>
        <form onSubmit={handleAddItem}>
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Enter item name"
            required
          />
          <button type="submit">Add Item</button>
        </form>

        {loading && <p>Loading items...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        <h2>Current Items:</h2>
        {items && items.length > 0 ? (
          <ul>
            {items.map((item) => (
              <li key={item.id || item.name}> {/* Fallback key if id is missing for some reason */}
                {item.name} (ID: {item.id})
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p>No items found. Add some!</p>
        )}
      </main>
    </div>
  );
}

export default App;
