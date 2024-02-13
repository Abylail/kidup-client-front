<template>
  <mobile-header>
    <div class="search-head">
      <nuxt-img class="search-head-logo"  src="/logo.svg" alt="logo"/>
      <span>Kidup.kz</span>
    </div>
  </mobile-header>

  <div class="toy-filter">
    <div class="toy-filter-right">Возраст</div>
    <base-select
        :model-value="activeAgeKey"
        :options="ages"
        view-type="mini"
        @update:modelValue="selectAge($event)"
    />
  </div>

  <div :class="[{'toy-page--mobile': !$device.isDesktop}, {'toy-page--desktop': $device.isDesktop}]">
    <h1 class="container toy-title">Список игрушек</h1>
    <div class="toy-list">
      <toy-card
        v-for="toy in toysStore.getList" :key="toy.id"
        :toy="toy"
        basket
      />
    </div>
    <base-loader v-if="isLoading" center-horizontal/>
  </div>

  <cart-window/>
</template>

<script setup>
import MobileHeader from "../../components/common/layoutComponents/mobileHeader";
import {useToysStore} from "../../store/toys";
import ToyCard from "../../components/common/miniCards/toyCard";
import {computed, nextTick, onMounted} from "vue";
import {useToysCartStore} from "../../store/toys/basket";
import CartWindow from "../../components/common/toys/cartWindow";
import BaseSelect from "../../components/base/BaseSelect";
import {useRoute, useRouter} from "nuxt/app";
import BaseLoader from "../../components/base/BaseLoader";
const { $device } = useNuxtApp();

const ages = [
  {name: "Любой возраст", key: "0", min: null, max: null},
  {name: "0 - 3 мес", key: "1", min: 0, max: 3},
  {name: "3 - 6 мес", key: "2", min: 3, max: 6},
  {name: "6 - 12 мес", key: "3", min: 6, max: 12},
  {name: "12 - 18 мес", key: "4", min: 12, max: 18},
  {name: "18 - 24 мес", key: "5", min: 18, max: 24},
  {name: "2 - 3 года", key: "6", min: 24, max: 36},
  {name: "3 - 5 лет", key: "7", min: 36, max: 60},
  {name: "5+ лет", key: "8", min: 60, max: null},
]

const router = useRouter();
const route = useRoute();
const activeAgeKey = computed(() => route.query?.ageKey || "0");
const activeAge = computed(() => ages.find(a => a.key === activeAgeKey.value) || ages[0]);

const toysStore = useToysStore();
const toysCartStore = useToysCartStore();

const isLoading = ref(false);
const fetchList = async () => {
  isLoading.value = true;
  await toysStore.fetchList({maxAge: activeAge.value.max, minAge: activeAge.value.min});
  isLoading.value = false;
}
await fetchList();

const selectAge = async (age) => {
  if (age === activeAgeKey.value) return;
  await router.replace({
    path: '/toys',
    query: {...route.query, ageKey: age || undefined}
  })
  fetchList()
}

onMounted(() => {
  toysCartStore.fetchCart();
})
</script>

<style lang="scss" scoped>
.search-head {
  display: flex;
  align-items: center;
  justify-content: left;
  width: 100%;
}

.search-head-logo {
  height: 50px;
}

.toy-list {
  display: flex;
  flex-wrap: wrap;
  column-gap: 12px;
  padding: 0 $side-space-mobile;
}

.toy-title {
  //margin-top: 16px;
  //color: $color--blue-dark;
  //font-size: $fs--default;
  //font-weight: normal;
  display: table-cell;
  vertical-align: bottom;
  font-size: 1rem;
  line-height: 1rem;
  font-weight: normal;
  height: 24px;
  padding: 0 16px;
  margin-top: 24px;
  margin-bottom: 8px;

}

.toy-page--mobile {
  margin-top: 24px;
}

.toy-filter {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: white;
  box-sizing: content-box !important;
  width: calc(100% - 32px);
  padding: 12px 16px;
  border-bottom: 3px solid #efefef;
  position: sticky;
  top: 0;
  z-index: 10;
}
</style>