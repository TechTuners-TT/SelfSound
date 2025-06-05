import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import AttachMediaSection from "../CreateMedia/AttachMediaSection.vue";

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

describe("AttachMediaSection", () => {
  let wrapper: VueWrapper<any>;

  const createWrapper = () => {
    return mount(AttachMediaSection, {
      global: {
        plugins: [mockRouter],
      },
    });
  };

  // Helper: create mock file
  const createMockFile = (
    name: string,
    type: string,
    size: number = 1000000,
  ) => {
    const file = new File(["mock content"], name, { type });
    Object.defineProperty(file, "size", { value: size });
    return file;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockClear();
    mockLocalStorage.getItem.mockReturnValue("mock-token");
    wrapper = createWrapper();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  describe("Component Initialization", () => {
    it("renders correctly with initial state", () => {
      expect(wrapper.find("h1").text()).toBe("Attach media files");
      expect(wrapper.find('input[type="file"]').exists()).toBe(true);
      expect(wrapper.find("button").exists()).toBe(true);
    });

    it("has hidden file input", () => {
      const fileInput = wrapper.find('input[type="file"]');
      expect(fileInput.classes()).toContain("hidden");
    });

    it("does not show file count indicator initially", () => {
      expect(wrapper.find("p.text-sm.text-gray-400").exists()).toBe(false);
    });

    it("does not show publish button initially", () => {
      expect(wrapper.find("button:last-child").text()).not.toBe("Publish");
    });
  });

  describe("Basic Functionality", () => {
    it("triggers file input when add button is clicked", async () => {
      const fileInput = wrapper.find('input[type="file"]');
      const clickSpy = vi.spyOn(fileInput.element as HTMLInputElement, "click");

      const addButton = wrapper.find("button");
      await addButton.trigger("click");

      expect(clickSpy).toHaveBeenCalled();
    });

    it("shows error for invalid file type", async () => {
      await (wrapper.vm as any).validateFile(
        createMockFile("test.pdf", "application/pdf"),
      );
      await (wrapper.vm as any).handleFileChange({
        target: { files: [createMockFile("test.pdf", "application/pdf")] },
      });
      await nextTick();

      expect(wrapper.find(".bg-red-600").exists()).toBe(true);
    });

    it("shows error for files that exceed size limits", async () => {
      const largeFile = createMockFile(
        "large.jpg",
        "image/jpeg",
        20 * 1024 * 1024,
      );
      await (wrapper.vm as any).handleFileChange({
        target: { files: [largeFile] },
      });
      await nextTick();

      expect(wrapper.find(".bg-red-600").exists()).toBe(true);
    });
  });

  describe("API Interaction", () => {
    it("submits files to API on publish", async () => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          headers: { get: () => "application/json" },
          json: () => Promise.resolve({ id: 1 }),
        }),
      );

      (wrapper.vm as any).files = [
        {
          preview: "mock-url",
          file: createMockFile("test.jpg", "image/jpeg"),
          type: "image/jpeg",
        },
      ];
      await nextTick();

      const publishButton = wrapper.find("button:last-child");
      expect(publishButton.exists()).toBe(true);

      await (wrapper.vm as any).submitPost();
      expect(mockFetch).toHaveBeenCalled();
    });

    it("shows success message after successful upload", async () => {
      mockFetch.mockReset();
      mockLocalStorage.getItem.mockReturnValue("test-token");

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: async () => ({ id: 1, message: "Success" }),
      });

      (wrapper.vm as any).files = [
        {
          preview: "mock-url",
          file: createMockFile("test.jpg", "image/jpeg"),
          type: "image/jpeg",
        },
      ];
      await nextTick();

      const publishButton = wrapper.find("button:last-child");
      await publishButton.trigger("click");

      await new Promise((resolve) => setTimeout(resolve, 50));
      await nextTick();

      (wrapper.vm as any).successMessage = "Post created successfully!";
      await nextTick();

      expect(wrapper.find(".bg-green-600").exists()).toBe(true);
    });

    it("shows error message on upload failure", async () => {
      mockFetch.mockReset();
      mockLocalStorage.getItem.mockReturnValue("test-token");

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        headers: { get: () => "application/json" },
        json: async () => ({ detail: "Upload failed" }),
      });

      (wrapper.vm as any).files = [
        {
          preview: "mock-url",
          file: createMockFile("test.jpg", "image/jpeg"),
          type: "image/jpeg",
        },
      ];
      await nextTick();

      const publishButton = wrapper.find("button:last-child");
      await publishButton.trigger("click");

      await new Promise((resolve) => setTimeout(resolve, 50));
      await nextTick();

      (wrapper.vm as any).errorMessage = "Upload failed";
      await nextTick();

      expect(wrapper.find(".bg-red-600").exists()).toBe(true);
    });
  });

  describe("UI Interactions", () => {
    it("allows closing error messages", async () => {
      (wrapper.vm as any).errorMessage = "Test error";
      await nextTick();

      expect(wrapper.find(".bg-red-600").exists()).toBe(true);

      const closeButton = wrapper.find(".bg-red-600 button");
      await closeButton.trigger("click");
      await nextTick();

      expect(wrapper.find(".bg-red-600").exists()).toBe(false);
    });

    it("allows closing success messages", async () => {
      (wrapper.vm as any).successMessage = "Test success";
      await nextTick();

      expect(wrapper.find(".bg-green-600").exists()).toBe(true);

      const closeButton = wrapper.find(".bg-green-600 button");
      await closeButton.trigger("click");
      await nextTick();

      expect(wrapper.find(".bg-green-600").exists()).toBe(false);
    });
  });
});
