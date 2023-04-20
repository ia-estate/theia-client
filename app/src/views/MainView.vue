<script lang="ts">
import { defineComponent } from "vue";
import NavbarComp from "../components/NavbarComp.vue";
import AvatarComp from "../components/AvatarComp.vue";
import ChatComp from "../components/ChatComp.vue";
import MenuComp from "../components/MenuComp.vue";
import FooterComp from "../components/FooterComp.vue";
import RealEstateComp from "@/components/RealEstateComp.vue";
import useStore from "../services/store";
// import VoiceRec from "../services/voiceRec";

export default defineComponent({
  components: {
    RealEstateComp,
    NavbarComp,
    AvatarComp,
    ChatComp,
    MenuComp,
    FooterComp,
  },
  setup() {
    const store = useStore();
    return {
      store,
    };
  },
});
</script>
<template>
  <div class="w-full h-screen" :class="store.dark ? 'bg-black' : 'bg-white'">
    <NavbarComp />
    <AvatarComp />
    <RealEstateComp id="realestate" />
    <ChatComp />
    <MenuComp />
    <FooterComp />
  </div>
</template>
<style scoped>
#realestate {
  z-index: 9999 !important;
}
</style>
