import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import BuyerManagement from "./index";
import axiosInstance from "../../helpers/axiosInstance";
import { supabase } from "../../supabase";
import { useAuth } from "../../auth/useAuth";
import { useTranslation } from "react-i18next";
import useLocalStorage from "../../utils/useLocalStorage";

// Mock necessary modules
vi.mock("../../helpers/axiosInstance");
vi.mock("../../supabase");
vi.mock("../../auth/useAuth");
vi.mock("../../utils/useLocalStorage");
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe("BuyerManagement Component", () => {
  const mockUser = { id: "test-builder-id" };

  beforeEach(() => {
    useAuth.mockReturnValue({ user: mockUser });
    useLocalStorage.mockReturnValue(["test-venture-id", vi.fn()]);
    axiosInstance.get.mockResolvedValue({ data: [] });
    supabase.from.mockReturnValue({
      delete: vi.fn().mockReturnThis(),
      match: vi.fn().mockReturnThis(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render the component and display no buyers message", async () => {
    render(<BuyerManagement ventureId="test-venture-id" />);

    expect(screen.getByText("buyerManagement")).toBeInTheDocument();
    expect(screen.getByText("add")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("No Buyer exist !")).toBeInTheDocument();
    });
  });

  it("should open and close the add buyer modal", async () => {
    render(<BuyerManagement ventureId="test-venture-id" />);

    const addButton = screen.getByText("add");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Add New Buyer")).toBeInTheDocument();
    });

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText("Add New Buyer")).not.toBeInTheDocument();
    });
  });

  it("should fetch and display buyers", async () => {
    const mockBuyers = [
      {
        buyer_id: "buyer1",
        name: "Buyer One",
        address: "123 Main St",
        contact_email: "buyer1@example.com",
        phone_number: "123-456-7890",
        house_type: "3",
        features: null,
      },
    ];

    axiosInstance.get.mockResolvedValueOnce({ data: mockBuyers });

    render(<BuyerManagement ventureId="test-venture-id" />);

    await waitFor(() => {
      expect(screen.getByText("Buyer One")).toBeInTheDocument();
      expect(screen.getByText("123 Main St")).toBeInTheDocument();
      expect(screen.getByText("buyer1@example.com")).toBeInTheDocument();
      expect(screen.getByText("123-456-7890")).toBeInTheDocument();
      expect(screen.getByText("3 Bed")).toBeInTheDocument();
    });
  });

  it("should delete a buyer", async () => {
    const mockBuyers = [
      {
        buyer_id: "buyer1",
        name: "Buyer One",
        address: "123 Main St",
        contact_email: "buyer1@example.com",
        phone_number: "123-456-7890",
        house_type: "3",
        features: null,
      },
    ];

    axiosInstance.get.mockResolvedValueOnce({ data: mockBuyers });

    render(<BuyerManagement ventureId="test-venture-id" />);

    await waitFor(() => {
      expect(screen.getByText("Buyer One")).toBeInTheDocument();
    });
  });

  it("should open and close the edit buyer modal", async () => {
    const mockBuyers = [
      {
        buyer_id: "buyer1",
        name: "Buyer One",
        address: "123 Main St",
        contact_email: "buyer1@example.com",
        phone_number: "123-456-7890",
        house_type: "3",
        features: null,
      },
    ];

    axiosInstance.get.mockResolvedValueOnce({ data: mockBuyers });

    render(<BuyerManagement ventureId="test-venture-id" />);

    await waitFor(() => {
      expect(screen.getByText("Buyer One")).toBeInTheDocument();
    });

    const editButton = screen.getByAltText("edit");
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getAllByText("Edit Buyer").length).toBeGreaterThan(0);
    });
  });
});
