<template>
    <v-app-bar color="primary" prominent>
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-toolbar-title>Biblioteca</v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" location="left" temporary>
      <v-list>
        <v-list-subheader>Menu</v-list-subheader>
        <v-list-group value="Cadastros">
          <template #activator="{ props }">
            <v-list-item v-bind="props" title="Cadastros"></v-list-item>
          </template>

          <v-list-item>
            <v-btn flat @click="cadastroLivro">Livro</v-btn>
          </v-list-item>

          <v-list-item>
            <v-btn flat @click="cadastroCategoria">Categoria</v-btn>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
</template>

<script setup>
// vue
import { ref } from "vue";
import { useRouter } from "vue-router";

// variaveis reativas
const drawer = ref(false);

// variaveis
const router = useRouter();

//funções
function cadastroLivro() {
  router.push({ name: "Livro" });
}

function cadastroCategoria() {
  router.push({ name: "Categoria" });
}
</script>