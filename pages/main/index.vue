<template>
  <mobile-header :lang-switch="false">
    <div class="main-page-mobile-header-title">
      <nuxt-img class="main-page-mini-logo" src="/logo.svg" alt="logo"/>
      <span>Kidup.kz</span>
    </div>
  </mobile-header>
  <div :class="[{'main-page--mobile': !$device.isDesktop}, {'main-page--desktop': $device.isDesktop}]">

    <div class="main-page-top">
      <banner/>
<!--      <subject-list class="container&#45;&#45;white main-page-block"/>-->
    </div>

    <!-- Топ центры -->
    <div class="main-page-block">
      <card-list title="Подборки уроков">
        <lessons-collection-card
            v-for="(lessonCollection, index) in lessonsCollections" :key="index"
            :title="lessonCollection.title"
            :image-path="lessonCollection.imagePath"
            :path="lessonCollection.path"
            @click="goCollection(lessonsCollections)"
        />
      </card-list>
    </div>

    <!-- Топ центры -->
    <div class="main-page-block">
      <card-list title="Топ центры" to="/catalog/almaty/centers">
        <center-card
            v-for="(lesson, index) in mainStore.getTopCenters" :key="index"
            :info="lesson"
        />
      </card-list>
    </div>

    <!-- Хочу стать партнером -->
    <want-partner/>

    <!-- Напишите нам -->
<!--    <still-questions/>-->

    <subjects-feed title="Интересные занятия"/>

  </div>
</template>

<script setup>
import MobileHeader from "../../components/common/layoutComponents/mobileHeader";
import CardList from "../../components/common/cardList";
import CenterCard from "../../components/common/miniCards/centerCard";
import {useMainStore} from "../../store/main";
import SubjectList from "../../components/common/main/subjectList";
import SubjectsFeed from "../../components/common/main/subjectsFeed";
import StillQuestions from "../../components/common/main/stillQuestions";
import Banner from "../../components/common/main/banner";
import LessonsCollectionCard from "../../components/common/main/lessonsCollectionCard";
import WantPartner from "../../components/common/main/wantPartner";
const { $device } = useNuxtApp();

const mainStore = useMainStore();

// Запрашиваю инетересные уроки
mainStore.fetchCategories();
mainStore.fetchTopCenters();

const lessonsCollections = [
  {title: "Творческое развитие", imagePath: "/tvorchestvo.gif.mp4", path: "/catalog/almaty/lessons/?category=tvorchestvo"},
  {title: "Логическое мышление", imagePath: "/logic.gif.mp4", path: "/catalog/almaty/lessons/?category=razvitie"},
  {title: "Боевой дух", imagePath: "/boevye.gif.mp4", path: "/catalog/almaty/lessons/?category=boevye_iskusstva"},
  {title: "Раннее развитие", imagePath: "/rannee_razvitye.gif.mp4", path: "/catalog/almaty/lessons/?category=rannee_razvitie"},
]

const goCollection = (collection) => {
  console.log(collection)
}

definePageMeta({
  key: (route) => route.fullPath,
  keepalive: true
})

</script>

<style lang="scss" scoped>
.main-page-mobile-header-title {
  display: flex;
  align-items: center;
  justify-content: left;
  width: 100%;
  font-size: $fs--title;
}
.main-page-mini-logo {
  height: 50px;
}
.main-page--mobile {

  .main-page-mobile-header-title {
    display: flex;
    align-items: center;
    justify-content: left;
    width: 100%;
  }

  .main-page-search-wrapper {
    padding: $side-space-mobile;
    background-color: white;;
  }

  .main-page-mini-logo {
    height: 50px;
  }

  .main-page-title {
    font-size: $fs--title;
    font-weight: normal;
  }

  .main-page-block {
    margin: 16px 0;
  }

  .main-page-steps {
    margin-top: 16px;
  }

  .main-page-step {
    display: flex;
    align-items: center;
    margin-top: 16px;
  }

  .main-page-step-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 100%;
    background-color: $color--red;
    color: white;
    margin-right: 8px;
  }

}
.main-page--desktop {

  .main-page-mobile-header-title {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .main-page-search-wrapper {
    padding: $side-space-mobile;
    background-color: white;;
  }

  .main-page-top {
    display: grid;
    grid-template-columns: 540px 1fr;
    margin: 16px 0;
  }

  .main-page-mini-logo {
    height: 50px;
  }

  .main-page-title {
    font-size: $fs--title;
    font-weight: normal;
  }

  .main-page-block {

  }

  .main-page-steps {
    margin-top: 16px;
  }

  .main-page-step {
    display: flex;
    align-items: center;
    margin-top: 16px;
  }

  .main-page-step-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 100%;
    background-color: $color--red;
    color: white;
    margin-right: 8px;
  }

}
</style>