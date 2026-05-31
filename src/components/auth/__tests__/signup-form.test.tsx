import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SignupForm } from "../signup-form";
import { api } from "@/services/api";

vi.mock("@/services/api", () => ({
  api: {
    post: vi.fn(),
  },
}));

// Mocks
const queryClient = new QueryClient();

describe("SignupForm", () => {
  const onToggleModeMock = vi.fn();

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <SignupForm onToggleMode={onToggleModeMock} />
      </QueryClientProvider>
    );
  };

  it("should render the signup form correctly", () => {
    renderComponent();
    expect(screen.getByRole("heading", { name: /cadastro/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/digite seu nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/digite seu e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^digite sua senha$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/repita sua senha/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cadastrar/i })).toBeInTheDocument();
  });

  it("should display validation errors if submitting empty form", async () => {
    renderComponent();
    const submitBtn = screen.getByRole("button", { name: /cadastrar/i });
    
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/o nome deve ter pelo menos 3 caracteres/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/o e-mail é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/a senha deve ter pelo menos 6 caracteres/i)).toBeInTheDocument();
  });

  it("should call onToggleMode when clicking 'Fazer Login'", () => {
    renderComponent();
    const toggleBtn = screen.getByRole("button", { name: /fazer login/i });
    
    fireEvent.click(toggleBtn);
    expect(onToggleModeMock).toHaveBeenCalled();
  });

  it("should create account and toggle mode on successful signup", async () => {
    (api.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { success: true }
    });

    renderComponent();
    
    fireEvent.change(screen.getByLabelText(/digite seu nome/i), { target: { value: "Test User" } });
    fireEvent.change(screen.getByLabelText(/digite seu e-mail/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/^digite sua senha$/i), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText(/repita sua senha/i), { target: { value: "123456" } });
    
    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/api/auth/register", {
        username: "Test User",
        email: "test@example.com",
        password: "123456",
      });
      expect(onToggleModeMock).toHaveBeenCalled();
    });
  });
});
