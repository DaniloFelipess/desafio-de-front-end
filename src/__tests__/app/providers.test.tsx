import { render, screen } from "@testing-library/react";
import { useQueryClient } from "@tanstack/react-query";
import { Providers } from "@/app/providers";

jest.mock("@tanstack/react-query-devtools", () => ({
  ReactQueryDevtools: () => <div>React Query Devtools</div>,
}));

describe("Providers", () => {
  it("renders children inside the query provider", () => {
    render(
      <Providers>
        <div>App content</div>
      </Providers>,
    );

    expect(screen.getByText("App content")).toBeInTheDocument();
  });

  it("keeps the same browser query client across remounts", () => {
    const queryClients: ReturnType<typeof useQueryClient>[] = [];

    function QueryClientProbe() {
      queryClients.push(useQueryClient());
      return <div>Probe</div>;
    }

    const { unmount } = render(
      <Providers>
        <QueryClientProbe />
      </Providers>,
    );

    unmount();

    render(
      <Providers>
        <QueryClientProbe />
      </Providers>,
    );

    expect(queryClients[0]).toBe(queryClients[1]);
  });
});
