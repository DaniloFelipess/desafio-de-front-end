import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "@/app/home/page";

describe("Home", () => {
  it("renders the city selection screen", () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>,
    );

    expect(screen.getByRole("heading", { name: "Weather" })).toBeInTheDocument();
    expect(screen.getByText("Select a city")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Dallol" })).toHaveAttribute(
      "href",
      "/weather/dallol",
    );
    expect(screen.getByRole("link", { name: "Yakutsk" })).toHaveAttribute(
      "href",
      "/weather/yakutsk",
    );
  });
});
