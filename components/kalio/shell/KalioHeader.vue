<!--
  Valero — Header (design D, 7 November 2026): an after-dark food hall's top.
  A thin announcement line in champagne small caps (the shop's own
  free-shipping rule, pickup, its makers), then one black bar: text links on
  the left (Aisles opens a numbered index of every aisle, Offers, Journal,
  Makers), the wordmark in spaced serif capitals in the middle, and Search,
  Account and "Bag (n)" on the right. Search opens a full-width row under
  the bar. On a phone: Menu, the wordmark, a search mark and the bag.

  Started from Tario's header, itself Molino's: every working part is still
  the platform's — the search box and its events (the layout's
  onSearch/onClear), sign-in through the app's need-login event, the basket
  shown by Kalio's own drawer, the language and currency pickers (in the
  menu and the footer) and the basket count from the storefront mixin.
-->
<template>
  <header v-if="!$store.getters.getIsNative" class="k-header -valero">
    <!-- ▆▆▆▆▆▆▆▆ Announcement ▆▆▆▆▆▆▆▆ -->
    <div class="v-ann">
      <div :class="{ '-region': !compact }" class="v-ann__row k-wrap">
        <span v-if="promo">{{ t("valero.strip.freeOver", "Complimentary shipping over {price}", { price: money(promo.amount, promo.currency, true) }) }}</span>
        <router-link v-else :to="dealsRoute">{{ t("valero.offers", "This week’s offers") }}</router-link>
        <span v-if="hasPickup" class="-wide">{{ t("valero.strip.pickup", "Pickup is always free") }}</span>
        <span v-if="sellerList.length > 1" class="-wide">{{ t("valero.strip.makers", { one: "{n} independent maker, one bag", other: "{n} independent makers, one bag" }, { n: sellerList.length }) }}</span>
        <!-- The visitor's language and currency, at the strip's end (the
             owner's choice B, 10 November 2026: in the header, as Walmart
             and Amazon have it). The phone gets the menu's row instead. -->
        <div v-if="!compact" class="v-ann__region">
          <!-- Keyed on its title: it redraws when the visitor's language file arrives. -->
          <region-switcher-button :key="'rs-' + t('region.title')" button-class="v-ann__pill" />
        </div>
      </div>
    </div>

    <div class="k-header__bar">
      <div class="k-header__row v-hdr k-wrap">
        <nav :aria-label="t('valero.nav.shop', 'Shop')" class="v-hdr__side">
          <button v-if="compact" class="v-hdr__link" type="button" @click="menu = true">{{ t("header.menu", "Menu") }}</button>
          <template v-else>
            <v-menu
              v-if="aisleList.length"
              v-model="aisles_open"
              :close-on-content-click="true"
              location="bottom start"
              offset="22"
            >
              <template v-slot:activator="{ props }">
                <button :class="{ '-on': aisles_open }" class="v-hdr__link" type="button" v-bind="props">{{ t("header.aisles", "Aisles") }}</button>
              </template>
              <div class="v-index">
                <p class="v-caps v-index__eyebrow">{{ t("valero.theAisles", "The aisles") }}</p>
                <div class="v-index__grid">
                  <router-link v-for="(aisle, i) in aisleList" :key="aisle.id" :to="aisleRoute(aisle)" class="v-index__item">
                    <span class="v-index__n">{{ String(i + 1).padStart(2, "0") }}</span>{{ aisle.title || aisle.name }}
                  </router-link>
                </div>
                <div class="v-index__foot">
                  <router-link :to="dealsRoute" class="v-more">{{ t("valero.offers", "This week’s offers") }}</router-link>
                  <router-link :to="catalogueRoute" class="v-more">{{ t("header.everyProduct", "Every product") }}</router-link>
                </div>
              </div>
            </v-menu>
            <router-link :to="dealsRoute" class="v-hdr__link">{{ t("valero.nav.offers", "Offers") }}</router-link>
            <router-link :to="journalRoute" class="v-hdr__link">{{ t("blog.journal", "Journal") }}</router-link>
            <v-menu v-if="sellerList.length" location="bottom start" offset="22">
              <template v-slot:activator="{ props }">
                <button class="v-hdr__link" type="button" v-bind="props">{{ t("valero.nav.makers", "Makers") }}</button>
              </template>
              <div class="v-index -makers">
                <p class="v-caps v-index__eyebrow">{{ t("valero.theMakers", "The makers") }}</p>
                <router-link v-for="seller in sellerList" :key="seller.id" :to="sellerRoute(seller)" class="v-index__maker">
                  <img v-if="seller.icon" :src="vendorImage(seller, true)" alt="" height="40" loading="lazy" width="40" />
                  <span v-else class="v-index__initial">{{ (seller.name || "?").charAt(0) }}</span>
                  {{ seller.name }}
                </router-link>
              </div>
            </v-menu>
          </template>
        </nav>

        <router-link :to="homeRoute" :aria-label="t('header.home', '{shop} home', { shop: shopTitle })" class="k-header__brand v-hdr__brand">
          <img :src="BRAND.mark" alt="" class="k-brand-mark" height="34" width="34" /><span>{{ shopTitle }}</span>
        </router-link>

        <nav :aria-label="t('header.yourAccount', 'Your account')" class="v-hdr__side -end">
          <button
            v-if="showSearch"
            :aria-expanded="String(search_open)"
            :class="{ '-on': search_open }"
            :aria-label="t('common.search', 'Search')"
            class="v-hdr__link"
            type="button"
            @click="search_open = !search_open"
          >
            <v-icon v-if="compact" size="22">search</v-icon><template v-else>{{ t("common.search", "Search") }}</template>
          </button>
          <template v-if="!compact">
            <router-link v-if="user" :to="profileRoute" class="v-hdr__link">{{ t("valero.account", "Account") }}</router-link>
            <button v-else-if="!busyUser" class="v-hdr__link" type="button" @click="signIn">{{ t("common.signIn", "Sign in") }}</button>
          </template>
          <button :aria-label="t('header.basketAria', { one: 'Bag, {n} item', other: 'Bag, {n} items' }, { n: itemsCount })" class="v-hdr__link -bag" type="button" @click="basket = true">
            {{ t("header.basket", "Bag") }} <b>({{ itemsCount }})</b>
          </button>
        </nav>
      </div>

      <!-- Search: a full-width row under the bar. Selldone's box is mounted
           only when the row opens, so a phone keyboard never opens by itself. -->
      <div v-if="showSearch && search_open" class="v-search k-wrap">
        <s-storefront-search-box
          :dark="true"
          :expand-input="true"
          :negative-qr-margin="false"
          :title="$t('layout_shop.search_title', { shop_name: shopTitle })"
          color="primary"
          flat
          no-qr
          persistent-placeholder
          variant="underlined"
          @onClear="$emit('clear')"
          @onSearch="(event) => { search_open = false; $emit('search', event); }"
        />
        <button :aria-label="t('valero.closeSearch', 'Close search')" class="v-hdr__link" type="button" @click="search_open = false">{{ t("common.close", "Close") }}</button>
      </div>
    </div>

    <!-- ▆▆▆▆▆▆▆▆ Basket drawer ▆▆▆▆▆▆▆▆ -->
    <teleport to="body">
      <v-navigation-drawer
        v-model="basket"
        :location="$vuetify.locale.isRtl ? 'left' : 'right'"
        :width="windowWidth < 520 ? windowWidth : 460"
        class="k-drawer -basket"
        temporary
      >
        <div class="k-drawer__head">
          <p class="k-drawer__title">
            {{ t("cart.title", "Your bag") }}<small v-if="basketUnits">{{ t("cart.units", { one: "{n} item", other: "{n} items" }, { n: basketUnits }) }}</small>
          </p>
          <button :aria-label="t('common.close', 'Close')" class="k-header__icon" type="button" @click="basket = false">
            <v-icon>close</v-icon>
          </button>
        </div>
        <!-- Empty: Selldone's line "Your bag is empty." left the shopper
             nowhere to go; Kalio's offers the way back to the shelves. -->
        <div v-if="!itemsCount" class="k-drawer__empty">
          <span aria-hidden="true" class="k-drawer__empty-mark"><v-icon size="30">shopping_bag</v-icon></span>
          <p class="k-drawer__empty-title">{{ t("cart.empty.title", "Your bag is empty") }}</p>
          <p class="k-drawer__empty-text">{{ t("cart.empty.text", "Choose something from the aisles and it will wait for you here.") }}</p>
          <div class="k-drawer__empty-ctas">
            <router-link :to="dealsRoute" class="k-btn k-btn--solid" @click="basket = false">{{ t("valero.offers", "This week’s offers") }}</router-link>
            <router-link :to="catalogueRoute" class="k-btn k-btn--line" @click="basket = false">{{ t("cart.empty.browse", "Browse every product") }}</router-link>
          </div>
          <template v-if="aisleList.length">
            <p class="k-eyebrow k-drawer__empty-label">{{ t("cart.empty.aisles", "Or start with an aisle") }}</p>
            <nav :aria-label="t('header.aisles', 'Aisles')" class="k-drawer__empty-aisles">
              <router-link
                v-for="aisle in aisleList.slice(0, 8)"
                :key="aisle.id"
                :style="{ '--k-tint': tint(aisle) }"
                :to="aisleRoute(aisle)"
                class="k-aisle-chip"
                @click="basket = false"
              >
                <img v-if="aisle.icon" :src="aisleImage(aisle, 64)" alt="" height="32" width="32" loading="lazy" />
                {{ aisle.title || aisle.name }}
              </router-link>
            </nav>
          </template>
        </div>
        <kalio-basket-drawer v-else @close="basket = false" />
      </v-navigation-drawer>

      <!-- ▆▆▆▆▆▆▆▆ Phone menu ▆▆▆▆▆▆▆▆ -->
      <v-navigation-drawer
        v-model="menu"
        :location="$vuetify.locale.isRtl ? 'right' : 'left'"
        :width="Math.min(360, windowWidth * 0.88)"
        class="k-drawer -menu"
        temporary
      >
        <div class="k-drawer__head">
          <router-link :to="homeRoute" class="k-header__brand -logo" @click="menu = false"><img :src="BRAND.mark" alt="" class="k-brand-mark" height="30" width="30" />{{ shopTitle }}</router-link>
          <button :aria-label="t('common.close', 'Close')" class="k-header__icon" type="button" @click="menu = false">
            <v-icon>close</v-icon>
          </button>
        </div>

        <div class="k-drawer__account v-menu-acc">
          <template v-if="user">
            <router-link :to="profileRoute" class="v-menu-link" @click="menu = false">{{ t("valero.account", "Account") }}</router-link>
            <router-link :to="ordersRoute" class="v-menu-link" @click="menu = false">{{ t("header.orders", "Orders") }}</router-link>
            <router-link :to="savedRoute" class="v-menu-link" @click="menu = false">{{ t("account.section.saved", "Saved") }}</router-link>
          </template>
          <button v-else class="k-btn k-btn--solid" type="button" @click="menu = false; signIn()">{{ t("common.signIn", "Sign in") }}</button>
        </div>

        <p class="v-caps k-drawer__label">{{ t("valero.theMarket", "The market") }}</p>
        <router-link :to="dealsRoute" class="v-menu-link" @click="menu = false">{{ t("valero.offers", "This week’s offers") }}</router-link>
        <router-link :to="newRoute" class="v-menu-link" @click="menu = false">{{ t("valero.newIn", "New in") }}</router-link>
        <router-link :to="journalRoute" class="v-menu-link" @click="menu = false">{{ t("blog.journal", "Journal") }}</router-link>

        <p class="v-caps k-drawer__label">{{ t("valero.theAisles", "The aisles") }}</p>
        <!-- The first six aisles in the merchant's order; the rest open in
             place under "Show N more" (the owner's option A, 10 November
             2026). Eight or fewer: all of them, no button. -->
        <router-link
          v-for="(aisle, i) in aisleList.slice(0, menuCut)"
          :key="aisle.id"
          :to="aisleRoute(aisle)"
          class="v-menu-link -aisle"
          @click="menu = false"
        >
          <span class="v-index__n">{{ String(i + 1).padStart(2, "0") }}</span>{{ aisle.title || aisle.name }}
        </router-link>
        <template v-if="menuCut < aisleList.length">
          <div id="v-menu-more" :class="{ '-open': menuMore }" class="v-menu-more">
            <div>
              <router-link
                v-for="(aisle, i) in aisleList.slice(menuCut)"
                :key="aisle.id"
                :style="{ '--i': i }"
                :to="aisleRoute(aisle)"
                class="v-menu-link -aisle"
                @click="menu = false"
              >
                <span class="v-index__n">{{ String(menuCut + i + 1).padStart(2, "0") }}</span>{{ aisle.title || aisle.name }}
              </router-link>
            </div>
          </div>
          <button
            :aria-expanded="String(menuMore)"
            aria-controls="v-menu-more"
            class="v-menu-link -aisle -more"
            type="button"
            @click="menuMore = !menuMore"
          >
            <span aria-hidden="true" class="v-menu-more__chip"><v-icon size="18">{{ menuMore ? "expand_less" : "expand_more" }}</v-icon></span>
            {{ menuMore ? t("menu.showFewer", "Show fewer") : t("menu.showMore", "Show {n} more", { n: aisleList.length - menuCut }) }}
          </button>
        </template>

        <template v-if="sellerList.length">
          <p class="v-caps k-drawer__label">{{ t("valero.theMakers", "The makers") }}</p>
          <router-link v-for="seller in sellerList" :key="seller.id" :to="sellerRoute(seller)" class="v-menu-link" @click="menu = false">
            {{ seller.name }}
          </router-link>
        </template>

        <!-- Language and currency: a row that opens a bottom sheet over the menu. -->
        <region-sheet :key="'rs-' + t('region.title')" row-class="v-menu-link -region" />
      </v-navigation-drawer>
    </teleport>
  </header>
</template>

<script>
import { BRAND } from "../kalio-brand";
import { defineAsyncComponent } from "vue";
import SStorefrontSearchBox from "@selldone/components-vue/storefront/search/SStorefrontSearchBox.vue";
import RegionSwitcherButton from "../../region-switcher/RegionSwitcherButton.vue";
import RegionSheet from "../../region-switcher/RegionSheet.vue";
import { money } from "../../valero/valero-home";
import KalioBasketDrawer from "./KalioBasketDrawer.vue";
import { EventBus } from "@selldone/components-vue/utils/events/EventBus.ts";
import { aisleImage, aisleRoute, aisles, catalogueRoute, dealsRoute, sellerRoute, tintFor, vendorImage, vendors } from "../kalio-catalog";
import { freeShippingFrom, waysOf } from "../../valero/valero-home";
import { journalRoute } from "../pages/kalio-journal";
import { basketView } from "../kalio-basket";

export default {
  name: "KalioHeader",
  components: {
    SStorefrontSearchBox,
    RegionSwitcherButton,
    RegionSheet,
    KalioBasketDrawer,
    SHeaderSectionUser: defineAsyncComponent(
      () => import("@selldone/components-vue/storefront/header/section/user/SHeaderSectionUser.vue"),
    ),
  },
  inject: ["$shop"],

  props: {
    /** The current route asks for the search box (route meta "search"). */
    showSearch: { type: Boolean, default: true },
  },

  emits: ["search", "clear"],

  data() {
    return {
      BRAND,
      aisleList: [],
      aisles_open: false,
      basket: false,
      menu: false,
      menuMore: false,
      search_open: false,
      windowWidth: window.innerWidth,
      sellerList: [],
      avatar_failed: false,
    };
  },

  computed: {
    shopTitle() {
      return this.$shop?.title || "Valero";
    },
    /* The phone menu's aisles shown before "Show N more": six, or all of
       them when there are eight or fewer. */
    menuCut() {
      return this.aisleList.length > 8 ? 6 : this.aisleList.length;
    },
    user() {
      return this.$store.getters.getUser;
    },
    busyUser() {
      return this.$store.getters.getBusyUser;
    },
    compact() {
      return this.$vuetify.display.smAndDown;
    },
    globalStyle() {
      return this.$store.getters.getGlobalStyle;
    },
    itemsCount() {
      return this.getTotalItemInBaskets() || 0;
    },
    /** How many things are in the basket, counting each one (2 breads are 2). */
    basketUnits() {
      return this.getBaskets().reduce(
        (sum, basket) => sum + (basket?.items || []).reduce((n, item) => n + (item.count || 0), 0),
        0,
      );
    },
    homeRoute() {
      return { path: "/" };
    },
    dealsRoute() {
      return dealsRoute();
    },
    catalogueRoute() {
      return catalogueRoute();
    },
    journalRoute() {
      return journalRoute();
    },
    /** The shop collects orders for free: said in the announcement line. */
    hasPickup() {
      return waysOf(this.$shop).some((way) => way.key === "Pickup" && way.free);
    },
    newRoute() {
      return catalogueRoute({ sort: "newest" });
    },
    /** The promo strip's offer: the lowest basket total that ships free. */
    promo() {
      return freeShippingFrom(this.$shop);
    },
    ordersRoute() {
      return { name: window.$storefront.routes.HISTORY_ORDERS_PHYSICAL };
    },
    savedRoute() {
      return { name: window.$storefront.routes.USER_FAVORITES_PAGE };
    },
    /** "My account": the Overview (design B) or the orders (design A). */
    profileRoute() {
      return { name: "KalioAccountHome" };
    },
    drawerOpen() {
      return this.basket || this.menu;
    },
  },

  watch: {
    drawerOpen(open) {
      /* The phone bottom bar would sit over either drawer. */
      this.$store.commit("setForceHideNavigation", open);
    },
    basket(open) {
      basketView.drawerOpen = open;
    },
    /* The phone menu opens with its aisle list folded each time. */
    menu(open) {
      if (open) this.menuMore = false;
    },
    $route() {
      this.menu = false;
      this.basket = false;
      this.search_open = false;
    },
  },

  mounted() {
    aisles().then((list) => (this.aisleList = list));
    vendors().then((list) => (this.sellerList = list));
    this.onResize = () => {
      this.windowWidth = window.innerWidth;
    };
    window.addEventListener("resize", this.onResize, { passive: true });
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },

  methods: {
    money,
    aisleRoute,
    aisleImage,
    sellerRoute,
    vendorImage,
    tint: tintFor,
    signIn() {
      EventBus.$emit("need-login", true);
    },
  },
};
</script>
