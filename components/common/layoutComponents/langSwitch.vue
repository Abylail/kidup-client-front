<template>
  <div class="lang-switch">
    <div class="lang-switch__locale" :class="{active: $i18n.locale === 'ru'}" @click="switchLangHandle('ru')">Рус</div>
    <div class="lang-switch__locale" :class="{active: $i18n.locale === 'kz'}" @click="switchLangHandle('kz')">Каз</div>
  </div>
</template>

<script setup>
import {computed} from "vue";
const nuxtApp = useNuxtApp();

const locale = computed(() => "ru")
const switchLangHandle = lang => {
  nuxtApp.$i18n.locale = lang;
}
</script>

<style lang="scss" scoped>
.lang-switch {
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 8px;

  &__locale {
    font-size: $fs--nano;
    &.active {
      color: $color--blue;
      border: 1px solid $color--blue;
      padding: 2px 4px;
      border-radius: 10px;
    }
  }

}
</style>