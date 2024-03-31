<template>
  <v-alert
    v-model="dialog"
    class="custom-alert fade-out mt-10"
    width="350"
    rounded="xl"
    title="Sucesso"
    type="success"
  ><p>{{ texto }}</p>
  <v-btn variant="outlined" @click="fecharModal">Ok</v-btn>
</v-alert>
  
</template>

<script setup>
//vue
import { defineProps, ref, watch, defineEmits } from "vue";

//propriedades
const props = defineProps({
  texto: {
    type: String,
    default: "Item registrado com sucesso!",
  },
  dialogSucesso: {
    type: Boolean,
    default: false,
  },
});

//variaveis reativas
const dialog = ref(false);

//variaveis
const emit = defineEmits(["change"]);

watch(
  () => props.dialogSucesso,
  (newValue) => {
    dialog.value = newValue;
    if (newValue) {
      setTimeout(() => {
        fecharModal();
      }, 9000); 
    }
  }
);

const fecharModal = () => {
  emitChange(false);
};

const emitChange = (value) => {
  emit("change", value);
};
</script>

<style scoped>
.custom-alert {
  position: fixed;
  top: 5%;
  right: 5%;
  width: 90%;
}

.fade-out {
  animation: fadeOut 6s ease forwards;
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>