import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { Space, Table, Row, Col, Button, Avatar } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import deleteIcon from "../../assets/delete.png";
import editIcon from "../../assets/edit.png";
import linkIcon from "../../assets/link.png";
import AddFeatureModal from "./AddFeatureModal";
import EditFeatureModal from "./EditFeatureModal";
import LinkFeatureModal from "./LinkFeatureModal";

// type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getFileReader = (file) =>
  new Promise((resolve, reject) => {
    const readerInfo = new FileReader();
    readerInfo.readAsDataURL(file);
    readerInfo.onload = () => resolve(readerInfo.result);
    readerInfo.onerror = (error) => reject(error);
  });

const FeatureManagement = () => {
  const [features, setFeatures] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState([]);
  const [featureOptions, setFeatureOptions] = useState([]);
  const [isLinkModalVisible, setIsLinkModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

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
    const { data, error } = await supabase.from("features").select("*");
    if (error) {
      console.log("Error fetching features:", error);
    } else {
      setFeatures(data);
      let options = [];
      data?.forEach((feature) => {
        options.push({
          value: feature?.name,
          label: feature?.name,
          id: feature?.feature_id,
        });
      });
      console.log(options);
      setFeatureOptions(options);
    }
  };

  // Function to add a new feature

  const featuresColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      // render: (text) => <a>{`/venture/${venture.venture_id}`}</a>,
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
    },
    {
      title: "Images",
      dataIndex: "images",
      key: "images",
      render: (text) => (
        <img src={text} alt="image" style={{ width: 50, height: 50 }} />
      ),
      // render: (_, record) => {
      //   <Space size="middle">
      //     <Button type="primary" onClick={() => setVisible(true)}>
      //       show image preview
      //     </Button>
      //     <Image
      //       width={200}
      //       style={{ display: 'none' }}
      //       src={record?.Image}
      //       preview={{
      //         visible,
      //         scaleStep,
      //         src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      //         onVisibleChange: (value) => {
      //           setVisible(value);
      //         },
      //       }}
      //     />
      //   </Space>
      // }
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
              onClick={() => console.log("kjds")}
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
    </div>
  );
};

export default FeatureManagement;
