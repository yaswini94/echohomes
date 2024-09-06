import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import EditBuyerModal from "./EditBuyerModal";
import axiosInstance from "../../helpers/axiosInstance";
import useLocalStorage from "../../utils/useLocalStorage";

// Mock necessary modules
vi.mock("../../helpers/axiosInstance");
vi.mock("../../utils/useLocalStorage");

describe("EditBuyerModal Component", () => {
  const mockHandleOk = vi.fn();
  const mockHandleCancel = vi.fn();
  const mockBuyer = {
    buyer_id: "buyer1",
    name: "Buyer One",
    address: "123 Main St",
    contact_email: "buyer1@example.com",
    phone_number: "123-456-7890",
    house_type: "3",
    features: null,
  };

  beforeEach(() => {
    useLocalStorage.mockReturnValue(["test-venture-id", vi.fn()]);
    axiosInstance.put.mockResolvedValue({ data: "Success" });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render the component and display the modal", () => {
    render(
      <EditBuyerModal
        isOpened={true}
        handleOk={mockHandleOk}
        handleCancel={mockHandleCancel}
        buyer={mockBuyer}
      />
    );

    expect(screen.getAllByText("Edit Buyer").length).toBeGreaterThan(0);
  });

  it("should close the modal when cancel button is clicked", () => {
    render(
      <EditBuyerModal
        buyer={mockBuyer}
        isOpened={true}
        handleOk={mockHandleOk}
        handleCancel={mockHandleCancel}
      />
    );

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockHandleCancel).toHaveBeenCalled();
  });
});
