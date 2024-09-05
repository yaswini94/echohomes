import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import VentureDetail from "./VentureDetail";
import axiosInstance from "../helpers/axiosInstance";
import BuyerManagement from "./BuyerManagement";

// Mock the axiosInstance
vi.mock("../helpers/axiosInstance");

// Mock BuyerManagement component
vi.mock("./BuyerManagement", () => ({
  __esModule: true,
  default: vi.fn(() => <div>Buyer Management Mock</div>),
}));

describe("VentureDetail Component", () => {
  const mockVentureData = {
    name: "Test Venture",
    address: "123 Main St",
    description: "A sample venture for testing",
    builder_id: "builder-123",
  };

  it("should show loading state initially", () => {
    // Mock the axios get call
    axiosInstance.get.mockResolvedValueOnce({ data: mockVentureData });

    render(
      <MemoryRouter initialEntries={["/ventures/1"]}>
        <Routes>
          <Route path="/ventures/:id" element={<VentureDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Assert loading state is displayed
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("should fetch and display venture details", async () => {
    // Mock the axios get call with mock data
    axiosInstance.get.mockResolvedValueOnce({ data: mockVentureData });

    render(
      <MemoryRouter initialEntries={["/ventures/1"]}>
        <Routes>
          <Route path="/ventures/:id" element={<VentureDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the venture data to be rendered
    await waitFor(() =>
      expect(screen.getByText("Test Venture")).toBeInTheDocument()
    );

    // Use a custom function matcher to match the full venture information text even if it's broken into multiple elements
    expect(
      screen.getByText((content, element) => content.includes("123 Main St"))
    ).toBeInTheDocument();

    // Check if description is displayed correctly
    expect(
      screen.getByText("A sample venture for testing")
    ).toBeInTheDocument();

    // Check if BuyerManagement component is rendered
    expect(screen.getByText("Buyer Management Mock")).toBeInTheDocument();
  });

  it("should handle errors gracefully", async () => {
    // Mock the axios get call to reject with an error
    axiosInstance.get.mockRejectedValueOnce(new Error("Failed to fetch"));

    render(
      <MemoryRouter initialEntries={["/ventures/1"]}>
        <Routes>
          <Route path="/ventures/:id" element={<VentureDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for loading state to disappear
    await waitFor(() =>
      expect(screen.queryByText("Loading")).not.toBeInTheDocument()
    );

    // Since we are not rendering an error message, we are testing for absence of data
    expect(screen.queryByText("Test Venture")).not.toBeInTheDocument();
  });

  it("should pass the correct props to BuyerManagement component", async () => {
    // Mock the axios get call with mock data
    axiosInstance.get.mockResolvedValueOnce({ data: mockVentureData });

    render(
      <MemoryRouter initialEntries={["/ventures/1"]}>
        <Routes>
          <Route path="/ventures/:id" element={<VentureDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the venture data to be rendered
    await waitFor(() =>
      expect(screen.getByText("Test Venture")).toBeInTheDocument()
    );

    // Check if BuyerManagement was called with the correct props
    expect(BuyerManagement).toHaveBeenCalledWith(
      { ventureId: "1", builderId: "builder-123" },
      {}
    );
  });
});
