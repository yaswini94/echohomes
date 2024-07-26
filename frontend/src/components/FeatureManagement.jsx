import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";
import { Space, Table, Row, Col, Button, Avatar, Input, Form, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import deleteIcon from "../assets/delete.png";
import editIcon from "../assets/edit.png";
import axiosInstance from "../helpers/axiosInstance";
import { Image, Upload } from 'antd';

// type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getFileReader = (file) =>
  new Promise((resolve, reject) => {
    const readerInfo = new FileReader();
    readerInfo.readAsDataURL(file);
    readerInfo.onload = () => resolve(readerInfo.result);
    readerInfo.onerror = (error) => reject(error);
  });

function FeatureManagement() {
  const [features, setFeatures] = useState([]);
  const [visible, setVisible] = useState(false);
  const [scaleStep, setScaleStep] = useState(0.5);
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [images, setImages] = useState([]);
  const [price, setPrice] = useState(0);
  const [featureId, setFeatureId] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialFormData, setInitialFormData] = useState();
  const [isChanged, setIsChanged] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
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

    setPreviewImage(file.url || (file.preview));
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    console.log(newFileList);
    setFileList(newFileList);
  }
  const showModal = () => {
    setName("");
    setDetails("");
    setImages([]);
    setPrice(0);
    setFeatureId("");
    setIsModalVisible(true);
  };

  const handleOk = () => {
    addFeature();
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showEditModal = (feature) => {
    setInitialFormData(feature);
    setIsEditModalVisible(true);
  };

  const handleEditOk = () => {
    updateFeature();
    setIsEditModalVisible(false);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

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

  const updateFeature = async () => {
    setLoading(true);

    try {
      const data = await axiosInstance.post("/updateFeature", {
        name,
        details,
        price,
        images,
        feature_id: featureId
      });
      setName("");
      setDetails("");
      setPrice(0);
      setImages([]);
      setFeatureId("");
      fetchFeatures();
    } catch (error) {
      console.log("Error updating feature:", error);
    }
    setLoading(false);
  };
  // Function to load features from Supabase
  const fetchFeatures = async () => {
    const { data, error } = await supabase.from("features").select("*");
    if (error) {
      console.log("Error fetching features:", error);
    } else {
      setFeatures(data);
    }
  };

  // Function to add a new feature
  const addFeature = async () => {
    setLoading(true);

    try {
      const data = await axiosInstance.post("/addFeature", {
        name: name,
        price: price,
        details: details,
        images: images,
      });
      fetchFeatures();
    } catch (error) {
      console.log("Error adding supplier:", error);
    }
    setLoading(false);
  };

  const featuresColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      // render: (text) => <a>{`/venture/${venture.venture_id}`}</a>,
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Images',
      dataIndex: 'images',
      key: 'images',
      render: (text) => <img src={text} alt="image" style={{ width: 50, height: 50 }} />,
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
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>
            <Avatar
              src={editIcon}
              style={{ height: "18px", width: "18px" }}
              onClick={() => {
                setName(record?.name);
                setDetails(record?.details);
                setPrice(record?.price);
                setImages(record?.images);
                setFeatureId(record?.feature_id);
                showEditModal(record);
              }}
            />
          </a>
          <a><Avatar src={deleteIcon} style={{ height: '18px', width: '18px' }} onClick={() => deleteFeature(record?.feature_id)}/></a>
        </Space>
      ),
    }
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
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            Add
          </Button>
        </Col>
      </Row>
      <div>
        <Modal
          title="Add New Feature"
          open={isModalVisible}
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
              onClick={handleOk}
            >
              {loading ? "Adding..." : "Add Feature"}
            </Button>,
          ]}
        >
          <Form layout="vertical">
            <Form.Item label="Name">
              <Input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Item>
            <Form.Item label="Details">
              <Input
                placeholder="Details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                required
              />
            </Form.Item>
            <Form.Item label="Price">
              <Input
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </Form.Item>
              {/* <Input
                placeholder="Images"
                value={images}
                onChange={(e) => setImages(e.target.value)}
                required
              /> */}
            <Form.Item label="Images" name="images">
              <>
                <Upload
                  action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                  listType="picture-circle"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                >
                  {fileList.length >= 8 ? null : 
                    <button style={{ border: 0, background: 'none' }} type="button">
                      <PlusOutlined style={{color: 'black'}}/>
                      <div style={{ marginTop: 8, color: 'black' }}>Upload</div>
                    </button>
                  }
                </Upload>
                {previewImage && (
                  <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                      visible: previewOpen,
                      onVisibleChange: (visible) => setPreviewOpen(visible),
                      afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                  />
                )}
              </>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Edit Feature"
          open={isEditModalVisible}
          onOk={handleEditOk}
          onCancel={handleEditCancel}
          footer={[
            <Button key="back" onClick={handleEditCancel}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={handleEditOk}
              disabled={!isChanged}
            >
              {loading ? "Updating..." : "Edit Feature"}
            </Button>,
          ]}
        >
          <Form layout="vertical">
            <Form.Item label="Name">
              <Input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Item>
            <Form.Item label="Details">
              <Input
                placeholder="Details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                required
              />
            </Form.Item>
            <Form.Item label="Price">
              <Input
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </Form.Item>
              {/* <Input
                placeholder="Images"
                value={images}
                onChange={(e) => setImages(e.target.value)}
                required
              /> */}
            <Form.Item label="Images" name="images">
              <>
                <Upload
                  action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                  listType="picture-circle"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                >
                  {fileList.length >= 8 ? null : 
                    <button style={{ border: 0, background: 'none' }} type="button">
                      <PlusOutlined style={{color: 'black'}}/>
                      <div style={{ marginTop: 8, color: 'black' }}>Upload</div>
                    </button>
                  }
                </Upload>
                {previewImage && (
                  <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                      visible: previewOpen,
                      onVisibleChange: (visible) => setPreviewOpen(visible),
                      afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                  />
                )}
              </>
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <div>
        {features.length === 0 && <p>No Features exist !</p>}
        {features.length > 0 && (
        <Table columns={featuresColumns} dataSource={features} />)}
      </div>
    </div>
  );
}
export default FeatureManagement;