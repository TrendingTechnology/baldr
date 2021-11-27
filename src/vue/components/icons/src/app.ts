import Vue from "vue";
import App from "@/components/App.vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "@/components/Home.vue";

Vue.config.productionTip = false;

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
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
