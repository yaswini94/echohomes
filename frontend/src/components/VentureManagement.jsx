import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";
import { useAuth } from "../auth/useAuth";

function VentureManagement() {
  const [ventures, setVentures] = useState([]);
  const [ventureName, setVentureName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  // Function to load ventures from Supabase
  const fetchVentures = async () => {
    const { data, error } = await supabase.from("ventures").select("*");
    if (error) {
      console.log("Error fetching ventures:", error);
    } else {
      setVentures(data);
    }
  };

  // Function to add a new venture
  const addVenture = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("ventures").insert([
      {
        builder_id: user.id,
        venture_name: ventureName,
        location: location,
        description: description,
      },
    ]);
    if (error) {
      console.log("Error adding venture:", error);
    } else {
      setVentures([...ventures, ...data]);
      setVentureName("");
      setLocation("");
      setDescription("");
    }
    setLoading(false);
  };

  // Fetch ventures on component mount
  useEffect(() => {
    fetchVentures();
  }, []);

  return (
    <div>
      <h2>Venture Management</h2>
      <div>
        <input
          type="text"
          placeholder="Venture Name"
          value={ventureName}
          onChange={(e) => setVentureName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={addVenture} disabled={loading}>
          {loading ? "Adding..." : "Add Venture"}
        </button>
      </div>
      <div>
        <h3>Existing Ventures</h3>
        <ul>
          {ventures.map((venture, index) => (
            <li key={venture.venture_id}>
              <Link to={`/venture/${venture.venture_id}`}>
                <strong>{venture.venture_name}</strong> - {venture.location}{" "}
                <br />
                <em>{venture.description}</em>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default VentureManagement;
