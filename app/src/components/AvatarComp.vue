<template>
  <div class="z-40 fixed">
    <LiquidBody :key="store.rerenderKey" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import LiquidBody from "./modules/avatars/liquid/LiquidBody.vue";
// import LiquidTalk from "./modules/avatars/liquid/LiquidTalk.vue";
import useStore from "../services/store";

export default defineComponent({
  components: { LiquidBody },
  setup() {
    const store = useStore();

    return {
      store,
    };
  },
});
</script>
