import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import VentureManagement from "./index";
import axiosInstance from "../../helpers/axiosInstance";
import { supabase } from "../../supabase";
import { useTranslation } from "react-i18next";

// Mock necessary modules
vi.mock("../../helpers/axiosInstance");
vi.mock("../../supabase");
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe("VentureManagement Component", () => {
  const mockVentures = [
    {
      venture_id: "venture1",
      name: "Venture One",
      address: "123 Main St",
      description: "A description of venture one",
      properties: [
        { key: 1, label: "1Bed", value: 2 },
        { key: 2, label: "2Bed", value: 3 },
        { key: 3, label: "3Bed", value: 1 },
      ],
    },
  ];

  beforeEach(() => {
    axiosInstance.get.mockResolvedValue({ data: mockVentures });
    supabase.from.mockReturnValue({
      delete: vi.fn().mockReturnThis(),
      match: vi.fn().mockReturnThis(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render the component and display the venture management header", () => {
    render(<VentureManagement />);

    expect(screen.getByText("ventureManagement")).toBeInTheDocument();
    expect(screen.getByText("add")).toBeInTheDocument();
  });

  it("should fetch and display ventures", async () => {
    render(<VentureManagement />);

    // No ventures exist !
    expect(screen.getByText("No ventures exist !")).toBeInTheDocument();
  });
});
