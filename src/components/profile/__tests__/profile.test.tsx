import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { ProfileView } from "../profile-view";
import { ProfileForm } from "../profile-form";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUpdateProfile } from "@/hooks/hooks";
import { UserProfile } from "@/hooks/hooks";

// Mock das libs e hooks
vi.mock("@/hooks/hooks", () => ({
  useUpdateProfile: vi.fn(),
}));

const mockUser: UserProfile = {
  id: "user-123",
  name: "João Silva",
  email: "joao@example.com",
  course: "Engenharia",
  created_at: "2023-01-01T00:00:00.000Z"
};

const queryClient = new QueryClient();

describe("ProfileView", () => {
  it("1. Should render the user name and email correctly", () => {
    render(<ProfileView user={mockUser} onEdit={vi.fn()} onOpenPasswordModal={vi.fn()} />);
    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("joao@example.com")).toBeInTheDocument();
  });

  it("2. Should render the user course if provided", () => {
    render(<ProfileView user={mockUser} onEdit={vi.fn()} onOpenPasswordModal={vi.fn()} />);
    expect(screen.getByText("Engenharia")).toBeInTheDocument();
    expect(screen.getByText("Curso")).toBeInTheDocument();
  });

  it("3. Should not render the course section if course is missing", () => {
    const userWithoutCourse = { ...mockUser, course: undefined };
    render(<ProfileView user={userWithoutCourse} onEdit={vi.fn()} onOpenPasswordModal={vi.fn()} />);
    expect(screen.queryByText("Curso")).not.toBeInTheDocument();
  });

  it("4. Should call onEdit when clicking the 'Editar Perfil' button", () => {
    const onEditSpy = vi.fn();
    render(<ProfileView user={mockUser} onEdit={onEditSpy} onOpenPasswordModal={vi.fn()} />);
    
    fireEvent.click(screen.getByRole("button", { name: /editar perfil/i }));
    expect(onEditSpy).toHaveBeenCalledTimes(1);
  });

  it("5. Should call onOpenPasswordModal when clicking 'Alterar Senha'", () => {
    const onPassSpy = vi.fn();
    render(<ProfileView user={mockUser} onEdit={vi.fn()} onOpenPasswordModal={onPassSpy} />);
    
    fireEvent.click(screen.getByRole("button", { name: /alterar senha/i }));
    expect(onPassSpy).toHaveBeenCalledTimes(1);
  });

  it("6. Should display the first letter of the user's name in the avatar", () => {
    render(<ProfileView user={mockUser} onEdit={vi.fn()} onOpenPasswordModal={vi.fn()} />);
    const avatar = screen.getByText("J");
    expect(avatar).toBeInTheDocument();
  });
});

describe("ProfileForm", () => {
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useUpdateProfile as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false
    });
  });

  const renderForm = (user = mockUser, onCancel = vi.fn()) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <ProfileForm user={user} onCancel={onCancel} />
      </QueryClientProvider>
    );
  };

  it("7. Should render the form with user data pre-filled", () => {
    renderForm();
    expect(screen.getByLabelText(/nome completo/i)).toHaveValue("João Silva");
    expect(screen.getByLabelText(/e-mail/i)).toHaveValue("joao@example.com");
    expect(screen.getByLabelText(/curso/i)).toHaveValue("Engenharia");
  });

  it("8. Should show validation error when submitting an empty name", async () => {
    renderForm();
    
    const nameInput = screen.getByLabelText(/nome completo/i);
    fireEvent.change(nameInput, { target: { value: "" } });
    
    const submitBtn = screen.getByRole("button", { name: /salvar/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/o nome deve ter pelo menos 3 caracteres/i)).toBeInTheDocument();
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("9. Should call onCancel when 'Cancelar' button is clicked", () => {
    const cancelSpy = vi.fn();
    renderForm(mockUser, cancelSpy);
    
    const cancelBtn = screen.getByRole("button", { name: /cancelar/i });
    fireEvent.click(cancelBtn);
    
    expect(cancelSpy).toHaveBeenCalledTimes(1);
  });

  it("10. Should call updateProfileMutation.mutate with new data on valid submission", async () => {
    renderForm();
    
    const nameInput = screen.getByLabelText(/nome completo/i);
    fireEvent.change(nameInput, { target: { value: "João Alterado" } });
    
    const submitBtn = screen.getByRole("button", { name: /salvar/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({ name: "João Alterado" }),
        expect.any(Object) // onSuccess/onError callbacks object might be passed
      );
    });
  });
});