import React, { useEffect, useState } from "react";
import {
  Table,
  Row,
  Col,
  Button,
  InputNumber,
} from "antd";

const BudgetBasedSuggestions = () => {
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [budget, setBudget] = useState();
  const [suggestedChoices, setSuggestedChoices] = useState([]);
  const [suggestedExtras, setSuggestedExtras] = useState([]);

  const toggleShowRecommendations = () => {
    if (showRecommendations) {
      setShowRecommendations(false);
    } else {
      const items = [
        { name: 'Item A', price: 50, category: 'choice' },
        { name: 'Item B', price: 30, category: 'choice' },
        { name: 'Item C', price: 70, category: 'choice' },
        { name: 'Item D', price: 40, category: 'extras' },
        { name: 'Item E', price: 60, category: 'extras' },
        { name: 'Item F', price: 20, category: 'extras' },
        { name: 'Item G', price: 90, category: 'extras' }
      ];
      setShowRecommendations(true);
      let list = budgetBasedSuggestions(items, budget);
      console.log(list);
      setSuggestedChoices(list.suggestedChoices);
      setSuggestedExtras(list.suggestedExtras);
    }
  };

  const recommendationsColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Price", dataIndex: "price", key: "price", render: (_, record) => "£ " + record?.price },
    // { title: "Quantity", dataIndex: "quantity", key: "quantity" },
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
          <Table
            columns={recommendationsColumns}
            dataSource={suggestedChoices}
            title={() => <b>SUGGESTED CHOICES</b>}
            pagination={false}
          />
          <Table
            columns={recommendationsColumns}
            dataSource={suggestedExtras}
            title={() => <b>SUGGESTED EXTRAS</b>}
            pagination={false}
          />
        </>
      )}
    </div>
  )
};

export default BudgetBasedSuggestions;