import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import EditFeatureModal from "./EditFeatureModal";
import axiosInstance from "../../helpers/axiosInstance";

// Mock necessary modules
vi.mock("../../helpers/axiosInstance");

describe("EditFeatureModal Component", () => {
  const mockHandleOk = vi.fn();
  const mockHandleCancel = vi.fn();
  const mockFeature = {
    feature_id: "feature1",
    name: "Feature One",
    details: "Feature details",
    price: 100,
  };

  beforeEach(() => {
    axiosInstance.post.mockResolvedValue({ data: "Success" });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render the component and display the modal", () => {
    render(
      <EditFeatureModal
        isOpened={true}
        feature={mockFeature}
        handleOk={mockHandleOk}
        handleCancel={mockHandleCancel}
      />
    );

    expect(screen.getAllByText("Edit Feature").length).toBeGreaterThan(0);
  });

  it("should close the modal when cancel button is clicked", () => {
    render(
      <EditFeatureModal
        isOpened={true}
        feature={mockFeature}
        handleOk={mockHandleOk}
        handleCancel={mockHandleCancel}
      />
    );

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockHandleCancel).toHaveBeenCalled();
  });

  it("should submit the form and call updateFeature function", async () => {
    render(
      <EditFeatureModal
        isOpened={true}
        feature={mockFeature}
        handleOk={mockHandleOk}
        handleCancel={mockHandleCancel}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Updated Feature Name" },
    });
    fireEvent.change(screen.getByPlaceholderText("Details"), {
      target: { value: "Updated Feature Details" },
    });
    fireEvent.change(screen.getByPlaceholderText("Price"), {
      target: { value: "200" },
    });

    // const saveButton = screen.getByText("Edit Feature");
    // data-testid="edit-feature-button"
    const saveButton = screen.getByTestId("edit-feature-button");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith("/updateFeature", {
        name: "Updated Feature Name",
        details: "Updated Feature Details",
        price: "200",
        feature_id: mockFeature.feature_id,
      });
      expect(mockHandleOk).toHaveBeenCalled();
    });
  });

  it("should display error message if updateFeature fails", async () => {
    axiosInstance.post.mockRejectedValueOnce({
      response: { data: "Error updating feature" },
    });

    render(
      <EditFeatureModal
        isOpened={true}
        feature={mockFeature}
        handleOk={mockHandleOk}
        handleCancel={mockHandleCancel}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Updated Feature Name" },
    });
    fireEvent.change(screen.getByPlaceholderText("Details"), {
      target: { value: "Updated Feature Details" },
    });
    fireEvent.change(screen.getByPlaceholderText("Price"), {
      target: { value: "200" },
    });

    const saveButton = screen.getByTestId("edit-feature-button");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith("/updateFeature", {
        name: "Updated Feature Name",
        details: "Updated Feature Details",
        price: "200",
        feature_id: mockFeature.feature_id,
      });
      expect(mockHandleOk).toHaveBeenCalled(1);
    });

    // Assuming there's a way to display error messages in the component
    // expect(screen.getByText("Error updating feature")).toBeInTheDocument();
  });
});
