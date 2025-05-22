import { describe, it, expect, beforeEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import LyricsComponent from "./AttachLyrics.vue"; // твій шлях до компонента

describe("LyricsComponent", () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(LyricsComponent);
  });

  it("початково parts пустий", () => {
    expect(wrapper.vm.parts).toHaveLength(0);
  });

  it("addNewPart додає нову частину", async () => {
    wrapper.vm.addNewPart();
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.parts).toHaveLength(1);
    expect(wrapper.vm.parts[0]).toEqual({ type: "", lyrics: "" });
  });

  it("removePart видаляє частину за індексом", async () => {
    wrapper.vm.addNewPart();
    wrapper.vm.addNewPart();
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.parts).toHaveLength(2);

    wrapper.vm.removePart(0);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.parts).toHaveLength(1);
  });

  it("canAddPart повертає false, якщо частин >= 10", async () => {
    for (let i = 0; i < 10; i++) {
      wrapper.vm.addNewPart();
    }
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.parts).toHaveLength(10);
    expect(wrapper.vm.canAddPart).toBe(false);
  });

  it("canSubmit повертає true, якщо всі поля заповнені", () => {
    wrapper.vm.songTitle = "My Song";
    wrapper.vm.artistName = "Some Artist";
    wrapper.vm.parts = [
      { type: "verse", lyrics: "Some lyrics" },
      { type: "chorus", lyrics: "Some chorus" },
    ];

    expect(wrapper.vm.canSubmit).toBe(true);
  });

  it("canSubmit повертає false, якщо є порожні поля", () => {
    wrapper.vm.songTitle = "My Song";
    wrapper.vm.artistName = "";
    wrapper.vm.parts = [{ type: "verse", lyrics: "Some lyrics" }];

    expect(wrapper.vm.canSubmit).toBe(false);

    wrapper.vm.artistName = "Artist";
    wrapper.vm.parts = [{ type: "", lyrics: "Lyrics" }];
    expect(wrapper.vm.canSubmit).toBe(false);

    wrapper.vm.parts = [{ type: "verse", lyrics: "" }];
    expect(wrapper.vm.canSubmit).toBe(false);
  });
});
