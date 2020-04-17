import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Test from "./views/test.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "test",
      component: Home
    },{
      path: "/test",
      name: "test",
      component: Test
    },
  ]
});
