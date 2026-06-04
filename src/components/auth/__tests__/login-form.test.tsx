import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoginForm } from "../login-form";
import Cookies from "js-cookie";
import { api } from "@/services/api";

// Mocks
const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("js-cookie", () => ({
  default: {
    set: vi.fn(),
  },
}));

vi.mock("@/services/api", () => ({
  api: {
    post: vi.fn(),
  },
}));

const queryClient = new QueryClient();

describe("LoginForm", () => {
  const onToggleModeMock = vi.fn();

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <LoginForm onToggleMode={onToggleModeMock} />
      </QueryClientProvider>
    );
  };

  it("should render the login form correctly", () => {
    renderComponent();
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/digite seu e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/digite sua senha/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("should display validation errors if submitting empty form", async () => {
    renderComponent();
    const submitBtn = screen.getByRole("button", { name: /entrar/i });
    
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/o e-mail é obrigatório/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/a senha é obrigatória/i)).toBeInTheDocument();
  });

  it("should call onToggleMode when clicking 'Criar Conta'", () => {
    renderComponent();
    const toggleBtn = screen.getByRole("button", { name: /criar conta/i });
    
    fireEvent.click(toggleBtn);
    expect(onToggleModeMock).toHaveBeenCalled();
  });

  it("should authenticate, set cookie and redirect to dashboard on successful login", async () => {
    (api.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { 
        token: "fake-jwt-token",
        user: { username: "TestUser" }
      }
    });

    renderComponent();
    
    fireEvent.change(screen.getByLabelText(/digite seu e-mail/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/digite sua senha/i), { target: { value: "123456" } });
    
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/api/auth/login", {
        email: "test@example.com",
        password: "123456",
      });
      expect(Cookies.set).toHaveBeenCalledWith("sigee.token", "fake-jwt-token", { expires: 1 });
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
  });
});
