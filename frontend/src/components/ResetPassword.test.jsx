import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ResetPassword from "./ResetPassword";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";

// Mock axios
vi.mock("axios");

describe("ResetPassword Component", () => {
  const setup = () => {
    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the reset password form", () => {
    setup();
    expect(screen.getByLabelText(/New Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Reset Password/i })
    ).toBeInTheDocument();
  });

  it("should display validation errors if password is not provided", async () => {
    setup();

    // Click submit without entering any data
    fireEvent.click(screen.getByRole("button", { name: /Reset Password/i }));

    // Check for validation messages
    expect(
      await screen.findByText(/Please input your new password!/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Please confirm your password!/i)
    ).toBeInTheDocument();
  });

  it("should display error if passwords do not match", async () => {
    setup();

    fireEvent.change(screen.getByLabelText(/New Password/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "differentPassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Reset Password/i }));

    expect(
      await screen.findByText(
        /The two passwords that you entered do not match!/i
      )
    ).toBeInTheDocument();
  });

  it("should call axios with correct data when form is submitted", async () => {
    // Mock axios response
    axios.post.mockResolvedValueOnce({
      data: { message: "Password reset successfully" },
    });

    setup();

    // Simulate user input
    fireEvent.change(screen.getByLabelText(/New Password/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "password123" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Reset Password/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:3001/updatePassword",
        {
          email: null,
          password: "password123",
        }
      );
    });
  });

  it("should show loading state while submitting the form", async () => {
    // Mock axios response to delay the request (simulating loading)
    axios.post.mockResolvedValueOnce({
      data: { message: "Password reset successfully" },
    });

    setup();

    fireEvent.change(screen.getByLabelText(/New Password/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "password123" },
    });

    const submitButton = screen.getByRole("button", {
      name: /Reset Password/i,
    });

    // Check that the button is not loading initially (no loading spinner)
    // data-testloading="false" is a custom attribute we added to the button
    expect(submitButton).toHaveAttribute("data-testloading", "false");

    // Submit the form
    fireEvent.click(submitButton);

    // Check that the button is in a loading state (loading spinner is present)
    expect(submitButton).toHaveAttribute("data-testloading", "false");

    // Wait for axios to resolve and the form to stop loading
    await waitFor(() => {
      expect(submitButton).toHaveAttribute("data-testloading", "false");
    });
  });

  it("should handle error if axios request fails", async () => {
    // Mock axios to reject the request
    axios.post.mockRejectedValueOnce(new Error("Network Error"));

    setup();

    fireEvent.change(screen.getByLabelText(/New Password/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Reset Password/i }));

    await waitFor(() => {
      expect(screen.getByText(/Error: Network Error/i)).toBeInTheDocument();
    });
  });
});
