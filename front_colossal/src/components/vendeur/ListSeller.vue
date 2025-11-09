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
          <v-divider></v-divider>
        </template>

        <!-- Colonnes actions -->
        <template #item.actions="{ item }">
          <v-btn icon color="primary" @click="voirVendeur(item)" title="Voir">
            <v-icon icon="mdi-eye"></v-icon>
          </v-btn>
          <v-btn icon color="orange" @click="modifierVendeur(item)" title="Modifier">
            <v-icon icon="mdi-pencil"></v-icon>
          </v-btn>
          <v-btn icon color="red" @click="supprimerVendeur(item)" title="Supprimer">
            <v-icon icon="mdi-delete"></v-icon>
          </v-btn>
        </template>

        <template #no-data>
          <div class="px-4 py-8 text-medium-emphasis">Aucune donnée</div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog: Voir -->
    <v-dialog v-model="dialogView" max-width="520">
      <v-card>
        <v-card-title class="text-h6">Détails du vendeur</v-card-title>
        <v-card-text v-if="selected">
          <div><strong>Nom:</strong> {{ selected.nom }}</div>
          <div><strong>Adresse:</strong> {{ selected.adresse }}</div>
          <div><strong>CIN:</strong> {{ selected.cin }}</div>
          <div><strong>Téléphone:</strong> {{ selected.telephone }}</div>
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
          Supprimer <strong>{{ selected?.nom }}</strong> ? Cette action est irréversible.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialogDelete = false">Annuler</v-btn>
          <v-btn color="red" variant="flat" @click="confirmDelete">Supprimer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar pour notifications -->
    <v-snackbar v-model="snackbar" color="success" timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from "vue";

// Données fictives
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

// Headers du tableau (Vuetify 3)
const headers = [
  { title: "Nom", key: "nom" },
  { title: "Adresse", key: "adresse" },
  { title: "CIN", key: "cin" },
  { title: "Téléphone", key: "telephone" },
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
  snackbarMessage.value = "Ouvrez le menu Vendeur > Ajout pour créer";
  snackbar.value = true;
};

// Fonctions actions
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
  snackbarMessage.value = `${selected.value.nom} supprimé`;
  snackbar.value = true;
  dialogDelete.value = false;
  selected.value = null;
};
</script>

<style scoped>
.v-btn {
  margin-right: 4px;
}
</style>
