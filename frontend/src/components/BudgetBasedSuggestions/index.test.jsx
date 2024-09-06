import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BudgetBasedSuggestions from "./index"; // Component to test
import axiosInstance from "../../helpers/axiosInstance"; // Mock axiosInstance
import { useAuth } from "../../auth/useAuth"; // Mock useAuth
import { vi } from "vitest";

// Mock axiosInstance
vi.mock("../../helpers/axiosInstance", async (importOriginal) => {
  const actual = await importOriginal(); // Import the actual module
  return {
    ...actual,
    default: {
      ...actual.default,
      get: vi.fn(), // Mock the get method
    },
  };
});

// Mock useAuth hook
vi.mock("../../auth/useAuth", () => ({
  useAuth: () => ({
    user: { id: "user-id" },
  }),
}));

// Mock useTranslation hook
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe("BudgetBasedSuggestions Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('displays "No Extras are in budget!" when no extras are within the budget', async () => {
    const mockChoices = [
      { feature_id: "choice-1", name: "Choice 1", price: 3000 },
    ];
    const mockExtras = [
      { feature_id: "extra-1", name: "Extra 1", price: 15000 },
    ]; // Extras are above the budget

    // Mock the API responses
    axiosInstance.get
      .mockResolvedValueOnce({
        data: { buyer_id: "buyer-id", venture_id: "venture-id" },
      }) // Buyer API response
      .mockResolvedValueOnce({
        data: {
          venture_id: "venture-id",
          properties: [
            { key: "house_type", choices: ["choice-1"], extras: ["extra-1"] },
          ],
        }, // Venture API response
      })
      .mockResolvedValueOnce({
        data: [...mockChoices, ...mockExtras], // Features API response
      });

    render(<BudgetBasedSuggestions />);

    // Enter a budget
    fireEvent.change(screen.getByPlaceholderText("Enter your budget"), {
      target: { value: 1000 },
    }); // Budget less than extra prices

    // Click the suggest button
    fireEvent.click(screen.getByRole("button", { name: "suggestInBudget" }));

    // Wait for the message to appear
    await waitFor(() => {
      expect(screen.getByText("No Extras are in budget!")).toBeInTheDocument();
    });
  });
});
