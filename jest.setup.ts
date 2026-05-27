import '@testing-library/jest-dom';

class TestResponse {
  status: number;
  ok: boolean;
  private body: unknown;

  constructor(body?: unknown, init?: { status?: number }) {
    this.status = init?.status ?? 200;
    this.ok = this.status >= 200 && this.status < 300;
    this.body = typeof body === "string" ? JSON.parse(body) : body;
  }

  static json(body: unknown, init?: { status?: number }) {
    return new TestResponse(body, init);
  }

  async json() {
    return this.body;
  }
}

class TestRequest {
  url: string;

  constructor(input: string | URL) {
    this.url = String(input);
  }
}

if (!global.Response) {
  global.Response = TestResponse as unknown as typeof Response;
}

if (!global.Request) {
  global.Request = TestRequest as unknown as typeof Request;
}

if (!global.fetch) {
  global.fetch = jest.fn();
}
