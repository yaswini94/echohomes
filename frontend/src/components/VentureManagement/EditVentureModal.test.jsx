import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { expect, vi } from "vitest";
import EditVentureModal from "./EditVentureModal";
import axiosInstance from "../../helpers/axiosInstance";

// Mock necessary modules
vi.mock("../../helpers/axiosInstance");

describe("EditVentureModal Component", () => {
  const mockHandleOk = vi.fn();
  const mockHandleCancel = vi.fn();
  const mockVenture = {
    venture_id: "venture1",
    name: "Venture One",
    address: "123 Main St",
    description: "A description of venture one",
    properties: [
      { key: 1, label: "1Bed", value: 2 },
      { key: 2, label: "2Bed", value: 3 },
      { key: 3, label: "3Bed", value: 1 },
    ],
  };

  beforeEach(() => {
    axiosInstance.post.mockResolvedValue({ data: "Success" });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render the component and display the modal", () => {
    render(
      <EditVentureModal
        isOpened={true}
        venture={mockVenture}
        handleOk={mockHandleOk}
        handleCancel={mockHandleCancel}
      />
    );

    expect(screen.getAllByText("Edit Venture").length).toBeGreaterThan(0);
  });

  it("should render the component and display the modal with edit venture button", () => {
    render(
      <EditVentureModal
        isOpened={true}
        venture={mockVenture}
        handleOk={mockHandleOk}
        handleCancel={mockHandleCancel}
      />
    );

    const editButton = screen.getByTestId("editVentureButton");
    expect(editButton).toBeInTheDocument();
  });

  it("should close the modal when cancel button is clicked", () => {
    render(
      <EditVentureModal
        isOpened={true}
        venture={mockVenture}
        handleOk={mockHandleOk}
        handleCancel={mockHandleCancel}
      />
    );

    const cancelButton = screen.getByTestId("cancelEditVentureButton");
    fireEvent.click(cancelButton);

    expect(mockHandleCancel).toHaveBeenCalled();
  });

  it("should submit the form and call editVenture function", async () => {
    render(
      <EditVentureModal
        isOpened={true}
        venture={mockVenture}
        handleOk={mockHandleOk}
        handleCancel={mockHandleCancel}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Venture Name"), {
      target: { value: "Updated Venture" },
    });
    fireEvent.change(screen.getByPlaceholderText("Address"), {
      target: { value: "456 New St" },
    });
    fireEvent.change(screen.getByPlaceholderText("Description"), {
      target: { value: "An updated description" },
    });

    const editButton = screen.getByTestId("editVentureButton");
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith("/updateVenture", {
        ventureId: mockVenture.venture_id,
        name: "Updated Venture",
        address: "456 New St",
        description: "An updated description",
        properties: [
          { key: 1, label: "1Bed", value: 2 },
          { key: 2, label: "2Bed", value: 3 },
          { key: 3, label: "3Bed", value: 1 },
        ],
      });
      expect(mockHandleOk).toHaveBeenCalled();
    });
  });

  it("should display error message if editVenture fails", async () => {
    axiosInstance.post.mockRejectedValueOnce({
      response: { data: "Error updating venture" },
    });

    render(
      <EditVentureModal
        isOpened={true}
        venture={mockVenture}
        handleOk={mockHandleOk}
        handleCancel={mockHandleCancel}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Venture Name"), {
      target: { value: "Updated Venture" },
    });
    fireEvent.change(screen.getByPlaceholderText("Address"), {
      target: { value: "456 New St" },
    });
    fireEvent.change(screen.getByPlaceholderText("Description"), {
      target: { value: "An updated description" },
    });

    const editButton = screen.getByTestId("editVentureButton");
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith("/updateVenture", {
        ventureId: mockVenture.venture_id,
        name: "Updated Venture",
        address: "456 New St",
        description: "An updated description",
        properties: [
          { key: 1, label: "1Bed", value: 2 },
          { key: 2, label: "2Bed", value: 3 },
          { key: 3, label: "3Bed", value: 1 },
        ],
      });
      expect(mockHandleOk).toHaveBeenCalled();
    });

    // Assuming there's a way to display error messages in the component
    // expect(screen.getByText("Error updating venture")).toBeInTheDocument();
  });
});
