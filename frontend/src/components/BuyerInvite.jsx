import React, { useState } from "react";
import axios from 'axios';
// import nodemailer from 'nodemailer';
const serviceRoleKey = import.meta.env.VITE_SERVICE_ROLE_KEY;
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

function BuyerInvite({ builderId }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  // Function to generate a random password
  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8); // Simple random password generator
  };

  async function inviteBuyer() {
    console.log({email});
    const tempPassword = generateRandomPassword();
    try {
      const response = await axios.post(
        `${supabaseUrl}/auth/v1/admin/users`,
        {
          email: email,
          password: tempPassword,
          email_confirm: true,
        },
        {
          headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('User invited:', response.data);
   
      const resp = await axios.post(
        'http://localhost:3001/invite',
        {
          email: email,
          password: tempPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('email invite sent:', resp.data);
    } catch (error) {
      console.error('Error inviting user:', error.response ? error.response.data : error.message);
    }
  }

  return (
    <div>
      <h2>Invite Buyer</h2>
      <input
        type="email"
        placeholder="Buyer's Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Buyer's Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Buyer's Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <textarea
        placeholder="Buyer's Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button onClick={inviteBuyer} disabled={loading}>
        {loading ? "Inviting..." : "Invite Buyer"}
      </button>
      <p>{message}</p>
    </div>
  );
}

export default BuyerInvite;
