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
      <div class="v-ann__row k-wrap">
        <span v-if="promo">Complimentary shipping over <u-price :amount="promo.amount" :currency="promo.currency" /></span>
        <router-link v-else :to="dealsRoute">This week’s offers</router-link>
        <span v-if="hasPickup" class="-wide">Pickup is always free</span>
        <span v-if="sellerList.length > 1" class="-wide">{{ sellerList.length }} independent makers, one bag</span>
      </div>
    </div>

    <div class="k-header__bar">
      <div class="k-header__row v-hdr k-wrap">
        <nav aria-label="Shop" class="v-hdr__side">
          <button v-if="compact" class="v-hdr__link" type="button" @click="menu = true">Menu</button>
          <template v-else>
            <v-menu
              v-if="aisleList.length"
              v-model="aisles_open"
              :close-on-content-click="true"
              location="bottom start"
              offset="22"
            >
              <template v-slot:activator="{ props }">
                <button :class="{ '-on': aisles_open }" class="v-hdr__link" type="button" v-bind="props">Aisles</button>
              </template>
              <div class="v-index">
                <p class="v-caps v-index__eyebrow">The aisles</p>
                <div class="v-index__grid">
                  <router-link v-for="(aisle, i) in aisleList" :key="aisle.id" :to="aisleRoute(aisle)" class="v-index__item">
                    <span class="v-index__n">{{ String(i + 1).padStart(2, "0") }}</span>{{ aisle.title || aisle.name }}
                  </router-link>
                </div>
                <div class="v-index__foot">
                  <router-link :to="dealsRoute" class="v-more">This week’s offers</router-link>
                  <router-link :to="catalogueRoute" class="v-more">Every product</router-link>
                </div>
              </div>
            </v-menu>
            <router-link :to="dealsRoute" class="v-hdr__link">Offers</router-link>
            <router-link :to="journalRoute" class="v-hdr__link">Journal</router-link>
            <v-menu v-if="sellerList.length" location="bottom start" offset="22">
              <template v-slot:activator="{ props }">
                <button class="v-hdr__link" type="button" v-bind="props">Makers</button>
              </template>
              <div class="v-index -makers">
                <p class="v-caps v-index__eyebrow">The makers</p>
                <router-link v-for="seller in sellerList" :key="seller.id" :to="sellerRoute(seller)" class="v-index__maker">
                  <img v-if="seller.icon" :src="vendorImage(seller, true)" alt="" height="40" loading="lazy" width="40" />
                  <span v-else class="v-index__initial">{{ (seller.name || "?").charAt(0) }}</span>
                  {{ seller.name }}
                </router-link>
              </div>
            </v-menu>
          </template>
        </nav>

        <router-link :to="homeRoute" :aria-label="`${shopTitle} home`" class="k-header__brand v-hdr__brand">
          <img :src="BRAND.mark" alt="" class="k-brand-mark" height="34" width="34" /><span>{{ shopTitle }}</span>
        </router-link>

        <nav aria-label="Your account" class="v-hdr__side -end">
          <button
            v-if="showSearch"
            :aria-expanded="String(search_open)"
            :class="{ '-on': search_open }"
            aria-label="Search"
            class="v-hdr__link"
            type="button"
            @click="search_open = !search_open"
          >
            <v-icon v-if="compact" size="22">search</v-icon><template v-else>Search</template>
          </button>
          <template v-if="!compact">
            <router-link v-if="user" :to="profileRoute" class="v-hdr__link">Account</router-link>
            <button v-else-if="!busyUser" class="v-hdr__link" type="button" @click="signIn">Sign in</button>
          </template>
          <button :aria-label="`Bag, ${itemsCount} items`" class="v-hdr__link -bag" type="button" @click="basket = true">
            Bag <b>({{ itemsCount }})</b>
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
        <button aria-label="Close search" class="v-hdr__link" type="button" @click="search_open = false">Close</button>
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
            Your bag<small v-if="basketUnits">{{ basketUnits }} {{ basketUnits === 1 ? "item" : "items" }}</small>
          </p>
          <button aria-label="Close" class="k-header__icon" type="button" @click="basket = false">
            <v-icon>close</v-icon>
          </button>
        </div>
        <!-- Empty: Selldone's line "Your bag is empty." left the shopper
             nowhere to go; Kalio's offers the way back to the shelves. -->
        <div v-if="!itemsCount" class="k-drawer__empty">
          <span aria-hidden="true" class="k-drawer__empty-mark"><v-icon size="30">shopping_bag</v-icon></span>
          <p class="k-drawer__empty-title">Your cart is empty</p>
          <p class="k-drawer__empty-text">Choose something from the aisles and it will wait for you here.</p>
          <div class="k-drawer__empty-ctas">
            <router-link :to="dealsRoute" class="k-btn k-btn--solid" @click="basket = false">This week’s offers</router-link>
            <router-link :to="catalogueRoute" class="k-btn k-btn--line" @click="basket = false">Browse every product</router-link>
          </div>
          <template v-if="aisleList.length">
            <p class="k-eyebrow k-drawer__empty-label">Or start with an aisle</p>
            <nav aria-label="Aisles" class="k-drawer__empty-aisles">
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
          <button aria-label="Close" class="k-header__icon" type="button" @click="menu = false">
            <v-icon>close</v-icon>
          </button>
        </div>

        <div class="k-drawer__account v-menu-acc">
          <template v-if="user">
            <router-link :to="profileRoute" class="v-menu-link" @click="menu = false">Account</router-link>
            <router-link :to="ordersRoute" class="v-menu-link" @click="menu = false">Orders</router-link>
            <router-link :to="savedRoute" class="v-menu-link" @click="menu = false">Saved</router-link>
          </template>
          <button v-else class="k-btn k-btn--solid" type="button" @click="menu = false; signIn()">Sign in</button>
        </div>

        <p class="v-caps k-drawer__label">The market</p>
        <router-link :to="dealsRoute" class="v-menu-link" @click="menu = false">This week’s offers</router-link>
        <router-link :to="newRoute" class="v-menu-link" @click="menu = false">New in</router-link>
        <router-link :to="journalRoute" class="v-menu-link" @click="menu = false">Journal</router-link>

        <p class="v-caps k-drawer__label">The aisles</p>
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
            {{ menuMore ? "Show fewer" : `Show ${aisleList.length - menuCut} more` }}
          </button>
        </template>

        <template v-if="sellerList.length">
          <p class="v-caps k-drawer__label">The makers</p>
          <router-link v-for="seller in sellerList" :key="seller.id" :to="sellerRoute(seller)" class="v-menu-link" @click="menu = false">
            {{ seller.name }}
          </router-link>
        </template>

        <div class="k-drawer__pickers">
          <s-language-selector hide-details variant="outlined"></s-language-selector>
          <u-currency-selector
            v-if="$shop.currencies && $shop.currencies.length > 1"
            :shop="$shop"
            hide-details
            @change="onChangeUserSelectedCurrency"
          />
        </div>
      </v-navigation-drawer>
    </teleport>
  </header>
</template>

<script>
import { BRAND } from "../kalio-brand";
import { defineAsyncComponent } from "vue";
import SStorefrontSearchBox from "@selldone/components-vue/storefront/search/SStorefrontSearchBox.vue";
import SLanguageSelector from "@selldone/components-vue/storefront/language/selector/SLanguageSelector.vue";
import UCurrencySelector from "@selldone/components-vue/ui/currency/selector/UCurrencySelector.vue";
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
    SLanguageSelector,
    UCurrencySelector,
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
