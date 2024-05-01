<template>
  <mobile-header
      :title="subjectName"
      go-back="/catalog/almaty/lessons"
  />

  <div :class="{'lesson-info--mobile': !$device.isDesktop, 'lesson-info--desktop': $device.isDesktop}">
    <div class="base-info">
      <base-mini-photos
        class="photos"
        v-if="photos"
        :list="photos"
        :rounded="false"
      />

      <div class="main container--white">
        <h1 class="title">{{ lessonName }}</h1>

        <div class="lesson-price" v-if="price.short">{{ price.short }} ₸/мес</div>

        <p class="description">
          <span v-if="age.range">{{ age.range }}</span>
          <span class="description-divider" v-if="language.ru"/>
          <span v-if="language.ru">Рус</span>
          <span class="description-divider" v-if="language.kz"/>
          <span v-if="language.kz">Каз</span>
        </p>

        <pre class="description-text">{{ lessonDescription }}</pre>
      </div>
    </div>

    <div class="timetable" id="timetable">
      <p v-if="!groups.length" class="description">Уточните расписание у центра</p>
      <div class="groups" v-else>
        <lesson-group
          v-for="(group, index) in groups"
          :info="group"
          :index="index"
          selectable
          @select="selectGroupHandle(group)"
        />
      </div>
    </div>

    <div class="location container--white">
      <h3 class="title">Местоположение</h3>
      <base-yandex-mini-map
          :branches="branches"
          height="150px"
      />
    </div>

    <!-- Контакты -->
    <div class="center-info-contacts container--white">
      <h3 class="center-info-title">Контакты</h3>
      <div v-if="institutionInfo?.call_phone">Телефон: <a :href="`tel:+${institutionInfo.call_phone}`">{{ institutionInfo.call_phone }}</a></div>
      <div v-if="institutionInfo?.whatsapp_phone">WhatsApp: <a :href="`https://wa.me/${institutionInfo.whatsapp_phone}`">Написать</a></div>
    </div>

    <center-card
        class="center-info"
        v-if="institutionInfo"
        :info="institutionInfo"
        full
    />
  </div>
</template>

<script setup>
import {useLessonDetailsStore} from "../../../../store/details/lesson";
import {useRoute, useRouter} from "nuxt/app";
import MobileHeader from "../../../../components/common/layoutComponents/mobileHeader";
import {computed, onMounted} from "vue";
import BaseMiniPhotos from "../../../../components/base/BaseMiniPhotos";
import CenterCard from "../../../../components/common/miniCards/centerCard";
import {useCenterDetailsStore} from "../../../../store/details/center";
import LessonGroup from "../../../../components/common/lesson/lessonGroup";
import LessonContacts from "../../../../components/common/lesson/lessonContacts";
import BaseYandexMiniMap from "../../../../components/base/BaseYandexMiniMap";
import CallRequest from "../../../../components/common/lesson/callRequest";
import {useSubjectsStore} from "../../../../store/subjects";

const { $device } = useNuxtApp();

const router = useRouter();
const route = useRoute();
const lessonDetailsStore = useLessonDetailsStore();
const lessonId = computed(() => +route.params.id);
const lessonInfo = computed(() => lessonDetailsStore.getLessonInfo || {});
await lessonDetailsStore.fetchLessonInfo({id: lessonId.value});

const centerDetailsStore = useCenterDetailsStore();
const isCenterLoading = ref(true);
const institutionInfo = computed(() => centerDetailsStore.getCenterInfo)
const fetchCenterInfo = async () => {
  isCenterLoading.value = true;
  await centerDetailsStore.fetchCenterInfo({id: lessonInfo.value.institution_id})
  isCenterLoading.value = false;
}

// Информация центра
const lessonName = computed(() => lessonInfo.value.name)
const subjectName = computed(() => lessonInfo.value?.subject?.name);
const lessonDescription = computed(() => lessonInfo.value.description)
const photos = computed(() => lessonInfo.value.photos)
const groups = computed(() => lessonInfo.value.institutionGroups || []);
const branches = computed(() => groups.value
    .map(group => group.institutionBranch)
    .filter((group, index, self) => index === self.findIndex((g) => g.id === group.id))
);

useSeoMeta({
  title: () => lessonName.value,
  ogTitle: () => lessonName.value,
})

// Цена {min, max}
const price = computed(() => {
  let minPrice = null;
  let maxPrice = null;
  groups.value.forEach(group => {
    if (typeof group.price === "number") {
      if (!minPrice || group.price < minPrice) minPrice = group.price;
      if (!maxPrice || group.price > maxPrice) maxPrice = group.price;
    }
  })
  return {
    max: maxPrice,
    min: minPrice,
    short: (minPrice === maxPrice ? (minPrice || "") : `от ${minPrice}`),
    range: (minPrice === maxPrice ? (minPrice || "") : `${minPrice} - ${maxPrice}`) + ((minPrice || maxPrice) ? " ₸" : "")
  };
})

// Возраст
const age = computed(() => {
  let minAge = 100;
  let maxAge = null;
  groups.value.forEach(group => {
    if (typeof group.min_age === "number" && (!group.min_age || group.min_age < minAge)) minAge = group.min_age;
    if (typeof group.min_age === "number" && group.max_age > maxAge) maxAge = group.max_age;
  })
  return {
    min: minAge,
    max: maxAge,
    range: (minAge && `${minAge}` || "") + (maxAge && ` - ${maxAge}` || "") + ((minAge || maxAge) ? " лет" : "")
  }
})

// Язык
const language = computed(() => ({
  kz: groups.value.some(group => group.language_kz),
  ru: groups.value.some(group => group.language_ru),
}))

const selectGroupHandle = group => {
  router.push(`/catalog/details/lesson-${lessonId.value}/group-${group.id}`)
}

onMounted(() => {
  fetchCenterInfo();
})
</script>

<style lang="scss" scoped>
.lesson-info--mobile {

  .photos {
    height: 80vw;
    max-height: 400px;
    background-color: white;
  }

  .title {
    font-size: $fs--title;
    margin-bottom: 4px;
  }

  .lesson-price {
    font-size: $fs--title;
    margin-bottom: 12px;
  }

  .description {
    display: flex;
    align-items: center;
    color: $color--black;
    font-size: $fs--default;
    font-weight: normal;
    margin-top: 8px;
  }

  .description-text {
    white-space: pre-wrap;
    font-size: $fs--mini;
    margin: 8px 0;
  }

  .description-divider {
    display: inline-block;
    height: 5px;
    width: 5px;
    border-radius: 100%;
    background: #222222b0;
    content: "";
    margin: 0 8px;
  }

  .timetable {
    margin: 16px 0;
  }

  .center-info {
    margin: 16px 0;
  }

  .location {
    margin: 16px 0;
  }

  .groups {
    margin-top: 16px;
  }

  .center-info-title {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    font-size: $fs--title;
    margin-bottom: 8px;
  }

}

.lesson-info--desktop {
  margin-top: $side-space-desktop;

  .base-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: $side-space-desktop;
  }

  .photos {
    height: 300px;
    max-height: 400px;
    background-color: white;
  }

  .title {
    font-size: $fs--title;
    margin-bottom: 8px;
  }

  .description {
    display: flex;
    align-items: center;
    color: $color--black;
    font-size: $fs--default;
    font-weight: normal;
    margin-top: 8px;
  }

  .description-text {
    white-space: pre-wrap;
    font-size: $fs--mini;
    margin: 8px 0;
  }

  .description-divider {
    display: inline-block;
    height: 5px;
    width: 5px;
    border-radius: 100%;
    background: #222222b0;
    content: "";
    margin: 0 8px;
  }

  .timetable {
    margin: 16px 0;
  }

  .center-info {
    margin: 16px 0;
  }

  .location {
    margin: 16px 0;
  }

  .groups {
    margin-top: 16px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 16px;
  }

  .center-info-title {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    font-size: $fs--title;
    margin-bottom: 8px;
  }

}

.center-info-contacts {
  line-height: 24px;
}
</style>