import { render, screen, waitFor } from "@testing-library/react";
import SupplierDashboard from "./SupplierDashboard";
import { supabase } from "../supabase";
import { useAuth } from "../auth/useAuth";

vi.mock("../supabase");
vi.mock("../auth/useAuth");

describe("SupplierDashboard Component", () => {
  beforeEach(() => {
    supabase.from.mockClear();
    useAuth.mockReturnValue({ user: { id: "user-123" } });
  });

  it("should render the dashboard layout with statistics and feedback sections", async () => {
    render(<SupplierDashboard />);

    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(screen.getByText("Feedback")).toBeInTheDocument();
    expect(screen.getByText("totalOrders")).toBeInTheDocument();
    expect(screen.getByText("pendingOrders")).toBeInTheDocument();
    expect(screen.getByText("invoiceAmount")).toBeInTheDocument();
    expect(screen.getByText("5 star")).toBeInTheDocument();
    expect(screen.getByText("4 star")).toBeInTheDocument();
    expect(screen.getByText("3 star")).toBeInTheDocument();
    expect(screen.getByText("2 star")).toBeInTheDocument();
    expect(screen.getByText("1 star")).toBeInTheDocument();
  });

  it("should fetch and display feedback data correctly", async () => {
    const feedbackMock = [{ feedback: 5 }, { feedback: 4 }];
    supabase.from.mockResolvedValueOnce({
      data: feedbackMock,
    });

    render(<SupplierDashboard />);

    await waitFor(() => {
      expect(screen.getByText("5 star")).toBeInTheDocument();
      expect(screen.getByText("4 star")).toBeInTheDocument();
      expect(screen.getByText("3 star")).toBeInTheDocument();
    });
  });

  it("should handle no feedback data gracefully", async () => {
    // Mock supabase response for feedback with no data
    supabase.from.mockResolvedValueOnce({
      data: [],
    });

    render(<SupplierDashboard />);

    await waitFor(() => {
      // Check that the 5 star feedback row exists
      expect(screen.getByText("5 star")).toBeInTheDocument();

      // Check that each star rating has a progress of 0%
      const fiveStarProgress = screen.getAllByText("0%")[0];
      const fourStarProgress = screen.getAllByText("0%")[1];
      const threeStarProgress = screen.getAllByText("0%")[2];
      const twoStarProgress = screen.getAllByText("0%")[3];
      const oneStarProgress = screen.getAllByText("0%")[4];

      expect(fiveStarProgress).toBeInTheDocument();
      expect(fourStarProgress).toBeInTheDocument();
      expect(threeStarProgress).toBeInTheDocument();
      expect(twoStarProgress).toBeInTheDocument();
      expect(oneStarProgress).toBeInTheDocument();
    });
  });

  it("should fetch and display order statistics", async () => {
    // Mock the user's authentication
    useAuth.mockReturnValue({
      user: {
        id: "f8a79253-f1e1-439c-9956-ea76eb842a04",
      },
    });

    // Mock the supabase response
    supabase.from.mockResolvedValueOnce({
      data: [
        {
          supplier_id: "f8a79253-f1e1-439c-9956-ea76eb842a04",
          po_id: "b9247110-ed42-400b-b2ee-83fc1db3b4aa",
          total: 400,
          status: "done", // Completed order
        },
        {
          supplier_id: "f8a79253-f1e1-439c-9956-ea76eb842a04",
          po_id: "b9247110-ed42-400b-b2ee-83fc1db3b4aa",
          total: 70,
          status: null, // Pending order
        },
        {
          supplier_id: "f8a79253-f1e1-439c-9956-ea76eb842a04",
          po_id: "b9247110-ed42-400b-b2ee-83fc1db3b4aa",
          total: 40,
          status: null, // Pending order
        },
        {
          supplier_id: "f8a79253-f1e1-439c-9956-ea76eb842a04",
          po_id: "b9247110-ed42-400b-b2ee-83fc1db3b4aa",
          total: 300,
          status: "inprogress", // In-progress order
        },
      ],
    });
  });
});
