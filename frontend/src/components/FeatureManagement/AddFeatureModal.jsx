import React, { useState } from "react";
import {
  Button,
  Input,
  Form,
  Modal,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axiosInstance from "../../helpers/axiosInstance";
import { Image, Upload } from "antd";

const AddFeatureModal = ({ isOpened, handleOk, handleCancel }) => {
  const [loading, setLoading] = useState("");
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [images, setImages] = useState([]);
  const [price, setPrice] = useState(0);

  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

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

  const addFeature = async () => {
    setLoading(true);

    try {
      await axiosInstance.post("/addFeature", {
        name,
        price,
        details,
        images,
      });
    } catch (error) {
      console.log("Error adding supplier:", error);
    }
    setLoading(false);
    handleOk();
  };

  return (
    <Modal
      title="Add New Feature"
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
          onClick={addFeature}
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
              {fileList.length >= 8 ? null : (
                <button style={{ border: 0, background: "none" }} type="button">
                  <PlusOutlined style={{ color: "black" }} />
                  <div style={{ marginTop: 8, color: "black" }}>Upload</div>
                </button>
              )}
            </Upload>
            {previewImage && (
              <Image
                wrapperStyle={{ display: "none" }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
              />
            )}
          </>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddFeatureModal;
