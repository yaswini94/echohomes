const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const sgMail = require('@sendgrid/mail');
const app = express();
app.use(cors());
app.use(express.json());

sgMail.setApiKey(process.env.SENDGRIDAPI_KEY);


// Optionally, configure CORS for specific origins
app.use(cors({
  origin: 'http://localhost:5173' // URL of your React app
}));

require('dotenv').config();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Check if the environment variables are set
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_KEY environment variable');
}

app.post('/invite', async (req, res) => {
  const { email, password } = req.body;
  const msg = {
    to: email,
    from: 'yaswini.ranga@gmail.com',
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js ',
    html: `<strong>and easy to do anywhere, even with Node.js ${password}</strong>`,
  };

  sgMail
  .send(msg)
  .then(() => {console.log('Email sent')}, error => {
    console.error(error);

    if (error.response) {
      console.error(error.response.body)
    }
  });
  res.send("Invite is sent");
});

app.post('/login', async (req, res) => {
  const { email, password } = req;
  const { user, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) return res.status(401).json({ error: error.message });
  res.json({ message: 'Login successful', user });
});

// app.post('/register', async (req, res) => {
//   const { email, name, companyName, phoneNumber, address, password } = req;
//   const { data: signUpData, error } = await supabase.auth.signUp({
//     email,
//     password,
//   });

//   console.log({ signUpData });

//   const { user } = signUpData;

//   if (error) {
//     if (userType === 1) {
//       setMessage("Error registering builder: " + error.message);
//     } else if (userType === 2) {
//       setMessage("Error registering supplier: " + error.message);
//     }
//     setLoading(false);
//     return;
//   }
//   if (userType === 1) {
//     const { data, insertError } = await supabase.from("builders").insert([
//       {
//         builder_id: user.id,
//         company_name: companyName,
//         contact_email: email,
//         phone_number: phoneNumber,
//         address: address,
//         name: name,
//       },
//     ]);

//     if (insertError) {
//       setMessage("Error saving builder details: " + insertError.message);
//       setLoading(false);
//       return;
//     }
//     setMessage("Builder registered successfully!");
//   } else if (userType === 2) {
//     const { data, insertError } = await supabase.from("suppliers").insert([
//       {
//         supplier_id: user.id,
//         company_name: companyName,
//         name: name,
//         contact_email: email,
//         phone_number: phoneNumber,
//         address: address,
//         registered_date: new Date().toISOString()
//       },
//     ]);

//     if (insertError) {
//       setMessage("Error saving supplier details: " + insertError.message);
//       setLoading(false);
//       return;
//     }
//     setMessage("Supplier registered successfully!");
//   }

//   setLoading(false);
// });
app.post('/register', async (req, res) => {
  console.log('req ',req.body);
  const { userId, email, name, companyName, phoneNumber, address, userType } = req.body;

  try {
    // Insert additional details based on userType
    const table = userType === 1 ? "builders" : "suppliers";
    console.log('table ', table);
    let payload = userType === 1 ? 
    {
      builder_id: userId,
      company_name: companyName,
      contact_email: email,
      phone_number: phoneNumber,
      address: address,
      name: name,
    } :
    {
      supplier_id: userId,
      company_name: companyName,
      name: name,
      contact_email: email,
      phone_number: phoneNumber,
      address: address,
      registered_date: new Date().toISOString()
    };
    console.log('payload ', payload);
    const { data, insertError } = await supabase.from(table).insert([payload]);

    if (insertError) {
      console.log("came inside error");
      throw insertError;
    }

    res.status(200).json({ message: `${userType === 1 ? 'Builder' : 'Supplier'} registered successfully!` });
  } catch (error) {
    console.log("failed ", error);
    res.status(400).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to Echo homes!');
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

