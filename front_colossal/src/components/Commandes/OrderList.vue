<template>
  <v-container class="py-6">
    <v-card elevation="3">
      <v-card-title class="text-h6">Liste des Commandes</v-card-title>

      <v-data-table
        :headers="headers"
        :items="orders"
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
            <v-btn color="primary" variant="flat" @click="goToAdd">
              <v-icon icon="mdi-plus" class="mr-2" />
              Ajouter
            </v-btn>
          </div>
          <v-divider />
        </template>

        <template #item.total="{ item }">
          {{ formatMoney(totalFor(item)) }}
        </template>

        <template #item.statut="{ value }">
          <v-chip
            size="small"
            variant="flat"
            :class="['status-chip', statusClass(value)]"
          >
            {{ value }}
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <v-btn icon class="action-btn view" @click="voir(item)" title="Voir">
            <v-icon icon="mdi-eye-outline" />
          </v-btn>
          <v-btn icon class="action-btn edit" @click="editer(item)" title="Editer">
            <v-icon icon="mdi-pencil-outline" />
          </v-btn>
          <v-btn icon class="action-btn delete" @click="supprimer(item)" title="Supprimer">
            <v-icon icon="mdi-delete-outline" />
          </v-btn>
        </template>

        <template #no-data>
          <div class="px-4 py-8 text-medium-emphasis">Aucune donnee</div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog: Voir -->
    <v-dialog v-model="dialogView" max-width="900">
      <v-card>
        <v-card-title class="text-h6">Details de la commande</v-card-title>
        <v-card-text v-if="selected">
          <v-row>
            <v-col cols="12" md="6">
              <div><strong>Numero:</strong> {{ selected.numero }}</div>
              <div><strong>Client:</strong> {{ selected.clientNom }}</div>
              <div><strong>Date:</strong> {{ selected.date }}</div>
            </v-col>
            <v-col cols="12" md="6">
              <div><strong>Statut:</strong> {{ selected.statut }}</div>
              <div><strong>Paiement:</strong> {{ selected.modePaiement }}</div>
              <div>
                <strong>Total:</strong> {{ formatMoney(totalFor(selected)) }}
              </div>
            </v-col>
          </v-row>
          <v-divider class="my-3" />
          <div class="mb-2 font-weight-medium">Lignes</div>
          <v-table density="compact">
            <thead>
              <tr>
                <th class="text-left">Produit</th>
                <th class="text-right">Prix</th>
                <th class="text-right">Qt</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(l, idx) in selected.lignes" :key="idx">
                <td>{{ l.produit }}</td>
                <td class="text-right">{{ formatMoney(l.prix) }}</td>
                <td class="text-right">{{ l.quantite }}</td>
                <td class="text-right">
                  {{ formatMoney(l.prix * l.quantite) }}
                </td>
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

    <!-- Dialog: Editer -->
    <v-dialog v-model="dialogEdit" max-width="640">
      <v-card>
        <v-card-title class="text-h6">Editer la commande</v-card-title>
        <v-card-text>
          <v-form ref="editForm" v-model="editValid" lazy-validation>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="editOrder.statut"
                  :items="statuts"
                  label="Statut"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="editOrder.modePaiement"
                  :items="modesPaiement"
                  label="Mode de paiement"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editOrder.dateLivraison"
                  type="date"
                  label="Date de livraison"
                  variant="outlined"
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
          >
            Enregistrer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog: Supprimer -->
    <v-dialog v-model="dialogDelete" max-width="520">
      <v-card>
        <v-card-title class="text-h6">Supprimer la commande</v-card-title>
        <v-card-text>
          Confirmer la suppression de <strong>{{ selected?.numero }}</strong> ?
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

const statuts = ["Nouveau", "Paye", "En attente", "Annule"];
const modesPaiement = ["Especes", "Mobile Money", "Carte", "Virement"];

const orders = ref([
  {
    id: 1,
    numero: "CMD-2025-001",
    clientNom: "Rasoa Andry",
    date: "2025-01-12",
    statut: "Nouveau",
    modePaiement: "Especes",
    dateLivraison: "",
    lignes: [
      { produit: "Casque Bluetooth", prix: 120000, quantite: 1 },
      { produit: "T-shirt coton", prix: 25000, quantite: 2 },
    ],
  },
  {
    id: 2,
    numero: "CMD-2025-002",
    clientNom: "Rakoto Jean",
    date: "2025-02-05",
    statut: "Paye",
    modePaiement: "Mobile Money",
    dateLivraison: "2025-02-08",
    lignes: [{ produit: "Mixeur", prix: 95000, quantite: 1 }],
  },
  {
    id: 3,
    numero: "CMD-2025-003",
    clientNom: "Hanitra Paul",
    date: "2025-03-19",
    statut: "En attente",
    modePaiement: "Carte",
    dateLivraison: "",
    lignes: [
      { produit: "T-shirt coton", prix: 25000, quantite: 4 },
      { produit: "Casque Bluetooth", prix: 120000, quantite: 1 },
    ],
  },
]);

const headers = [
  { title: "No", key: "numero" },
  { title: "Client", key: "clientNom" },
  { title: "Date", key: "date" },
  { title: "Statut", key: "statut" },
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
const editOrder = ref({
  id: null,
  statut: "",
  modePaiement: "",
  dateLivraison: "",
});

const rules = {
  required: (v) => !!v || "Champ requis",
};

function formatMoney(val) {
  return (Number(val) || 0)
    .toLocaleString("fr-FR", {
      style: "currency",
      currency: "MGA",
      currencyDisplay: "code",
    })
    .replace("MGA", "Ar");
}

const totalFor = (order) =>
  (order.lignes || []).reduce(
    (sum, l) => sum + Number(l.prix || 0) * Number(l.quantite || 0),
    0
  );

const statusClass = (statut) => {
  switch (statut) {
    case "Paye":
      return "status-paid";
    case "Nouveau":
      return "status-new";
    case "En attente":
      return "status-pending";
    case "Annule":
      return "status-cancelled";
    default:
      return "status-default";
  }
};

const voir = (item) => {
  selected.value = item;
  dialogView.value = true;
};

const editer = (item) => {
  editOrder.value = {
    id: item.id,
    statut: item.statut,
    modePaiement: item.modePaiement,
    dateLivraison: item.dateLivraison || "",
  };
  dialogEdit.value = true;
};

const saveEdit = async () => {
  const result = await editForm.value?.validate();
  const isValid = typeof result === "object" ? result.valid : !!result;
  if (!isValid) return;
  const idx = orders.value.findIndex((o) => o.id === editOrder.value.id);
  if (idx !== -1)
    orders.value[idx] = { ...orders.value[idx], ...editOrder.value };
  snackbarMessage.value = "Commande mise a jour";
  snackbar.value = true;
  dialogEdit.value = false;
};

const supprimer = (item) => {
  selected.value = item;
  dialogDelete.value = true;
};

const confirmDelete = () => {
  if (!selected.value) return;
  orders.value = orders.value.filter((o) => o.id !== selected.value.id);
  snackbarMessage.value = "Commande supprimee";
  snackbar.value = true;
  dialogDelete.value = false;
  selected.value = null;
};

const goToAdd = () => {
  emit("open-add", "commande-creer");
};
</script>

<style scoped></style>
