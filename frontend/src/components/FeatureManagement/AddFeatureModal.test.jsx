import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import AddFeatureModal from "./AddFeatureModal";
import axiosInstance from "../../helpers/axiosInstance";

// Mock necessary modules
vi.mock("../../helpers/axiosInstance");

describe("AddFeatureModal Component", () => {
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
      <AddFeatureModal
        isOpened={true}
        handleOk={mockHandleOk}
        handleCancel={mockHandleCancel}
      />
    );

    expect(screen.getByText("Add New Feature")).toBeInTheDocument();
    expect(screen.getByText("Add Feature")).toBeInTheDocument();
  });

  it("should close the modal when cancel button is clicked", () => {
    render(
      <AddFeatureModal
        isOpened={true}
        handleOk={mockHandleOk}
        handleCancel={mockHandleCancel}
      />
    );

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockHandleCancel).toHaveBeenCalled();
  });

  it("should submit the form and call addFeature function", async () => {
    render(
      <AddFeatureModal
        isOpened={true}
        handleOk={mockHandleOk}
        handleCancel={mockHandleCancel}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Feature Name" },
    });
    fireEvent.change(screen.getByPlaceholderText("Details"), {
      target: { value: "Feature Details" },
    });
    fireEvent.change(screen.getByPlaceholderText("Price"), {
      target: { value: "100" },
    });

    const addButton = screen.getByText("Add Feature");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith("/addFeature", {
        name: "Feature Name",
        price: "100",
        details: "Feature Details",
      });
      expect(mockHandleOk).toHaveBeenCalled();
    });
  });
});
