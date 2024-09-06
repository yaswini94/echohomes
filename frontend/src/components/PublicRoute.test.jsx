import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import { useAuth } from "../auth/useAuth";
import { vi } from "vitest";
import { Navigate } from "react-router-dom";

// Mock the useAuth hook using Vitest
vi.mock("../auth/useAuth");

// Mock the Navigate component from react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Navigate: vi.fn(() => null), // Mock the Navigate component to return null
  };
});

describe("PublicRoute Component", () => {
  it("should render loading when auth is loading", () => {
    // Mock the useAuth hook to return loading state
    useAuth.mockReturnValue({
      user: null,
      loading: true,
    });

    render(
      <MemoryRouter>
        <PublicRoute>
          <div>Public Content</div>
        </PublicRoute>
      </MemoryRouter>
    );

    // Check that loading message is displayed
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should navigate to /dashboard if user is authenticated", () => {
    // Mock the useAuth hook to return an authenticated user
    useAuth.mockReturnValue({
      user: { id: 1, name: "Test User" },
      loading: false,
    });

    render(
      <MemoryRouter>
        <PublicRoute>
          <div>Public Content</div>
        </PublicRoute>
      </MemoryRouter>
    );

    // Check that the Navigate component was called to redirect to /dashboard
    expect(Navigate).toHaveBeenCalledWith({ to: "/dashboard" }, {});
  });

  it("should render children if user is not authenticated", () => {
    // Mock the useAuth hook to return unauthenticated state
    useAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    render(
      <MemoryRouter>
        <PublicRoute>
          <div>Public Content</div>
        </PublicRoute>
      </MemoryRouter>
    );

    // Check that the children content is rendered
    expect(screen.getByText("Public Content")).toBeInTheDocument();
  });
});
