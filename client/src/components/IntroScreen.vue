<script setup lang="ts">
import PetIllustration from './PetIllustration.vue';
import GraphicShape from './GraphicShape.vue';
defineEmits<{ start: [] }>();
</script>

<template>
  <section class="intro" data-screen="intro">
    <div class="hero-copy">
      <span class="eyebrow"><GraphicShape class="tiny-star" kind="flower" /> UM NOVO COMEÇO, COM RESPONSABILIDADE</span>
      <h1 tabindex="-1" data-focus>Não é só adotar.<br />É acolher <em>uma vida.</em></h1>
      <p class="hero-description">O amor é o começo. Tempo, cuidado e planejamento fazem parte do caminho.</p>
      <p class="hero-support">Descubra o que considerar antes de abrir as portas da sua casa — e do seu coração — para um animal.</p>
      <button class="button button-primary hero-button" data-action="start" @click="$emit('start')">
        Inicie a avaliação <span aria-hidden="true">↗</span>
      </button>
      <p class="button-caption"><span aria-hidden="true">✓</span> 8 perguntas · Sem cadastro · No seu ritmo</p>
    </div>
    <div class="hero-art">
      <GraphicShape class="art-heart" kind="heart" />
      <GraphicShape class="art-ribbon" kind="ribbon" />
      <span class="art-label">um lar muda tudo.</span>
      <PetIllustration />
      <span class="art-sticker"><GraphicShape kind="heart" /> carinho também<br />é responsabilidade</span>
    </div>
    <div class="intro-bottom">
      <div class="intro-message"><GraphicShape class="flower" kind="flower" /><p>Uma escolha consciente.<br /><strong>Uma história mais feliz.</strong></p></div>
      <p>Este projeto escolar incentiva adoções responsáveis e contribui para a reflexão sobre a prevenção do abandono animal.</p>
      <span class="handwritten">Sem nota. Sem julgamento.<br />Só reflexão.</span>
    </div>
  </section>
</template>
