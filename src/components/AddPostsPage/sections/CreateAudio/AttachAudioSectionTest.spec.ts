import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import AudioUploader from "./AttachAudioSection.vue"; // твій шлях

describe("AudioUploader", () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(AudioUploader, {
      attachTo: document.body,
    });
  });

  it("початково files порожній", () => {
    expect(wrapper.vm.files).toHaveLength(0);
  });

  it("triggerFileInput клікає на input, якщо менше 2 файлів", async () => {
    const input = wrapper.find("input[type=file]");
    const clickSpy = vi.spyOn(input.element as HTMLInputElement, "click");

    // Спочатку файлів 0 — клік повинен бути
    await wrapper.vm.triggerFileInput();
    expect(clickSpy).toHaveBeenCalled();

    // Додаємо 2 файли
    wrapper.vm.files = [
      {
        preview: "url1",
        file: new File([], "one.mp3"),
        type: "audio/mp3",
        title: "One",
        artist: "Artist1",
        avatar: "",
        isPlaying: false,
        currentTime: 0,
        duration: 0,
      },
      {
        preview: "url2",
        file: new File([], "two.mp3"),
        type: "audio/mp3",
        title: "Two",
        artist: "Artist2",
        avatar: "",
        isPlaying: false,
        currentTime: 0,
        duration: 0,
      },
    ];
    await wrapper.vm.$nextTick();

    clickSpy.mockReset();
    await wrapper.vm.triggerFileInput();
    expect(clickSpy).not.toHaveBeenCalled();
  });

  it("removeFile видаляє файл за індексом", async () => {
    wrapper.vm.files.push({
      preview: "url",
      file: new File([], "test.mp3"),
      type: "audio/mp3",
      title: "test",
      artist: "Unknown Artist",
      avatar: "",
      isPlaying: false,
      currentTime: 0,
      duration: 0,
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.files.length).toBe(1);

    wrapper.vm.removeFile(0);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.files.length).toBe(0);
  });

  it("formatTime правильно форматує час", () => {
    expect(wrapper.vm.formatTime(0)).toBe("0:00");
    expect(wrapper.vm.formatTime(65)).toBe("1:05");
    expect(wrapper.vm.formatTime(600)).toBe("10:00");
  });
});
