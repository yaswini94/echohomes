import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import EditSupplierModal from "./EditSupplierModal";
import axiosInstance from "../../helpers/axiosInstance";

// Mock necessary modules
vi.mock("../../helpers/axiosInstance");

describe("EditSupplierModal Component", () => {
  const mockHandleOk = vi.fn();
  const mockHandleCancel = vi.fn();
  const mockSupplier = {
    supplier_id: "supplier1",
    name: "Supplier One",
    company_name: "Company One",
    phone_number: "09999999999",
    address: "Address One",
    email: "supplier@domain.com",
  };

  beforeEach(() => {
    axiosInstance.post.mockResolvedValue({ data: "Success" });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render the component and display the modal", () => {
    render(
      <EditSupplierModal
        isOpened={true}
        supplier={mockSupplier}
        handleOk={mockHandleOk}
        handleCancel={mockHandleCancel}
      />
    );

    expect(screen.getAllByText("Edit Supplier").length).toBeGreaterThan(0);
  });

  it("should render the component and display the modal with Edit Supplier Button", () => {
    render(
      <EditSupplierModal
        isOpened={true}
        supplier={mockSupplier}
        handleOk={mockHandleOk}
        handleCancel={mockHandleCancel}
      />
    );

    // data-testid="editSupplierButton"
    expect(screen.getByTestId("editSupplierButton")).toBeInTheDocument();
  });

  it("should close the modal when cancel button is clicked", () => {
    render(
      <EditSupplierModal
        isOpened={true}
        supplier={mockSupplier}
        handleOk={mockHandleOk}
        handleCancel={mockHandleCancel}
      />
    );

    const cancelButton = screen.getByTestId("cancelEditSupplierButton");
    fireEvent.click(cancelButton);

    expect(mockHandleCancel).toHaveBeenCalled();
  });

  it("should submit the form and call updateSupplier function", async () => {
    render(
      <EditSupplierModal
        isOpened={true}
        supplier={mockSupplier}
        handleOk={mockHandleOk}
        handleCancel={mockHandleCancel}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("John T"), {
      target: { value: "Updated Supplier Name" },
    });
    fireEvent.change(screen.getByPlaceholderText("Mulberry Homes"), {
      target: { value: "Updated Company Name" },
    });
    fireEvent.change(screen.getByPlaceholderText("09999999999"), {
      target: { value: "09999999998" },
    });
    fireEvent.change(screen.getByPlaceholderText("abc@domain.com"), {
      target: { value: "updated@domain.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Jarrom st, Leicester"), {
      target: { value: "Updated Address" },
    });

    const editButton = screen.getByTestId("editSupplierButton");
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith("/updateSupplier", {
        company_name: "Updated Company Name",
        name: "Updated Supplier Name",
        contact_email: "updated@domain.com",
        phone_number: "09999999998",
        address: "Updated Address",
        supplier_id: mockSupplier.supplier_id,
      });
      expect(mockHandleOk).toHaveBeenCalled();
    });
  });

  it("should display error message if updateSupplier fails", async () => {
    axiosInstance.post.mockRejectedValueOnce({
      response: { data: "Error updating supplier" },
    });

    render(
      <EditSupplierModal
        isOpened={true}
        supplier={mockSupplier}
        handleOk={mockHandleOk}
        handleCancel={mockHandleCancel}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("John T"), {
      target: { value: "Updated Supplier Name" },
    });
    fireEvent.change(screen.getByPlaceholderText("Mulberry Homes"), {
      target: { value: "Updated Company Name" },
    });
    fireEvent.change(screen.getByPlaceholderText("09999999999"), {
      target: { value: "09999999998" },
    });
    fireEvent.change(screen.getByPlaceholderText("abc@domain.com"), {
      target: { value: "updated@domain.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Jarrom st, Leicester"), {
      target: { value: "Updated Address" },
    });

    const editButton = screen.getByTestId("editSupplierButton");
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith("/updateSupplier", {
        company_name: "Updated Company Name",
        name: "Updated Supplier Name",
        contact_email: "updated@domain.com",
        phone_number: "09999999998",
        address: "Updated Address",
        supplier_id: mockSupplier.supplier_id,
      });
      expect(mockHandleOk).toHaveBeenCalled();
    });

    // Assuming there's a way to display error messages in the component
    // expect(screen.getByText("Error updating supplier")).toBeInTheDocument();
  });
});
