import { render, screen } from "@testing-library/react";
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
});
