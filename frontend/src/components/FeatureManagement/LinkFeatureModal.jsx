import React, { useState } from "react";
import { Space, Button, Modal, Select } from "antd";

const LinkFeatureModal = ({
  isOpened,
  handleOk,
  handleCancel,
  featureOptions,
}) => {
  const [loading, setLoading] = useState("");

  const [types, setTypes] = useState([
    {
      key: 1,
      label: "1 Bed",
      choices: [],
      extras: [],
    },
    {
      key: 2,
      label: "2 Bed",
      choices: [],
      extras: [],
    },
    {
      key: 3,
      label: "3 Bed",
      choices: [],
      extras: [],
    },
  ]);

  const handleChange = (values, key, type) => {
    const _types = types.map((_type) => {
      if (_type.key === key) {
        _type[type] = values;
      }
      return _type;
    });
    setTypes(_types);
  };

  const handleLinkFeature = async () => {
    console.log({ types });
    setLoading(true);

    try {
      // await axiosInstance.post("/linkFeature", {
      // });
    } catch (error) {
      console.log("Error linking feature:", error);
    }
    setLoading(false);
    handleOk();
  };

  return (
    <Modal
      title="Link Features"
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
          onClick={handleLinkFeature}
        >
          {loading ? "Linking..." : "Link Features"}
        </Button>,
      ]}
    >
      {types.map((type) => {
        return (
          <Space key={type.key} direction="vertical" style={{ width: "100%" }}>
            <p style={{ margin: "12px 0 0 0" }}>
              <b>{type.label}: </b>
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p>Choices </p>
              <Select
                mode="tags"
                placeholder="Please select"
                onChange={(value) => handleChange(value, type.key, "choices")}
                style={{ width: "85%" }}
                options={featureOptions}
              />
            </div>
            <div
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
                onChange={(value) => handleChange(value, type.key, "extras")}
                style={{ width: "85%" }}
                options={featureOptions}
              />
            </div>
          </Space>
        );
      })}
      <>
        {/* <Space direction="vertical" style={{ width: "100%" }}>
          <p style={{ margin: "12px 0 0 0" }}>
            <b>1 Bed : </b>
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p>Choices </p>
            <Select
              mode="tags"
              placeholder="Please select"
              onChange={handleChange}
              style={{ width: "85%" }}
              options={featureOptions}
            />
          </div>
          <div
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
              onChange={handleChange}
              style={{ width: "85%" }}
              options={featureOptions}
            />
          </div>
        </Space>
        <Space direction="vertical" style={{ width: "100%" }}>
          <p style={{ margin: "12px 0 0 0" }}>
            <b>2 Bed : </b>
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p>Choices </p>
            <Select
              mode="tags"
              placeholder="Please select"
              onChange={handleChange}
              style={{ width: "85%" }}
              options={featureOptions}
            />
          </div>
          <div
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
              onChange={handleChange}
              style={{ width: "85%" }}
              options={featureOptions}
            />
          </div>
        </Space>
        <Space direction="vertical" style={{ width: "100%" }}>
          <p style={{ margin: "12px 0 0 0" }}>
            <b>3 Bed : </b>
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p>Choices </p>
            <Select
              mode="tags"
              placeholder="Please select"
              onChange={handleChange}
              style={{ width: "85%" }}
              options={featureOptions}
            />
          </div>
          <div
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
              onChange={handleChange}
              style={{ width: "85%" }}
              options={featureOptions}
            />
          </div>
        </Space> */}
      </>
    </Modal>
  );
};

export default LinkFeatureModal;
