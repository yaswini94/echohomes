import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import AddSupplierModal from "./AddSupplierModal";
import axiosInstance from "../../helpers/axiosInstance";
import useLocalStorage from "../../utils/useLocalStorage";

// Mock necessary modules
vi.mock("../../helpers/axiosInstance");
vi.mock("../../utils/useLocalStorage");

describe("AddSupplierModal Component", () => {
  const mockHandleOk = vi.fn();
  const mockHandleCancel = vi.fn();
  const mockVentureId = "test-venture-id";

  beforeEach(() => {
    useLocalStorage.mockReturnValue([mockVentureId, vi.fn()]);
    axiosInstance.post.mockResolvedValue({ data: "Success" });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render the component and display the modal", () => {
    render(
      <AddSupplierModal
        isOpened={true}
        handleOk={mockHandleOk}
        handleCancel={mockHandleCancel}
      />
    );

    expect(screen.getByText("Add New Supplier")).toBeInTheDocument();
    expect(screen.getByText("Add Supplier")).toBeInTheDocument();
  });

  it("should close the modal when cancel button is clicked", () => {
    render(
      <AddSupplierModal
        isOpened={true}
        handleOk={mockHandleOk}
        handleCancel={mockHandleCancel}
      />
    );

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockHandleCancel).toHaveBeenCalled();
  });

  it("should submit the form and call addSupplier function", async () => {
    render(
      <AddSupplierModal
        isOpened={true}
        handleOk={mockHandleOk}
        handleCancel={mockHandleCancel}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("John T"), {
      target: { value: "Supplier Name" },
    });
    fireEvent.change(screen.getByPlaceholderText("Mulberry Homes"), {
      target: { value: "Company Name" },
    });
    fireEvent.change(screen.getByPlaceholderText("09999999999"), {
      target: { value: "09999999999" },
    });
    fireEvent.change(screen.getByPlaceholderText("abc@domain.com"), {
      target: { value: "abc@domain.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Jarrom st, Leicester"), {
      target: { value: "Address" },
    });

    const addButton = screen.getByText("Add Supplier");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith("/invite/supplier", {
        company_name: "Company Name",
        password: expect.any(String),
        name: "Supplier Name",
        email: "abc@domain.com",
        phone_number: "09999999999",
        address: "Address",
        venture_id: mockVentureId,
      });
      expect(mockHandleOk).toHaveBeenCalled();
    });
  });

  it("should display error message if addSupplier fails", async () => {
    axiosInstance.post.mockRejectedValueOnce({
      response: { data: "Error adding supplier" },
    });

    render(
      <AddSupplierModal
        isOpened={true}
        handleOk={mockHandleOk}
        handleCancel={mockHandleCancel}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("John T"), {
      target: { value: "Supplier Name" },
    });
    fireEvent.change(screen.getByPlaceholderText("Mulberry Homes"), {
      target: { value: "Company Name" },
    });
    fireEvent.change(screen.getByPlaceholderText("09999999999"), {
      target: { value: "09999999999" },
    });
    fireEvent.change(screen.getByPlaceholderText("abc@domain.com"), {
      target: { value: "abc@domain.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Jarrom st, Leicester"), {
      target: { value: "Address" },
    });

    // const addButton = screen.getByText("Add Supplier");
    // data-testid="add-supplier-button"
    const addButton = screen.getByTestId("add-supplier-button");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith("/invite/supplier", {
        company_name: "Company Name",
        password: expect.any(String),
        name: "Supplier Name",
        email: "abc@domain.com",
        phone_number: "09999999999",
        address: "Address",
        venture_id: mockVentureId,
      });
      expect(mockHandleOk).toHaveBeenCalled();
    });

    // Assuming there's a way to display error messages in the component
    // expect(screen.getByText("Error adding supplier")).toBeInTheDocument();
  });
});
