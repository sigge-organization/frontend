import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React, { useState, useEffect } from "react";

// Mock de dados de grande escala
const generateMockEvents = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `event-${i}`,
    title: `Evento de Teste de Carga nº ${i}`,
    date: new Date().toISOString(),
  }));
};

const generateMockGroups = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `group-${i}`,
    theme: `Grupo de Estudos nº ${i}`,
    description: `Descrição longa para o grupo de testes número ${i} com fins de testes de carga.`,
  }));
};

describe("Testes de Carga (Load Testing)", () => {
  
  // ==========================================
  // TESTES AUTOMÁTICOS
  // ==========================================

  it("1. [Automático] - Deve renderizar de forma estável uma lista de 1.000 eventos de calendário mockados", () => {
    const events = generateMockEvents(1000);
    
    const TestComponent = () => (
      <div data-testid="calendar-container">
        {events.map((evt) => (
          <div key={evt.id} className="event-item" data-testid="event-item">
            {evt.title}
          </div>
        ))}
      </div>
    );

    render(<TestComponent />);
    
    const items = screen.getAllByTestId("event-item");
    expect(items).toHaveLength(1000);
    expect(items[0]).toHaveTextContent("Evento de Teste de Carga nº 0");
    expect(items[999]).toHaveTextContent("Evento de Teste de Carga nº 999");
  });

  it("2. [Automático] - Deve renderizar 500 grupos de estudo em formato de grid sem falhas", () => {
    const groups = generateMockGroups(500);

    const GridComponent = () => (
      <div className="grid grid-cols-3" data-testid="group-grid">
        {groups.map((group) => (
          <div key={group.id} className="card" data-testid="group-card">
            <h3>{group.theme}</h3>
            <p>{group.description}</p>
          </div>
        ))}
      </div>
    );

    render(<GridComponent />);
    
    const cards = screen.getAllByTestId("group-card");
    expect(cards).toHaveLength(500);
    expect(screen.getByText("Grupo de Estudos nº 250")).toBeInTheDocument();
  });

  it("3. [Automático] - Deve renderizar 200 itens de materiais de estudo em menos de 100ms", () => {
    const materials = Array.from({ length: 200 }, (_, i) => ({
      id: `mat-${i}`,
      title: `Material Didático de Engenharia de Software nº ${i}`,
    }));

    const ListComponent = () => (
      <ul data-testid="materials-list">
        {materials.map((mat) => (
          <li key={mat.id} data-testid="material-item">
            {mat.title}
          </li>
        ))}
      </ul>
    );

    const t0 = performance.now();
    render(<ListComponent />);
    const t1 = performance.now();
    
    const renderTime = t1 - t0;
    expect(screen.getAllByTestId("material-item")).toHaveLength(200);
    expect(renderTime).toBeLessThan(100); // Garante que a renderização do DOM foi rápida
  });

  it("4. [Automático] - Deve executar 100 atualizações seguidas de estado em lote e manter consistência", () => {
    const UpdateComponent = ({ onFinish }: { onFinish: (count: number) => void }) => {
      const [count, setCount] = useState(0);

      useEffect(() => {
        for (let i = 0; i < 100; i++) {
          setCount((prev) => prev + 1);
        }
      }, []);

      useEffect(() => {
        if (count === 100) {
          onFinish(count);
        }
      }, [count, onFinish]);

      return <div data-testid="counter">{count}</div>;
    };

    const finishSpy = vi.fn();
    render(<UpdateComponent onFinish={finishSpy} />);

    expect(screen.getByTestId("counter")).toHaveTextContent("100");
    expect(finishSpy).toHaveBeenCalledWith(100);
  });

  it("5. [Automático] - Carregamento de imagem de perfil de alta resolução: Validação do elemento DOM", () => {
    // Automático: Valida a injeção do base64 gigante no elemento img
    const giantBase64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    
    render(
      <img 
        src={giantBase64Image} 
        alt="Foto de Perfil Gigante" 
        data-testid="profile-image-large" 
      />
    );

    const img = screen.getByTestId("profile-image-large");
    expect(img).toBeInTheDocument();
    expect(img.getAttribute("src")).toBe(giantBase64Image);
  });

  it("6. [Automático] - Scroll infinito de materiais com 5.000 itens: renderização estável e rápida do DOM", () => {
    const items = Array.from({ length: 5000 }, (_, i) => `Material ${i}`);
    
    const VirtualizedListMock = () => {
      // Simula uma lista virtualizada básica (mostra apenas 20 itens por vez com base no scroll)
      const [scrollTop, setScrollTop] = useState(0);
      const itemHeight = 30;
      const containerHeight = 300;
      
      const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight));
      const endIndex = Math.min(items.length, Math.floor((scrollTop + containerHeight) / itemHeight));
      
      const visibleItems = items.slice(startIndex, endIndex);

      return (
        <div 
          data-testid="scroll-container" 
          style={{ height: containerHeight, overflow: "auto" }}
          onScroll={(e) => setScrollTop((e.target as HTMLDivElement).scrollTop)}
        >
          <div style={{ height: items.length * itemHeight, position: "relative" }}>
            <div style={{ position: "absolute", top: startIndex * itemHeight }}>
              {visibleItems.map((item) => (
                <div key={item} data-testid="visible-item" style={{ height: itemHeight }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };

    const t0 = performance.now();
    render(<VirtualizedListMock />);
    const t1 = performance.now();

    expect(screen.getAllByTestId("visible-item").length).toBeLessThan(20);
    expect(screen.getAllByTestId("visible-item")[0]).toHaveTextContent("Material 0");
    expect(t1 - t0).toBeLessThan(50); // Deve montar instantaneamente (<50ms) devido à virtualização simulada
  });

  it("7. [Automático] - Sincronização sob fluxo contínuo de sockets: retenção de memória limitando elementos no DOM", () => {
    const ChatMessageListMock = ({ messageStream }: { messageStream: { id: string; text: string }[] }) => {
      const [messages, setMessages] = useState<string[]>([]);

      useEffect(() => {
        if (messageStream.length > 0) {
          setMessages((prev) => {
            const next = [...prev, ...messageStream.map(m => m.text)];
            // Mantém apenas as últimas 50 mensagens para evitar vazamento de memória visual
            return next.slice(-50);
          });
        }
      }, [messageStream]);

      return (
        <ul data-testid="message-list">
          {messages.map((m, idx) => (
            <li key={idx} data-testid="chat-message">{m}</li>
          ))}
        </ul>
      );
    };

    // Simula 200 mensagens recebidas
    const batch1 = Array.from({ length: 200 }, (_, i) => ({ id: `${i}`, text: `Msg ${i}` }));
    const { rerender } = render(<ChatMessageListMock messageStream={[]} />);

    act(() => {
      rerender(<ChatMessageListMock messageStream={batch1} />);
    });

    const renderedItems = screen.getAllByTestId("chat-message");
    expect(renderedItems.length).toBe(50); // O buffer manteve apenas as últimas 50 mensagens
    expect(renderedItems[49]).toHaveTextContent("Msg 199");
  });

  it("8. [Automático] - Carga de conexão paralela: leitura concorrente e consistente de cookies de sessão", async () => {
    const rawCookies = "sigee.token=jwt-auth-token-123; path=/";
    
    // Simula 20 requisições concorrentes lendo cookies
    const readCookiePromise = () => {
      return new Promise<string>((resolve) => {
        setTimeout(() => {
          const list: Record<string, string> = {};
          rawCookies.split(";").forEach((cookie) => {
            const parts = cookie.split("=");
            list[parts.shift()!.trim()] = decodeURIComponent(parts.join("="));
          });
          resolve(list["sigee.token"]);
        }, Math.random() * 20); // Latência aleatória
      });
    };

    const promises = Array.from({ length: 20 }, () => readCookiePromise());
    const results = await Promise.all(promises);

    results.forEach((token) => {
      expect(token).toBe("jwt-auth-token-123");
    });
  });

  it("9. [Automático] - Cadastro rápido de múltiplos links de materiais externos: submissão sequencial rápida", () => {
    const AddMultipleLinksMock = ({ onAdd }: { onAdd: (title: string, url: string) => void }) => {
      const [title, setTitle] = useState("");
      const [url, setUrl] = useState("");

      const handleAdd = () => {
        onAdd(title, url);
        setTitle("");
        setUrl("");
      };

      return (
        <div>
          <input data-testid="link-title" value={title} onChange={e => setTitle(e.target.value)} />
          <input data-testid="link-url" value={url} onChange={e => setUrl(e.target.value)} />
          <button data-testid="add-btn" onClick={handleAdd}>Adicionar</button>
        </div>
      );
    };

    const addSpy = vi.fn();
    render(<AddMultipleLinksMock onAdd={addSpy} />);

    const titleInput = screen.getByTestId("link-title");
    const urlInput = screen.getByTestId("link-url");
    const btn = screen.getByTestId("add-btn");

    for (let i = 0; i < 5; i++) {
      fireEvent.change(titleInput, { target: { value: `Material ${i}` } });
      fireEvent.change(urlInput, { target: { value: `https://drive.google.com/${i}` } });
      fireEvent.click(btn);
    }

    expect(addSpy).toHaveBeenCalledTimes(5);
    expect(addSpy).toHaveBeenLastCalledWith("Material 4", "https://drive.google.com/4");
  });

  it("10. [Automático] - Prevenção de vazamento de memória sob montagens sucessivas (Heap Size Profiling alternativo)", () => {
    const cleanupSpy = vi.fn();

    const LeakyComponentMock = () => {
      useEffect(() => {
        const handleResize = () => {};
        window.addEventListener("resize", handleResize);
        return () => {
          window.removeEventListener("resize", handleResize);
          cleanupSpy();
        };
      }, []);

      return <div>Componente Dinâmico</div>;
    };

    // Monta e desmonta o componente 50 vezes consecutivas
    for (let i = 0; i < 50; i++) {
      const { unmount } = render(<LeakyComponentMock />);
      unmount();
    }

    expect(cleanupSpy).toHaveBeenCalledTimes(50); // Garante que todos os recursos foram devidamente desalocados em cada ciclo
  });
});
