import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import AttachMusicXML from "./AttachMusicXML.vue";

// ———————————————————————————————————————
//  Моки для браузерних API, яких немає у Node
// ———————————————————————————————————————
beforeAll(() => {
  global.URL.createObjectURL = vi.fn((file: File) => `blob:${file.name}`);
  vi.spyOn(window, "open").mockImplementation(() => null);
});

describe("AttachMusicXML", () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(AttachMusicXML, {
      attachTo: document.body,
    });
  });

  it("початково files порожній", () => {
    expect(wrapper.vm.files).toHaveLength(0);
  });

  it("triggerFileInput клікає на input", async () => {
    const input = wrapper.find('input[type="file"]');
    const clickSpy = vi.spyOn(input.element as HTMLInputElement, "click");

    await wrapper.vm.triggerFileInput();

    expect(clickSpy).toHaveBeenCalled();
  });

  it("handleFileChange додає коректні файли й створює preview", async () => {
    const xmlFile = new File(["<xml/>"], "score.musicxml", {
      type: "application/xml",
    });

    const event = {
      target: { files: [xmlFile] },
    } as unknown as Event;

    await wrapper.vm.handleFileChange(event);

    expect(wrapper.vm.files.length).toBe(1);
    expect(wrapper.vm.files[0].file).toBe(xmlFile);
    expect(wrapper.vm.files[0].preview).toBe(`blob:${xmlFile.name}`);
    expect(wrapper.vm.files[0].title).toBe("score");
  });

  it("handleFileChange відхиляє не-MusicXML та не додає їх", async () => {
    vi.spyOn(window, "alert").mockImplementation(() => {});

    const txtFile = new File(["text"], "readme.txt", { type: "text/plain" });

    const event = {
      target: { files: [txtFile] },
    } as unknown as Event;

    await wrapper.vm.handleFileChange(event);

    expect(wrapper.vm.files).toHaveLength(0);
  });

  it("removeFile видаляє файл за індексом", async () => {
    const f1 = new File([], "one.musicxml", { type: "application/xml" });
    const f2 = new File([], "two.musicxml", { type: "application/xml" });

    wrapper.vm.files.push(
      {
        preview: `blob:${f1.name}`,
        file: f1,
        title: "one",
        artist: "",
        avatar: "",
      },
      {
        preview: `blob:${f2.name}`,
        file: f2,
        title: "two",
        artist: "",
        avatar: "",
      },
    );
    await wrapper.vm.$nextTick();

    wrapper.vm.removeFile(0);

    expect(wrapper.vm.files).toHaveLength(1);
    expect(wrapper.vm.files[0].file).toBe(f2);
  });

  it("правильно рахує зайняту памʼять та розмір у КБ", () => {
    const f = new File(["x".repeat(2048)], "big.musicxml", {
      type: "application/xml",
    }); // 2 KB

    wrapper.vm.files.push({
      preview: `blob:${f.name}`,
      file: f,
      title: "big",
      artist: "",
      avatar: "",
    });

    expect(wrapper.vm.getUsedMemoryInBytes()).toBe(2048);
    expect(wrapper.vm.fileSizeInKB(f)).toBe("2.00");
  });

  it("submitPost логує файли у консоль", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    wrapper.vm.files = [
      {
        preview: "blob:test",
        file: new File([], "test.musicxml", { type: "application/xml" }),
        title: "test",
        artist: "",
        avatar: "",
      },
    ];

    wrapper.vm.submitPost();

    expect(logSpy).toHaveBeenCalledWith(
      "Submitting post with files:",
      wrapper.vm.files,
    );

    logSpy.mockRestore();
  });

  it("openFile відкриває нову вкладку", () => {
    const url = "blob:test";
    wrapper.vm.openFile(url);

    expect(window.open).toHaveBeenCalledWith(url, "_blank");
  });
});
