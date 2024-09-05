import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import BuyerConfiguration from "./index";
import { vi } from "vitest";
import axiosInstance from "../../helpers/axiosInstance";
import { loadStripe } from "@stripe/stripe-js";

// Mocking
vi.mock("../../auth/useAuth", () => ({
  useAuth: () => ({ user: { id: "user1" } }),
}));

vi.mock("../../helpers/axiosInstance");
vi.mock("@stripe/stripe-js");

describe("BuyerConfiguration Component", () => {
  it("should render basic structure", async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: { buyer_id: "buyer1" } });

    render(<BuyerConfiguration />);

    await waitFor(() => {
      expect(screen.getByText(/Venture Name/i)).toBeInTheDocument();
      expect(screen.getByText(/House Type/i)).toBeInTheDocument();
    });
  });
});
