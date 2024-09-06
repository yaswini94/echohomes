import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import InvoiceComponent from "../components/InvoiceComponent";
import axiosInstance from "../helpers/axiosInstance";
import { useTranslation } from "react-i18next";
import { vi } from "vitest";

// Mock axiosInstance
vi.mock("../helpers/axiosInstance");

// Mock useTranslation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe("InvoiceComponent", () => {
  const invoiceId = "test-invoice-id";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch and display invoice and receipt URLs", async () => {
    axiosInstance.get
      .mockResolvedValueOnce({
        data: {
          pdfUrl: "http://example.com/invoice.pdf",
          charge: "test-charge-id",
        },
      })
      .mockResolvedValueOnce({
        data: {
          receiptUrl: "http://example.com/receipt",
        },
      });

    render(<InvoiceComponent invoiceId={invoiceId} />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "downloadInvoice" })
      ).toBeEnabled();
      expect(
        screen.getByRole("button", { name: "downloadReceipt" })
      ).toBeEnabled();
    });
  });

  it("should handle errors during fetch", async () => {
    axiosInstance.get.mockRejectedValueOnce(new Error("Failed to fetch"));

    render(<InvoiceComponent invoiceId={invoiceId} />);

    await waitFor(() => {
      expect(screen.getByText("Error: Failed to fetch")).toBeInTheDocument();
    });
  });

  it("should disable buttons if URLs are not available", async () => {
    axiosInstance.get
      .mockResolvedValueOnce({
        data: {
          pdfUrl: "",
          charge: "test-charge-id",
        },
      })
      .mockResolvedValueOnce({
        data: {
          receiptUrl: "",
        },
      });

    render(<InvoiceComponent invoiceId={invoiceId} />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "downloadInvoice" })
      ).toBeDisabled();
      expect(
        screen.getByRole("button", { name: "downloadReceipt" })
      ).toBeDisabled();
    });
  });

  it("should handle invoice download", async () => {
    axiosInstance.get
      .mockResolvedValueOnce({
        data: {
          pdfUrl: "http://example.com/invoice.pdf",
          charge: "test-charge-id",
        },
      })
      .mockResolvedValueOnce({
        data: {
          receiptUrl: "http://example.com/receipt",
        },
      });

    render(<InvoiceComponent invoiceId={invoiceId} />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "downloadInvoice" })
      ).toBeEnabled();
    });

    // const link = document.createElement("a");
    // document.body.appendChild(link);
    // const clickSpy = vi.spyOn(link, "click");

    // fireEvent.click(screen.getByRole("button", { name: "downloadInvoice" }));

    // expect(clickSpy).toHaveBeenCalled();
    // document.body.removeChild(link);
  });

  it("should handle receipt download", async () => {
    axiosInstance.get
      .mockResolvedValueOnce({
        data: {
          pdfUrl: "http://example.com/invoice.pdf",
          charge: "test-charge-id",
        },
      })
      .mockResolvedValueOnce({
        data: {
          receiptUrl: "http://example.com/receipt",
        },
      });

    render(<InvoiceComponent invoiceId={invoiceId} />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "downloadReceipt" })
      ).toBeEnabled();
    });

    // const link = document.createElement("a");
    // document.body.appendChild(link);
    // const clickSpy = vi.spyOn(link, "click");

    // fireEvent.click(screen.getByRole("button", { name: "downloadReceipt" }));

    // expect(clickSpy).toHaveBeenCalled();
    // document.body.removeChild(link);
  });
});
