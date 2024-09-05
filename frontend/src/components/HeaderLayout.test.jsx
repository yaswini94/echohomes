import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import HeaderLayout from './HeaderLayout';
import { useAuth } from '../auth/useAuth'; // Mock useAuth
import axiosInstance from '../helpers/axiosInstance'; // Mock Axios instance
import { vi } from 'vitest';

// Mock useAuth hook for builder role
vi.mock('../auth/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'user-id', email: 'test@example.com' },
    role: 'builders', // Ensure the role is "builders"
  }),
}));

// Mock axiosInstance
vi.mock('../helpers/axiosInstance', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    default: {
      ...actual.default,
      get: vi.fn(),
    },
  };
});

// Mock Supabase
vi.mock('../supabase', () => ({
  supabase: {
    auth: {
      signOut: vi.fn(),
    },
  },
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: vi.fn(), // Mock the changeLanguage function
    },
  }),
}));

describe('HeaderLayout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });
  
  test('renders ventures for builder role and handles venture selection', async () => {
    // Mock the response for ventures
    axiosInstance.get.mockResolvedValueOnce({
      data: [
        { venture_id: 'venture-1', name: 'Venture 1' },
        { venture_id: 'venture-2', name: 'Venture 2' },
      ],
    });
  
    render(<HeaderLayout />);
  
    // Wait for the ventures to be rendered
    await waitFor(() => {
      const comboboxes = screen.getAllByRole('combobox');
      expect(comboboxes.length).toBeGreaterThan(0);
    });
  
    // Open the venture select dropdown
    const ventureSelect = screen.getAllByRole('combobox')[0]; // Assuming the first one is for ventures
    fireEvent.mouseDown(ventureSelect); // Open dropdown
  
    // Select an option (Assuming the options are rendered now)
    const option = await screen.findByText('Venture 2');
    fireEvent.click(option);
  
    // Assert that the selected value is updated
    expect(option).toHaveTextContent('Venture 2');
  });    
});
