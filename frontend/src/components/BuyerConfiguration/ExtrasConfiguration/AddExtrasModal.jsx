import React, { useState } from "react";
import {
  Button,
  // Input,
  // Form,
  Space,
  Modal,
  Select
} from "antd";
import { MAX_COUNT } from "../../../utils/constants";

const AddExtrasModal = ({ isOpened, handleOk, handleCancel }) => {
  const [loading, setLoading] = useState("");
  // const [name, setName] = useState("");
  // const [details, setDetails] = useState("");
  // const [price, setPrice] = useState();

  const types = [{key: 1, id: 'xyz', name: 'xyz'}, {key: 2, id: 'yzz', name: 'yzz'}];
  const addExtras = async () => {
    setLoading(true);

    try {
      // await axiosInstance.post("/addFeature", {
      //   name,
      //   price,
      //   details,
      // });
    } catch (error) {
      console.log("Error adding choice:", error);
    }
    setLoading(false);
    handleOk();
  };

  // // Function to load features from Supabase
  // const fetchFeatures = async () => {
  //   const { data, error } = await supabase.from("features").select("*");
  //   if (error) {
  //     console.log("Error fetching features:", error);
  //   } else {
  //     setFeatures(data);
  //     let options = [];
  //     data?.forEach((feature) => {
  //       options.push({
  //         value: feature?.name,
  //         label: feature?.name,
  //         id: feature?.feature_id,
  //       });
  //     });
  //     setFeatureOptions(options);
  //   }
  // };

  return(
    <Modal
      title="Add Extras"
      open={isOpened}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          // onClick={handleLinkFeature}
        >
          {loading ? "Adding..." : "Add Choices"}
        </Button>,
      ]}
    >
      {/* {types.map((type) => { */}
        {/* return ( */}
          <Space direction="vertical" style={{ width: "100%" }}>
            {/* <p style={{ margin: "12px 0 0 0" }}>
              <b>{type.label}: </b>
            </p> */}
            {/* <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p>Choices </p> */}
              <Select
                mode="tags"
                placeholder="Please select"
                maxCount={MAX_COUNT}
                onChange={(value) => console.log(value)}
                // onChange={(value) => handleChange(value, type.key, "choices")}
                style={{ width: "100%" }}
                options={types}
              />
            {/* </div> */}
            {/* <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p>Extras </p>
              <Select
                mode="tags"
                placeholder="Please select"
                maxTagCount="responsive"
                onChange={(value) => handleChange(value, type.key, "extras")}
                style={{ width: "100%" }}
                options={featureOptions}
              />
            </div> */}
          </Space>
        {/* ); */}
      {/* })} */}
    </Modal>
  );
}

export default AddExtrasModal;