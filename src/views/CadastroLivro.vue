<template>
    <div class="mt-10" style="display: grid; justify-items: center">
      <v-list max-width="500" width="100%">
        <v-card>
          <v-list-item v-for="livro in livro" :key="livro.id">
          <v-card-title>{{ livro.titulo }}</v-card-title>
          <v-card-text>Autor: {{ livro.autor }}</v-card-text>
          <v-card-text>Descricao: {{ livro.descricao }}</v-card-text>
          <v-card-text>Ano Publicação: {{ livro.anoPublicacao }}</v-card-text>
          <v-card-text>Cópias: {{ livro.copias }}</v-card-text>
          <v-card-text>Cópias Disponiveis: {{ livro.copiasDisponiveis }}</v-card-text>
          <v-list-item-action class="d-flex flex-row pr-4">
            <v-btn class="mr-5" icon @click="atualizarLivro(livro)">
              <v-icon color="primary">mdi-pencil</v-icon>
            </v-btn>
  
            <v-btn class="mr-5" icon @click="deletarLivro(livro)">
              <v-icon color="error">mdi-delete</v-icon>
            </v-btn>  

            <v-btn class="mr-5" icon @click="alugarLivro(livro)">
              <v-icon>mdi-book-arrow-down</v-icon>
            </v-btn>
            <v-btn icon @click="devolverLivro(livro)">
              <v-icon>mdi-book-arrow-up</v-icon>
            </v-btn>
          </v-list-item-action>
          <v-divider />
        </v-list-item>
        </v-card>
      </v-list>
  
      <v-btn fab @click="adicionarLivro()" color="orange" dark bottom class="ma-4 fixed-btn">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
  
      <!--Componentes-->
      <ModalLivro :dialogLivro="dialogAtualizar" @change="dialogAtualizar = $event" @salvar="salvar()">
        <v-text-field label="Titulo" v-model="livroSelecionado.titulo" />
        <v-text-field label="Autor" v-model="livroSelecionado.autor" />
        <v-select     
        label="Categoria"
        v-model="livroSelecionado.categoriaId"
        :items="listarCategoria"
        item-title="nome"
        item-value="id"
        @click="carregarListaCategoria" />
        <v-text-field label="Descrição" v-model="livroSelecionado.descricao" />
        <v-text-field type="number" label="Ano Publicação" v-model="livroSelecionado.anoPublicacao" />
        <v-text-field type="number" label="Cópias" v-model="livroSelecionado.copias" />
        <v-text-field type="number" label="Cópias Disponiveis" v-model="livroSelecionado.copiasDisponiveis" />
      </ModalLivro>
  
      <ModalConfirmacao
        :dialogConfirmacao="dialogDeletar"
        @change="dialogDeletar = $event"
        @sim="confirmaDeletarlivro()"
        :texto="`Tem certeza que deseja excluir a livro ${livroSelecionado.titulo}?`"
      />
    </div>
  </template>

<script setup>
//vue
import { ref, onMounted } from "vue";

//componentes
import ModalLivro from "@/components/ModalLivro.vue";
import ModalConfirmacao from "@/components/ModalConfirmacao.vue";

//serviços
import { api } from "@/services/api.js";

//variaveis reativas
const dialogAtualizar = ref(false);
const dialogDeletar = ref(false);
const livro = ref([]);
const listarCategoria = ref([]);
const livroSelecionado = ref({
  titulo: "",
  autor: "",
  categoriaId:"",
  descricao: "",
  anoPublicacao: "",
  copias: "",
  copiasDisponiveis: "",
});

//funções
async function adicionarLivro() {
  livroSelecionado.value = {};
  dialogAtualizar.value = true;
}

async function deletarLivro(livro) {
  livroSelecionado.value = { ...livro };
  dialogDeletar.value = true;
}

async function confirmaDeletarlivro() {
  try {
    await api.delete(`livro/${livroSelecionado.value.id}`);
    livro.value = livro.value.filter(
      (c) => c.id !== livroSelecionado.value.id
    );
    dialogDeletar.value = false;
  } catch (error) {
    console.error(error);
  }
}

async function atualizarLivro(livro) {
  livroSelecionado.value = { ...livro };
  dialogAtualizar.value = true;
}

async function carregarListaCategoria() {
  try {
    const response = await api.get("categoria");
    if (response.data && Array.isArray(response.data)) {
      listarCategoria.value = response.data.map((categoria) => ({
        nome: categoria.nome,
        id: categoria.id,
      }));
    } else {
      console.error("Resposta inválida da API para 'categorias'.", response);
    }
  } catch (error) {
    this.error = error;
    console.error("Erro ao carregar a lista de categorias:", error);
  }
}

async function alugarLivro(livro) {
  if (livro.copiasDisponiveis > 0) {
    livro.copiasDisponiveis--; 
    try {
      await api.put(`livro/${livro.id}`, { copiasDisponiveis: livro.copiasDisponiveis });
      console.log("Livro alugado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar o livro:", error);
    }
  } else {
    console.log("Não há cópias disponíveis para alugar.");
  }
}

async function devolverLivro(livro) {
  if (livro.copiasDisponiveis > 0 ) {
    livro.copiasDisponiveis++; 
    try {
      await api.put(`livro/${livro.id}`, { copiasDisponiveis: livro.copiasDisponiveis });
      console.log("Livro devolvido com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar o livro:", error);
    }
  } else {
    console.log("Não há cópias disponíveis para alugar ou o limite foi atingido.");
  }
}



async function salvar() {
  try {
    let resposta;
    if (livroSelecionado.value.id) {
      resposta = await api.put(
        `livro/${livroSelecionado.value.id}`,
        livroSelecionado.value
      );
    } else {
      resposta = await api.post("livro", livroSelecionado.value);
      livro.value.push(resposta.data);
    }
    dialogAtualizar.value = false;
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  try {
    const response = await api.get("livro");
    livro.value = response.data;
  } catch (error) {
    alert("Falha ao conectar com o servidor!");
    console.error("Erro ao carregar a lista de livro:", error);
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