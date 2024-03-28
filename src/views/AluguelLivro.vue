<template>
    <v-card class="mx-auto mt-10 pa-5" max-width="800">
        <form @submit.prevent="submit">
            <v-card-title>Aluguel/Devolução</v-card-title>

            <v-select v-model="selectLivro.value.value" :error-messages="selectLivro.errorMessage.value"
                :items="listarLivro" item-title="nome" item-value="id" @click="buscarLivros()"
                label="Selecione o livro"></v-select>

            <v-select v-model="selectTipo.value.value" :error-messages="selectTipo.errorMessage.value" :items="items"
                label="Tipo"></v-select>

            <v-text-field v-model="quantidade.value.value" min="0" type="number"
                :error-messages="quantidade.errorMessage.value" label="Quantidade"></v-text-field>
            <v-card-actions>
                <v-btn color="green" class="me-4" type="submit">
                    salvar
                </v-btn>

                <v-btn @click="handleReset">
                    limpar
                </v-btn>
            </v-card-actions>
        </form>
    </v-card>
</template>
<script setup>
//vue
import { onMounted, ref } from 'vue'
import { useField, useForm } from 'vee-validate'

//Serviços
import { api } from '../Services/api.js'

//Variaveis reativas
const listarLivro = ref([]);

//Regras de formulario
const { handleSubmit, handleReset } = useForm({
    validationSchema: {
        quantidade(value) {
            if (value > 0) return true

            return 'A quantidade deve ser maior que zero.'
        },
        selectLivro(value) {
            if (value) return true

            return 'Selecione um item.'
        },
        selectTipo(value) {
            if (value) return true

            return 'Selecione um tipo.'
        },
    },
})
const quantidade = useField('quantidade')
const selectTipo = useField('selectTipo')
const selectLivro = useField('selectLivro')

const items = ref([
    'Alugar',
    'Devolver'
])

const submit = handleSubmit(values => {
    alert(JSON.stringify(values, null, 2))
    return manipularLivro(values);

})

//Funções
async function buscarLivros() {
    try {
        const response = await api.get("livro");
        if (response.data && Array.isArray(response.data)) {
            listarLivro.value = response.data.map((livro) => ({
                nome: livro.titulo,
                id: livro.id,
            }));
        } else {
            console.error("Resposta inválida da API para 'livros'.", response);
        }
    } catch (error) {
        this.error = error;
        console.error("Erro ao carregar a lista de livros:", error);
    }
}

async function alugarLivro(livro) {
    try {
        await api.put(`livro/${livro.selectLivro}/alugar`, { quantidade: livro.quantidade });
        console.log("Livro alugado com sucesso!");
    } catch (error) {
        console.error("Erro ao atualizar o livro:", error);
    }
}

async function devolverLivro(livro) {
    try {
        await api.put(`livro/${livro.selectLivro}/devolver`, { quantidade: livro.quantidade });
        console.log("Livro devolvido com sucesso!");
    } catch (error) {
        console.error("Erro ao atualizar o livro:", error);
    }
}

function manipularLivro(livro) {
    if (selectTipo.value.value == "Alugar") {
        return alugarLivro(livro);
    }
    return devolverLivro(livro);
}

function quantidadeLivro() {
    quantidade.value.value = 0
}

onMounted(quantidadeLivro); 
</script>