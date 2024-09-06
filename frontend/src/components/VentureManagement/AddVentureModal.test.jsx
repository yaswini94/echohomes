import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import AddVentureModal from "./AddVentureModal";
import axiosInstance from "../../helpers/axiosInstance";

// Mock necessary modules
vi.mock("../../helpers/axiosInstance");

describe("AddVentureModal Component", () => {
  const mockHandleOk = vi.fn();
  const mockHandleCancel = vi.fn();

  beforeEach(() => {
    axiosInstance.post.mockResolvedValue({ data: "Success" });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render the component and display the modal", () => {
    render(
      <AddVentureModal
        isOpened={true}
        handleOk={mockHandleOk}
        handleCancel={mockHandleCancel}
      />
    );

    expect(screen.getByText("Add New Venture")).toBeInTheDocument();
    expect(screen.getByText("Add Venture")).toBeInTheDocument();
  });

  it("should close the modal when cancel button is clicked", () => {
    render(
      <AddVentureModal
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
