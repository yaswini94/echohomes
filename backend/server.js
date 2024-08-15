const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const sgMail = require("@sendgrid/mail");
const bodyParser = require("body-parser");
// const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Optionally, configure CORS for specific origins
app.use(
  cors({
    origin: "*",
  })
);
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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
// const jwtSecret = process.env.JWT_SECRET;

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

app.post("/resetlink", async (req, res) => {
  const { email } = req.body;

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "/resetPassword",
  });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Reset password email sent successful", data });
});

app.post("/updatePassword", async (req, res) => {
  const { data, error } = await supabase.auth.updateUser({
    email: req.body?.email,
    password: req.body?.password,
  });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Update password is successful", data });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Login successful", data });
});

app.post("/register", async (req, res) => {
  const { email, password, name, companyName, phoneNumber, address, userType } =
    req.body;

  const { data: signUpData, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) return res.status(400).json({ error: error.message });

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
          settings: {
            font: "Arial",
            fontSize: 14,
            theme: "light",
          },
        }
      : {
          supplier_id: userId,
          company_name: companyName,
          name: name,
          contact_email: email,
          phone_number: phoneNumber,
          address: address,
          settings: {
            font: "Arial",
            fontSize: 14,
            theme: "light",
          },
          registered_date: new Date().toISOString(),
        };
  const { data, insertError } = await supabase.from(table).insert([payload]);

  if (insertError) return res.status(400).json({ error: insertError.message });

  res.status(200).json({
    message: `${
      userType === 1 ? "Builder" : "Supplier"
    } registered successfully!`,
  });
});

app.post("/create-checkout-session", async (req, res) => {
  const { features, buyer_id } = req.body;

  const line_items = Object.keys(features.choices).map((choice) => {
    return {
      price_data: {
        currency: "gbp",
        product_data: {
          name: features.choices[choice].name,
          metadata: {
            feature_id: features.extras[choice].id,
            type: "choice",
          },
        },
        unit_amount: features.choices[choice].price * 100,
      },
      quantity: features.choices[choice].quantity,
    };
  });

  Object.keys(features.extras).forEach((extra) => {
    line_items.push({
      price_data: {
        currency: "gbp",
        product_data: {
          name: features.extras[extra].name,
          metadata: {
            feature_id: features.extras[extra].id,
            type: "extras",
          },
        },
        unit_amount: features.extras[extra].price * 100,
      },
      quantity: features.extras[extra].quantity,
    });
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    client_reference_id: buyer_id,
    success_url: `${process.env.FRONTEND_URL}/buyer-configuration?status=success`,
    cancel_url: `${process.env.FRONTEND_URL}/buyer-configuration?status=cancel`,
  });

  res.json({ id: session.id });
});

app.get("/builders/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("builders")
    .select("*")
    .eq("builder_id", id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.post("/updateBuilder", authenticateToken, async (req, res) => {
  const { settings, feedback, builder_id } = req.body;
  const { data, error } = await supabase
    .from("builders")
    .update({ settings, feedback })
    .eq("builder_id", builder_id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(201).json("Update successfull");
});

app.post("/addVenture", authenticateToken, async (req, res) => {
  const { name, address, description, properties } = req.body;
  const user = req.user;

  const { data, error } = await supabase.from("ventures").insert({
    builder_id: user.id,
    name,
    address,
    description,
    properties,
  });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data);
});

app.post("/updateVenture", authenticateToken, async (req, res) => {
  const { name, address, description, ventureId, properties } = req.body;

  const { data, error } = await supabase
    .from("ventures")
    .update({ name, address, description, properties })
    .eq("venture_id", ventureId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(201).json("Update successfull");
});

app.get("/ventures", authenticateToken, async (req, res) => {
  const { data, error } = await supabase.from("ventures").select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// To fetch venture details based on id
app.get("/ventures/:id", authenticateToken, async (req, res) => {
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

app.post("/addSupplier", authenticateToken, async (req, res) => {
  const {
    name,
    contact_email,
    address,
    phone_number,
    company_name,
    venture_id,
  } = req.body;

  const { data, error } = await supabase.from("suppliers").insert({
    venture_id,
    company_name,
    name,
    contact_email,
    phone_number,
    address: address,
    settings: {
      font: "Arial",
      fontSize: 14,
      theme: "light",
    },
    registered_date: new Date().toISOString(),
  });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json("Add Supplier Successfull");
});

app.post("/updateSupplier", authenticateToken, async (req, res) => {
  const {
    name,
    contact_email,
    address,
    phone_number,
    company_name,
    supplier_id,
    settings,
    feedback,
  } = req.body;

  const { data, error } = await supabase
    .from("suppliers")
    .update({
      name,
      contact_email,
      address,
      phone_number,
      company_name,
      settings,
      feedback,
    })
    .eq("supplier_id", supplier_id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(201).json("Update successfull");
});

app.get("/suppliers", authenticateToken, async (req, res) => {
  const { data, error } = await supabase.from("suppliers").select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.get("/suppliers/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("supplier_id", id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.get("/buyers", authenticateToken, async (req, res) => {
  const ventureId = req.query.venture_id;
  const { data, error } = await supabase
    .from("buyers")
    .select("*")
    .eq("venture_id", ventureId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.get("/orders", authenticateToken, async (req, res) => {
  const ventureId = req.query.venture_id;
  const { data, error } = await supabase
    .from("buyers")
    .select("*")
    .eq("venture_id", ventureId)
    // where features are not null
    .not("features", "is", null);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// To list details of the buyer
app.get("/buyers/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("buyers")
    .select("*")
    .eq("buyer_id", id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.post("/invite", authenticateToken, async (req, res) => {
  const {
    email,
    password,
    phone_number,
    address,
    name,
    house_type,
    venture_id,
  } = req.body;
  const user = req.user;
  const msg = {
    to: email,
    from: "official.echohomes@gmail.com",
    subject: "Invitation to Echohomes as Buyer",
    text: `Hi ${name}, \n We would like to invite you to join echohomes as buyer. \n Please use below link ${password} to reset password. `,
    html: `<p>Hi ${name}, \n We would like to invite you to join echohomes as buyer.</p> <p>Please use below password <a>${password}</a> to reset password. </p> <strong>Continue to Login after reset password. Use the link <a>${password}</a></strong>`,
  };

  const { data: createdUser, createdUserError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (createdUserError) {
    return res.status(400).json({ error: createdUserError.message });
  }

  console.log({ createdUser: createdUser?.user?.id, builderId: user.id });

  const { data, error } = await supabase.from("buyers").insert({
    buyer_id: createdUser?.user?.id,
    name,
    address,
    phone_number,
    house_type,
    contact_email: email,
    venture_id,
    settings: {
      font: "Arial",
      fontSize: 14,
      theme: "light",
    },
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

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

app.post("/stripe-session", authenticateToken, async (req, res) => {
  const { buyer_id } = req.body;

  const { data, error } = await supabase
    .from("buyers")
    .select("stripe_session_id")
    .eq("buyer_id", buyer_id)
    .single();

  if (!data?.stripe_session_id) {
    return res.status(404).json({ error: "Session not" });
  }

  const session = await stripe.checkout.sessions.retrieve(
    data.stripe_session_id
  );

  res.json(session);
});

app.post("/updateBuyer", authenticateToken, async (req, res) => {
  const {
    name,
    contact_email,
    address,
    phone_number,
    house_type,
    buyer_id,
    features,
    settings,
    feedback,
    stripe_session_id,
  } = req.body;

  const { data, error } = await supabase
    .from("buyers")
    .update({
      name,
      contact_email,
      address,
      phone_number,
      features,
      house_type,
      settings,
      feedback,
      stripe_session_id,
    })
    .eq("buyer_id", buyer_id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(201).json("Update successfull");
});

app.post("/addFeature", authenticateToken, async (req, res) => {
  const { name, details, price, images } = req.body;
  const user = req.user;

  const { data, error } = await supabase.from("features").insert({
    name,
    details,
    images,
    price,
    builder_id: user.id,
  });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json("Add Feature Successfull");
});

app.post("/updateFeature", authenticateToken, async (req, res) => {
  const { name, details, images, price, feature_id } = req.body;

  const { data, error } = await supabase
    .from("features")
    .update({ name, details, price, images })
    .eq("feature_id", feature_id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(201).json("Update successfull");
});

app.get("/features", authenticateToken, async (req, res) => {
  const user = req.user;
  const { data, error } = await supabase.from("features").select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.get("/", (req, res) => {
  res.send("Welcome to Echo homes!");
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
