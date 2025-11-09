<template>
  <v-container class="py-8">
    <v-card elevation="4" class="mx-auto" max-width="820">
      <v-card-title class="text-h6">Créer un client</v-card-title>
      <v-divider></v-divider>

      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="envoyer">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="client.nom"
                label="Nom complet"
                prepend-inner-icon="mdi-account"
                :rules="[rules.required, rules.min2]"
                variant="outlined"
                clearable
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="client.pseudoFacebook"
                label="Pseudo Facebook"
                prepend-inner-icon="mdi-facebook"
                variant="outlined"
                clearable
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="client.telephone"
                label="Téléphone"
                prepend-inner-icon="mdi-phone"
                :rules="[rules.required, rules.phone]"
                variant="outlined"
                clearable
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="client.email"
                label="Email"
                prepend-inner-icon="mdi-email"
                :rules="[rules.emailOptional]"
                variant="outlined"
                clearable
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="client.genre"
                :items="genres"
                label="Genre"
                prepend-inner-icon="mdi-gender-male-female"
                variant="outlined"
                clearable
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="8">
              <v-text-field
                v-model="client.adresse"
                label="Adresse"
                prepend-inner-icon="mdi-map-marker"
                :rules="[rules.required]"
                variant="outlined"
                clearable
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="client.ville"
                label="Ville"
                prepend-inner-icon="mdi-city"
                variant="outlined"
                clearable
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="client.cin"
                label="CIN (optionnel)"
                prepend-inner-icon="mdi-card-account-details"
                variant="outlined"
                clearable
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="client.dateNaissance"
                label="Date de naissance"
                type="date"
                prepend-inner-icon="mdi-cake"
                variant="outlined"
                clearable
              />
            </v-col>
            <v-col cols="12" md="4" class="d-flex align-center">
              <v-switch v-model="client.actif" label="Actif" color="primary" />
            </v-col>
          </v-row>

          <v-textarea
            v-model="client.notes"
            label="Notes"
            prepend-inner-icon="mdi-note-text"
            variant="outlined"
            rows="3"
            auto-grow
            class="mb-4"
          />

          <div class="d-flex justify-end" style="gap: 8px">
            <v-btn variant="text" @click="resetForm">Réinitialiser</v-btn>
            <v-btn color="primary" variant="flat" :disabled="!valid" type="submit">
              <v-icon icon="mdi-content-save" class="mr-2" />
              Enregistrer
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>

    <v-snackbar v-model="snackbar" color="success" timeout="3000">
      Client enregistré avec succès !
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from "vue";

const genres = ["Homme", "Femme", "Autre"];

const client = ref({
  nom: "",
  pseudoFacebook: "",
  telephone: "",
  email: "",
  adresse: "",
  ville: "",
  cin: "",
  dateNaissance: "",
  genre: "",
  actif: true,
  notes: "",
});

const valid = ref(false);
const snackbar = ref(false);
const form = ref(null);

const rules = {
  required: (v) => !!v || "Champ requis",
  min2: (v) => (v && v.length >= 2) || "Au moins 2 caractères",
  phone: (v) => /^(\+?\d{8,15})$/.test(v) || "Numéro invalide",
  emailOptional: (v) => !v || /\S+@\S+\.\S+/.test(v) || "Email invalide",
};

const resetForm = () => {
  client.value = {
    nom: "",
    pseudoFacebook: "",
    telephone: "",
    email: "",
    adresse: "",
    ville: "",
    cin: "",
    dateNaissance: "",
    genre: "",
    actif: true,
    notes: "",
  };
  form.value?.resetValidation();
};

const envoyer = async () => {
  const result = await form.value?.validate();
  const isValid = typeof result === "object" ? result.valid : !!result;
  if (!isValid) return;

  // Envoi API ici (axios)
  console.log("👤 Client envoyé:", { ...client.value });
  snackbar.value = true;
  resetForm();
};
</script>

<style scoped>
</style>
