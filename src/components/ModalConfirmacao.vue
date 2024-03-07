<template>
  <v-dialog v-model="dialog" @click:outside="fecharModal" width="350">
    <v-card class="pa-4" rounded="xl">
      <v-card-title>Confirmação</v-card-title>
      <v-card-text>
        <p>{{ texto }}</p>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn text color="primary" @click="$emit('sim')">Sim</v-btn>
        <v-btn text color="error" @click="fecharModal">Não</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
//vue
import { defineProps, ref, watch, defineEmits } from "vue";

//propriedades
const props = defineProps({
  texto: {
    type: String,
    default: "Tem certeza que deseja excluir o registro ?",
  },
  dialogConfirmacao: {
    type: Boolean,
    default: false,
  },
});

//variaveis reativas
const dialog = ref(false);

//variaveis
const emit = defineEmits(["change"]);

watch(
  () => props.dialogConfirmacao,
  (newValue) => {
    dialog.value = newValue;
  }
);

const fecharModal = () => {
  emitChange(false);
};

const emitChange = (value) => {
  emit("change", value);
};
</script>