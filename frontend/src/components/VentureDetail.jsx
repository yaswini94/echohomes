import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase";
import BuyerInvite from "./BuyerInvite";

function VentureDetail() {
  const [venture, setVenture] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  // Function to load ventures from Supabase
  const fetchVenture = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("ventures")
      .select("*")
      .eq("venture_id", id)
      .single();

    setLoading(false);

    if (error) {
      console.log("Error fetching ventures:", error);
    } else {
      setVenture(data);
    }
  };

  // Fetch ventures on component mount
  useEffect(() => {
    fetchVenture();
  }, []);

  if (loading) {
    return <p>Loading</p>;
  }

  console.log({ venture });

  return (
    <div>
      <h2>Venture Page</h2>
      <div>
        <strong>{venture.venture_name}</strong> - {venture.location} <br />
        <em>{venture.description}</em>
      </div>

      <BuyerInvite builderId={venture.builder_id} />
    </div>
  );
}

export default VentureDetail;
