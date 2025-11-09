<template>
  <v-container class="py-8">
    <v-card elevation="4" class="mx-auto" max-width="1100">
      <v-card-title class="text-h6">Créer une commande</v-card-title>
      <v-divider />

      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          @submit.prevent="enregistrer"
        >
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="commande.clientId"
                :items="clientsItems"
                item-title="label"
                item-value="id"
                label="Client"
                prepend-inner-icon="mdi-account"
                :rules="[rules.required]"
                variant="outlined"
                clearable
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="commande.date"
                label="Date de commande"
                type="date"
                prepend-inner-icon="mdi-calendar"
                :rules="[rules.required]"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="commande.dateLivraison"
                label="Date de livraison"
                type="date"
                prepend-inner-icon="mdi-truck"
                variant="outlined"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="4">
              <v-select
                v-model="commande.statut"
                :items="statuts"
                label="Statut"
                prepend-inner-icon="mdi-progress-check"
                variant="outlined"
                :rules="[rules.required]"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="commande.modePaiement"
                :items="modesPaiement"
                label="Mode de paiement"
                prepend-inner-icon="mdi-cash"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                v-model.number="commande.remise"
                label="Remise (%)"
                type="number"
                step="0.1"
                :rules="[rules.range0to100]"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                v-model.number="commande.tva"
                label="TVA (%)"
                type="number"
                step="0.1"
                :rules="[rules.nonNegative]"
                variant="outlined"
              />
            </v-col>
          </v-row>

          <v-card class="mb-4" variant="tonal">
            <v-card-title class="text-subtitle-1"
              >Lignes de commande</v-card-title
            >
            <v-card-text>
              <v-row class="font-weight-medium text-caption mb-1">
                <v-col cols="12" md="5">Produit</v-col>
                <v-col cols="12" md="2">Prix unitaire</v-col>
                <v-col cols="12" md="2">Quantité</v-col>
                <v-col cols="12" md="2">Total</v-col>
                <v-col cols="12" md="1"></v-col>
              </v-row>

              <div v-for="(l, i) in commande.lignes" :key="i" class="mb-1">
                <v-row
                  align="center"
                  no-gutters
                  :class="i % 2 ? 'bg-grey-lighten-4' : ''"
                  class="pa-1 rounded"
                >
                  <v-col cols="12" md="5" class="pr-2">
                    <v-autocomplete
                      v-model="l.produitId"
                      :items="produitsItems"
                      item-title="label"
                      item-value="id"
                      label="Produit"
                      variant="outlined"
                      density="comfortable"
                      clearable
                      @update:modelValue="(val) => onProduitChange(i, val)"
                    />
                  </v-col>
                  <v-col cols="12" md="2" class="px-2">
                    <v-text-field
                      v-model.number="l.prix"
                      label="Prix"
                      type="number"
                      step="0.01"
                      variant="outlined"
                      density="comfortable"
                      :rules="[rules.positive]"
                    />
                  </v-col>
                  <v-col cols="12" md="2" class="px-2">
                    <v-text-field
                      v-model.number="l.quantite"
                      label="Qté"
                      type="number"
                      step="1"
                      variant="outlined"
                      density="comfortable"
                      :rules="[
                        rules.nonNegativeInt,
                        (v) => Number(v) > 0 || '> 0',
                      ]"
                    />
                  </v-col>
                  <v-col cols="12" md="2" class="px-2">
                    <v-text-field
                      :model-value="formatMoney(l.quantite * l.prix)"
                      label="Total"
                      readonly
                      variant="solo"
                      density="comfortable"
                    />
                  </v-col>
                  <v-col cols="12" md="1" class="pl-2 d-flex justify-end">
                    <v-btn
                      icon
                      variant="text"
                      color="red"
                      @click="supprimerLigne(i)"
                      :disabled="commande.lignes.length === 1"
                    >
                      <v-icon icon="mdi-delete" />
                    </v-btn>
                  </v-col>
                </v-row>
              </div>

              <div class="mt-2">
                <v-btn color="primary" variant="tonal" @click="ajouterLigne">
                  <v-icon icon="mdi-plus" class="mr-2" />
                  Ajouter une ligne
                </v-btn>
              </div>
            </v-card-text>
          </v-card>

          <v-row>
            <v-col cols="12" md="6">
              <v-textarea
                v-model="commande.notes"
                label="Notes"
                prepend-inner-icon="mdi-note-text"
                variant="outlined"
                rows="3"
                auto-grow
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-card variant="outlined">
                <v-card-text>
                  <div class="d-flex justify-space-between mb-1">
                    <span>Sous-total</span>
                    <strong>{{ formatMoney(sousTotal) }}</strong>
                  </div>
                  <div class="d-flex justify-space-between mb-1">
                    <span>Remise ({{ commande.remise || 0 }}%)</span>
                    <strong>- {{ formatMoney(totalRemise) }}</strong>
                  </div>
                  <div class="d-flex justify-space-between mb-1">
                    <span>TVA ({{ commande.tva || 0 }}%)</span>
                    <strong>+ {{ formatMoney(totalTva) }}</strong>
                  </div>
                  <v-divider class="my-2" />
                  <div class="d-flex justify-space-between text-subtitle-1">
                    <span>Total</span>
                    <strong>{{ formatMoney(total) }}</strong>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <div class="d-flex justify-end mt-4" style="gap: 8px">
            <v-btn variant="text" @click="resetForm">Réinitialiser</v-btn>
            <v-btn
              color="primary"
              variant="flat"
              :disabled="!valid || !hasValidLines"
              type="submit"
            >
              <v-icon icon="mdi-content-save" class="mr-2" />
              Enregistrer
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>

    <v-snackbar v-model="snackbar" color="success" timeout="3000">
      Commande enregistrée avec succès !
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";

// Données d'exemple (à remplacer par votre API)
const clients = [
  { id: 1, nom: "Rasoa Andry", telephone: "+261341112233" },
  { id: 2, nom: "Rakoto Jean", telephone: "+261339998877" },
  { id: 3, nom: "Hanitra Paul", telephone: "+261322223344" },
];

const produits = [
  { id: 1, nom: "Casque Bluetooth", prix: 120000 },
  { id: 2, nom: "T-shirt coton", prix: 25000 },
  { id: 3, nom: "Mixeur", prix: 95000 },
];

const clientsItems = clients.map((c) => ({
  id: c.id,
  label: `${c.nom} (${c.telephone})`,
}));
const produitsItems = produits.map((p) => ({
  id: p.id,
  label: `${p.nom} — ${formatMoney(p.prix)}`,
}));

const statuts = ["Nouveau", "Payé", "En attente", "Annulé"];
const modesPaiement = ["Espèces", "Mobile Money", "Carte", "Virement"];

const commande = ref({
  clientId: null,
  date: new Date().toISOString().slice(0, 10),
  dateLivraison: "",
  statut: "Nouveau",
  modePaiement: "Espèces",
  remise: 0,
  tva: 20,
  notes: "",
  lignes: [{ produitId: null, prix: 0, quantite: 1 }],
});

const valid = ref(false);
const snackbar = ref(false);
const form = ref(null);

const rules = {
  required: (v) => !!v || "Champ requis",
  positive: (v) => Number(v) > 0 || "> 0",
  nonNegative: (v) => Number(v) >= 0 || "≥ 0",
  nonNegativeInt: (v) =>
    (Number.isInteger(Number(v)) && Number(v) >= 0) || "Entier ≥ 0",
  range0to100: (v) => (Number(v) >= 0 && Number(v) <= 100) || "Entre 0 et 100",
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

const sousTotal = computed(() =>
  (commande.value.lignes || []).reduce(
    (sum, l) => sum + Number(l.prix || 0) * Number(l.quantite || 0),
    0
  )
);
const totalRemise = computed(
  () => (sousTotal.value * Number(commande.value.remise || 0)) / 100
);
const baseTva = computed(() =>
  Math.max(0, sousTotal.value - totalRemise.value)
);
const totalTva = computed(
  () => (baseTva.value * Number(commande.value.tva || 0)) / 100
);
const total = computed(() => baseTva.value + totalTva.value);

const hasValidLines = computed(
  () =>
    commande.value.lignes.length > 0 &&
    commande.value.lignes.every(
      (l) => Number(l.quantite) > 0 && Number(l.prix) > 0 && !!l.produitId
    )
);

const ajouterLigne = () => {
  commande.value.lignes.push({ produitId: null, prix: 0, quantite: 1 });
};

const supprimerLigne = (index) => {
  if (commande.value.lignes.length > 1) {
    commande.value.lignes.splice(index, 1);
  }
};

const onProduitChange = (index, produitId) => {
  const p = produits.find((x) => x.id === produitId);
  if (p) {
    commande.value.lignes[index].prix = p.prix;
    if (
      !commande.value.lignes[index].quantite ||
      commande.value.lignes[index].quantite <= 0
    ) {
      commande.value.lignes[index].quantite = 1;
    }
  }
};

const resetForm = () => {
  commande.value = {
    clientId: null,
    date: new Date().toISOString().slice(0, 10),
    dateLivraison: "",
    statut: "Nouveau",
    modePaiement: "Espèces",
    remise: 0,
    tva: 20,
    notes: "",
    lignes: [{ produitId: null, prix: 0, quantite: 1 }],
  };
  form.value?.resetValidation();
};

const enregistrer = async () => {
  const result = await form.value?.validate();
  const isValid = typeof result === "object" ? result.valid : !!result;
  if (!isValid || !hasValidLines.value) return;

  // Envoyez à votre API ici
  console.log("🧾 Commande envoyée:", {
    ...commande.value,
    montants: {
      sousTotal: sousTotal.value,
      remise: totalRemise.value,
      tva: totalTva.value,
      total: total.value,
    },
  });
  snackbar.value = true;
  resetForm();
};
</script>

<style scoped></style>
