import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import "vuetify/styles";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const app = createApp(App);
const vuetify = createVuetify({
  components,
  directives,
});

app.use(createPinia());
app.use(vuetify);
app.mount("#app");
