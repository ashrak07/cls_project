<template>
  <v-container class="py-8">
    <v-card elevation="4" class="mx-auto" max-width="920">
      <v-card-title class="text-h6">Créer un produit</v-card-title>
      <v-divider></v-divider>

      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          @submit.prevent="envoyer"
        >
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="produit.categorie"
                :items="categories"
                label="Catégorie"
                prepend-inner-icon="mdi-shape"
                :rules="[rules.required]"
                variant="outlined"
                clearable
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="produit.nom"
                label="Nom du produit"
                prepend-inner-icon="mdi-tag"
                :rules="[rules.required, rules.min2]"
                variant="outlined"
                clearable
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="produit.sku"
                label="Référence (SKU)"
                prepend-inner-icon="mdi-barcode"
                variant="outlined"
                clearable
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model.number="produit.prix"
                label="Prix"
                prepend-inner-icon="mdi-currency-usd"
                suffix="Ar"
                type="number"
                step="0.01"
                :rules="[rules.required, rules.positive]"
                variant="outlined"
                clearable
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model.number="produit.stock"
                label="Stock"
                prepend-inner-icon="mdi-warehouse"
                type="number"
                step="1"
                :rules="[rules.nonNegativeInt]"
                variant="outlined"
                clearable
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model.number="produit.tva"
                label="TVA (%)"
                prepend-inner-icon="mdi-percent"
                type="number"
                step="0.1"
                :rules="[rules.nonNegative]"
                variant="outlined"
                clearable
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model.number="produit.remise"
                label="Remise (%)"
                prepend-inner-icon="mdi-sale"
                type="number"
                step="0.1"
                :rules="[rules.range0to100]"
                variant="outlined"
                clearable
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-switch
                v-model="produit.actif"
                label="Actif"
                color="primary"
                hide-details
              />
            </v-col>
          </v-row>

          <v-textarea
            v-model="produit.description"
            label="Description"
            prepend-inner-icon="mdi-text"
            variant="outlined"
            rows="3"
            auto-grow
            class="mb-4"
          />

          <div class="mb-2 text-subtitle-2">Caractéristiques</div>
          <v-card variant="tonal" class="mb-4">
            <v-card-text>
              <v-row
                v-for="(c, i) in produit.caracteristiques"
                :key="i"
                class="mb-1"
              >
                <v-col cols="12" md="5">
                  <v-text-field
                    v-model="c.cle"
                    label="Clé"
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>
                <v-col cols="12" md="5">
                  <v-text-field
                    v-model="c.valeur"
                    label="Valeur"
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>
                <v-col cols="12" md="2" class="d-flex align-center">
                  <v-btn
                    icon
                    color="red"
                    variant="text"
                    @click="removeCaracteristique(i)"
                    :disabled="produit.caracteristiques.length === 1"
                  >
                    <v-icon icon="mdi-delete" />
                  </v-btn>
                </v-col>
              </v-row>
              <v-btn
                color="primary"
                variant="tonal"
                @click="addCaracteristique"
              >
                <v-icon icon="mdi-plus" class="mr-2" />
                Ajouter une caractéristique
              </v-btn>
            </v-card-text>
          </v-card>

          <v-file-input
            v-model="produit.images"
            label="Images du produit"
            prepend-inner-icon="mdi-image"
            accept="image/*"
            multiple
            chips
            variant="outlined"
            show-size
            class="mb-4"
          />

          <div class="d-flex justify-end" style="gap: 8px">
            <v-btn variant="text" @click="resetForm">Réinitialiser</v-btn>
            <v-btn
              color="primary"
              variant="flat"
              :disabled="!valid"
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
      Produit enregistré avec succès !
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from "vue";

const categories = ["Électronique", "Vêtements", "Maison", "Sport", "Autre"];

const produit = ref({
  categorie: "",
  nom: "",
  sku: "",
  prix: null,
  stock: 0,
  tva: 20,
  remise: 0,
  actif: true,
  description: "",
  caracteristiques: [{ cle: "", valeur: "" }],
  images: [],
});

const valid = ref(false);
const snackbar = ref(false);
const form = ref(null);

const rules = {
  required: (v) => !!v || "Champ requis",
  min2: (v) => (v && v.length >= 2) || "Au moins 2 caractères",
  positive: (v) => Number(v) > 0 || "Doit être > 0",
  nonNegative: (v) => Number(v) >= 0 || "Doit être ≥ 0",
  nonNegativeInt: (v) =>
    (Number.isInteger(Number(v)) && Number(v) >= 0) || "Entier ≥ 0",
  range0to100: (v) => (Number(v) >= 0 && Number(v) <= 100) || "Entre 0 et 100",
};

const addCaracteristique = () => {
  produit.value.caracteristiques.push({ cle: "", valeur: "" });
};

const removeCaracteristique = (index) => {
  if (produit.value.caracteristiques.length > 1) {
    produit.value.caracteristiques.splice(index, 1);
  }
};

const resetForm = () => {
  produit.value = {
    categorie: "",
    nom: "",
    sku: "",
    prix: null,
    stock: 0,
    tva: 20,
    remise: 0,
    actif: true,
    description: "",
    caracteristiques: [{ cle: "", valeur: "" }],
    images: [],
  };
  form.value?.resetValidation();
};

const envoyer = async () => {
  const result = await form.value?.validate();
  const isValid = typeof result === "object" ? result.valid : !!result;
  if (!isValid) return;

  // Ici, appeler votre API (axios/fetch) pour enregistrer
  console.log("📦 Produit envoyé:", { ...produit.value });
  snackbar.value = true;
  resetForm();
};
</script>

<style scoped></style>
