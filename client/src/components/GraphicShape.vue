<script setup lang="ts">
withDefaults(defineProps<{ kind?: 'heart' | 'star' | 'flower' | 'ribbon' }>(), { kind: 'star' });
</script>

<template>
  <svg class="graphic-shape" viewBox="0 0 100 100" fill="currentColor" aria-hidden="true" focusable="false">
    <path v-if="kind === 'heart'" d="M50 88 14 53C-9 28 22 1 43 22l7 8 7-8c21-21 52 6 29 31Z" />
    <path v-else-if="kind === 'star'" d="m50 2 11 30 30-15-15 30 23 14-34 4-5 33-16-29-29 20 12-32L0 44l33-7Z" />
    <path v-else-if="kind === 'flower'" d="M50 32C21-15-8 23 28 48-17 74 23 108 49 71c22 44 66 8 23-20 44-24 6-65-22-19Z" />
    <path v-else d="M18 6c72 2-10 32 44 42s8 40 26 46H57c-25-15 21-30-22-38S62 24 10 22Z" />
  </svg>
</template>
