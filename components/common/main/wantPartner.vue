<template>
  <div class="container want-partner">
    <h2 class="title want-partner__title">Расскажите о вашем центре</h2>
    <div class="want-partner__image"/>
    <base-button type="yellow" full-width @click="goPartner()">Стать партнером</base-button>
  </div>
</template>

<script setup>
import BaseButton from "../../base/BaseButton";

const goPartner = () => window.location.href = 'https://kidup.kz/adminpanel'
</script>

<style lang="scss" scoped>
.want-partner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  margin-top: 20px;
  margin-bottom: 20px;
  background-color: #004bff4d;
  max-width: 500px;
  padding: 8px;

  &__title {
    text-align: center;
  }

  &__image {
    width: 100%;
    max-width: 500px;
    height: 250px;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url("/wantPartner.png");
    margin-bottom: 20px;
  }

}
</style>