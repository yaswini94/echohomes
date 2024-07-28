import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import {
  Space,
  Table,
  Row,
  Col,
  Button,
  Avatar,
  Input,
  Form,
  Modal,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import deleteIcon from "../../assets/delete.png";
import editIcon from "../../assets/edit.png";
import linkIcon from "../../assets/link.png";
import axiosInstance from "../../helpers/axiosInstance";
import { Image, Upload } from "antd";
import AddFeatureModal from "./AddFeatureModal";
import EditFeatureModal from "./EditFeatureModal";

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
  const [visible, setVisible] = useState(false);
  const [scaleStep, setScaleStep] = useState(0.5);
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [images, setImages] = useState([]);
  const [price, setPrice] = useState(0);
  const [featureId, setFeatureId] = useState("");
  const [isLinkModalVisible, setIsLinkModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialFormData, setInitialFormData] = useState();
  const [isChanged, setIsChanged] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  let featureOptions = [];
  const [fileList, setFileList] = useState([
    // {
    //   uid: '-1',
    //   name: 'image.png',
    //   status: 'done',
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // },
  ]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getFileReader(file.originFileData);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    console.log(newFileList);
    setFileList(newFileList);
  };

  const showLinkModal = () => {
    setIsLinkModalVisible(true);
  };
  const handleLinkOk = () => {
    addVenture();
    setIsLinkModalVisible(false);
  };
  const handleLinkCancel = () => {
    setIsLinkModalVisible(false);
  };

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
      makeOptions(data);
    }
  };

  const makeOptions = async (_features) => {
    let options = [];
    _features.forEach((feature) => {
      options.push({
        value: feature?.name,
        label: feature?.name,
        id: feature?.feature_id,
      });
    });
    console.log(options);
    featureOptions = options;
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
    const hasChanges = () => {
      if (
        name !== initialFormData?.name ||
        details !== initialFormData?.details ||
        price !== initialFormData?.price
      ) {
        return true;
      }
      return false;
    };
    setIsChanged(hasChanges());
  }, [name, details, price]);
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
        <Modal
          title="Link Features"
          open={isLinkModalVisible}
          onOk={handleLinkOk}
          onCancel={handleLinkCancel}
          footer={[
            <Button key="back" onClick={handleLinkCancel}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={handleLinkOk}
            >
              {loading ? "Linking..." : "Link Features"}
            </Button>,
          ]}
        >
          <>
            <Space direction="vertical" style={{ width: "100%" }}>
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
            </Space>
          </>
        </Modal>
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
