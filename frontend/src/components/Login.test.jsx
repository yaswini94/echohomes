import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom"; // For mocking navigation
import { supabase } from "../supabase"; // Mocked Supabase
import axiosInstance from "../helpers/axiosInstance"; // Mocked Axios instance
import Login from "./Login"; // The component to test
import { vi } from "vitest";

// Mock supabase
vi.mock("../supabase", () => ({
  supabase: {
    auth: {
      setSession: vi.fn(),
    },
  },
}));

// Mock axiosInstance
vi.mock("../helpers/axiosInstance", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    default: {
      ...actual,
      post: vi.fn(),
    },
  };
});

// Helper function to wrap component in BrowserRouter
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("login button should be disabled while logging in", async () => {
    // Mock a successful response from axios
    axiosInstance.post.mockResolvedValueOnce({
      data: {
        data: {
          session: {
            access_token: "mock_access_token",
            refresh_token: "mock_refresh_token",
          },
        },
      },
    });

    renderWithRouter(<Login />);

    const loginButton = screen.getByRole("button", { name: "Login" });
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    // Fill in the form fields
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Click the login button
    fireEvent.click(loginButton);

    // Check that the button is disabled while loading
    await waitFor(() => {
      expect(loginButton).toBeDisabled();
    });

    // After the form submission completes, check that the button is re-enabled
    await waitFor(() => {
      expect(loginButton).not.toBeDisabled();
    });
  });
});
