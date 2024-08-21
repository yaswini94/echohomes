import React, { useEffect, useState } from "react";
import {
  Table,
  Row,
  Col,
  Button,
  InputNumber,
} from "antd";
import axiosInstance from "../../helpers/axiosInstance";
import { useAuth } from "../../auth/useAuth";

const BudgetBasedSuggestions = () => {
  const { user } = useAuth();
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [budget, setBudget] = useState();
  const [suggestedChoices, setSuggestedChoices] = useState([]);
  const [suggestedExtras, setSuggestedExtras] = useState([]);
  const [configuration, setConfiguration] = useState(null);
  const [allFeatures, setAllFeatures] = useState(null);
  const [buyer, setBuyer] = useState(null);

  useEffect(() => {
    if (!buyer?.buyer_id) return;

    const fetchVenture = async () => {
      try {
        const response = await axiosInstance.get(
          `/ventures/${buyer.venture_id}`
        );
        const _venture = response.data;
        const _configuration = (_venture?.properties || []).filter(
          (property) => property.key === buyer.house_type
        );
        setConfiguration(_configuration[0]);
      } catch (error) {
        console.log("Error fetching ventures:", error);
      }
    };
    fetchVenture();
  }, [buyer?.buyer_id]);

  useEffect(() => {
    const fetchBuyer = async () => {
      try {
        const response = await axiosInstance.get(`/buyers/${user.id}`);
        const data = response.data;
        setBuyer(data);
      } catch (error) {
        console.log("Error fetching buyer:", error);
      }
    };
    fetchBuyer();
  });

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await axiosInstance.get("/features");
        const _featuresMap = response?.data?.reduce((acc, feature) => {
          acc[feature.feature_id] = feature;
          return acc;
        }, {});
        setAllFeatures(_featuresMap);
      } catch (error) {
        console.log("Error fetching features:", error);
      }
    };

    fetchFeatures();
  }, []);

  const toggleShowRecommendations = () => {
    if (showRecommendations) {
      setShowRecommendations(false);
    } else {
      let items = [];
      if (configuration?.length != 0) {

        configuration?.choices?.forEach((choice) => {
          items.push({
            ...allFeatures[choice],
            category: 'choice',
          });
        });
        configuration?.extras?.forEach((extra) => {
          items.push({
            ...allFeatures[extra],
            category: 'extras',
          });
        });
      }
      setShowRecommendations(true);
      let list = budgetBasedSuggestions(items, budget);
      setSuggestedChoices(list.suggestedChoices);
      setSuggestedExtras(list.suggestedExtras);
    }
  };

  const recommendationsColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Price", dataIndex: "price", key: "price", render: (_, record) => "£ " + record?.price },
  ];

  function budgetBasedSuggestions(items, budget) {
    // Separate the items into choices and extras
    const choices = items.filter(item => item.category === 'choice');
    const extras = items.filter(item => item.category === 'extras');

    // Sort choices by actual price in descending order (most expensive first)
    choices.sort((a, b) => b.price - a.price);

    // Select the top 3 most expensive items from choices
    const suggestedChoices = choices.slice(0, 3);

    // Initialize the best combination of extras within the budget
    let bestExtras = [];
    let bestCost = 0;

    // Function to find all combinations of extras
    function getCombinations(list) {
      let result = [[]];
      for (let index = 0; index < list.length; index++) {
          const currentLength = result.length;
          for (let j = 0; j < currentLength; j++) {
              result.push(result[j].concat(list[index]));
          }
      }
      return result;
    }

    // Check all combinations of extras to find the best within the budget
    const allExtrasCombinations = getCombinations(extras);
    allExtrasCombinations.forEach(combo => {
      const comboCost = combo.reduce((sum, item) => sum + item.price, 0);
      if (comboCost <= budget && comboCost > bestCost) {
          bestCost = comboCost;
          bestExtras = combo;
      }
    });

    // Return the recommended choices and extras
    return {
      suggestedChoices,
      suggestedExtras: bestExtras,
      totalCost: bestCost
    };
}

  return (
    <div>
      <h3>In-Buget Suggestions</h3>
      <Row align="middle" style={{margin: "24px 0"}}>
        <Col style={{marginRight: "48px"}}>
          <p style={{display: "inline", marginRight: "8px"}}>Enter your buget </p>
          <InputNumber 
            addonBefore="£"
            style={{minWidth: "180px"}}
            placeholder="Enter your budget"
            onChange={(value) => setBudget(value)}
          />
        </Col>
        <Col>
          <Button
            type="primary"
            disabled={!budget}
            onClick={toggleShowRecommendations}
          >
            Suggest in budget
          </Button>
        </Col>
      </Row>
      {showRecommendations && ( 
        <>
          <h3><b>SUGGESTED CHOICES</b></h3>
          <Table
            columns={recommendationsColumns}
            dataSource={suggestedChoices}
            pagination={false}
          />
          <h3><b>SUGGESTED EXTRAS</b></h3>
          {suggestedExtras.length === 0 && <p>No Extras are in budget!</p>}
          {suggestedExtras.length > 0 && (
            <Table
              columns={recommendationsColumns}
              dataSource={suggestedExtras}
              pagination={false}
            />
          )}
        </>
      )}
    </div>
  )
};

export default BudgetBasedSuggestions;