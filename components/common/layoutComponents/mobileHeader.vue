<template>
  <header class="mobile-header mobile-header--two-cols--right"
          :class="[{'mobile-header--three-cols': isThreeCols}, {'mobile-header--three-cols': isTwoColsLeft}, {'mobile-header--two-cols--right': isTwoColsRight}]"
          v-if="!$device.isDesktop">
    <slot name="left">
      <button class="mobile-header__go-back" v-if="props.goBack" @click="goBackHandle()">
        <base-icon name="mdi-chevron-left" size="36"/>
      </button>
    </slot>
    <div class="mobile-header__title" :class="{'mobile-header__title--big': !goBack}">
      <slot>{{ title }}</slot>
    </div>
    <div class="mobile-header__right">
      <slot name="right">
        <lang-switch/>
      </slot>
    </div>
  </header>
</template>

<script setup>
import BaseIcon from "../../base/BaseIcon";
import {computed} from "vue";
import LangSwitch from "./langSwitch";
const { $device, $goBack } = useNuxtApp();
const slots = defineSlots()
const props = defineProps({
  title: {
    type: String
  },
  goBack: {
    type: [String, Function],
    default: null
  }
})

// Нажатие перейти назад
const goBackHandle = () => {
  if (typeof props.goBack === "string") $goBack(props.goBack || "/");
  else if (typeof props.goBack === "function") props.goBack()
}

const isTwoColsLeft = computed(() => (slots.left || props.goBack) && !slots.right);
const isTwoColsRight = computed(() => !(slots.left || props.goBack) && slots.right);
const isThreeCols = computed(() => (slots.left || props.goBack) && slots.right);
</script>

<style lang="scss" scoped>
$side-column-size: 60px;
.mobile-header {
  display: grid;
  align-items: center;
  grid-template-columns: 1fr;
  height: $header-height;
  font-weight: bold;
  background-color: white;
  padding: 0 $side-space-mobile;
  grid-column-gap: 8px;

  &--two-cols--right {
    display: grid;
    align-items: center;
    grid-template-columns: 1fr $side-column-size;
  }

  &--two-cols--left {
    display: grid;
    align-items: center;
    grid-template-columns: $side-column-size 1fr;
  }

  &--three-cols {
    display: grid;
    align-items: center;
    grid-template-columns: $side-column-size 1fr $side-column-size;
  }

  &__go-back {
    width: 36px;
    color: $color--blue;
  }

  &__title {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: $fs--title;

    &--big {
      font-size: $fs--big-title;
    }
  }

  &__right {
    display: flex;
    justify-content: flex-end;
    color: $color--black;
  }
}
</style>