import { useState, useEffect } from "react";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import axiosInstance from "../helpers/axiosInstance";

const InvoiceComponent = ({ invoiceId }) => {
  const [pdfUrl, setPdfUrl] = useState("");
  const [receiptPdfUrl, setReceiptPdfUrl] = useState("");
  const [error, setError] = useState(null);

  const { t: translate } = useTranslation();

  useEffect(() => {
    const fetchReceiptPdfUrl = async (chargeId) => {
      try {
        const response = await axiosInstance.get(`/get-receipt/${chargeId}`);
        setReceiptPdfUrl(response.data.receiptUrl);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchInvoicePdfUrl = async () => {
      try {
        const response = await axiosInstance.get(`/get-invoice/${invoiceId}`);
        setPdfUrl(response.data.pdfUrl);
        fetchReceiptPdfUrl(response.data.charge);
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

  const handleReceiptDownload = () => {
    if (receiptPdfUrl) {
      // Create a link element
      const link = document.createElement("a");
      // add /pdf at the end before the query string in the receiptPdfUrl
      const pdfUrl = receiptPdfUrl.replace(/\?.*$/, "/pdf$&");
      link.href = pdfUrl;
      link.download = `receipt_${invoiceId}.pdf`; // Name the file as desired
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Button type="primary" onClick={handleDownload} disabled={!pdfUrl}>
        {translate("downloadInvoice")}
      </Button>
      <Button
        type="primary"
        onClick={handleReceiptDownload}
        disabled={!receiptPdfUrl}
      >
        {translate("downloadReceipt")}
      </Button>
    </div>
  );
};

export default InvoiceComponent;
