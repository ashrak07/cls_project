<template>
  <v-container class="py-6">
    <v-card elevation="3">
      <v-card-title class="text-h6">Liste des Produits</v-card-title>

      <v-data-table
        :headers="headers"
        :items="produits"
        :search="search"
        item-key="id"
        class="elevation-1"
        density="compact"
        :items-per-page="8"
      >
        <template #top>
          <div class="px-4 py-3 d-flex align-center" style="gap: 12px">
            <v-text-field
              v-model="search"
              label="Rechercher"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              hide-details
              clearable
              class="flex-grow-1"
            />
          </div>
          <v-divider></v-divider>
        </template>

        <template #item.prix="{ value }">
          {{ formatMoney(value) }}
        </template>

        <template #item.actif="{ value }">
          <v-chip :color="value ? 'green' : 'grey'" size="small" variant="flat">
            {{ value ? "Actif" : "Inactif" }}
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <v-btn icon color="primary" @click="voirProduit(item)" title="Voir">
            <v-icon icon="mdi-eye"></v-icon>
          </v-btn>
          <v-btn
            icon
            color="orange"
            @click="editerProduit(item)"
            title="Éditer"
          >
            <v-icon icon="mdi-pencil"></v-icon>
          </v-btn>
        </template>

        <template #no-data>
          <div class="px-4 py-8 text-medium-emphasis">Aucune donnée</div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog: Voir -->
    <v-dialog v-model="dialogView" max-width="560">
      <v-card>
        <v-card-title class="text-h6">Détails du produit</v-card-title>
        <v-card-text v-if="selected">
          <div class="mb-1"><strong>Nom:</strong> {{ selected.nom }}</div>
          <div class="mb-1">
            <strong>Catégorie:</strong> {{ selected.categorie }}
          </div>
          <div class="mb-1">
            <strong>Prix:</strong> {{ formatMoney(selected.prix) }}
          </div>
          <div class="mb-1"><strong>Stock:</strong> {{ selected.stock }}</div>
          <div class="mb-1">
            <strong>Actif:</strong> {{ selected.actif ? "Oui" : "Non" }}
          </div>
          <div class="mb-1">
            <strong>Description:</strong> {{ selected.description || "-" }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialogView = false">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog: Éditer -->
    <v-dialog v-model="dialogEdit" max-width="640">
      <v-card>
        <v-card-title class="text-h6">Éditer le produit</v-card-title>
        <v-card-text>
          <v-form ref="editForm" v-model="editValid" lazy-validation>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editProduit.nom"
                  label="Nom"
                  :rules="[rules.required, rules.min2]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="editProduit.categorie"
                  :items="categories"
                  label="Catégorie"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="editProduit.prix"
                  label="Prix"
                  type="number"
                  step="0.01"
                  :rules="[rules.required, rules.positive]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="editProduit.stock"
                  label="Stock"
                  type="number"
                  step="1"
                  :rules="[rules.nonNegativeInt]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="4" class="d-flex align-center">
                <v-switch
                  v-model="editProduit.actif"
                  label="Actif"
                  color="primary"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialogEdit = false">Annuler</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            :disabled="!editValid"
            @click="saveEdit"
            >Enregistrer</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" color="success" timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from "vue";

const categories = ["Électronique", "Vêtements", "Maison", "Sport", "Autre"];

const produits = ref([
  {
    id: 1,
    nom: "Casque Bluetooth",
    categorie: "Électronique",
    prix: 120000,
    stock: 35,
    actif: true,
    description: "Casque sans fil avec réduction de bruit.",
  },
  {
    id: 2,
    nom: "T-shirt coton",
    categorie: "Vêtements",
    prix: 25000,
    stock: 120,
    actif: true,
    description: "100% coton, plusieurs tailles.",
  },
  {
    id: 3,
    nom: "Mixeur",
    categorie: "Maison",
    prix: 95000,
    stock: 18,
    actif: false,
    description: "Puissant et silencieux.",
  },
]);

const headers = [
  { title: "Nom", key: "nom" },
  { title: "Catégorie", key: "categorie" },
  { title: "Prix", key: "prix" },
  { title: "Stock", key: "stock" },
  { title: "Statut", key: "actif" },
  { title: "Actions", key: "actions", sortable: false },
];

const search = ref("");
const snackbar = ref(false);
const snackbarMessage = ref("");

const dialogView = ref(false);
const dialogEdit = ref(false);
const selected = ref(null);

const editForm = ref(null);
const editValid = ref(false);
const editProduit = ref({
  id: null,
  nom: "",
  categorie: "",
  prix: 0,
  stock: 0,
  actif: true,
});

const rules = {
  required: (v) => !!v || "Champ requis",
  min2: (v) => (v && v.length >= 2) || "Au moins 2 caractères",
  positive: (v) => Number(v) > 0 || "Doit être > 0",
  nonNegativeInt: (v) =>
    (Number.isInteger(Number(v)) && Number(v) >= 0) || "Entier ≥ 0",
};

const formatMoney = (val) =>
  (Number(val) || 0)
    .toLocaleString("fr-FR", {
      style: "currency",
      currency: "MGA",
      currencyDisplay: "code",
    })
    .replace("MGA", "Ar");

const voirProduit = (item) => {
  selected.value = item;
  dialogView.value = true;
};

const editerProduit = (item) => {
  editProduit.value = {
    id: item.id,
    nom: item.nom,
    categorie: item.categorie,
    prix: item.prix,
    stock: item.stock,
    actif: item.actif,
  };
  dialogEdit.value = true;
};

const saveEdit = async () => {
  const result = await editForm.value?.validate();
  const isValid = typeof result === "object" ? result.valid : !!result;
  if (!isValid) return;
  const idx = produits.value.findIndex((p) => p.id === editProduit.value.id);
  if (idx !== -1)
    produits.value[idx] = { ...produits.value[idx], ...editProduit.value };
  snackbarMessage.value = "Produit mis à jour";
  snackbar.value = true;
  dialogEdit.value = false;
};
</script>

<style scoped></style>
