<template>
  <v-app>
    <v-navigation-drawer app width="280" class="light-drawer" :elevation="0">
      <div class="px-3 py-4 text-slate-800 text-lg font-semibold">-</div>
      <v-divider class="mb-2" />

      <v-list
        density="compact"
        nav
        v-model:opened="openedGroups"
        @update:opened="handleOpenChange"
        class="menu-list"
      >
        <v-list-group value="vendeur" prepend-icon="mdi-account-tie">
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

        <v-list-group value="produit" prepend-icon="mdi-package-variant">
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

        <v-list-group value="client" prepend-icon="mdi-account-group">
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

        <v-list-group value="commande" prepend-icon="mdi-cart-outline">
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
            title="Creer"
          />
          <v-list-item
            :active="selected === 'commande-liste'"
            active-color="primary"
            @click="select('commande-liste')"
            prepend-icon="mdi-format-list-bulleted"
            title="Liste"
          />
        </v-list-group>

        <v-list-group value="arrivee" prepend-icon="mdi-truck-fast">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              title="Arrivee commande"
              :active="activeGroup === 'arrivee'"
              active-color="primary"
            />
          </template>
          <v-list-item
            :active="selected === 'arrivee-creer'"
            active-color="primary"
            @click="select('arrivee-creer')"
            prepend-icon="mdi-plus"
            title="Creer"
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

    <v-main class="main-surface">
      <v-container fluid class="content-shell">
        <div class="content-panel">
          <v-breadcrumbs
            :items="breadcrumbs"
            class="mb-4 themed-breadcrumbs"
          />
          <component :is="currentComponent" @open-add="handleOpenAdd" />
        </div>
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
const openedGroups = ref(["vendeur"]);
const selected = ref("vendeur-ajout");

const setActiveGroup = (name) => {
  activeGroup.value = name;
  openedGroups.value = name ? [name] : [];
};

const handleOpenChange = (open) => {
  const latest = open[open.length - 1] || "";
  setActiveGroup(latest);
};

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
  if (grp) setActiveGroup(grp);
};

// v-list-group exclusif: gere par activeGroup

const handleOpenAdd = (key) => {
  if (key) select(key);
};

const breadcrumbs = computed(() => {
  const map = {
    "vendeur-ajout": ["Vendeur", "Ajout"],
    "vendeur-liste": ["Vendeur", "Liste"],
    "produit-ajout": ["Produit", "Ajout"],
    "produit-liste": ["Produit", "Liste"],
    "client-ajout": ["Client", "Ajout"],
    "client-liste": ["Client", "Liste"],
    "commande-creer": ["Commande", "Creer"],
    "commande-liste": ["Commande", "Liste"],
    "arrivee-creer": ["Arrivee", "Creer"],
    "arrivee-liste": ["Arrivee", "Liste"],
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
          '<div class="text-medium-emphasis">Selectionnez une action dans le menu.</div>',
      };
  }
});
</script>

<style scoped>
.v-list-item {
  transition: background-color 0.2s ease;
}

.light-drawer {
  background: linear-gradient(180deg, #f8fafc 0%, #e7eeff 100%);
  color: #1f2937;
  border-right: 1px solid rgba(31, 41, 55, 0.08);
  backdrop-filter: blur(8px);
}

.light-drawer .v-divider {
  border-color: rgba(31, 41, 55, 0.08);
}

.menu-list .v-list-item-title,
.menu-list .v-list-item-subtitle {
  color: #1f2937;
}

.menu-list .v-list-item {
  border-radius: 10px;
  margin-inline: 10px;
  padding-inline: 12px;
}

.menu-list .v-list-item:hover {
  background-color: rgba(91, 124, 250, 0.08);
}

.menu-list .v-list-item--active {
  background-color: rgba(91, 124, 250, 0.12);
  color: #1f2937;
  box-shadow: 0 6px 20px rgba(91, 124, 250, 0.12);
}

.menu-list .v-list-item--active .v-list-item-title {
  color: #1f2937;
  font-weight: 600;
}

.menu-list .v-list-item__prepend .v-icon {
  color: #5b7cfa;
}

.main-surface {
  background: linear-gradient(180deg, #f7f9fc 0%, #eef2ff 100%);
  color: #111827;
}

.content-shell {
  padding: 28px 32px;
}

.content-panel {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(31, 41, 55, 0.06);
  border-radius: 14px;
  box-shadow: 0 12px 30px rgba(17, 24, 39, 0.08);
  backdrop-filter: blur(6px);
  padding: 20px 22px;
  min-height: calc(100vh - 120px);
}

.themed-breadcrumbs .v-breadcrumbs-item--disabled {
  color: #6b7280;
}

.themed-breadcrumbs .v-breadcrumbs-item:last-child {
  color: #1f2937;
  font-weight: 600;
}

.themed-breadcrumbs .v-breadcrumbs-divider {
  color: rgba(17, 24, 39, 0.35);
}

/* Harmonisation du contenu interne */
:deep(.v-card),
:deep(.v-sheet) {
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(31, 41, 55, 0.06);
  box-shadow: 0 10px 24px rgba(17, 24, 39, 0.06);
  border-radius: 12px;
}

:deep(.v-btn--elevated),
:deep(.v-btn--flat) {
  border-radius: 10px;
  font-weight: 600;
}

:deep(.v-btn--variant-elevated) {
  background: linear-gradient(120deg, #6c8bff 0%, #5b7cfa 100%);
  color: #fff;
  box-shadow: 0 10px 20px rgba(91, 124, 250, 0.25);
}

:deep(.v-btn--variant-outlined) {
  border-color: rgba(91, 124, 250, 0.3);
  color: #334155;
}

:deep(.v-field) {
  border-radius: 10px;
  background: rgba(248, 250, 252, 0.8);
}

:deep(.v-field--focused .v-field__outline) {
  border-color: #5b7cfa;
}

:deep(.v-field__input) {
  color: #0f172a;
}

:deep(.v-table) {
  border: 1px solid rgba(31, 41, 55, 0.06);
  border-radius: 12px;
  overflow: hidden;
}

:deep(.v-table tbody tr:hover) {
  background: rgba(91, 124, 250, 0.05);
}

:deep(.v-table thead tr) {
  background: linear-gradient(120deg, #eef2ff 0%, #e5e9ff 100%);
}

:deep(.v-table thead th) {
  color: #1f2937;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.02em;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(31, 41, 55, 0.08);
}

:deep(.v-table tbody td) {
  color: #111827;
  font-size: 13px;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(31, 41, 55, 0.05);
}

:deep(.v-table tbody tr:nth-child(even)) {
  background-color: rgba(248, 250, 252, 0.8);
}

:deep(.v-table .v-btn--icon) {
  background: #f1f5ff;
  color: #4c63d9;
  border: 1px solid rgba(91, 124, 250, 0.18);
  border-radius: 10px;
  width: 34px;
  height: 34px;
}

:deep(.v-table .v-btn--icon:hover) {
  background: #e4e9ff;
}

:deep(.v-table .v-btn--variant-plain) {
  color: #4c63d9;
}

:deep(.v-table .v-icon) {
  font-size: 18px;
}

:deep(.v-table .v-pagination) {
  padding: 12px;
}

:deep(.v-pagination__item) {
  border-radius: 8px;
}

:deep(.v-pagination__item--is-active) {
  background: linear-gradient(120deg, #6c8bff 0%, #5b7cfa 100%);
  color: #fff;
  box-shadow: 0 8px 20px rgba(91, 124, 250, 0.2);
}

:deep(.action-btn) {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid transparent;
  transition: all 0.18s ease;
  margin-right: 6px;
  margin-block: 4px;
}

:deep(.action-btn .v-icon) {
  font-size: 18px;
}

:deep(.action-btn.view) {
  background: linear-gradient(120deg, #e6eeff 0%, #dce7ff 100%);
  color: #2b3f9e;
  border-color: rgba(60, 87, 207, 0.2);
}

:deep(.action-btn.edit) {
  background: linear-gradient(120deg, #fff4e0 0%, #ffe6c7 100%);
  color: #b45309;
  border-color: rgba(255, 184, 94, 0.4);
}

:deep(.action-btn.delete) {
  background: linear-gradient(120deg, #ffe3e3 0%, #ffd5d5 100%);
  color: #b91c1c;
  border-color: rgba(220, 53, 69, 0.28);
}

:deep(.action-btn:hover) {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(17, 24, 39, 0.08);
}

:deep(.danger-btn) {
  background: linear-gradient(120deg, #f97066 0%, #ef4444 100%);
  color: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 22px rgba(239, 68, 68, 0.28);
}

:deep(.danger-btn:hover) {
  filter: brightness(0.97);
}

:deep(.status-chip) {
  border-radius: 10px;
  font-size: 12px;
  letter-spacing: 0.01em;
  padding-inline: 10px;
}

:deep(.status-chip .v-chip__content) {
  font-weight: 300 !important;
  letter-spacing: 0.01em;
}

:deep(.status-chip.active) {
  background: linear-gradient(120deg, #d9f9e7 0%, #c7f0dc 100%);
  color: #0f5132;
}

:deep(.status-chip.inactive),
:deep(.status-chip.status-default) {
  background: linear-gradient(120deg, #eceff4 0%, #e5e7eb 100%);
  color: #374151;
}

:deep(.status-chip.status-new) {
  background: linear-gradient(120deg, #e1e8ff 0%, #d7e2ff 100%);
  color: #1d4ed8;
}

:deep(.status-chip.status-paid) {
  background: linear-gradient(120deg, #d7f8ef 0%, #c4f1e3 100%);
  color: #0f766e;
}

:deep(.status-chip.status-pending) {
  background: linear-gradient(120deg, #fff4e0 0%, #ffe6c7 100%);
  color: #b45309;
}

:deep(.status-chip.status-cancelled) {
  background: linear-gradient(120deg, #ffe3e3 0%, #ffd5d5 100%);
  color: #b91c1c;
}
</style>
