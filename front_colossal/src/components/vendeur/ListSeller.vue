<template>
  <v-container class="py-6">
    <v-card elevation="3">
      <v-card-title class="text-h6">Liste des Vendeurs</v-card-title>

      <v-data-table
        :headers="headers"
        :items="vendeurs"
        :search="search"
        item-key="id"
        class="elevation-1"
        density="compact"
        :items-per-page="5"
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
            <v-btn color="primary" variant="flat" @click="goToAdd">
              <v-icon icon="mdi-plus" class="mr-2" />
              Ajouter
            </v-btn>
          </div>
          <v-divider />
        </template>

        <template #item.actions="{ item }">
          <v-btn icon class="action-btn view" @click="voirVendeur(item)" title="Voir">
            <v-icon icon="mdi-eye-outline" />
          </v-btn>
          <v-btn icon class="action-btn edit" @click="modifierVendeur(item)" title="Modifier">
            <v-icon icon="mdi-pencil-outline" />
          </v-btn>
          <v-btn icon class="action-btn delete" @click="supprimerVendeur(item)" title="Supprimer">
            <v-icon icon="mdi-delete-outline" />
          </v-btn>
        </template>

        <template #no-data>
          <div class="px-4 py-8 text-medium-emphasis">Aucune donnee</div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog: Voir -->
    <v-dialog v-model="dialogView" max-width="520">
      <v-card>
        <v-card-title class="text-h6">Details du vendeur</v-card-title>
        <v-card-text v-if="selected">
          <div><strong>Nom:</strong> {{ selected.nom }}</div>
          <div><strong>Adresse:</strong> {{ selected.adresse }}</div>
          <div><strong>CIN:</strong> {{ selected.cin }}</div>
          <div><strong>Telephone:</strong> {{ selected.telephone }}</div>
          <div><strong>Email:</strong> {{ selected.email }}</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialogView = false">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog: Supprimer -->
    <v-dialog v-model="dialogDelete" max-width="460">
      <v-card>
        <v-card-title class="text-h6">Confirmer la suppression</v-card-title>
        <v-card-text>
          Supprimer <strong>{{ selected?.nom }}</strong> ? Cette action est irreversible.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialogDelete = false">Annuler</v-btn>
          <v-btn class="danger-btn" @click="confirmDelete">Supprimer</v-btn>
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

const emit = defineEmits(["open-add"]);

const vendeurs = ref([
  {
    id: 1,
    nom: "Jean",
    adresse: "Antananarivo",
    cin: "AB123456",
    telephone: "+261341234567",
    email: "jean@example.com",
  },
  {
    id: 2,
    nom: "Marie",
    adresse: "Fianarantsoa",
    cin: "CD789012",
    telephone: "+261339876543",
    email: "marie@example.com",
  },
  {
    id: 3,
    nom: "Paul",
    adresse: "Toamasina",
    cin: "EF345678",
    telephone: "+261322345678",
    email: "paul@example.com",
  },
]);

const headers = [
  { title: "Nom", key: "nom" },
  { title: "Adresse", key: "adresse" },
  { title: "CIN", key: "cin" },
  { title: "Telephone", key: "telephone" },
  { title: "Email", key: "email" },
  { title: "Actions", key: "actions", sortable: false },
];

const snackbar = ref(false);
const snackbarMessage = ref("");
const search = ref("");
const dialogView = ref(false);
const dialogDelete = ref(false);
const selected = ref(null);

const goToAdd = () => {
  emit("open-add", "vendeur-ajout");
};

const voirVendeur = (item) => {
  selected.value = item;
  dialogView.value = true;
};

const modifierVendeur = (item) => {
  snackbarMessage.value = `Modifier ${item.nom}`;
  snackbar.value = true;
};

const supprimerVendeur = (item) => {
  selected.value = item;
  dialogDelete.value = true;
};

const confirmDelete = () => {
  if (!selected.value) return;
  vendeurs.value = vendeurs.value.filter((v) => v.id !== selected.value.id);
  snackbarMessage.value = `${selected.value.nom} supprime`;
  snackbar.value = true;
  dialogDelete.value = false;
  selected.value = null;
};
</script>

<style scoped></style>
