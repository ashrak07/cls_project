<template>
  <v-app>
    <v-navigation-drawer app color="blue-grey-darken-4" dark width="280">
      <div class="px-3 py-4 text-gray-200 text-lg font-semibold">COLOSSAL</div>
      <v-divider class="mb-2" />

      <v-list density="compact" nav>
        <v-list-group v-model="groupVendeur" prepend-icon="mdi-account-tie">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              title="Vendeur"
              :active="activeGroup === 'vendeur'"
              active-color="primary"
            />
          </template>
          <v-list-item
            :active="selected === 'vendeur-ajout'"
            active-color="primary"
            @click="select('vendeur-ajout')"
            prepend-icon="mdi-plus"
            title="Ajout"
          />
          <v-list-item
            :active="selected === 'vendeur-liste'"
            active-color="primary"
            @click="select('vendeur-liste')"
            prepend-icon="mdi-format-list-bulleted"
            title="Liste"
          />
        </v-list-group>

        <v-list-group v-model="groupProduit" prepend-icon="mdi-package-variant">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              title="Produit"
              :active="activeGroup === 'produit'"
              active-color="primary"
            />
          </template>
          <v-list-item
            :active="selected === 'produit-ajout'"
            active-color="primary"
            @click="select('produit-ajout')"
            prepend-icon="mdi-plus"
            title="Ajout"
          />
          <v-list-item
            :active="selected === 'produit-liste'"
            active-color="primary"
            @click="select('produit-liste')"
            prepend-icon="mdi-format-list-bulleted"
            title="Liste"
          />
        </v-list-group>

        <v-list-group v-model="groupClient" prepend-icon="mdi-account-group">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              title="Client"
              :active="activeGroup === 'client'"
              active-color="primary"
            />
          </template>
          <v-list-item
            :active="selected === 'client-ajout'"
            active-color="primary"
            @click="select('client-ajout')"
            prepend-icon="mdi-plus"
            title="Ajout"
          />
          <v-list-item
            :active="selected === 'client-liste'"
            active-color="primary"
            @click="select('client-liste')"
            prepend-icon="mdi-format-list-bulleted"
            title="Liste"
          />
        </v-list-group>

        <v-list-group v-model="groupCommande" prepend-icon="mdi-cart-outline">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              title="Commande"
              :active="activeGroup === 'commande'"
              active-color="primary"
            />
          </template>
          <v-list-item
            :active="selected === 'commande-creer'"
            active-color="primary"
            @click="select('commande-creer')"
            prepend-icon="mdi-plus"
            title="Créer"
          />
          <v-list-item
            :active="selected === 'commande-liste'"
            active-color="primary"
            @click="select('commande-liste')"
            prepend-icon="mdi-format-list-bulleted"
            title="Liste"
          />
        </v-list-group>

        <v-list-group v-model="groupArrivee" prepend-icon="mdi-truck-fast">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              title="Arrivée commande"
              :active="activeGroup === 'arrivee'"
              active-color="primary"
            />
          </template>
          <v-list-item
            :active="selected === 'arrivee-creer'"
            active-color="primary"
            @click="select('arrivee-creer')"
            prepend-icon="mdi-plus"
            title="Créer"
          />
          <v-list-item
            :active="selected === 'arrivee-liste'"
            active-color="primary"
            @click="select('arrivee-liste')"
            prepend-icon="mdi-format-list-bulleted"
            title="Liste"
          />
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-main class="bg-grey-lighten-4">
      <v-container fluid>
        <v-breadcrumbs :items="breadcrumbs" class="mb-4" />
        <component :is="currentComponent" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from "vue";
import AddSeller from "./vendeur/AddSeller.vue";
import ListSeller from "./vendeur/ListSeller.vue";
import AddProduct from "./Produit/AddProduct.vue";
import ProductList from "./Produit/ProductList.vue";
import AddCustomer from "./Client/AddCustomer.vue";
import CustomerList from "./Client/CustomerList.vue";
import AddOrder from "./Commandes/AddOrder.vue";
import OrderList from "./Commandes/OrderList.vue";
import AddArrivalOrder from "./ArriveeCommande/AddArrivalOrder.vue";
import ListArrivalOrder from "./ArriveeCommande/ListArrivalOrder.vue";

const activeGroup = ref("vendeur");
const groupModel = (name) =>
  computed({
    get: () => activeGroup.value === name,
    set: (val) => {
      // Accordéon strict: toujours un groupe ouvert
      if (val) {
        activeGroup.value = name;
      } else if (activeGroup.value !== name) {
        // si on tente de fermer un autre groupe, on ignore
        return;
      } else {
        // empêcher l'état "tous fermés": on reste ouvert
        activeGroup.value = name;
      }
    },
  });
const groupVendeur = groupModel("vendeur");
const groupProduit = groupModel("produit");
const groupClient = groupModel("client");
const groupCommande = groupModel("commande");
const groupArrivee = groupModel("arrivee");

const selected = ref("vendeur-ajout");

const groupOf = (key) => {
  if (key.startsWith("vendeur-")) return "vendeur";
  if (key.startsWith("produit-")) return "produit";
  if (key.startsWith("client-")) return "client";
  if (key.startsWith("commande-")) return "commande";
  if (key.startsWith("arrivee-")) return "arrivee";
  return "";
};

const select = (key) => {
  console.log("key =>", key);
  selected.value = key;
  const grp = groupOf(key);
  console.log("grp =>", grp);
  if (grp) activeGroup.value = grp;
};

// v-list-group exclusif: géré par activeGroup + groupModel

const breadcrumbs = computed(() => {
  const map = {
    "vendeur-ajout": ["Vendeur", "Ajout"],
    "vendeur-liste": ["Vendeur", "Liste"],
    "produit-ajout": ["Produit", "Ajout"],
    "produit-liste": ["Produit", "Liste"],
    "client-ajout": ["Client", "Ajout"],
    "client-liste": ["Client", "Liste"],
    "commande-creer": ["Commande", "Créer"],
    "commande-liste": ["Commande", "Liste"],
    "arrivee-creer": ["Arrivée", "Créer"],
    "arrivee-liste": ["Arrivée", "Liste"],
  };
  const parts = map[selected.value] || [];
  return [{ title: "Accueil" }, ...parts.map((p) => ({ title: p }))];
});

const currentComponent = computed(() => {
  switch (selected.value) {
    case "vendeur-ajout":
      return AddSeller;
    case "vendeur-liste":
      return ListSeller;
    case "produit-ajout":
      return AddProduct;
    case "produit-liste":
      return ProductList;
    case "client-ajout":
      return AddCustomer;
    case "client-liste":
      return CustomerList;
    case "commande-creer":
      return AddOrder;
    case "commande-liste":
      return OrderList;
    case "arrivee-creer":
      return AddArrivalOrder;
    case "arrivee-liste":
      return ListArrivalOrder;
    default:
      return {
        template:
          '<div class="text-medium-emphasis">Sélectionnez une action dans le menu.</div>',
      };
  }
});
</script>

<style scoped>
.v-list-item {
  transition: background-color 0.2s ease;
}

/* Accentue l'élément actif dans le drawer sombre */
.v-list-item--active {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
