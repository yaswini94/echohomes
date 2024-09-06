import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import AddBuyerModal from "./AddBuyerModal";
import axiosInstance from "../../helpers/axiosInstance";
import useLocalStorage from "../../utils/useLocalStorage";

// Mock necessary modules
vi.mock("../../helpers/axiosInstance");
vi.mock("../../utils/useLocalStorage");

describe("AddBuyerModal Component", () => {
  const mockHandleOk = vi.fn();
  const mockHandleCancel = vi.fn();

  beforeEach(() => {
    useLocalStorage.mockReturnValue(["test-venture-id", vi.fn()]);
    axiosInstance.post.mockResolvedValue({ data: "Success" });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render the component and display the modal", () => {
    render(
      <AddBuyerModal
        isOpened={true}
        handleOk={mockHandleOk}
        handleCancel={mockHandleCancel}
      />
    );

    expect(screen.getByText("Add New Buyer")).toBeInTheDocument();
    expect(screen.getByText("Add Buyer")).toBeInTheDocument();
  });

  it("should close the modal when cancel button is clicked", () => {
    render(
      <AddBuyerModal
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
