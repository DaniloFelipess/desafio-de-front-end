import RootLayout, { metadata } from "@/app/layout";

describe("RootLayout", () => {
  it("defines page metadata", () => {
    expect(metadata).toEqual({
      title: "Weather App",
      description: "Weather app challenge",
      icons: {
        icon: "/Vector.svg",
      },
    });
  });

  it("wraps content with the expected document structure", () => {
    const layout = RootLayout({ children: <main>content</main> });

    expect(layout.type).toBe("html");
    expect(layout.props.lang).toBe("en");
    expect(layout.props.children.type).toBe("body");
    expect(layout.props.children.props.children.props.children).toEqual(
      <main>content</main>,
    );
  });
});
