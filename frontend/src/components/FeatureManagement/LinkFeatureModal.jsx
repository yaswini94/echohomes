import React, { useEffect, useState } from "react";
import { Space, Button, Modal, Select } from "antd";
import axiosInstance from "../../helpers/axiosInstance";
import useLocalStorage from "../../utils/useLocalStorage";

const LinkFeatureModal = ({
  isOpened,
  handleOk,
  handleCancel,
  featureOptions,
  defaultValues,
}) => {
  const [loading, setLoading] = useState("");
  const [properties, setProperties] = useState();
  const [ventureId] = useLocalStorage("selectedVenture", null);

  const [types, setTypes] = useState(defaultValues);

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
    let updatedProperties = properties?.map((prop) => {
      const additional = types.find((item) => item.key === prop.key);
      return {
        ...prop,
        choices: additional.choices,
        extras: additional.extras,
      };
    });
    setLoading(true);

    try {
      await axiosInstance.post("/updateVenture", {
        properties: updatedProperties,
        ventureId: ventureId,
      });
    } catch (error) {
      console.log("Error updating venture with linked features:", error);
    }
    setLoading(false);
    handleOk();
  };

  const fetchVentureInfo = async () => {
    const _ventureId = ventureId;
    try {
      const response = await axiosInstance.get(`/ventures/${_ventureId}`);
      setProperties(response?.data?.properties);
    } catch (error) {
      console.log("Error fetching venture info:", error);
    }
  };
  useEffect(() => {
    fetchVentureInfo();
  }, [isOpened]);

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
                maxTagCount="responsive"
                onChange={(value) => handleChange(value, type.key, "choices")}
                style={{ width: "85%" }}
                options={featureOptions}
                defaultValue={type.choices}
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
                maxTagCount="responsive"
                onChange={(value) => handleChange(value, type.key, "extras")}
                style={{ width: "85%" }}
                options={featureOptions}
                defaultValue={type.extras}
              />
            </div>
          </Space>
        );
      })}
    </Modal>
  );
};

export default LinkFeatureModal;
