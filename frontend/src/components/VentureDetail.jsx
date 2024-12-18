import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BuyerManagement from "./BuyerManagement";
import axiosInstance from "../helpers/axiosInstance";

function VentureDetail() {
  const [venture, setVenture] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  // Function to handle fetch ventures
  const fetchVenture = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.get(`/ventures/${id}`);
      setVenture(response.data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching ventures:", error);
      setLoading(false);
    }
  };

  // Fetch ventures on component mount
  useEffect(() => {
    fetchVenture();
  }, [id]);

  if (loading) {
    return <p>Loading</p>;
  }

  return (
    <div>
      <h2>Venture Details</h2>
      <div>
        <strong>{venture.name}</strong> - {venture.address} <br />
        <em>{venture.description}</em>
      </div>

      <BuyerManagement ventureId={id} builderId={venture.builder_id} />
    </div>
  );
}

export default VentureDetail;
