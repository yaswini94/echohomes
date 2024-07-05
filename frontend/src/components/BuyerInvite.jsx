import React, { useState } from "react";
import { supabase } from "../supabase"; 

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

  // Function to invite a new buyer
  const inviteBuyer = async () => {
    setLoading(true);

    const password = generateRandomPassword();

    const { error } = await supabase.auth.signUp(
      {
        email: email,
        password: password,
      },
      {
        redirectTo: "http://localhost:3000/confirm",
      }
    );

    if (error) {
      console.log(error);
      return;
    }

    const { data, error: inviteError } =
      await supabase.auth.api.inviteUserByEmail(email);

    if (inviteError) {
      console.log(inviteError);
      return;
    }

    console.log(data);

    // const { data, error } = await supabase.auth.signUp({
    //   email,
    //   password,
    // });

    // const { user } = data;

    // if (signUpError) {
    //   setMessage("Error creating buyer account: " + signUpError.message);
    //   setLoading(false);
    //   return;
    // }

    // const { data: insertData, error: insertError } = await supabase
    //   .from("home_buyers")
    //   .insert([
    //     {
    //       buyer_id: user.id,
    //       builder_id: builderId,
    //       name: name,
    //       contact_email: email,
    //       phone_number: phone,
    //       address: address,
    //     },
    //   ]);

    // if (insertError) {
    //   setMessage("Error saving buyer details: " + insertError.message);
    //   setLoading(false);
    //   return;
    // }

    // // Send an email invitation (assuming you have a function set up to handle this)
    // sendEmailInvitation(email, password);
    // setMessage("Buyer invited successfully!");
    // setLoading(false);
  };

  // Simulated email sending function
  const sendEmailInvitation = (email, password) => {
    console.log(`Email sent to ${email} with password ${password}`);
  };

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
