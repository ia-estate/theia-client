import "./services/web/registerServiceWorker";
import "./assets/css/tailwind.css";
import "./assets/css/wallets.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { useWorkspace } from "./services/web3/wallets/useWorkspace";
import Notifications from "@kyvg/vue3-notification";
import velocity from "velocity-animate";
import router from "./routes";
import App from "./App.vue";
import store from "./services/store";

useWorkspace(); // Init Solana Wallets
const app = createApp(App);
const pinia = createPinia();
app.provide('store', store);
app.use(pinia).use(router).use(Notifications, { velocity }).mount("#app");
