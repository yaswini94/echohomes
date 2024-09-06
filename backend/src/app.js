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

// Setting API key for the sendgrid mail
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

// Post API to reset password email
app.post("/resetlink", async (req, res) => {
  const { email } = req.body;

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "/resetPassword",
  });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Reset password email sent successful", data });
});

// Post API for update password
app.post("/updatePassword", async (req, res) => {
  const { data, error } = await supabase.auth.updateUser({
    email: req.body?.email,
    password: req.body?.password,
  });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Update password is successful", data });
});

// Post API for login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Login successful", data });
});

// Post API for registerion of supplier/builder
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

// Post API to create checkout session of stripe
app.post("/create-checkout-session", async (req, res) => {
  const { features, buyer_id } = req.body;

  try {
    // Fetch the user from your database using email or user ID
    const { data: user, error: userError } = await supabase
      .from("buyers")
      .select("buyer_id, contact_email, stripe_customer_id")
      .eq("buyer_id", buyer_id)
      .single();

    if (userError) {
      console.error("Error fetching user:", userError.message);
      return res.status(500).json({ error: userError.message });
    }

    let customerId;

    if (user?.stripe_customer_id) {
      // Use existing Stripe customer ID
      customerId = user.stripe_customer_id;
    } else {
      // Create a new Stripe customer
      const customer = await stripe.customers.create({
        email: user.contact_email,
      });
      customerId = customer.id;

      // Update your database with the new Stripe customer ID
      const { error: updateError } = await supabase
        .from("buyers")
        .update({ stripe_customer_id: customerId })
        .eq("buyer_id", buyer_id);

      if (updateError) {
        console.error(
          "Error updating user with Stripe customer ID:",
          updateError.message
        );
        return res.status(500).json({ error: updateError.message });
      }
    }

    const line_items = Object.keys(features.choices).map((choice) => {
      return {
        price_data: {
          currency: "gbp",
          product_data: {
            name: features.choices[choice].name,
            metadata: {
              feature_id: features.choices[choice].id,
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
      invoice_creation: {
        enabled: true,
      },
      client_reference_id: buyer_id,
      metadata: {
        userId: buyer_id,
      },
      success_url: `${process.env.FRONTEND_URL}/buyer-configuration?status=success`,
      cancel_url: `${process.env.FRONTEND_URL}/buyer-configuration?status=cancel`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating Checkout session:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get API to fetch invoice based on invoiceId
app.get("/get-invoice/:invoiceId", async (req, res) => {
  const { invoiceId } = req.params;

  try {
    const invoice = await stripe.invoices.retrieve(invoiceId);
    res.json({ pdfUrl: invoice.invoice_pdf, charge: invoice.charge });
  } catch (error) {
    console.error("Error retrieving invoice:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get API to fetch receipt based on chargeId
app.get("/get-receipt/:chargeId", async (req, res) => {
  const { chargeId } = req.params;

  try {
    const receipt = await stripe.charges.retrieve(chargeId);
    res.json({ receiptUrl: receipt.receipt_url });
  } catch (error) {
    console.error("Error retrieving invoice:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get API to fetch payment intent based on id
app.get("/get-payment-intent/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(id);
    res.json({ paymentIntent });
  } catch (error) {
    console.error("Error retrieving invoice:", error);
    res.status(500).json({ error: error.message });
  }
});

// Post API to create builder/supplier checkout session
app.post(
  "/create-builder-supplier-checkout-session",
  authenticateToken,
  async (req, res) => {
    const { orders = [], supplier_id } = req.body;
    const builder = req.user;

    try {
      // Fetch the user from your database using email or user ID
      const { data: user, error: userError } = await supabase
        .from("builders")
        .select("builder_id, contact_email, stripe_customer_id")
        .eq("builder_id", builder.id)
        .single();

      if (userError) {
        console.error("Error fetching user:", userError.message);
        return res.status(500).json({ error: userError.message });
      }

      let customerId;

      if (user?.stripe_customer_id) {
        // Use existing Stripe customer ID
        customerId = user.stripe_customer_id;
      } else {
        // Create a new Stripe customer
        const customer = await stripe.customers.create({
          email: user.contact_email,
        });
        customerId = customer.id;

        // Update your database with the new Stripe customer ID
        const { error: updateError } = await supabase
          .from("builders")
          .update({ stripe_customer_id: customerId })
          .eq("builder_id", user.builder_id);

        if (updateError) {
          console.error(
            "Error updating user with Stripe customer ID:",
            updateError.message
          );
          return res.status(500).json({ error: updateError.message });
        }
      }

      const line_items = orders.map((order) => {
        return {
          price_data: {
            currency: "gbp",
            product_data: {
              name: order.name,
            },
            unit_amount: order.price * 100,
          },
          quantity: order.quantity,
        };
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        invoice_creation: {
          enabled: true,
        },
        client_reference_id: `builder=${builder.id}__supplier=${supplier_id}`,
        metadata: {
          userId: `builder=${builder.id}__supplier=${supplier_id}`,
        },
        client_reference_id: `builder=${builder.id}__supplier=${supplier_id}`,
        success_url: `${process.env.FRONTEND_URL}/orders?tab=suppliers&status=success`,
        cancel_url: `${process.env.FRONTEND_URL}/orders?tab=suppliers&status=cancel`,
      });

      res.json({ id: session.id });
    } catch (error) {
      // Modify the catch block to log the error
      console.error("Error creating Checkout session:", error); // Log the error
      res.status(500).json({ error: error.message });
    }
  }
);

// Get API for fetching builder based on id
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

// Get API for updating purchase order status
app.post(
  "/update-purchase-order-status",
  authenticateToken,
  async (req, res) => {
    const { po_id, feature_id, status } = req.body;

    // get purchase order based on po_id and get the orders_list column
    const { data, error } = await supabase
      .from("purchase_orders")
      .select("orders_list")
      .eq("po_id", po_id)
      .single();

    // update the status of the feature_id in the orders_list
    let orders_list = data.orders_list;
    orders_list = orders_list.map((order) => {
      if (order.feature_id === feature_id) {
        order.status = status;
      }
      return order;
    });

    // update the orders_list in the purchase_orders table
    const { updateData, updateError } = await supabase
      .from("purchase_orders")
      .update({ orders_list })
      .eq("po_id", po_id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json("Update successfull");
  }
);

// Post API to update builder
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

// Get API to fetch settings based on role
app.get("/settings/:role", authenticateToken, async (req, res) => {
  const { role } = req.params;
  const user = req.user;
  const column =
    role === "builders"
      ? "builder_id"
      : role === "suppliers"
      ? "supplier_id"
      : "buyer_id";

  const { data, error } = await supabase
    .from(role)
    .select("settings")
    .eq(column, user.id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data.settings);
});

// Post API to add venture
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

// Post API for update venture
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

// Get API to fetch ventures
app.get("/ventures", authenticateToken, async (req, res) => {
  const builder = req.user;
  const { data, error } = await supabase
    .from("ventures")
    .select("*")
    .eq("builder_id", builder.id);

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

// Post API to update supplier
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

// Get API to fetch suppliers
app.get("/suppliers", authenticateToken, async (req, res) => {
  const { venture_id } = req.query;

  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .or(`venture_id.eq.${venture_id},venture_id.is.null`);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// Get API to fetch suppliers based on id
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

// Get API to fetch buyers
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

// Get API to fetch specific buyer configuration orders
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

// Post API to create purchase order
app.post("/orders", authenticateToken, async (req, res) => {
  const {
    venture_id,
    supplier_id,
    orders_list,
    total,
    stripe_session_id,
    builder_id,
  } = req.body;

  const { data, error } = await supabase.from("purchase_orders").insert({
    supplier_id,
    venture_id,
    orders_list,
    total,
    stripe_session_id,
    builder_id,
  });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json("Add Feature Successfull");
});

// Get API to fetch supplier orders based on venture_id
app.get("/supplier-orders/:venture_id", authenticateToken, async (req, res) => {
  const supplier_id = req.user;
  const { venture_id } = req.params;
  const { data, error } = await supabase
    .from("purchase_orders")
    .select(
      `
    *,
    supplier:supplier_id (
      name
    )
  `
    )
    .eq("venture_id", venture_id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// Get API to fetch purchase orders based on supplier_id
app.get("/supplier-orders", authenticateToken, async (req, res) => {
  const supplier = req.user;
  const { data, error } = await supabase
    .from("purchase_orders")
    .select(
      `
    *,
    venture:venture_id (
      name,
      address,
      builder_id,
      builder:builder_id (name)
    )
  `
    )
    .eq("supplier_id", supplier.id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// Get API to list details of the buyer based on id
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

// Post API to invite the buyer to the system
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
  const msg = {
    to: email,
    from: "official.echohomes@gmail.com",
    subject: "Invitation to Echohomes as Buyer",
    text: `Hi ${name}, \n We would like to invite you to join echohomes as buyer. \n Please use below link <b>${password}</b> to reset password. `,
    html: `<p>Hi ${name}, \n We would like to invite you to join echohomes as buyer.</p> <p>Please use below password <b>${password}</b> to reset password. </p> <strong>Continue to Login after reset password. Use the link <a>${password}</a></strong>`,
  };

  // triggering supabase signup to allow logins
  const { data: createdUser, createdUserError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (createdUserError) {
    return res.status(400).json({ error: createdUserError.message });
  }

  // Insert data to the buyers table
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

  // To send invite mail to buyer mailid
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

// Post API to invite the supplier to the system
app.post("/invite/supplier", authenticateToken, async (req, res) => {
  const {
    email,
    password,
    phone_number,
    address,
    company_name,
    name,
    venture_id,
  } = req.body;
  const msg = {
    to: email,
    from: "official.echohomes@gmail.com",
    subject: "Invitation to Echohomes as Supplier",
    text: `Hi ${name}, \n We would like to invite you to join echohomes as supplier. \n Please use below link <b>${password}</b> to reset password. `,
    html: `<p>Hi ${name}, \n We would like to invite you to join echohomes as supplier.</p> <p>Please use below password <b>${password}</b> to reset password. </p> <strong>Continue to Login after reset password. Use the link <a>${password}</a></strong>`,
  };

  // triggering supabase signup to allow logins
  const { data: createdUser, createdUserError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (createdUserError) {
    return res.status(400).json({ error: createdUserError.message });
  }

  // Insert data to the suppliers table
  const { data, error } = await supabase.from("suppliers").insert({
    supplier_id: createdUser?.user?.id,
    venture_id,
    company_name,
    name,
    contact_email: email,
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
    return res.status(400).json({ error: error.message });
  }

  // To send invite mail to supplier mailid
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

// Post API to create stripe session based on buyer_id
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

// Post API to get stripe session
app.post("/get-stripe-session", authenticateToken, async (req, res) => {
  const { stripe_session_id } = req.body;

  if (!stripe_session_id) {
    return res.status(404).json({ error: "Session not" });
  }

  const session = await stripe.checkout.sessions.retrieve(stripe_session_id);

  res.json(session);
});

// Post API to update the buyer
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

// Post API to update buyer features
app.post("/update-buyer-features", authenticateToken, async (req, res) => {
  const { features, buyer_id } = req.body;

  const { data, error } = await supabase
    .from("buyers")
    .update({
      features,
    })
    .eq("buyer_id", buyer_id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(201).json("Update successfull");
});

// Post API to add feature
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

// Post API to update the feature
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

// Get API to fetch features
app.get("/features", authenticateToken, async (req, res) => {
  const { builder_id } = req.query;
  const { data, error } = await supabase
    .from("features")
    .select("*")
    .eq("builder_id", builder_id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// Default landing API
app.get("/", (req, res) => {
  res.send("Welcome to Echo homes!");
});

module.exports = app;
