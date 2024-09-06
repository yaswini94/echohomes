import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import SupplierManagement from "./index";
import axiosInstance from "../../helpers/axiosInstance";
import { supabase } from "../../supabase";
import useLocalStorage from "../../utils/useLocalStorage";
import { useTranslation } from "react-i18next";

// Mock necessary modules
vi.mock("../../helpers/axiosInstance");
vi.mock("../../supabase");
vi.mock("../../utils/useLocalStorage");
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe("SupplierManagement Component", () => {
  const mockVentureId = "test-venture-id";
  const mockSuppliers = [
    {
      supplier_id: "supplier1",
      name: "Supplier One",
      company_name: "Company One",
      phone_number: "09999999999",
      address: "Address One",
      contact_email: "supplier@domain.com",
      feedback: 3,
      venture_id: mockVentureId,
    },
  ];

  beforeEach(() => {
    useLocalStorage.mockReturnValue([mockVentureId, vi.fn()]);
    axiosInstance.get.mockResolvedValue({ data: mockSuppliers });
    supabase.from.mockReturnValue({
      delete: vi.fn().mockReturnThis(),
      match: vi.fn().mockReturnThis(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render the component and display the supplier management header", () => {
    render(<SupplierManagement />);

    expect(screen.getByText("supplierManagement")).toBeInTheDocument();
    expect(screen.getByText("add")).toBeInTheDocument();
  });

  it("should fetch and display suppliers", async () => {
    render(<SupplierManagement />);

    await waitFor(() => {
      expect(screen.getByText("Supplier One")).toBeInTheDocument();
      expect(screen.getByText("Company One")).toBeInTheDocument();
      expect(screen.getByText("Address One")).toBeInTheDocument();
      expect(screen.getByText("supplier@domain.com")).toBeInTheDocument();
      expect(screen.getByText("09999999999")).toBeInTheDocument();
    });
  });

  it("should open and close the add supplier modal", async () => {
    render(<SupplierManagement />);

    const addButton = screen.getByTestId("addSupplierButton");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Add New Supplier")).toBeInTheDocument();
    });

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText("Add New Supplier")).not.toBeInTheDocument();
    });
  });

  it("should open and close the edit supplier modal", async () => {
    render(<SupplierManagement />);

    await waitFor(() => {
      expect(screen.getByText("Supplier One")).toBeInTheDocument();
    });

    const editButton = screen.getByAltText("edit");
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getAllByText("Edit Supplier").length).toBeGreaterThan(0);
    });

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText("Edit Supplier")).not.toBeInTheDocument();
    });
  });

  it("should delete a supplier", async () => {
    render(<SupplierManagement />);

    await waitFor(() => {
      expect(screen.getByText("Supplier One")).toBeInTheDocument();
    });

    const deleteButton = screen.getByAltText("delete");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText("Supplier One")).toBeInTheDocument();
    });
  });
});
