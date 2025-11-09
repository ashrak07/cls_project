<template>
  <v-container class="py-8">
    <v-card elevation="4" class="mx-auto" max-width="1100">
      <v-card-title class="text-h6"
        >Enregistrer une arrivée de commande</v-card-title
      >
      <v-divider />

      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          @submit.prevent="enregistrer"
        >
          <v-row>
            <v-col cols="12" md="5">
              <v-autocomplete
                v-model="arrivee.fournisseurId"
                :items="fournisseursItems"
                item-title="label"
                item-value="id"
                label="Fournisseur"
                prepend-inner-icon="mdi-truck-fast"
                :rules="[rules.required]"
                variant="outlined"
                clearable
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="arrivee.date"
                label="Date d'arrivée"
                type="date"
                prepend-inner-icon="mdi-calendar"
                :rules="[rules.required]"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                v-model="arrivee.reference"
                label="Référence"
                prepend-inner-icon="mdi-identifier"
                variant="outlined"
                clearable
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                v-model="arrivee.magasin"
                :items="magasins"
                label="Magasin"
                prepend-inner-icon="mdi-warehouse"
                variant="outlined"
                :rules="[rules.required]"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="4">
              <v-select
                v-model="arrivee.mode"
                :items="modes"
                label="Type d'entrée"
                prepend-inner-icon="mdi-transfer"
                variant="outlined"
                :rules="[rules.required]"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model.number="arrivee.tva"
                label="TVA (%)"
                type="number"
                step="0.1"
                prepend-inner-icon="mdi-percent"
                :rules="[rules.nonNegative]"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model.number="arrivee.frais"
                label="Frais (transport, douane)"
                type="number"
                step="0.01"
                prepend-inner-icon="mdi-cash"
                :rules="[rules.nonNegative]"
                variant="outlined"
                clearable
              />
            </v-col>
          </v-row>

          <v-card class="mb-4" variant="tonal">
            <v-card-title class="text-subtitle-1"
              >Lignes d'arrivée</v-card-title
            >
            <v-card-text>
              <v-row class="font-weight-medium text-caption mb-1">
                <v-col cols="12" md="5">Produit</v-col>
                <v-col cols="12" md="2">Coût unitaire</v-col>
                <v-col cols="12" md="2">Quantité</v-col>
                <v-col cols="12" md="2">Total</v-col>
                <v-col cols="12" md="1"></v-col>
              </v-row>

              <div v-for="(l, i) in arrivee.lignes" :key="i" class="mb-1">
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
                      v-model.number="l.cout"
                      label="Coût"
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
                      :model-value="formatMoney(l.quantite * l.cout)"
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
                      :disabled="arrivee.lignes.length === 1"
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
                v-model="arrivee.notes"
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
                    <span>TVA ({{ arrivee.tva || 0 }}%)</span>
                    <strong>+ {{ formatMoney(totalTva) }}</strong>
                  </div>
                  <div class="d-flex justify-space-between mb-1">
                    <span>Frais</span>
                    <strong>+ {{ formatMoney(arrivee.frais || 0) }}</strong>
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
      Arrivée enregistrée avec succès !
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";

// Données d'exemple (remplacez par votre API)
const fournisseurs = [
  { id: 1, nom: "Fourniture Mada" },
  { id: 2, nom: "Import Océan Indien" },
  { id: 3, nom: "Global Trading" },
];

const catalogue = [
  { id: 1, nom: "Casque Bluetooth", prixAchat: 100000 },
  { id: 2, nom: "T-shirt coton", prixAchat: 18000 },
  { id: 3, nom: "Mixeur", prixAchat: 80000 },
];

const magasins = ["Principal", "Annexe 1", "Annexe 2"];
const modes = ["Achat", "Retour client", "Transfert", "Correction stock"];

const fournisseursItems = fournisseurs.map((f) => ({ id: f.id, label: f.nom }));
const produitsItems = catalogue.map((p) => ({
  id: p.id,
  label: `${p.nom} — ${formatMoney(p.prixAchat)}`,
}));

const arrivee = ref({
  fournisseurId: null,
  date: new Date().toISOString().slice(0, 10),
  reference: "",
  magasin: "Principal",
  mode: "Achat",
  tva: 20,
  frais: 0,
  notes: "",
  lignes: [{ produitId: null, cout: 0, quantite: 1 }],
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
  (arrivee.value.lignes || []).reduce(
    (sum, l) => sum + Number(l.cout || 0) * Number(l.quantite || 0),
    0
  )
);
const totalTva = computed(
  () => (sousTotal.value * Number(arrivee.value.tva || 0)) / 100
);
const total = computed(
  () => sousTotal.value + totalTva.value + Number(arrivee.value.frais || 0)
);

const hasValidLines = computed(
  () =>
    arrivee.value.lignes.length > 0 &&
    arrivee.value.lignes.every(
      (l) => Number(l.quantite) > 0 && Number(l.cout) > 0 && !!l.produitId
    )
);

const ajouterLigne = () => {
  arrivee.value.lignes.push({ produitId: null, cout: 0, quantite: 1 });
};

const supprimerLigne = (index) => {
  if (arrivee.value.lignes.length > 1) {
    arrivee.value.lignes.splice(index, 1);
  }
};

const onProduitChange = (index, produitId) => {
  const p = catalogue.find((x) => x.id === produitId);
  if (p) {
    arrivee.value.lignes[index].cout = p.prixAchat;
    if (
      !arrivee.value.lignes[index].quantite ||
      arrivee.value.lignes[index].quantite <= 0
    ) {
      arrivee.value.lignes[index].quantite = 1;
    }
  }
};

const resetForm = () => {
  arrivee.value = {
    fournisseurId: null,
    date: new Date().toISOString().slice(0, 10),
    reference: "",
    magasin: "Principal",
    mode: "Achat",
    tva: 20,
    frais: 0,
    notes: "",
    lignes: [{ produitId: null, cout: 0, quantite: 1 }],
  };
  form.value?.resetValidation();
};

const enregistrer = async () => {
  const result = await form.value?.validate();
  const isValid = typeof result === "object" ? result.valid : !!result;
  if (!isValid || !hasValidLines.value) return;

  // Envoyez à votre API ici
  console.log("📦 Arrivée commande envoyée:", {
    ...arrivee.value,
    montants: {
      sousTotal: sousTotal.value,
      tva: totalTva.value,
      total: total.value,
    },
  });
  snackbar.value = true;
  resetForm();
};
</script>

<style scoped></style>
