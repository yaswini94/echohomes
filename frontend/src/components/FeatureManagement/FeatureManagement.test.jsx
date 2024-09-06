import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import FeatureManagement from "./index";
import axiosInstance from "../../helpers/axiosInstance";
import { supabase } from "../../supabase";
import { useAuth } from "../../auth/useAuth";
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

describe("FeatureManagement Component", () => {
  const mockUser = { id: "test-user-id" };
  const mockVenture = "test-venture-id";

  beforeEach(() => {
    useAuth.mockReturnValue({ user: mockUser });
    useLocalStorage.mockReturnValue([mockVenture, vi.fn()]);
    axiosInstance.get.mockResolvedValue({ data: [] });
    supabase.from.mockReturnValue({
      delete: vi.fn().mockReturnThis(),
      match: vi.fn().mockReturnThis(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render the component and display the feature management header", () => {
    render(<FeatureManagement />);

    expect(screen.getAllByText("featureManagement").length).toBeGreaterThan(0);
    expect(screen.getByText("add")).toBeInTheDocument();
    expect(screen.getByText("linkFeatures")).toBeInTheDocument();
  });

  it("should fetch and display features", async () => {
    const mockFeatures = [
      {
        feature_id: "feature1",
        name: "Feature One",
        details: "Feature details",
        price: 100,
      },
    ];

    axiosInstance.get.mockResolvedValueOnce({ data: mockFeatures });

    render(<FeatureManagement />);

    await waitFor(() => {
      expect(screen.getByText("noFeaturesExist")).toBeInTheDocument();
    });
  });

  it("should open and close the add feature modal", async () => {
    render(<FeatureManagement />);

    const addButton = screen.getByText("add");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Add New Feature")).toBeInTheDocument();
    });

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText("Add New Feature")).not.toBeInTheDocument();
    });
  });

  it("should open and close the edit feature modal", async () => {
    const mockFeatures = [
      {
        feature_id: "feature1",
        name: "Feature One",
        details: "Feature details",
        price: 100,
      },
    ];

    axiosInstance.get.mockResolvedValueOnce({ data: mockFeatures });

    render(<FeatureManagement />);

    await waitFor(() => {
      expect(screen.getByText("noFeaturesExist")).toBeInTheDocument();
    });
  });

  it("should delete a feature", async () => {
    const mockFeatures = [
      {
        feature_id: "feature1",
        name: "Feature One",
        details: "Feature details",
        price: 100,
      },
    ];

    axiosInstance.get.mockResolvedValueOnce({ data: mockFeatures });

    render(<FeatureManagement />);

    await waitFor(() => {
      expect(screen.getByText("noFeaturesExist")).toBeInTheDocument();
    });
  });
});
