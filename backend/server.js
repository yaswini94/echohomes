const express = require('express');
const cors = require('cors');
// const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');
// import { process } from '';

const app = express();
app.use(cors());
app.use(express.json());

// Optionally, configure CORS for specific origins
app.use(cors({
  origin: 'http://localhost:3001' // URL of your React app
}));

require('dotenv').config();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   // Additional settings depending on your environment
// });

// const supabase = createClient(
//   'YOUR_SUPABASE_URL',
//   'YOUR_SUPABASE_ANON_KEY'
// );

app.get('/', (req, res) => {
  res.send('Welcome to Echo homes!');
});

// app.post('/login', (req, res) => {
//   const { email, password } = req.body;
//   // Here, you'd check the credentials against a database or other service
//   if (email === 'yaswini.ranga@gmail.com' && password === 'Pass12') {
//       res.json({ message: 'Login Successful!' });
//   } else {
//       res.status(401).json({ message: 'Invalid credentials' });
//   }
// });

app.post('/login', async (req, res) => {
  const { email, password } = req;
  const { user, error } = await supabase.auth.signIn({
    email: email,
    password: password,
  });

  if (error) return res.status(401).json({ error: error.message });
  res.json({ message: 'Login successful', user });
});

app.post('/register', async (req, res) => {
  const { email, name, usertype, password } = req;
  const { user, error } = await supabase.auth.signUp({
    email: email,
    name: name,
    usertype, usertype,
    password: password,
  });

  if (error) return res.status(401).json({ error: error.message });
  res.json({ message: 'Register successful', user });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

