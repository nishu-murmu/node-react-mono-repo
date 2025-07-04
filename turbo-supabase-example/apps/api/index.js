import express from 'express';
import cors from 'cors';

import { supabase } from './src/supabaseClient.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

app.get('/', (req, res) => {
  res.send('Hello from the API! Supabase client ' + (supabase ? 'initialized.' : 'NOT initialized.'));
});

// GET /api/items - Fetch all items
app.get('/api/items', async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase client not initialized.' });
  }
  try {
    const { data, error } = await supabase
      .from('items')
      .select('*');

    if (error) {
      console.error('Supabase error fetching items:', error);
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    console.error('API error fetching items:', err);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
});

// POST /api/items - Create a new item
app.post('/api/items', async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase client not initialized.' });
  }
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Item name is required.' });
    }

    const { data, error } = await supabase
      .from('items')
      .insert([{ name }])
      .select(); // .select() returns the inserted row

    if (error) {
      console.error('Supabase error inserting item:', error);
      return res.status(500).json({ error: error.message });
    }
    res.status(201).json(data[0]);
  } catch (err) {
    console.error('API error inserting item:', err);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
});

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
  if (supabase) {
    console.log("Supabase client initialized successfully.");
  } else {
    console.error("Supabase client failed to initialize. Check .env and supabaseClient.js");
  }
});
