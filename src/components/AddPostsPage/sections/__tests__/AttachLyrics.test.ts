import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import AttachLyrics from "../CreateLyrics/AttachLyrics.vue";

// Mock the router
const mockRouter = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: { template: "<div>Home</div>" } },
    { path: "/home", component: { template: "<div>Home</div>" } },
  ],
});

// Mock SVG components
vi.mock("@/components/SVG/AddPosts_Icons/MediaClose.vue", () => ({
  default: {
    name: "MediaClose",
    template: '<div data-testid="media-close">Close</div>',
  },
}));

vi.mock("@/components/SVG/AddPosts_Icons/AddIcon.vue", () => ({
  default: {
    name: "AddIcon",
    template: '<div data-testid="add-icon">Add</div>',
  },
}));

// Mock medium-zoom
vi.mock("medium-zoom", () => ({
  default: vi.fn(() => ({
    attach: vi.fn(),
    detach: vi.fn(),
  })),
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock environment variables
vi.mock("import.meta", () => ({
  env: {
    VITE_API_URL: "http://localhost:3000",
  },
}));

// Mock URL methods
global.URL.createObjectURL = vi.fn(() => "mock-url");
global.URL.revokeObjectURL = vi.fn();

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

// Mock sessionStorage
const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, "sessionStorage", { value: mockSessionStorage });

// Mock document.cookie
Object.defineProperty(document, "cookie", {
  writable: true,
  value: "",
});

describe("AttachLyrics", () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockClear();
    mockLocalStorage.getItem.mockReturnValue("mock-token");
    wrapper = mount(AttachLyrics, {
      global: {
        plugins: [mockRouter],
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  // (Your tests go here)
  // Example: using an explicit type annotation for the header getter callback.
  it("tests header get callback", () => {
    const headers = {
      get: (name: string) =>
        name === "content-type" ? "application/json" : null,
    };
    expect(headers.get("content-type")).toBe("application/json");
  });
});
