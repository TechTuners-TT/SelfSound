import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import YourComponent from "./AttachMediaSection.vue"; // заміни на правильний шлях

describe("YourComponent", () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(YourComponent, {
      attachTo: document.body,
    });
  });

  it("triggerFileInput клікає на input якщо менше 5 файлів", async () => {
    const fileInput = wrapper.find('input[type="file"]');
    const clickSpy = vi.spyOn(fileInput.element as HTMLInputElement, "click");

    // Спочатку files пустий, можна клікати
    await wrapper.vm.triggerFileInput();
    expect(clickSpy).toHaveBeenCalled();

    // Заповнюємо files до 5
    wrapper.vm.files = Array(5).fill({
      preview: "url",
      file: new File([], "test.png"),
      type: "image/png",
    });
    await wrapper.vm.$nextTick();

    // Тепер click не має викликатися, бо файлів вже 5
    clickSpy.mockReset();
    await wrapper.vm.triggerFileInput();
    expect(clickSpy).not.toHaveBeenCalled();
  });

  it("removeFile видаляє файл за індексом", async () => {
    wrapper.vm.files = [
      { preview: "url1", file: new File([], "f1.png"), type: "image/png" },
      { preview: "url2", file: new File([], "f2.png"), type: "image/png" },
    ];
    await wrapper.vm.$nextTick();

    wrapper.vm.removeFile(0);

    expect(wrapper.vm.files.length).toBe(1);
    expect(wrapper.vm.files[0].preview).toBe("url2");
  });

  it("submitPost виводить файли в консоль", () => {
    wrapper.vm.files = [
      { preview: "url", file: new File([], "test.png"), type: "image/png" },
    ];

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    wrapper.vm.submitPost();

    expect(consoleSpy).toHaveBeenCalledWith(
      "Submitting post with files:",
      wrapper.vm.files,
    );

    consoleSpy.mockRestore();
  });
});
