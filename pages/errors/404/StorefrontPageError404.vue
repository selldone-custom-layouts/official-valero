<!--
  - Copyright (c) 2024. Selldone® Business OS™
  -
  - Author: M.Pajuhaan
  - Web: https://selldone.com
  - ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  -
  - All rights reserved. In the weave of time, where traditions and innovations intermingle, this content was crafted.
  - From the essence of thought, through the corridors of creativity, each word, and sentiment has been molded.
  - Not just to exist, but to inspire. Like an artist's stroke or a sculptor's chisel, every nuance is deliberate.
  - Our journey is not just about reaching a destination, but about creating a masterpiece.
  - Tread carefully, for you're treading on dreams.
  -->
<template>
  <!-- Valero (404, design D): a huge outlined "404" in the serif, "Not on the
       shelf.", a search, the way back, and the aisles as a numbered index. -->
  <div class="t-404 k-wrap">
    <section class="t-404__top">
      <span aria-hidden="true" class="t-404__big">404</span>
      <p class="t-404__code">Page not found</p>
      <h1>Not on the shelf.</h1>
      <p class="t-404__lede">This page has been moved, sold out or was never stocked.</p>
      <form class="t-404__search" role="search" @submit.prevent="search">
        <input v-model.trim="q" aria-label="Search the shop" placeholder="Search milk, bread, berries…" type="search" />
        <button aria-label="Search" type="submit"><v-icon size="20">search</v-icon></button>
      </form>
      <div class="t-404__acts">
        <router-link :to="{ path: '/' }" class="t-btn -red">Back to the market</router-link>
        <router-link :to="deals" class="t-btn -line">This week’s offers</router-link>
      </div>
    </section>
    <section v-if="list.length" class="t-sec">
      <header class="t-sec__head"><h2 class="t-sec__title">Or start with an aisle</h2></header>
      <div class="t-404__aisles">
        <router-link v-for="(a, i) in list.slice(0, 8)" :key="a.id" :to="aisleRoute(a)">
          <span class="t-404__n">{{ String(i + 1).padStart(2, "0") }}</span>{{ a.title || a.name }}
        </router-link>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { aisleImage, aisleRoute, aisles, dealsRoute, featured, tintFor } from "../../../components/kalio/kalio-catalog";

export default defineComponent({
  name: "StorefrontPageError404",
  data: () => ({ q: "", list: [] as any[] }),
  computed: {
    shop() {
      return this.getShop();
    },
    deals() {
      return dealsRoute();
    },
  },
  mounted() {
    aisles().then((list: any[]) => (this.list = featured(list)));
  },
  methods: {
    aisleImage,
    aisleRoute,
    tint(aisle: any) {
      return tintFor(aisle) || "#f2f2f2";
    },
    search() {
      if (!this.q) return;
      this.$router.push({ name: window.$storefront.routes.SHOP_PAGE, query: { search: this.q } });
    },
  },
});
</script>
<style scoped lang="scss"></style>
