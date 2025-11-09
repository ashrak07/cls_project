<template>
  <v-container class="py-6">
    <v-card elevation="3">
      <v-card-title class="text-h6">Liste des Clients</v-card-title>

      <v-data-table
        :headers="headers"
        :items="clients"
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

        <template #item.actif="{ value }">
          <v-chip :color="value ? 'green' : 'grey'" size="small" variant="flat">
            {{ value ? 'Actif' : 'Inactif' }}
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <v-btn icon color="primary" @click="voirClient(item)" title="Voir">
            <v-icon icon="mdi-eye"></v-icon>
          </v-btn>
          <v-btn icon color="orange" @click="editerClient(item)" title="Éditer">
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
        <v-card-title class="text-h6">Détails du client</v-card-title>
        <v-card-text v-if="selected">
          <div class="mb-1"><strong>Nom:</strong> {{ selected.nom }}</div>
          <div class="mb-1"><strong>Pseudo Facebook:</strong> {{ selected.pseudoFacebook || '-' }}</div>
          <div class="mb-1"><strong>Téléphone:</strong> {{ selected.telephone }}</div>
          <div class="mb-1"><strong>Email:</strong> {{ selected.email || '-' }}</div>
          <div class="mb-1"><strong>Adresse:</strong> {{ selected.adresse || '-' }}</div>
          <div class="mb-1"><strong>Ville:</strong> {{ selected.ville || '-' }}</div>
          <div class="mb-1"><strong>CIN:</strong> {{ selected.cin || '-' }}</div>
          <div class="mb-1"><strong>Date de naissance:</strong> {{ selected.dateNaissance || '-' }}</div>
          <div class="mb-1"><strong>Genre:</strong> {{ selected.genre || '-' }}</div>
          <div class="mb-1"><strong>Statut:</strong> {{ selected.actif ? 'Actif' : 'Inactif' }}</div>
          <div class="mb-1"><strong>Notes:</strong> {{ selected.notes || '-' }}</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialogView = false">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog: Éditer -->
    <v-dialog v-model="dialogEdit" max-width="720">
      <v-card>
        <v-card-title class="text-h6">Éditer le client</v-card-title>
        <v-card-text>
          <v-form ref="editForm" v-model="editValid" lazy-validation>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editClient.nom"
                  label="Nom"
                  :rules="[rules.required, rules.min2]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editClient.pseudoFacebook"
                  label="Pseudo Facebook"
                  variant="outlined"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="editClient.telephone"
                  label="Téléphone"
                  :rules="[rules.required, rules.phone]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="editClient.email"
                  label="Email"
                  :rules="[rules.emailOptional]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="4" class="d-flex align-center">
                <v-switch v-model="editClient.actif" label="Actif" color="primary" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="8">
                <v-text-field v-model="editClient.adresse" label="Adresse" variant="outlined" />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="editClient.ville" label="Ville" variant="outlined" />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialogEdit = false">Annuler</v-btn>
          <v-btn color="primary" variant="flat" :disabled="!editValid" @click="saveEdit">Enregistrer</v-btn>
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

const clients = ref([
  { id: 1, nom: "Rasoa Andry", pseudoFacebook: "rasoa.andry", telephone: "+261341112233", email: "rasoa@example.com", adresse: "Lot II A 123", ville: "Antananarivo", cin: "AB123456", dateNaissance: "1992-05-10", genre: "Femme", actif: true, notes: "Cliente fidèle" },
  { id: 2, nom: "Rakoto Jean", pseudoFacebook: "rakoto.jean", telephone: "+261339998877", email: "rakoto@example.com", adresse: "Lot III B 456", ville: "Fianarantsoa", cin: "CD789012", dateNaissance: "1988-11-02", genre: "Homme", actif: false, notes: "" },
  { id: 3, nom: "Hanitra Paul", pseudoFacebook: "hanitra.paul", telephone: "+261322223344", email: "", adresse: "Rue des Palmiers", ville: "Toamasina", cin: "", dateNaissance: "", genre: "", actif: true, notes: "Préférence contact Facebook" },
]);

const headers = [
  { title: "Nom", key: "nom" },
  { title: "Facebook", key: "pseudoFacebook" },
  { title: "Téléphone", key: "telephone" },
  { title: "Email", key: "email" },
  { title: "Ville", key: "ville" },
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
const editClient = ref({ id: null, nom: "", pseudoFacebook: "", telephone: "", email: "", adresse: "", ville: "", actif: true });

const rules = {
  required: (v) => !!v || "Champ requis",
  min2: (v) => (v && v.length >= 2) || "Au moins 2 caractères",
  phone: (v) => /^(\+?\d{8,15})$/.test(v) || "Numéro invalide",
  emailOptional: (v) => !v || /\S+@\S+\.\S+/.test(v) || "Email invalide",
};

const voirClient = (item) => {
  selected.value = item;
  dialogView.value = true;
};

const editerClient = (item) => {
  editClient.value = { id: item.id, nom: item.nom, pseudoFacebook: item.pseudoFacebook, telephone: item.telephone, email: item.email, adresse: item.adresse, ville: item.ville, actif: item.actif };
  dialogEdit.value = true;
};

const saveEdit = async () => {
  const result = await editForm.value?.validate();
  const isValid = typeof result === "object" ? result.valid : !!result;
  if (!isValid) return;
  const idx = clients.value.findIndex((c) => c.id === editClient.value.id);
  if (idx !== -1) clients.value[idx] = { ...clients.value[idx], ...editClient.value };
  snackbarMessage.value = "Client mis à jour";
  snackbar.value = true;
  dialogEdit.value = false;
};
</script>

<style scoped>
</style>
