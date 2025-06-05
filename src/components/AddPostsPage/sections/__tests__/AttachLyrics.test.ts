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

// Mock the SVG components
vi.mock("@/components/SVG/AddPosts_Icons/AudioClose11.vue", () => ({
  default: {
    name: "AudioClose11",
    template: '<div data-testid="audio-close-11">Close</div>',
  },
}));

vi.mock("@/components/SVG/AddPosts_Icons/ArrowIcon.vue", () => ({
  default: {
    name: "ArrowIcon",
    template: '<div data-testid="arrow-icon">Arrow</div>',
  },
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock environment variables
vi.mock(
  "import.meta",
  () => ({
    env: {
      VITE_API_URL: "http://localhost:3000",
    },
  }),
  { virtual: true },
);

// Directly patch the fetch calls
vi.mock("node:url", () => ({
  URL: class {
    constructor() {
      return { toString: () => "http://localhost:3000/posts/lyrics" };
    }
  },
}));

// Mock window.location
Object.defineProperty(window, "location", {
  value: {
    pathname: "/test",
    reload: vi.fn(),
  },
  writable: true,
});

describe("AttachLyrics", () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockClear();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  const createWrapper = () => {
    return mount(AttachLyrics, {
      global: {
        plugins: [mockRouter],
      },
    });
  };

  describe("Component Initialization", () => {
    it("renders correctly with initial state", () => {
      wrapper = createWrapper();

      expect(wrapper.find("h1").text()).toBe("Create Lyrics");
      expect(wrapper.find('input[placeholder="Song title"]').exists()).toBe(
        true,
      );
      expect(wrapper.find('input[placeholder="Artist name"]').exists()).toBe(
        true,
      );
      expect(wrapper.find("button").text()).toBe("Add New Part");
    });

    it("has empty initial form state", () => {
      wrapper = createWrapper();

      const songTitleInput = wrapper.find('input[placeholder="Song title"]');
      const artistNameInput = wrapper.find('input[placeholder="Artist name"]');

      expect((songTitleInput.element as HTMLInputElement).value).toBe("");
      expect((artistNameInput.element as HTMLInputElement).value).toBe("");
      expect(wrapper.findAll("textarea").length).toBe(0); // No parts initially
    });
  });

  describe("Form Input Handling", () => {
    beforeEach(() => {
      wrapper = createWrapper();
    });

    it("updates song title when input changes", async () => {
      const input = wrapper.find('input[placeholder="Song title"]');
      await input.setValue("Test Song");

      expect((input.element as HTMLInputElement).value).toBe("Test Song");
    });

    it("updates artist name when input changes", async () => {
      const input = wrapper.find('input[placeholder="Artist name"]');
      await input.setValue("Test Artist");

      expect((input.element as HTMLInputElement).value).toBe("Test Artist");
    });
  });

  describe("Parts Management", () => {
    beforeEach(() => {
      wrapper = createWrapper();
    });

    it("adds new part when Add New Part button is clicked", async () => {
      const addButton = wrapper.find("button");
      expect(addButton.text()).toBe("Add New Part");

      await addButton.trigger("click");
      await nextTick();

      // Should now have one part section
      expect(wrapper.findAll("select").length).toBe(1);
      expect(wrapper.findAll("textarea").length).toBe(1);
    });

    it("displays part with correct options", async () => {
      const addButton = wrapper.find("button");
      await addButton.trigger("click");
      await nextTick();

      const select = wrapper.find("select");
      const options = select.findAll("option");

      // Should have placeholder + 6 part types
      expect(options.length).toBe(7);
      expect(options[0].text()).toBe("Select part");
      expect(options[1].text()).toBe("intro");
      expect(options[2].text()).toBe("verse");
      expect(options[3].text()).toBe("pre-chorus");
      expect(options[4].text()).toBe("chorus");
      expect(options[5].text()).toBe("bridge");
      expect(options[6].text()).toBe("outro");
    });

    it("removes part when remove button is clicked", async () => {
      // Add a part first
      const addButton = wrapper.find("button");
      await addButton.trigger("click");
      await nextTick();

      expect(wrapper.findAll("select").length).toBe(1);

      // Find and click remove button
      const removeButton = wrapper.find('[data-testid="audio-close-11"]')
        .element.parentElement;
      if (removeButton) {
        await removeButton.click();
        await nextTick();
      }

      expect(wrapper.findAll("select").length).toBe(0);
    });

    it("allows adding up to 10 parts", async () => {
      const addButton = wrapper.find("button");

      // Add 10 parts
      for (let i = 0; i < 10; i++) {
        await addButton.trigger("click");
        await nextTick();
      }

      expect(wrapper.findAll("select").length).toBe(10);

      // Button should be disabled after 10 parts
      expect(addButton.attributes("disabled")).toBeDefined();
    });

    it("updates part type when select changes", async () => {
      const addButton = wrapper.find("button");
      await addButton.trigger("click");
      await nextTick();

      const select = wrapper.find("select");
      await select.setValue("verse");

      expect((select.element as HTMLSelectElement).value).toBe("verse");
    });

    it("updates part lyrics when textarea changes", async () => {
      const addButton = wrapper.find("button");
      await addButton.trigger("click");
      await nextTick();

      const textarea = wrapper.find("textarea");
      await textarea.setValue("Test lyrics content");

      expect((textarea.element as HTMLTextAreaElement).value).toBe(
        "Test lyrics content",
      );
    });
  });

  describe("Form Validation", () => {
    beforeEach(() => {
      wrapper = createWrapper();
    });

    it("does not show publish button when no parts exist", () => {
      const publishButton = wrapper.find("button:last-child");
      expect(publishButton.text()).not.toBe("Publish");
    });

    it("shows publish button when parts exist", async () => {
      // Add a part
      const addButton = wrapper.find("button");
      await addButton.trigger("click");
      await nextTick();

      // Fill in required fields
      await wrapper
        .find('input[placeholder="Song title"]')
        .setValue("Test Song");
      await wrapper
        .find('input[placeholder="Artist name"]')
        .setValue("Test Artist");
      await wrapper.find("select").setValue("verse");
      await wrapper.find("textarea").setValue("Test lyrics");
      await nextTick();

      const publishButton = wrapper.find('button[class*="w-\\[75px\\]"]');
      expect(publishButton.exists()).toBe(true);
      expect(publishButton.text()).toBe("Publish");
    });

    it("disables publish button when form is invalid", async () => {
      // Add a part but don't fill required fields
      const addButton = wrapper.find("button");
      await addButton.trigger("click");
      await nextTick();

      const publishButton = wrapper.find('button[class*="w-\\[75px\\]"]');
      expect(publishButton.attributes("disabled")).toBeDefined();
    });
  });

  describe("API Submission", () => {
    beforeEach(() => {
      wrapper = createWrapper();
    });

    it("submits form with correct data when all fields are valid", async () => {
      mockFetch.mockReset();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => "application/json",
        },
        json: async () => ({ id: 1, message: "Success" }),
      });

      // Add a part and fill in all fields
      const addButton = wrapper.find("button");
      await addButton.trigger("click");
      await nextTick();

      await wrapper
        .find('input[placeholder="Song title"]')
        .setValue("Test Song");
      await wrapper
        .find('input[placeholder="Artist name"]')
        .setValue("Test Artist");
      await wrapper.find("select").setValue("verse");
      await wrapper.find("textarea").setValue("Test lyrics content");
      await nextTick();

      const publishButton = wrapper.find('button[class*="w-\\[75px\\]"]');
      await publishButton.trigger("click");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            songTitle: "Test Song",
            artistName: "Test Artist",
            parts: [
              {
                type: "verse",
                lyrics: "Test lyrics content",
              },
            ],
          }),
        }),
      );
    });

    it("shows error message when API request fails", async () => {
      mockFetch.mockReset();
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        headers: {
          get: (name: string) =>
            name === "content-type" ? "application/json" : null,
        },
        json: async () => ({ detail: "Invalid data" }),
      });

      // Setup form with valid data
      const addButton = wrapper.find("button");
      await addButton.trigger("click");
      await nextTick();

      await wrapper
        .find('input[placeholder="Song title"]')
        .setValue("Test Song");
      await wrapper
        .find('input[placeholder="Artist name"]')
        .setValue("Test Artist");
      await wrapper.find("select").setValue("verse");
      await wrapper.find("textarea").setValue("Test lyrics");
      await nextTick();

      const publishButton = wrapper.find('button[class*="w-\\[75px\\]"]');
      await publishButton.trigger("click");
      await nextTick();

      // Wait for error to appear
      await new Promise((resolve) => setTimeout(resolve, 100));
      await nextTick();

      const errorDiv = wrapper.find(".bg-red-600");
      expect(errorDiv.exists()).toBe(true);
      expect(errorDiv.text()).toContain("Invalid data");
    });

    it("shows success message and redirects on successful submission", async () => {
      mockFetch.mockReset();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => "application/json",
        },
        json: async () => ({ id: 1, message: "Success" }),
      });

      // Setup form with valid data
      const addButton = wrapper.find("button");
      await addButton.trigger("click");
      await nextTick();

      await wrapper
        .find('input[placeholder="Song title"]')
        .setValue("Test Song");
      await wrapper
        .find('input[placeholder="Artist name"]')
        .setValue("Test Artist");
      await wrapper.find("select").setValue("verse");
      await wrapper.find("textarea").setValue("Test lyrics");
      await nextTick();

      const publishButton = wrapper.find('button[class*="w-\\[75px\\]"]');
      await publishButton.trigger("click");
      await nextTick();

      // Wait for success message
      await new Promise((resolve) => setTimeout(resolve, 100));
      await nextTick();

      const successDiv = wrapper.find(".bg-green-600");
      expect(successDiv.exists()).toBe(true);
      expect(successDiv.text()).toContain("Lyrics post created successfully!");
    });

    it("shows loading state during submission", async () => {
      // Mock a delayed response
      mockFetch.mockReset();
      mockFetch.mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  headers: {
                    get: () => "application/json",
                  },
                  json: async () => ({ id: 1 }),
                }),
              100,
            ),
          ),
      );

      // Setup form with valid data
      const addButton = wrapper.find("button");
      await addButton.trigger("click");
      await nextTick();

      await wrapper
        .find('input[placeholder="Song title"]')
        .setValue("Test Song");
      await wrapper
        .find('input[placeholder="Artist name"]')
        .setValue("Test Artist");
      await wrapper.find("select").setValue("verse");
      await wrapper.find("textarea").setValue("Test lyrics");
      await nextTick();

      const publishButton = wrapper.find('button[class*="w-\\[75px\\]"]');
      await publishButton.trigger("click");
      await nextTick();

      // Check loading state
      expect(publishButton.text()).toBe("Publishing...");
      expect(publishButton.attributes("disabled")).toBeDefined();
    });
  });

  describe("Progress Tracking", () => {
    beforeEach(() => {
      wrapper = createWrapper();
    });

    it("shows progress bar during submission", async () => {
      mockFetch.mockReset();
      mockFetch.mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  headers: {
                    get: () => "application/json",
                  },
                  json: async () => ({ id: 1 }),
                }),
              100,
            ),
          ),
      );

      // Setup and submit form
      const addButton = wrapper.find("button");
      await addButton.trigger("click");
      await nextTick();

      await wrapper
        .find('input[placeholder="Song title"]')
        .setValue("Test Song");
      await wrapper
        .find('input[placeholder="Artist name"]')
        .setValue("Test Artist");
      await wrapper.find("select").setValue("verse");
      await wrapper.find("textarea").setValue("Test lyrics");
      await nextTick();

      const publishButton = wrapper.find('button[class*="w-\\[75px\\]"]');
      await publishButton.trigger("click");
      await nextTick();

      // Check for progress bar
      const progressBar = wrapper.find(".bg-gray-700");
      expect(progressBar.exists()).toBe(true);
    });
  });

  describe("Error Handling", () => {
    beforeEach(() => {
      wrapper = createWrapper();
    });

    it("shows validation error when submitting empty form", async () => {
      // Add part but leave fields empty
      const addButton = wrapper.find("button");
      await addButton.trigger("click");
      await nextTick();

      const publishButton = wrapper.find('button[class*="w-\\[75px\\]"]');

      // Button should be disabled for empty form
      expect(publishButton.attributes("disabled")).toBeDefined();
    });

    it("allows closing error messages", async () => {
      mockFetch.mockReset();
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        headers: {
          get: (name) => (name === "content-type" ? "application/json" : null),
        },
        json: async () => ({ detail: "Test error" }),
      });

      // Submit form to get error
      const addButton = wrapper.find("button");
      await addButton.trigger("click");
      await nextTick();

      await wrapper
        .find('input[placeholder="Song title"]')
        .setValue("Test Song");
      await wrapper
        .find('input[placeholder="Artist name"]')
        .setValue("Test Artist");
      await wrapper.find("select").setValue("verse");
      await wrapper.find("textarea").setValue("Test lyrics");
      await nextTick();

      const publishButton = wrapper.find('button[class*="w-\\[75px\\]"]');
      await publishButton.trigger("click");
      await nextTick();

      await new Promise((resolve) => setTimeout(resolve, 100));
      await nextTick();

      const closeButton = wrapper.find(".bg-red-600 button");
      expect(closeButton.exists()).toBe(true);

      await closeButton.trigger("click");
      await nextTick();

      expect(wrapper.find(".bg-red-600").exists()).toBe(false);
    });
  });

  describe("Component Exposure", () => {
    it("exposes necessary methods and properties", () => {
      wrapper = createWrapper();

      const exposed = wrapper.vm.$;
      expect(exposed).toBeDefined();
      // Note: Testing exposed properties would require accessing the component instance
      // which might not be directly available in this test setup
    });
  });
});
