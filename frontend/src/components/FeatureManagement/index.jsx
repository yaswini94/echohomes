import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { Space, Table, Row, Col, Button, Avatar, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import deleteIcon from "../../assets/delete.png";
import editIcon from "../../assets/edit.png";
import linkIcon from "../../assets/link.png";
import AddFeatureModal from "./AddFeatureModal";
import EditFeatureModal from "./EditFeatureModal";
import LinkFeatureModal from "./LinkFeatureModal";
import useLocalStorage from "../../utils/useLocalStorage";
import axiosInstance from "../../helpers/axiosInstance";

const FeatureManagement = () => {
  const [features, setFeatures] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState([]);
  const [featureOptions, setFeatureOptions] = useState([]);
  const [defaultValues, setDefaultValues] = useState([
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
  const [isLinkModalVisible, setIsLinkModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [ventureId] = useLocalStorage("selectedVenture", null);

  useEffect(() => {
    if (!ventureId) return;

    const fetchVenture = async () => {
      try {
        const response = await axiosInstance.get(`/ventures/${ventureId}`);
        setDefaultValues(response.data?.properties);
      } catch (error) {
        console.log("Error fetching ventures:", error);
      }
    };

    fetchVenture();
  }, [ventureId]);

  // add modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    fetchFeatures();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // edit modal
  const showEditModal = (feature) => {
    setSelectedFeature(feature);
    setIsEditModalVisible(true);
  };

  const handleEditOk = () => {
    fetchFeatures();
    setIsEditModalVisible(false);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

  // link modal
  const showLinkModal = () => {
    setIsLinkModalVisible(true);
  };

  const handleLinkOk = () => {
    fetchFeatures();
    setIsLinkModalVisible(false);
  };

  const handleLinkCancel = () => {
    setIsLinkModalVisible(false);
  };

  // delete modal
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

  // Function to load features from Supabase
  const fetchFeatures = async () => {
    try {
      const response = await axiosInstance.get("/features");
      setFeatures(response);
      let options = [];
      response?.forEach((feature) => {
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
  
  const linkedColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (_, record) => "£ " + record?.price
    },
  ];
  
  const featuresColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (_, record) => "£ " + record?.price
    },
    {
      title: "Action",
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
      <Tabs
      defaultActiveKey="1"
      items={[
        {
          label: 'Feature Management',
          key: '1',
          children: 
            <>
              <Row justify="space-between" align="middle">
              <Col>
                <h3>Feature Management</h3>
              </Col>
              <Col>
                <Button
                  type="primary"
                  style={{ margin: "6px" }}
                  onClick={showLinkModal}
                >
                  <Avatar
                    src={linkIcon}
                    style={{ height: "18px", width: "18px", color: "white" }}
                  />{" "}
                  Link Features
                </Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
                  Add
                </Button>
              </Col>
              </Row>
              <div>
                {isLinkModalVisible && (
                  <LinkFeatureModal
                    isOpened={isLinkModalVisible}
                    handleOk={handleLinkOk}
                    handleCancel={handleLinkCancel}
                    featureOptions={featureOptions}
                    defaultValues={defaultValues}
                  />
                )}
                {isModalVisible && (
                  <AddFeatureModal
                    isOpened={isModalVisible}
                    handleOk={handleOk}
                    handleCancel={handleCancel}
                  />
                )}
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
                {features.length === 0 && <p>No Features exist !</p>}
                {features.length > 0 && (
                  <Table columns={featuresColumns} dataSource={features} />
                )}
              </div>
            </>,
        },
        {
          label: 'Linked Features',
          key: '2',
          disabled: defaultValues[0].choices,
          children: 
            <>
              <p style={{ margin: "12px 0 0 0" }}>
                <b>1 Bed </b>
              </p>
              <p>Choices </p>
              <Table columns={linkedColumns} dataSource={defaultValues[0].choices} />
              <p>Extras </p>
              <Table columns={linkedColumns} dataSource={defaultValues[0].extras} />
              <p style={{ margin: "12px 0 0 0" }}>
                <b>2 Bed </b>
              </p>
              <p>Choices </p>
              <Table columns={linkedColumns} dataSource={defaultValues[1].choices} />
              <p>Extras </p>
              <Table columns={linkedColumns} dataSource={defaultValues[1].extras} />
              <p style={{ margin: "12px 0 0 0" }}>
                <b>3 Bed </b>
              </p>
              <p>Choices </p>
              <Table columns={linkedColumns} dataSource={defaultValues[2].choices} />
              <p>Extras </p>
              <Table columns={linkedColumns} dataSource={defaultValues[2].extras} />
            </>
        }
      ]}
    />
      
    </div>
  );
};

export default FeatureManagement;
