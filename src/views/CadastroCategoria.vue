<template>
  <div class="mt-10" style="display: grid; justify-items: center">
    <v-list max-width="500" width="100%">
      <v-list-item v-for="categoria in categoria" :key="categoria.id">
        <v-list-item-title>Nome: {{ categoria.nome }}</v-list-item-title>
        <v-list-item-action class="d-flex flex-row pr-4">
          <v-btn class="mr-5 mt-5" icon @click="atualizarCategoria(categoria)">
            <v-icon color="primary">mdi-pencil</v-icon>
          </v-btn>

          <v-btn class="mt-5" icon @click="deletarCategoria(categoria)">
            <v-icon color="error">mdi-delete</v-icon>
          </v-btn>  
        </v-list-item-action>
        <v-divider />
      </v-list-item>
    </v-list>

    <v-btn fab @click="adicionarCategoria()" color="orange" dark bottom class="ma-4 fixed-btn">
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <!--Componentes-->
    <ModalCategoria :dialogCategoria="dialogAtualizar" @change="dialogAtualizar = $event" @salvar="salvar()">
      <v-text-field label="Nome" v-model="categoriaSelecionada.nome" />
    </ModalCategoria>

    <ModalConfirmacao
      :dialogConfirmacao="dialogDeletar"
      @change="dialogDeletar = $event"
      @sim="confirmaDeletarCategoria()"
      :texto="`Tem certeza que deseja excluir a categoria ${categoriaSelecionada.nome}?`"
    />
  </div>
</template>

<script setup>
//vue
import { ref, onMounted } from "vue";

//componentes
import ModalCategoria from "@/components/ModalCategoria.vue";
import ModalConfirmacao from "@/components/ModalConfirmacao.vue";

//serviços
import { api } from "@/services/api.js";

//variaveis reativas
const dialogAtualizar = ref(false);
const dialogDeletar = ref(false);
const categoria = ref([]);
const categoriaSelecionada = ref({
  nome: "",
});

//funções
async function adicionarCategoria() {
  categoriaSelecionada.value = {};
  dialogAtualizar.value = true;
}

async function deletarCategoria(categoria) {
  categoriaSelecionada.value = { ...categoria };
  dialogDeletar.value = true;
}

async function confirmaDeletarCategoria() {
  try {
    await api.delete(`categoria/${categoriaSelecionada.value.id}`);
    categoria.value = categoria.value.filter(
      (c) => c.id !== categoriaSelecionada.value.id
    );
    dialogDeletar.value = false;
  } catch (error) {
    console.error(error);
  }
}

async function atualizarCategoria(categoria) {
  categoriaSelecionada.value = { ...categoria };
  dialogAtualizar.value = true;
}

async function salvar() {
  try {
    let resposta;
    if (categoriaSelecionada.value.id) {
      resposta = await api.put(
        `categoria/${categoriaSelecionada.value.id}`,
        categoriaSelecionada.value
      );
    } else {
      resposta = await api.post("categoria", categoriaSelecionada.value);
      categoria.value.push(resposta.data);
    }
    dialogAtualizar.value = false;
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  try {
    const response = await api.get("categoria");
    categoria.value = response.data;
  } catch (error) {
    alert("Falha ao conectar com o servidor!");
    console.error("Erro ao carregar a lista de categoria:", error);
  }
});
</script>

<style scoped>
.fixed-btn {
  position: fixed;
  bottom: 16px;
  right: 16px;
}
</style>