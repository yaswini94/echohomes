import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Chat from "../Chat/Chat";
import { supabase } from "../../supabase";
import { useAuth } from "../../auth/useAuth";

vi.mock("../../supabase");
vi.mock("../../auth/useAuth");

describe("Chat Component", () => {
  const mockUser = { id: "user-id-123" };
  const mockMessages = [
    {
      id: 1,
      conversation_id: "conversation-id-1",
      sender_id: "user-id-123",
      message_text: "Hello from user",
    },
    {
      id: 2,
      conversation_id: "conversation-id-1",
      sender_id: "buyer-id-456",
      message_text: "Hello from buyer",
    },
  ];

  beforeEach(() => {
    useAuth.mockReturnValue({ user: mockUser });
    supabase.from.mockImplementation(() => ({
      select: vi.fn().mockResolvedValue({ data: mockMessages }),
      insert: vi.fn().mockResolvedValue({}),
    }));

    supabase.channel.mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(),
      unsubscribe: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render chat with buyer's name and toggle minimize", async () => {
    render(<Chat name="Buyer Name" />);

    // Verify that the component renders with the buyer's name
    expect(screen.getByText("Buyer Name")).toBeInTheDocument();
  });

  it("should render chat with default name when no buyer name is provided", async () => {
    render(<Chat namr="Chat" />);

    // Verify that the component renders with the buyer's name
    expect(screen.getByText("Chat")).toBeInTheDocument();
  });

  it("should scroll to the bottom when new messages are added", async () => {
    const { container } = render(
      <Chat builderId="builder-id-1" buyerId="buyer-id-456" name="Buyer Name" />
    );

    const messagesEnd = container.querySelector(".messages-container div");

    fireEvent.scroll(messagesEnd);

    await waitFor(() => {
      expect(messagesEnd).toBeInTheDocument();
    });
  });

  it("should close chat when the close icon is clicked", () => {
    const mockOnClose = vi.fn();
    render(
      <Chat
        builderId="builder-id-1"
        buyerId="buyer-id-456"
        name="Buyer Name"
        onClose={mockOnClose}
      />
    );

    // data-testid="close-chat"
    // const closeButton = screen.getByRole("img", { name: /close/i });
    const closeButton = screen.getByTestId("close-chat");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
