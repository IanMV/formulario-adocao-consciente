<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ open: boolean; loading: boolean }>();
const emit = defineEmits<{ cancel: []; confirm: [] }>();
const dialog = ref<HTMLDialogElement | null>(null);

watch(() => props.open, (open) => {
  if (open && !dialog.value?.open) dialog.value?.showModal();
  else if (!open && dialog.value?.open) dialog.value.close();
}, { flush: 'post' });
</script>

<template>
  <dialog ref="dialog" class="exit-dialog" aria-labelledby="exit-title" aria-describedby="exit-description" @cancel.prevent="emit('cancel')" @click="($event.target === dialog) && emit('cancel')">
    <div class="dialog-content">
      <span class="dialog-symbol" aria-hidden="true">♡</span>
      <h2 id="exit-title">Voltar ao início?</h2>
      <p id="exit-description">Suas respostas serão descartadas.<template v-if="loading"> A espera pela avaliação será cancelada nesta página, mas o Google pode continuar o processamento.</template></p>
      <div class="dialog-actions">
        <button class="button button-primary" autofocus data-action="cancel-exit" @click="emit('cancel')">Continuar preenchendo</button>
        <button class="button button-secondary" data-action="confirm-exit" @click="emit('confirm')">Descartar e voltar</button>
      </div>
    </div>
  </dialog>
</template>
