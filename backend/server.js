const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const sgMail = require("@sendgrid/mail");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Optionally, configure CORS for specific origins
app.use(
  cors({
    origin: "http://localhost:5173", // URL of your React app
  })
);

sgMail.setApiKey(process.env.SENDGRIDAPI_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Check if the environment variables are set
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_KEY environment variable");
}

// JWT secret key (use a strong secret key in production)
const jwtSecret = process.env.JWT_SECRET;

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401); // Unauthorized
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error) {
    return res.sendStatus(403); // Forbidden
  }
  const { user } = data;
  req.user = user;
  next();
};

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) return res.status(401).json({ error: error.message });
  res.json({ message: "Login successful", data });
});

app.post("/register", async (req, res) => {
  const { email, password, name, companyName, phoneNumber, address, userType } =
    req.body;

  const { data: signUpData, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) return res.status(401).json({ error: error.message });

  const { user } = signUpData;
  const userId = user.id;

  const table = userType === 1 ? "builders" : "suppliers";
  let payload =
    userType === 1
      ? {
          builder_id: userId,
          company_name: companyName,
          contact_email: email,
          phone_number: phoneNumber,
          address: address,
          name: name,
        }
      : {
          supplier_id: userId,
          company_name: companyName,
          name: name,
          contact_email: email,
          phone_number: phoneNumber,
          address: address,
          registered_date: new Date().toISOString(),
        };
  const { data, insertError } = await supabase.from(table).insert([payload]);

  if (insertError) return res.status(401).json({ error: insertError.message });

  res.status(200).json({
    message: `${
      userType === 1 ? "Builder" : "Supplier"
    } registered successfully!`,
  });
});

app.post("/venture", authenticateToken, async (req, res) => {
  const { name, address, description } = req.body;
  const user = req.user;

  const { data, error } = await supabase.from("ventures").insert({
    builder_id: user.id,
    name: name,
    address: address,
    description: description,
  });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data);
});

app.get("/ventures", authenticateToken, async (req, res) => {
  const { data, error } = await supabase.from("ventures").select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.get("/venture/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("ventures")
    .select("*")
    .eq("venture_id", id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.post("/invite", async (req, res) => {
  const { email, password } = req.body;
  const msg = {
    to: email,
    from: "yaswini.ranga@gmail.com",
    subject: "Sending with SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js ",
    html: `<strong>and easy to do anywhere, even with Node.js ${password}</strong>`,
  };

  sgMail.send(msg).then(
    () => {
      console.log("Email sent");
    },
    (error) => {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    }
  );
  res.send("Invite is sent");
});

app.get("/", (req, res) => {
  res.send("Welcome to Echo homes!");
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
