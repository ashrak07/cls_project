<template>
  <v-container class="py-6">
    <v-card elevation="3">
      <v-card-title class="text-h6">Liste des Arrivées</v-card-title>

      <v-data-table
        :headers="headers"
        :items="arrivees"
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

        <template #item.total="{ item }">
          {{ formatMoney(totalFor(item)) }}
        </template>

        <template #item.actions="{ item }">
          <v-btn icon color="primary" @click="voir(item)" title="Voir">
            <v-icon icon="mdi-eye"></v-icon>
          </v-btn>
          <v-btn icon color="orange" @click="editer(item)" title="Éditer">
            <v-icon icon="mdi-pencil"></v-icon>
          </v-btn>
          <v-btn icon color="red" @click="supprimer(item)" title="Supprimer">
            <v-icon icon="mdi-delete"></v-icon>
          </v-btn>
        </template>

        <template #no-data>
          <div class="px-4 py-8 text-medium-emphasis">Aucune donnée</div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog: Voir -->
    <v-dialog v-model="dialogView" max-width="900">
      <v-card>
        <v-card-title class="text-h6">Détails de l'arrivée</v-card-title>
        <v-card-text v-if="selected">
          <v-row>
            <v-col cols="12" md="6">
              <div><strong>Référence:</strong> {{ selected.reference || '-' }}</div>
              <div><strong>Fournisseur:</strong> {{ selected.fournisseurNom }}</div>
              <div><strong>Date:</strong> {{ selected.date }}</div>
            </v-col>
            <v-col cols="12" md="6">
              <div><strong>Magasin:</strong> {{ selected.magasin }}</div>
              <div><strong>Type:</strong> {{ selected.mode }}</div>
              <div><strong>Total:</strong> {{ formatMoney(totalFor(selected)) }}</div>
            </v-col>
          </v-row>
          <v-divider class="my-3" />
          <div class="mb-2 font-weight-medium">Lignes</div>
          <v-table density="compact">
            <thead>
              <tr>
                <th class="text-left">Produit</th>
                <th class="text-right">Coût</th>
                <th class="text-right">Qté</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(l, idx) in selected.lignes" :key="idx">
                <td>{{ l.produit }}</td>
                <td class="text-right">{{ formatMoney(l.cout) }}</td>
                <td class="text-right">{{ l.quantite }}</td>
                <td class="text-right">{{ formatMoney(l.cout * l.quantite) }}</td>
              </tr>
            </tbody>
          </v-table>
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
        <v-card-title class="text-h6">Éditer l'arrivée</v-card-title>
        <v-card-text>
          <v-form ref="editForm" v-model="editValid" lazy-validation>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field v-model="editArrival.reference" label="Référence" variant="outlined" />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="editArrival.date" type="date" label="Date" variant="outlined" />
              </v-col>
              <v-col cols="12" md="4">
                <v-select v-model="editArrival.magasin" :items="magasins" label="Magasin" :rules="[rules.required]" variant="outlined" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-select v-model="editArrival.mode" :items="modes" label="Type d'entrée" :rules="[rules.required]" variant="outlined" />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field v-model.number="editArrival.tva" label="TVA (%)" type="number" step="0.1" :rules="[rules.nonNegative]" variant="outlined" />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field v-model.number="editArrival.frais" label="Frais" type="number" step="0.01" :rules="[rules.nonNegative]" variant="outlined" />
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

    <!-- Dialog: Supprimer -->
    <v-dialog v-model="dialogDelete" max-width="520">
      <v-card>
        <v-card-title class="text-h6">Supprimer l'arrivée</v-card-title>
        <v-card-text>
          Confirmer la suppression de la référence <strong>{{ selected?.reference || selected?.id }}</strong> ?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialogDelete = false">Annuler</v-btn>
          <v-btn color="red" variant="flat" @click="confirmDelete">Supprimer</v-btn>
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

const magasins = ["Principal", "Annexe 1", "Annexe 2"];
const modes = ["Achat", "Retour client", "Transfert", "Correction stock"];

// Données fictives
const arrivees = ref([
  {
    id: 1,
    reference: "ARV-2025-001",
    fournisseurNom: "Fourniture Mada",
    date: "2025-01-08",
    magasin: "Principal",
    mode: "Achat",
    tva: 20,
    frais: 5000,
    lignes: [
      { produit: "Casque Bluetooth", cout: 100000, quantite: 2 },
      { produit: "T-shirt coton", cout: 18000, quantite: 10 },
    ],
  },
  {
    id: 2,
    reference: "ARV-2025-002",
    fournisseurNom: "Import Océan Indien",
    date: "2025-02-10",
    magasin: "Annexe 1",
    mode: "Transfert",
    tva: 0,
    frais: 0,
    lignes: [
      { produit: "Mixeur", cout: 80000, quantite: 3 },
    ],
  },
  {
    id: 3,
    reference: "ARV-2025-003",
    fournisseurNom: "Global Trading",
    date: "2025-03-02",
    magasin: "Principal",
    mode: "Achat",
    tva: 20,
    frais: 12000,
    lignes: [
      { produit: "Casque Bluetooth", cout: 98000, quantite: 5 },
    ],
  },
]);

const headers = [
  { title: "Réf.", key: "reference" },
  { title: "Fournisseur", key: "fournisseurNom" },
  { title: "Date", key: "date" },
  { title: "Magasin", key: "magasin" },
  { title: "Type", key: "mode" },
  { title: "Total", key: "total" },
  { title: "Actions", key: "actions", sortable: false },
];

const search = ref("");
const snackbar = ref(false);
const snackbarMessage = ref("");

const dialogView = ref(false);
const dialogEdit = ref(false);
const dialogDelete = ref(false);
const selected = ref(null);

const editForm = ref(null);
const editValid = ref(false);
const editArrival = ref({ id: null, reference: "", date: "", magasin: "", mode: "", tva: 0, frais: 0 });

const rules = {
  required: (v) => !!v || "Champ requis",
  nonNegative: (v) => Number(v) >= 0 || "≥ 0",
};

function formatMoney(val) {
  return (Number(val) || 0)
    .toLocaleString("fr-FR", { style: "currency", currency: "MGA", currencyDisplay: "code" })
    .replace("MGA", "Ar");
}

const totalFor = (a) => {
  const sousTotal = (a.lignes || []).reduce((sum, l) => sum + Number(l.cout || 0) * Number(l.quantite || 0), 0);
  const tva = (sousTotal * Number(a.tva || 0)) / 100;
  return sousTotal + tva + Number(a.frais || 0);
};

const voir = (item) => {
  selected.value = item;
  dialogView.value = true;
};

const editer = (item) => {
  editArrival.value = { id: item.id, reference: item.reference || "", date: item.date || "", magasin: item.magasin, mode: item.mode, tva: item.tva || 0, frais: item.frais || 0 };
  dialogEdit.value = true;
};

const saveEdit = async () => {
  const result = await editForm.value?.validate();
  const isValid = typeof result === "object" ? result.valid : !!result;
  if (!isValid) return;
  const idx = arrivees.value.findIndex((o) => o.id === editArrival.value.id);
  if (idx !== -1) arrivees.value[idx] = { ...arrivees.value[idx], ...editArrival.value };
  snackbarMessage.value = "Arrivée mise à jour";
  snackbar.value = true;
  dialogEdit.value = false;
};

const supprimer = (item) => {
  selected.value = item;
  dialogDelete.value = true;
};

const confirmDelete = () => {
  if (!selected.value) return;
  arrivees.value = arrivees.value.filter((o) => o.id !== selected.value.id);
  snackbarMessage.value = "Arrivée supprimée";
  snackbar.value = true;
  dialogDelete.value = false;
  selected.value = null;
};
</script>

<style scoped>
</style>
