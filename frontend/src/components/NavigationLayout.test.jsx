import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import NavigationLayout from "./NavigationLayout";
import { userRoles } from "../utils/constants";
import { useAuth } from "../auth/useAuth";

// Partially mock the "antd" module
vi.mock("antd", async (importOriginal) => {
  const actual = await importOriginal(); // Import the original module
  return {
    ...actual,
    theme: {
      useToken: () => ({
        token: {
          colorBgContainer: "#fff",
          borderRadiusLG: 4,
        },
      }),
    },
  };
});

// Mock useAuth
vi.mock("../auth/useAuth");

// Mock useTranslation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key, // simple translation mock that returns the key itself
  }),
}));

describe("NavigationLayout Component", () => {
  const mockUseAuth = useAuth;

  it("should render builder's navigation menu", () => {
    // Set role to builder
    mockUseAuth.mockReturnValue({ role: userRoles.BUILDERS });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <NavigationLayout />
      </MemoryRouter>
    );

    // Check if builder-specific menu items are present
    expect(screen.getByText("home")).toBeInTheDocument();
    expect(screen.getByText("ventureManagement")).toBeInTheDocument();
    expect(screen.getByText("supplierManagement")).toBeInTheDocument();
    expect(screen.getByText("buyerManagement")).toBeInTheDocument();
    expect(screen.getByText("featureManagement")).toBeInTheDocument();
    expect(screen.getByText("orders")).toBeInTheDocument();
  });

  it("should render buyer's navigation menu", () => {
    // Set role to buyer
    mockUseAuth.mockReturnValue({ role: userRoles.BUYERS });

    render(
      <MemoryRouter initialEntries={["/buyer-configuration"]}>
        <NavigationLayout />
      </MemoryRouter>
    );

    // Check if buyer-specific menu items are present
    expect(screen.getByText("home")).toBeInTheDocument();
    expect(screen.getByText("choicesConfiguration")).toBeInTheDocument();
    expect(screen.getByText("inBudgetSuggestions")).toBeInTheDocument();
    expect(screen.getByText("comparisonTool")).toBeInTheDocument();
  });

  it("should render supplier's navigation menu", () => {
    // Set role to supplier
    mockUseAuth.mockReturnValue({ role: userRoles.SUPPLIERS });

    render(
      <MemoryRouter initialEntries={["/supplier-orders"]}>
        <NavigationLayout />
      </MemoryRouter>
    );

    // Check if supplier-specific menu items are present
    expect(screen.getByText("home")).toBeInTheDocument();
    expect(screen.getByText("orders")).toBeInTheDocument();
  });

  it("should select the current menu item based on location", () => {
    // Set role to builder
    mockUseAuth.mockReturnValue({ role: userRoles.BUILDERS });

    render(
      <MemoryRouter initialEntries={["/ventures"]}>
        <NavigationLayout />
      </MemoryRouter>
    );

    // Check if the "/ventures" menu item is selected
    const venturesMenuItem = screen
      .getByText("ventureManagement")
      .closest("li");
    expect(venturesMenuItem).toHaveClass("ant-menu-item-selected");
  });

  it("should return null if no role is provided", () => {
    // No role provided
    mockUseAuth.mockReturnValue({ role: null });

    const { container } = render(
      <MemoryRouter>
        <NavigationLayout />
      </MemoryRouter>
    );

    // Component should render nothing if role is invalid
    expect(container.firstChild).toBeNull();
  });
});
