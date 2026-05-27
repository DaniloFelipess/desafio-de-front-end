import { redirect } from "next/navigation";
import RootPage from "@/app/page";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("RootPage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("redirects the root route to home", () => {
    RootPage();

    expect(redirect).toHaveBeenCalledWith("/home");
  });
});
