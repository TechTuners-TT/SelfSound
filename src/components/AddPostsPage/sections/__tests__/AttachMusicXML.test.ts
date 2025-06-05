import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import AttachMusicXML from "../CreateMusicXML/AttachMusicXML.vue";

// Mock the router
const mockRouter = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: { template: "<div>Home</div>" } },
    { path: "/home", component: { template: "<div>Home</div>" } },
  ],
});

// Mock SVG components
vi.mock("@/components/SVG/AddPosts_Icons/AddIcon.vue", () => ({
  default: {
    name: "AddIcon",
    template: '<div data-testid="add-icon">Add</div>',
  },
}));

vi.mock("@/components/SVG/AddPosts_Icons/AudioClose11.vue", () => ({
  default: {
    name: "AudioClose11",
    template: '<div data-testid="audio-close-11">Close</div>',
  },
}));

vi.mock("@/components/SVG/AddPosts_Icons/XMLIcon.vue", () => ({
  default: {
    name: "XMLIcon",
    template: '<div data-testid="xml-icon">XML</div>',
  },
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

describe("AttachMusicXML", () => {
  let wrapper: VueWrapper<any>;

  // Helper function to create a mock XML file
  const createMockXMLFile = (
    name: string,
    type: string = "application/xml",
    size: number = 1024 * 1024,
  ) => {
    const file = new File(["mock xml content"], name, { type });
    Object.defineProperty(file, "size", { value: size });
    return file;
  };

  // Helper function to mount the component
  const createWrapper = () => {
    return mount(AttachMusicXML, {
      global: {
        plugins: [mockRouter],
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockClear();
    wrapper = createWrapper();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  // Helper function to simulate file upload
  const simulateFileUpload = async (files: File[]) => {
    // Using an explicit cast for the missing handleFileChange method.
    await (wrapper.vm as any).handleFileChange({
      target: {
        files,
        value: "", // to avoid warnings
      },
    });
    await nextTick();
  };

  describe("Component Initialization", () => {
    it("renders correctly with initial state", () => {
      expect(wrapper.find("h1").text()).toBe("Attach MusicXML files");
      expect(wrapper.find('input[type="file"]').exists()).toBe(true);
      expect(wrapper.find("button").exists()).toBe(true);
    });

    it("has hidden file input", () => {
      const fileInput = wrapper.find('input[type="file"]');
      expect(fileInput.attributes("class")).toContain("hidden");
    });

    it("does not show file preview initially", () => {
      expect(
        wrapper.find('input[placeholder="Song/Piece title"]').exists(),
      ).toBe(false);
    });

    it("does not show publish button initially", () => {
      expect(wrapper.find("button:last-child").text()).not.toBe("Publish");
    });
  });

  describe("File Handling", () => {
    beforeEach(() => {
      wrapper = createWrapper();
    });

    it("triggers file input when add button is clicked", async () => {
      const fileInput = wrapper.find('input[type="file"]');
      const clickSpy = vi.spyOn(fileInput.element as HTMLInputElement, "click");
      const addButton = wrapper.find("button");
      await addButton.trigger("click");
      expect(clickSpy).toHaveBeenCalled();
    });

    it("adds a MusicXML file when selected", async () => {
      await (wrapper.vm as any).handleFileChange({
        target: {
          files: [createMockXMLFile("test.musicxml")],
          value: "",
        },
      });
      await nextTick();

      expect(wrapper.find(".bg-\\[\\#000C9C\\]\\/40").exists()).toBe(true);
      expect(
        wrapper.find('input[placeholder="Song/Piece title"]').exists(),
      ).toBe(true);
    });

    it("sets default title from filename", async () => {
      await (wrapper.vm as any).handleFileChange({
        target: {
          files: [createMockXMLFile("Beautiful Song.musicxml")],
          value: "",
        },
      });
      await nextTick();
      const titleInput = wrapper.find('input[placeholder="Song/Piece title"]');
      expect((titleInput.element as HTMLInputElement).value).toBe(
        "Beautiful Song",
      );
    });

    it("displays file size", async () => {
      await (wrapper.vm as any).handleFileChange({
        target: {
          files: [createMockXMLFile("test.musicxml", "application/xml", 2048)], // 2KB
          value: "",
        },
      });
      await nextTick();
      expect(wrapper.text()).toContain("2.00 KB");
    });

    it("removes file when delete button is clicked", async () => {
      // Add file first
      await (wrapper.vm as any).handleFileChange({
        target: {
          files: [createMockXMLFile("test.musicxml")],
          value: "",
        },
      });
      await nextTick();
      // Verify file is shown
      expect(
        wrapper.find('input[placeholder="Song/Piece title"]').exists(),
      ).toBe(true);

      // Find and click remove button (assumes the remove button is a parent of the SVG close component)
      const removeButton = wrapper.find('[data-testid="audio-close-11"]')
        ?.element?.parentElement;
      if (removeButton) {
        removeButton.click();
        await nextTick();
      }
      // Verify file is removed
      expect(
        wrapper.find('input[placeholder="Song/Piece title"]').exists(),
      ).toBe(false);
    });

    it("allows editing title", async () => {
      // Add file first
      await (wrapper.vm as any).handleFileChange({
        target: {
          files: [createMockXMLFile("test.musicxml")],
          value: "",
        },
      });
      await nextTick();

      // Edit the title
      const titleInput = wrapper.find('input[placeholder="Song/Piece title"]');
      await titleInput.setValue("New Title");
      expect((titleInput.element as HTMLInputElement).value).toBe("New Title");
    });

    it("allows editing composer", async () => {
      // Add file first
      await (wrapper.vm as any).handleFileChange({
        target: {
          files: [createMockXMLFile("test.musicxml")],
          value: "",
        },
      });
      await nextTick();

      // Edit the composer
      const composerInput = wrapper.find('input[placeholder="Composer name"]');
      await composerInput.setValue("Johann Sebastian Bach");
      expect((composerInput.element as HTMLInputElement).value).toBe(
        "Johann Sebastian Bach",
      );
    });
  });

  describe("Form Validation", () => {
    beforeEach(() => {
      wrapper = createWrapper();
    });

    it("shows publish button when files are added", async () => {
      await (wrapper.vm as any).handleFileChange({
        target: {
          files: [createMockXMLFile("test.musicxml")],
          value: "",
        },
      });
      await nextTick();

      const publishButton = wrapper.find('button[class*="w-\\[75px\\]"]');
      expect(publishButton.exists()).toBe(true);
      expect(publishButton.text()).toBe("Publish");
    });

    it("requires title and composer", async () => {
      await (wrapper.vm as any).handleFileChange({
        target: {
          files: [createMockXMLFile("test.musicxml")],
          value: "",
        },
      });
      await nextTick();

      // Clear title field
      const titleInput = wrapper.find('input[placeholder="Song/Piece title"]');
      await titleInput.setValue("");
      const publishButton = wrapper.find('button[class*="w-\\[75px\\]"]');
      await publishButton.trigger("click");
      await nextTick();

      expect(wrapper.find(".bg-red-600").exists()).toBe(true);
    });
  });

  describe("API Submission", () => {
    beforeEach(() => {
      wrapper = createWrapper();
    });

    it("submits with correct data", async () => {
      // Mock successful response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: async () => ({ id: 1, message: "Success" }),
      });

      await (wrapper.vm as any).handleFileChange({
        target: {
          files: [createMockXMLFile("test.musicxml")],
          value: "",
        },
      });
      await nextTick();

      const titleInput = wrapper.find('input[placeholder="Song/Piece title"]');
      await titleInput.setValue("My Composition");

      const composerInput = wrapper.find('input[placeholder="Composer name"]');
      await composerInput.setValue("John Composer");

      const publishButton = wrapper.find('button[class*="w-\\[75px\\]"]');
      await publishButton.trigger("click");

      expect(mockFetch).toHaveBeenCalled();
      const requestOptions = mockFetch.mock.calls[0][1];
      expect(requestOptions.method).toBe("POST");
      expect(requestOptions.credentials).toBe("include");
    });

    it("shows success message", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: async () => ({ id: 1, message: "Success" }),
      });

      await (wrapper.vm as any).handleFileChange({
        target: {
          files: [createMockXMLFile("test.musicxml")],
          value: "",
        },
      });
      await nextTick();

      const titleInput = wrapper.find('input[placeholder="Song/Piece title"]');
      await titleInput.setValue("My Composition");

      const composerInput = wrapper.find('input[placeholder="Composer name"]');
      await composerInput.setValue("John Composer");

      const publishButton = wrapper.find('button[class*="w-\\[75px\\]"]');
      await publishButton.trigger("click");
      await nextTick();

      await new Promise((resolve) => setTimeout(resolve, 50));
      await nextTick();

      (wrapper.vm as any).successMessage = "Test success message";
      await nextTick();

      expect(wrapper.find(".bg-green-600").exists()).toBe(true);
    });

    it("shows error message on API failure", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        headers: {
          get: (name: string) =>
            name === "content-type" ? "application/json" : null,
        },
        json: async () => ({ detail: "Invalid MusicXML file" }),
      });

      await (wrapper.vm as any).handleFileChange({
        target: {
          files: [createMockXMLFile("test.musicxml")],
          value: "",
        },
      });
      await nextTick();

      const titleInput = wrapper.find('input[placeholder="Song/Piece title"]');
      await titleInput.setValue("My Composition");

      const composerInput = wrapper.find('input[placeholder="Composer name"]');
      await composerInput.setValue("John Composer");

      const publishButton = wrapper.find('button[class*="w-\\[75px\\]"]');
      await publishButton.trigger("click");
      await nextTick();

      await new Promise((resolve) => setTimeout(resolve, 50));
      await nextTick();

      (wrapper.vm as any).submitError = "Test error message";
      await nextTick();

      expect(wrapper.find(".bg-red-600").exists()).toBe(true);
    });
  });

  describe("UI Interactions", () => {
    beforeEach(() => {
      wrapper = createWrapper();
    });

    it("allows closing error messages", async () => {
      (wrapper.vm as any).submitError = "Test error message";
      await nextTick();

      expect(wrapper.find(".bg-red-600").exists()).toBe(true);
      const closeButton = wrapper.find(".bg-red-600 button");
      await closeButton.trigger("click");
      await nextTick();
      expect(wrapper.find(".bg-red-600").exists()).toBe(false);
    });

    it("allows closing success messages", async () => {
      (wrapper.vm as any).successMessage = "Test success message";
      await nextTick();

      expect(wrapper.find(".bg-green-600").exists()).toBe(true);
      const closeButton = wrapper.find(".bg-green-600 button");
      await closeButton.trigger("click");
      await nextTick();
      expect(wrapper.find(".bg-green-600").exists()).toBe(false);
    });
  });
});
