import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom'; // For mocking navigation
import Registration from './Registration'; // Component to test
import axiosInstance from '../helpers/axiosInstance'; // Mocked Axios instance
import { vi } from 'vitest';

// Mock axiosInstance
vi.mock('../helpers/axiosInstance', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    default: {
      ...actual.default,
      post: vi.fn(),
    },
  };
});

// Helper function to wrap component in BrowserRouter
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Registration Component', () => {
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
  
  test('register button should be disabled while registering', async () => {
    axiosInstance.post.mockResolvedValueOnce({});

    renderWithRouter(<Registration />);

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John T' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Company Name'), { target: { value: 'Test Corp' } });
    fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '09999999999' } });
    fireEvent.change(screen.getByLabelText('Address'), { target: { value: '123 Main St' } });
    fireEvent.click(screen.getByRole('radio', { name: 'Builder' }));

    // Click the Register button
    const registerButton = screen.getByRole('button', { name: 'Register' });
    fireEvent.click(registerButton);

    // The register button should be disabled while loading
    await waitFor(() => {
      expect(registerButton).toBeDisabled();
    });

    // The button should be re-enabled after registration is done
    await waitFor(() => {
      expect(registerButton).not.toBeDisabled();
    });
  });
});
