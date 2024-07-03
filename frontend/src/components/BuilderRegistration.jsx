import React, { useState } from "react";
import { supabase } from "../supabase";

function BuilderRegistration() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data: data1, error } = await supabase.auth.signUp({
      email,
      password,
    });

    console.log({ data1 });

    const { user } = data1;

    if (error) {
      setMessage("Error registering builder: " + error.message);
      setLoading(false);
      return;
    }

    const { data, insertError } = await supabase.from("builders").insert([
      {
        builder_id: user.id,
        company_name: companyName,
        contact_email: email,
        phone_number: phoneNumber,
        address: address,
      },
    ]);

    if (insertError) {
      setMessage("Error saving builder details: " + insertError.message);
      setLoading(false);
      return;
    }

    setMessage("Builder registered successfully!");
    setLoading(false);
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register as a Builder</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Company Name"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        required
      />
      <input
        type="tel"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>
      <p>{message}</p>
    </form>
  );
}

export default BuilderRegistration;
