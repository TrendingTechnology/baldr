import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import App from "@/components/app/App.vue";
import Home from "@/components/app/Home.vue";
import AudioDemonstration from "@/components/app/AudioDemonstration.vue";
import VideoDemonstration from "@/components/app/VideoDemonstration.vue";

Vue.config.productionTip = false;

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    component: Home,
  },  {
    path: "/audio",
    component: AudioDemonstration,
  },  {
    path: "/Video",
    component: VideoDemonstration,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
