<template>
  <mobile-header title="Профиль"/>

  <!-- Авторизованный -->
  <div class="account" v-if="authStore.isAuth">

    <div class="account__block">
      <div class="title">Мои данные</div>
      <personal-data/>
    </div>

    <div class="account__block">
      <div class="title">Мои дети</div>
      <children/>
    </div>

    <div class="account__block">
      <div class="title">Записи</div>
      <registrations @select="selectRegistration($event)"/>
    </div>

  </div>

  <!-- Не авторизованный -->
  <div class="account" v-else>
    <div class="account__auth">
      <p class="account__auth-text">Войдите что бы вы могли записываться и смотреть расписание</p>
      <base-button @click="openAuth = true">Вход / Регистрация</base-button>
    </div>
  </div>

  <auth-modal v-model:open="openAuth"/>
</template>

<script setup>
import MobileHeader from "../../components/common/layoutComponents/mobileHeader";
import PersonalData from "../../components/common/account/personalData";
import Children from "../../components/common/account/children";
import {useAuthStore} from "../../store/client/parent/auth";
import AuthModal from "../../components/common/auth/authModal";
import BaseButton from "../../components/base/BaseButton";
import Registrations from "../../components/common/account/registrations";
import {useRouter} from "nuxt/app";
const authStore = useAuthStore();

const openAuth = ref(false);

// Перейти в детализацию записи
const router = useRouter();
const selectRegistration = registration => {
  router.push(`/account/registrations/${registration.id}`)
}

useSeoMeta({
  title: "Kidup - личный кабинет",
  ogTitle: "Kidup - личный кабинет",
})
</script>

<style lang="scss" scoped>
.account {
  padding: 0 $side-space-mobile;

  &__block {
    &:first-child {margin-top: 16px}
    margin: 32px 0;
  }

  &__user-info {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  &__auth {
    text-align: center;
    margin-top: 200px;
  }

  &__auth-text {
    color: $color--gray-dark;
    margin: 12px 0;
  }

}
</style>