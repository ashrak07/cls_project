import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/Home.vue";
import AddSeller from "../components/vendeur/AddSeller.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/vendeur/creer",
    name: "vendeur-creer",
    component: AddSeller,
  },
  // Tu peux ajouter d'autres routes ici, ex: /vendeur/liste, /client/creer, ...
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
