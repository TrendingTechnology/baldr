import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import AudioDemonstration from "@/components/app/AudioDemonstration.vue";

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message";
    const wrapper = shallowMount(AudioDemonstration);
    expect(wrapper.text()).to.include(msg);
  });
});
