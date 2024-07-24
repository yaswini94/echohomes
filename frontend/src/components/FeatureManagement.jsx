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
  const [choices, setChoices] = useState([]);
  const [extras, setExtras] = useState([]);
  const [visible, setVisible] = useState(false);
  const [scaleStep, setScaleStep] = useState(0.5);
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState();
  const [isChoicesModalVisible, setIsChoicesModalVisible] = useState(false);
  const [isEditChoicesModalVisible, setIsEditChoicesModalVisible] = useState(false);
  const [isExtrassModalVisible, setIsExtrasModalVisible] = useState(false);
  const [isEditExtrasModalVisible, setIsEditExtrasModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const [initialValues, setInitialValues] = useState({
    name: "",
    details: "",
    image: "",
    price: ""
  });
  const showModal = () => {
    setName("");
    setDetails("");
    setImage("");
    setPrice("");
    setIsChoicesModalVisible(true);
  };

  const handleOk = () => {
    // addChoice();
    setIsChoicesModalVisible(false);
  };
  const handleCancel = () => {
    setName("");
    setDetails("");
    setImage("");
    setPrice("");
    setIsChoicesModalVisible(false);
  };

  const showEditModal = () => {
    setIsEditChoicesModalVisible(true);
  };

  const handleEditOk = () => {
    // editChoice();
    setIsEditChoicesModalVisible(false);
  };

  const handleEditCancel = () => {
    setName("");
    setDetails("");
    setImage("");
    setPrice("");
    setIsEditChoicesModalVisible(false);
  };

  const showExtrasModal = () => {
    setName("");
    setDetails("");
    setImage("");
    setPrice("");
    setIsExtrasModalVisible(true);
  };

  const handleExtrasOk = () => {
    // addChoice();
    setIsExtrasModalVisible(false);
  };
  const handleExtrasCancel = () => {
    setName("");
    setDetails("");
    setImage("");
    setPrice("");
    setIsExtrasModalVisible(false);
  };

  const showEditExtrasModal = () => {
    setIsEditChoicesModalVisible(true);
  };

  const handleEditExtrasOk = () => {
    // editChoice();
    setIsEditChoicesModalVisible(false);
  };

  const handleEditExtrasCancel = () => {
    setName("");
    setDetails("");
    setImage("");
    setPrice("");
    setIsEditChoicesModalVisible(false);
  };
  const deleteChoice = async (id) => {
    const newData = choices.filter(item => item.id !== id);
    setChoices(newData);
    // if (id) {
    //   const { data, error } = await supabase
    //     .from("ventures")
    //     .delete()
    //     .match({ venture_id: id });

    //   if (error) {
    //     console.error("Error deleting venture:", error);
    //     return { error };
    //   }

    //   fetchVentures();
    // }
  };

  const deleteExtras = async (id) => {
    const newData = extras.filter(item => item.id !== id);
    setExtras(newData);
    // if (id) {
    //   const { data, error } = await supabase
    //     .from("ventures")
    //     .delete()
    //     .match({ venture_id: id });

    //   if (error) {
    //     console.error("Error deleting venture:", error);
    //     return { error };
    //   }

    //   fetchVentures();
    // }
  };

  const choicesColumns = [
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
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
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
                setImage(record?.image);
                showEditModal();
              }}
            />
          </a>
          <a><Avatar src={deleteIcon} style={{ height: '18px', width: '18px' }} onClick={() => deleteChoice(record?.id)}/></a>
        </Space>
      ),
    }
  ];
  const extrasColumns = [
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
      render: (_, record) => (
        // <space size="middle">
          <p>£ {record?.price}</p>
        // </space>
      )
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (text) => <img src={text} alt="image" style={{ width: 50, height: 50 }} />,
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
                setImage(record?.image);
                setPrice(record?.price);
                showEditExtrasModal();
              }}
            />
          </a>
          <a><Avatar src={deleteIcon} style={{ height: '18px', width: '18px' }} onClick={() => deleteExtras(record?.id)}/></a>
        </Space>
      ),
    }
  ];
  // Fetch features on component mount
  useEffect(() => {
    setChoices([
      {id: '1', name: 'Carpet', feature_type: 'choice', details: 'extra text', image: '../assets/edit.png'}, 
      {id: '2', name: 'Washbasin', feature_type: 'choice', details: 'new text', image: '../assets/edit.png'},
      {id: '3', name: 'Low Quality Carpet', feature_type: 'choice', details: 'new text', image: '../assets/edit.png'}
    ]);
    setExtras([
      {id: '1', name: 'Boiler', feature_type: 'extras', price: 500, details: 'some text', image: '../assets/edit.png'},
      {id: '2', name: 'Curtains', feature_type: 'extras', price: 20, details: 'extra text', image: '../assets/edit.png'}, 
      {id: '3', name: 'High Quality Carpet', feature_type: 'extras', price: 100, details: 'new text', image: '../assets/edit.png'}
    ]);
  }, []);
  return (
    <div>
      <h3>Feature Management</h3>
      <p><b>2 Bed</b></p>
      <Row justify="space-between" align="middle">
        <Col>
        <h4>Choices</h4>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            Add
          </Button>
        </Col>
      </Row>
      <Modal
        title="Add New Choice"
        open={isChoicesModalVisible}
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
            {loading ? "Adding..." : "Add Choice"}
          </Button>,
        ]}
      >
        <Form layout="vertical" initialValues={initialValues}>
          <Form.Item label="Name" name="name">
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Item>
          <Form.Item label="Details" name="details">
            <Input
              placeholder="Details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
            />
          </Form.Item>
          <Form.Item label="Image" name="image">
            {/* <Input
              placeholder="Image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            /> */}
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
        title="Edit Choice"
        open={isEditChoicesModalVisible}
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
            onClick={handleOk}
          >
            {loading ? "Updating..." : "Edit Choice"}
          </Button>,
        ]}
      >
        <Form layout="vertical" initialValues={initialValues}>
          <Form.Item label="Name" name="name">
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Item>
          <Form.Item label="Details" name="details">
            <Input
              placeholder="Details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
            />
          </Form.Item>
          <Form.Item label="Image" name="image">
            {/* <Input
              placeholder="Image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            /> */}
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
      <div>
        {choices.length === 0 && <p>No Choices exist !</p>}
        {choices.length > 0 && (
        <Table columns={choicesColumns} dataSource={choices} />)}
      </div>
      <Row justify="space-between" align="middle">
        <Col>
        <h4>Extras</h4>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={showExtrasModal}>>
            Add
          </Button>
        </Col>
      </Row>
      <Modal
        title="Add New Extras"
        open={isExtrassModalVisible}
        onOk={handleExtrasOk}
        onCancel={handleExtrasCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleExtrasOk}
          >
            {loading ? "Adding..." : "Add Extras"}
          </Button>,
        ]}
      >
        <Form layout="vertical" initialValues={initialValues}>
          <Form.Item label="Name" name="name">
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Item>
          <Form.Item label="Details" name="details">
            <Input
              placeholder="Details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
            />
          </Form.Item>
          <Form.Item label="Image" name="image">
            {/* <Input
              placeholder="Image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            /> */}
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
        title="Edit Extras"
        open={isEditExtrasModalVisible}
        onOk={handleEditExtrasOk}
        onCancel={handleEditExtrasCancel}
        footer={[
          <Button key="back" onClick={handleEditExtrasCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleExtrasOk}
          >
            {loading ? "Updating..." : "Edit Extras"}
          </Button>,
        ]}
      >
        <Form layout="vertical" initialValues={initialValues}>
          <Form.Item label="Name" name="name">
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Item>
          <Form.Item label="Details" name="details">
            <Input
              placeholder="Details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
            />
          </Form.Item>
          <Form.Item label="Image" name="image">
            {/* <Input
              placeholder="Image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            /> */}
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
      <div>
        {extras.length === 0 && <p>No Extras exist !</p>}
        {extras.length > 0 && (
        <Table columns={extrasColumns} dataSource={extras} />)}
      </div>
    </div>
  );
}
export default FeatureManagement;