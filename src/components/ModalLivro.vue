<template>
    <v-dialog v-model="dialog" @click:outside="fecharModal" width="350">
      <v-card class="pa-6" rounded="xl">
        <slot />
        <v-card-actions class="d-flex justify-end">
          <v-btn color="success" :loading="loadingEvent" text @click="$emit('salvar')">Gravar</v-btn>
          <v-btn color="error" text @click="fecharModal">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  //vue
  import { defineProps, ref, watch, defineEmits} from 'vue';
  
  //propriedades
  const props = defineProps({
    dialogLivro: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  });
  
  //variaveis reativas
  const dialog = ref(false);
  const loadingEvent = ref(false); 
  
  //variaveis
  const emit = defineEmits(["change"]);
  
  watch([() => props.dialogLivro, () => props.loading], ([newDialogLivro, newLoading]) => {
  dialog.value = newDialogLivro;
  loadingEvent.value = newLoading;
});
  
  const fecharModal = () => {
    emitChange(false);
  };
  
  const emitChange = (value) => {
    emit('change', value);
  };
  </script>