import React, { useState, useEffect } from "react";
import { Space, Table, Row, Col, Button, Avatar, Tabs } from "antd";
import { useTranslation } from "react-i18next";
import { supabase } from "../../supabase";
import { PlusOutlined } from "@ant-design/icons";
import deleteIcon from "../../assets/delete.png";
import editIcon from "../../assets/edit.png";
import linkIcon from "../../assets/link.png";
import AddFeatureModal from "./AddFeatureModal";
import EditFeatureModal from "./EditFeatureModal";
import LinkFeatureModal from "./LinkFeatureModal";
import useLocalStorage from "../../utils/useLocalStorage";
import axiosInstance from "../../helpers/axiosInstance";
import { useAuth } from "../../auth/useAuth";

const FeatureManagement = () => {
  const { t } = useTranslation();

  const [features, setFeatures] = useState({});
  const [selectedFeature, setSelectedFeature] = useState([]);
  const [featureOptions, setFeatureOptions] = useState([]);
  const [defaultValues, setDefaultValues] = useState([
    {
      key: 1,
      label: t("1Bed"),
      choices: [],
      extras: [],
    },
    {
      key: 2,
      label: t("2Bed"),
      choices: [],
      extras: [],
    },
    {
      key: 3,
      label: t("3Bed"),
      choices: [],
      extras: [],
    },
  ]);
  const [linkedFeatures, setLinkedFeatures] = useState([]);
  const [isLinkModalVisible, setIsLinkModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [ventureId] = useLocalStorage("selectedVenture", null);

  const { user } = useAuth();

  useEffect(() => {
    if (!ventureId) return;

    // Function to fetch venture based on venture_id
    const fetchVenture = async () => {
      try {
        const response = await axiosInstance.get(`/ventures/${ventureId}`);
        const _properties = response.data?.properties;
        setDefaultValues(_properties);
      } catch (error) {
        console.log("Error fetching ventures:", error);
      }
    };

    fetchVenture();
  }, [ventureId]);

  useEffect(() => {
    if (!Object.keys(features)?.length || !defaultValues?.length) return;

    // Creating linkedfeatures data by using map to link choices and extras
    const _linkedFeatures = defaultValues.map((property) => {
      return {
        ...property,
        choices: property.choices.map((choice) => features[choice]),
        extras: property.extras.map((extra) => features[extra]),
      };
    });
    setLinkedFeatures(_linkedFeatures);
  }, [defaultValues, features]);

  // Function to show add modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Function to handle add button in add modal
  const handleOk = () => {
    fetchFeatures();
    setIsModalVisible(false);
  };

  // Function to handle add modal cancel button
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Function to handle edit modal
  const showEditModal = (feature) => {
    setSelectedFeature(feature);
    setIsEditModalVisible(true);
  };

  // Function to handle edit modal update button
  const handleEditOk = () => {
    fetchFeatures();
    setIsEditModalVisible(false);
  };

  // Function to handle edit modal cancel button
  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

  // Function to show link modal
  const showLinkModal = () => {
    setIsLinkModalVisible(true);
  };

  // Function to handle link button in link modal
  const handleLinkOk = () => {
    fetchFeatures();
    setIsLinkModalVisible(false);
  };

  // Function to handle cancel button in link modal
  const handleLinkCancel = () => {
    setIsLinkModalVisible(false);
  };

  // Function to delete feature from linked items list
  const deleteFeature = async (id) => {
    if (id) {
      const { data, error } = await supabase
        .from("features")
        .delete()
        .match({ feature_id: id });

      if (error) {
        console.error("Error deleting feature:", error);
        return { error };
      }

      fetchFeatures();
    }
  };

  // Function to handle fetch features
  const fetchFeatures = async () => {
    try {
      const response = await axiosInstance.get(
        `/features?builder_id=${user?.id}`
      );
      const _featuresMap = response?.data?.reduce((acc, feature) => {
        acc[feature.feature_id] = feature;
        return acc;
      }, {});
      setFeatures(_featuresMap);

      let options = [];
      response?.data?.forEach((feature) => {
        options.push({
          value: feature?.feature_id,
          label: feature?.name,
        });
      });
      setFeatureOptions(options);
    } catch (error) {
      console.log("Error fetching features:", error);
    }
  };

  // Columns for linked features table
  const linkedColumns = [
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
      width: "33%",
    },
    {
      title: t("details"),
      dataIndex: "details",
      key: "details",
      width: "33%",
    },
    {
      title: t("price"),
      dataIndex: "price",
      key: "price",
      width: "33%",
      render: (_, record) => "£ " + record?.price,
    },
  ];

  const featuresColumns = [
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("details"),
      dataIndex: "details",
      key: "details",
    },
    {
      title: t("price"),
      dataIndex: "price",
      key: "price",
      render: (_, record) => "£ " + record?.price,
    },
    {
      title: t("action"),
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a>
            <Avatar
              src={editIcon}
              style={{ height: "18px", width: "18px" }}
              onClick={() => {
                showEditModal(record);
              }}
            />
          </a>
          <a>
            <Avatar
              src={deleteIcon}
              style={{ height: "18px", width: "18px" }}
              onClick={() => deleteFeature(record?.feature_id)}
            />
          </a>
        </Space>
      ),
    },
  ];

  // Fetch features on component mount
  useEffect(() => {
    fetchFeatures();
  }, []);

  return (
    <div>
      {/* Tabs template used from ant design */}
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: t("featureManagement"),
            key: "1",
            children: (
              <>
                <Row justify="space-between" align="middle">
                  <Col>
                    <h3>{t("featureManagement")}</h3>
                  </Col>
                  <Col>
                    <Button
                      type="primary"
                      style={{ margin: "6px" }}
                      onClick={showLinkModal}
                    >
                      <Avatar
                        src={linkIcon}
                        style={{
                          height: "18px",
                          width: "18px",
                          color: "white",
                        }}
                      />{" "}
                      {t("linkFeatures")}
                    </Button>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={showModal}
                    >
                      {t("add")}
                    </Button>
                  </Col>
                </Row>
                <div>
                  {/* Link feaure modal  */}
                  {isLinkModalVisible && (
                    <LinkFeatureModal
                      isOpened={isLinkModalVisible}
                      handleOk={handleLinkOk}
                      handleCancel={handleLinkCancel}
                      featureOptions={featureOptions}
                      defaultValues={defaultValues}
                    />
                  )}
                  {/* Add feature modal */}
                  {isModalVisible && (
                    <AddFeatureModal
                      isOpened={isModalVisible}
                      handleOk={handleOk}
                      handleCancel={handleCancel}
                    />
                  )}
                  {/* Edit feature modal */}
                  {isEditModalVisible && (
                    <EditFeatureModal
                      feature={selectedFeature}
                      isOpened={isEditModalVisible}
                      handleOk={handleEditOk}
                      handleCancel={handleEditCancel}
                    />
                  )}
                </div>
                <div>
                  {/* Text to diaplay when no features exist */}
                  {Object.keys(features).length === 0 && (
                    <p>{t("noFeaturesExist")}</p>
                  )}
                  {/* Feature will be displayed in Table template of ant design */}
                  {Object.keys(features).length > 0 && (
                    <Table
                      columns={featuresColumns}
                      dataSource={Object.values(features)}
                    />
                  )}
                </div>
              </>
            ),
          },
          {
            label: t("linkedFeatures"),
            key: "2",
            disabled: !Boolean(linkedFeatures.length),
            children: (
              <>
                {/* Display of linked features in Table template of Ant design */}
                {linkedFeatures?.map((value, index) => (
                  <div key={index}>
                    <h3 style={{ margin: "12px 0 0 12px" }}>
                      {t(value?.label?.replace(/\s/g, ""))}
                    </h3>
                    <Table
                      columns={linkedColumns}
                      dataSource={value.choices}
                      title={() => <b>{t("choices")}</b>}
                      pagination={false}
                    />
                    <Table
                      columns={linkedColumns}
                      dataSource={value.extras}
                      title={() => <b>{t("extras")}</b>}
                      pagination={false}
                    />
                  </div>
                ))}
              </>
            ),
          },
        ]}
      />
    </div>
  );
};

export default FeatureManagement;
