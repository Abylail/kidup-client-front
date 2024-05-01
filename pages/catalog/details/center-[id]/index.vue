<template>
  <mobile-header
      :title="centerInfo.name"
      go-back="/catalog/almaty/centers"
  />

  <div :class="{'center-info--mobile': !$device.isDesktop, 'center-info--desktop': $device.isDesktop}">
    <div class="center-info-head">
    <base-mini-photos
        class="center-info-photos"
        v-if="photos"
        :list="photos"
        :rounded="false"
    />

    <div class="center-info-main container--white">
      <h1 class="center-info-title">
        <img class="center-info-logo" v-if="logoUrl" :src="logoUrl" alt="logo"/>
        <span>{{ centerInfo.name }}</span>
      </h1>

      <p class="center-info-description">
        <span>
          <base-icon class="center-info-description-icon" name="mdi-star" color="#dbdb2f"/>
          <span>{{ centerInfo.rating }}</span>
        </span>
        <span>
          <base-icon class="center-info-description-icon" name="mdi-clock-time-eight-outline"/>
          <span>{{ workTime }}</span>
        </span>
        <span>
          <base-icon class="center-info-description-icon" name="mdi-account-group"/>
          <span>{{ groups.length }} групп</span>
        </span>
      </p>

      <pre class="center-info-description-text"><base-cut-text :text="centerInfo.description" :max-symbols="300"/></pre>
    </div>
    </div>

    <div class="center-info-go-subjects container" v-if="!$device.isDesktop">
      <base-button type="outline" full-width @click="goSubjects()">Записаться</base-button>
    </div>

    <div class="center-info-contacts container--white">
      <h3 class="center-info-title">Контакты</h3>
      <div v-if="centerInfo.call_phone">Телефон: <a :href="`tel:+${centerInfo.call_phone}`">{{ centerInfo.call_phone }}</a></div>
      <div v-if="centerInfo.whatsapp_phone">WhatsApp: <a :href="`https://wa.me/${centerInfo.whatsapp_phone}`">Написать</a></div>
    </div>

    <div class="center-info-map container--white">
      <h3 class="center-info-title">Местоположение</h3>
      <base-yandex-mini-map
          :branches="branches"
          :height="mapHeight"
      />
    </div>

    <div class="center-info-subjects" id="subjects">
      <h3 class="center-info-title container">Уроки в центре</h3>
      <subject-card
        class="center-info-subject"
        v-for="subject in subjects" :key="subject.id"
        :info="subject"
        full
      />
    </div>

    <!-- Предметы -->

  </div>
</template>

<script setup>
import MobileHeader from "../../../../components/common/layoutComponents/mobileHeader";
import {useCenterDetailsStore} from "../../../../store/details/center";
import {useRoute, useRouter, useRuntimeConfig} from "nuxt/app";
import {computed, onMounted} from "vue";
import BaseMiniPhotos from "../../../../components/base/BaseMiniPhotos";
import BaseIcon from "../../../../components/base/BaseIcon";
import LessonContacts from "../../../../components/common/lesson/lessonContacts";
import SubjectCard from "../../../../components/common/miniCards/subjectCard";
import BaseYandexMiniMap from "../../../../components/base/BaseYandexMiniMap";
import BaseCutText from "../../../../components/base/BaseCutText";
import BaseButton from "../../../../components/base/BaseButton";
import CallRequest from "../../../../components/common/lesson/callRequest";

const config = useRuntimeConfig();
const { $device } = useNuxtApp();

const route = useRoute();
const centerId = computed(() => +route.params.id);
const centerStore = useCenterDetailsStore();
const centerInfo = computed(() => centerStore.getCenterInfo || {});
await centerStore.fetchCenterInfo({id: centerId.value});

useSeoMeta({
  title: () => centerInfo.value?.name,
  ogTitle: () => centerInfo.value?.name,
})

const groups = computed(() => centerInfo.value.institutionGroups || []);
const branches = computed(() => centerInfo.value.institutionBranches || []);
const photos = computed(() => centerInfo.value.photos);
const workTime = computed(() => `${centerInfo.value.start_time} - ${centerInfo.value.end_time}`)
const logoUrl = computed(() => centerInfo.value?.logo && (config.public.CDN_URL + centerInfo.value?.logo) || null);

const mapHeight = computed(() => $device.isDesktop ? "300px" : "150px")

const isSubjectsLoading = ref(true);
const subjects = computed(() => centerStore.getSubjects || []);
const fetchSubjects = async () => {
  isSubjectsLoading.value = true;
  await centerStore.fetchCenterSubjects({id: centerId.value})
  isSubjectsLoading.value = false;
}

const router = useRouter()
const goSubjects = () => {
  router.replace({hash: "#subjects"})
}

onMounted(() => {
  fetchSubjects();
})
</script>

<style lang="scss" scoped>
.center-info--mobile {

  .center-info-photos {
    height: 80vw;
    max-height: 400px;
    background-color: white;
  }

  .center-info-title {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    font-size: $fs--title;
    margin-bottom: 8px;
  }

  .center-info-logo {
    width: 32px;
    height: 32px;
    background: white;
    padding: 4px;
    border-right: 60px;
    margin-right: 8px;
    border-radius: 32px;
  }

  .center-info-description {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: $color--black;
    font-weight: normal;
    margin-top: 8px;
    font-size: $fs--default;

    & > * {
      display: flex;
      align-items: center;
    }
  }

  .center-info-description-text {
    white-space: pre-wrap;
    font-size: $fs--mini;
    margin: 8px 0;
  }

  .center-info-description-icon {
    color: $color--blue;
    margin-right: 4px;
  }

  .center-info-go-subjects {
    margin: 16px 0;
  }

  .center-info-contacts {
    margin: 16px 0;
    line-height: 24px;
  }

  .center-info-map {
    margin: 16px 0;
  }

  .center-info-subjects {
    margin-top: 16px;
    padding-top: 8px;
  }

  .center-info-subject {
    margin: 8px 0;
  }

}

.center-info--desktop {
  margin-top: 25px;

  .center-info-head {
    grid-column-gap: 25px;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .center-info-photos {
    height: 80vw;
    max-height: 400px;
    background-color: white;
  }

  .center-info-title {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    font-size: $fs--title;
    margin-bottom: 8px;
  }

  .center-info-logo {
    width: 32px;
    height: 32px;
    background: white;
    padding: 4px;
    border-right: 60px;
    margin-right: 8px;
    border-radius: 32px;
  }

  .center-info-description {
    display: flex;
    flex-direction: column;
    color: $color--black;
    font-weight: normal;
    margin-top: 8px;
    font-size: $fs--default;

    & > * {
      display: flex;
      align-items: center;
    }
  }

  .center-info-extra-info {
    grid-column-gap: 25px;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .center-info-description-text {
    white-space: pre-wrap;
    font-size: $fs--mini;
    margin: 8px 0;
  }

  .center-info-description-icon {
    color: $color--blue;
    margin-right: 4px;
  }

  .center-info-go-subjects {
    margin: 16px 0;
  }

  .center-info-contacts {
    max-width: 300px;
    line-height: 24px;
  }

  .center-info-subjects {
    margin-top: 16px;
    padding-top: 8px;
  }

  .center-info-subject {
    margin: 8px 0;
  }

}
</style>