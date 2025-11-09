<template>
  <v-container class="py-10">
    <v-card elevation="4" class="pa-6 mx-auto" max-width="640">
      <v-card-title class="text-h6 mb-4">Créer un vendeur</v-card-title>

      <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="envoyer">
        <v-text-field
          v-model="vendeur.nom"
          label="Nom"
          prepend-inner-icon="mdi-account"
          :rules="[(v) => !!v || 'Le nom est requis']"
          variant="outlined"
          clearable
          class="mb-3"
        />

        <v-text-field
          v-model="vendeur.telephone"
          label="Téléphone"
          prepend-inner-icon="mdi-phone"
          :rules="[
            (v) => !!v || 'Le téléphone est requis',
            (v) => /^\+?\d{8,15}$/.test(v) || 'Numéro invalide',
          ]"
          variant="outlined"
          clearable
          class="mb-3"
        />

        <v-text-field
          v-model="vendeur.username"
          label="Nom d’utilisateur"
          prepend-inner-icon="mdi-account-circle"
          :rules="[(v) => !!v || 'Nom d’utilisateur requis']"
          variant="outlined"
          clearable
          class="mb-3"
        />

        <v-select
          v-model="vendeur.role"
          :items="roles"
          label="Rôle"
          prepend-inner-icon="mdi-account-key"
          :rules="[(v) => !!v || 'Le rôle est requis']"
          variant="outlined"
          clearable
          class="mb-6"
        />

        <v-text-field
          v-model="vendeur.password"
          label="Mot de passe"
          prepend-inner-icon="mdi-lock"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          @click:append-inner="showPassword = !showPassword"
          :rules="[
            (v) => !!v || 'Mot de passe requis',
            (v) => v.length >= 6 || 'Min 6 caractères',
          ]"
          variant="outlined"
          clearable
          class="mb-6"
        />

        <v-btn color="primary" class="w-100" :disabled="!valid" type="submit">
          <v-icon icon="mdi-send" class="mr-2" />
          Envoyer
        </v-btn>
      </v-form>
    </v-card>

    <v-snackbar v-model="snackbar" color="success" timeout="3000">
      Vendeur créé avec succès !
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from "vue";

// Liste des rôles pour le select
const roles = ["Commercial", "Responsable", "Assistant"];

// Formulaire
const vendeur = ref({
  nom: "",
  telephone: "",
  username: "",
  password: "",
  role: "",
});

const valid = ref(false);
const showPassword = ref(false);
const snackbar = ref(false);

const form = ref(null);

const envoyer = async () => {
  const result = await form.value?.validate();
  const isValid = typeof result === "object" ? result.valid : !!result;
  if (isValid) {
    console.log("✅ Données envoyées :", vendeur.value);
    snackbar.value = true;

    // Ici tu peux envoyer à ton backend avec axios/fetch
    // await axios.post('/api/vendeurs', vendeur.value)

    // Réinitialiser le formulaire
    vendeur.value = {
      nom: "",
      telephone: "",
      username: "",
      password: "",
      role: "",
    };
    form.value?.resetValidation();
  }
};
</script>
