import React, { useState, useEffect } from "react";
import { Button } from "antd";
import axiosInstance from "../helpers/axiosInstance";

const InvoiceComponent = ({ invoiceId }) => {
  const [pdfUrl, setPdfUrl] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoicePdfUrl = async () => {
      try {
        const response = await axiosInstance.get(`/get-invoice/${invoiceId}`);
        setPdfUrl(response.data.pdfUrl);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchInvoicePdfUrl();
  }, [invoiceId]);

  const handleDownload = () => {
    if (pdfUrl) {
      // Create a link element
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `invoice_${invoiceId}.pdf`; // Name the file as desired
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Button type="primary" onClick={handleDownload} disabled={!pdfUrl}>
      Download Invoice
    </Button>
  );
};

export default InvoiceComponent;
