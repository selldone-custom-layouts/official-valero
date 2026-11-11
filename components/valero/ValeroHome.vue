<!--
  Valero — Home (design D, 7 November 2026): an after-dark food hall.
  The owner asked for designs C and D "completely different" from each other
  and from Molino, Tario and Walio, D in black (kalio-design/cd-options/
  home-d.html). Top to bottom:
    the hero: a full-bleed photo, dimmed, with one large serif line
    01 The aisles: every aisle as a numbered index (the hovered one's
       picture beside it on a computer)
    02 This week's edit: the biggest savings in a hairline grid of cards
       (the best sellers when nothing is on offer)
    03 Of the season: the fresh aisle beside a photo, as a short list
    04 The makers: each seller with four of their products
    the ways to get it: the shop's own delivery methods
    05 From the journal, last: the shop's own articles as a magazine block
       (each with its date: the blog list has no body to time); each post
       in the visitor's language when it has an edition in it
       (blog-editions.json, kalio-journal.ts), read again after a pick
  Everything is read live; a section with nothing to show is not drawn. It
  shows on the bare shop page only (StorefrontPageProducts decides).
-->
<template>
  <div class="vh">
    <!-- ▆▆▆▆ Hero ▆▆▆▆ -->
    <section class="vh-hero">
      <img v-if="heroPhoto" :src="heroPhoto" alt="" class="vh-hero__img" />
      <div v-else aria-hidden="true" class="vh-hero__still">
        <img v-for="p in edit.slice(0, 3)" :key="p.id" :src="image(p)" alt="" />
      </div>
      <div class="vh-hero__in k-wrap">
        <p class="v-caps vh-gold">
          {{ shopTitle }}<template v-if="aisleList.length"> · {{ t("valero.home.aisleCount", { one: "{n} aisle", other: "{n} aisles" }, { n: aisleList.length }) }}</template
          ><template v-if="sellerList.length"> · {{ t("valero.home.makerCount", { one: "{n} maker", other: "{n} makers" }, { n: sellerList.length }) }}</template>
        </p>
        <h1 class="vh-hero__title">{{ t("valero.home.title", "The market,") }} <em>{{ t("valero.home.titleEm", "after hours.") }}</em></h1>
        <p class="vh-hero__lede">
          {{ t("valero.home.lede", "Good groceries from independent makers, chosen slowly and brought to your door tonight, or kept for you to collect.") }}
        </p>
        <div class="vh-hero__ctas">
          <router-link :to="catalogueRoute" class="v-btn-solid">{{ t("valero.home.enter", "Enter the market") }}</router-link>
          <router-link :to="dealsRoute" class="v-btn-line">{{ t("valero.offers", "This week’s offers") }}</router-link>
        </div>
      </div>
    </section>

    <div class="k-wrap">
      <!-- ▆▆▆▆ 01 The aisles ▆▆▆▆ -->
      <section v-if="aisleList.length" class="vh-sec">
        <header class="vh-head">
          <span class="vh-head__n">01</span>
          <h2>{{ t("valero.theAisles", "The aisles") }}</h2>
          <router-link :to="catalogueRoute" class="v-more">{{ t("header.everyProduct", "Every product") }}</router-link>
        </header>
        <div class="vh-index">
          <nav :aria-label="t('header.aisles', 'Aisles')" class="vh-index__list">
            <router-link
              v-for="(aisle, i) in aisleList"
              :key="aisle.id"
              :class="{ '-on': hovered === aisle }"
              :to="aisleRoute(aisle)"
              class="vh-index__item"
              @focus="hovered = aisle"
              @mouseenter="hovered = aisle"
            >
              <span class="vh-index__n">{{ String(i + 1).padStart(2, "0") }}</span>
              <b>{{ aisle.title || aisle.name }}</b>
              <span class="vh-index__arrow k-flip" aria-hidden="true">→</span>
            </router-link>
          </nav>
          <router-link v-if="hovered" :to="aisleRoute(hovered)" aria-hidden="true" class="vh-index__pic" tabindex="-1">
            <img v-if="hovered.icon" :src="aisleImage(hovered, 512)" alt="" />
            <span class="v-caps">{{ hovered.title || hovered.name }}</span>
          </router-link>
        </div>
      </section>

      <!-- ▆▆▆▆ 02 This week's edit ▆▆▆▆ -->
      <section v-if="edit.length" class="vh-sec">
        <header class="vh-head">
          <span class="vh-head__n">02</span>
          <h2>{{ has_deals ? t("valero.home.edit", "This week’s edit") : t("valero.home.mostChosen", "Most chosen") }}</h2>
          <router-link :to="has_deals ? dealsRoute : bestRoute" class="v-more">{{ has_deals ? t("valero.home.everyOffer", "Every offer") : t("valero.seeMore", "See more") }}</router-link>
        </header>
        <div class="v-grid">
          <div v-for="p in edit" :key="p.id" class="v-grid__cell">
            <valero-card :product="p" :sellers="sellersOf.get(p.id) || []" @quick-buy="quickBuy" />
          </div>
        </div>
      </section>

      <!-- ▆▆▆▆ 03 Of the season ▆▆▆▆ -->
      <section v-if="fresh && freshList.length" class="vh-sec">
        <header class="vh-head">
          <span class="vh-head__n">03</span>
          <h2>{{ t("valero.home.season", "Of the season") }}</h2>
        </header>
        <div class="vh-season">
          <img v-if="seasonPhoto" :src="seasonPhoto" alt="" class="vh-season__img" />
          <div v-else aria-hidden="true" class="vh-season__still"><img v-for="p in freshList.slice(0, 2)" :key="p.id" :src="image(p)" alt="" /></div>
          <div class="vh-season__tx">
            <p class="v-caps vh-gold">{{ fresh.title || fresh.name }}</p>
            <h3>{{ t("valero.home.seasonTitle", "Crisp, bright and only just picked.") }}</h3>
            <p class="vh-muted">{{ t("valero.home.seasonLede", "The best of {aisle} this week, from the makers who grow and choose it.", { aisle: (fresh.title || fresh.name).toLowerCase() }) }}</p>
            <router-link v-for="p in freshList" :key="p.id" :to="productRoute(p)" class="vh-line">
              <span class="vh-line__pic"><img :src="thumb(p)" alt="" /></span>
              <span class="vh-line__name">
                <small v-if="sellerName(p)" class="v-caps">{{ sellerName(p) }}</small>
                {{ p.title }}
              </span>
              <u-price :amount="priceNow(p)" :currency="currency" class="vh-line__price" />
            </router-link>
            <router-link :to="aisleRoute(fresh)" class="v-more vh-season__more">{{ t("valero.home.shopAisle", "Shop {aisle}", { aisle: (fresh.title || fresh.name).toLowerCase() }) }}</router-link>
          </div>
        </div>
      </section>

      <!-- ▆▆▆▆ 04 The makers ▆▆▆▆ -->
      <section v-if="sellerList.length" class="vh-sec">
        <header class="vh-head">
          <span class="vh-head__n">04</span>
          <h2>{{ t("valero.theMakers", "The makers") }}</h2>
        </header>
        <div class="vh-makers">
          <router-link v-for="v in sellerList" :key="v.id" :to="sellerRoute(v)" class="vh-maker">
            <img v-if="v.icon" :src="vendorImage(v)" alt="" class="vh-maker__mark" />
            <span v-else class="vh-maker__mark -initial">{{ (v.name || "?").charAt(0) }}</span>
            <span class="vh-maker__tx">
              <small class="v-caps vh-gold">{{ t("valero.independentMaker", "Independent maker") }}</small>
              <b>{{ v.name }}</b>
              <span v-if="makerLine(v)" class="vh-muted">{{ makerLine(v) }}</span>
              <span class="vh-maker__strip">
                <span v-for="p in shelf(v)" :key="p.id"><img :src="thumb(p)" alt="" loading="lazy" /></span>
              </span>
            </span>
          </router-link>
        </div>
      </section>
    </div>

    <!-- ▆▆▆▆ How it reaches you ▆▆▆▆ -->
    <section v-if="ways.length" class="vh-ways k-wrap">
      <div v-for="w in ways" :key="w.key" class="vh-way">
        <small class="v-caps vh-gold">{{ w.word }}</small>
        <b>{{ w.line }}</b>
        <span class="vh-muted">
          <template v-if="w.free">{{ t("valero.free", "Free") }}</template>
          <template v-else-if="w.freeOver">{{ t("valero.freeOver", "Free over {price}", { price: money(w.freeOver, w.currency, "auto") }) }}</template>
          <template v-else>{{ t("valero.home.pricedWithAddress", "Priced with your address") }}</template>
        </span>
      </div>
    </section>

    <!-- ▆▆▆▆ 05 From the journal: the page's last section (owner, 8 November 2026) ▆▆▆▆ -->
    <section v-if="posts.length" class="vh-sec vh-journal k-wrap">
      <header class="vh-head">
        <span class="vh-head__n">05</span>
        <h2>{{ t("valero.home.fromJournal", "From the journal") }}</h2>
        <router-link :to="journalRoute" class="v-more">{{ t("valero.home.theJournal", "The journal") }}</router-link>
      </header>
      <div class="vh-mag">
        <router-link :to="postRoute(posts[0])" class="vh-mag__lead">
          <img v-if="posts[0].image" :src="postImage(posts[0])" :srcset="postSrcset(posts[0], true)" alt="" loading="lazy" sizes="(max-width: 760px) 92vw, 760px" @error="dropSrcset" />
          <small v-if="dateOf(posts[0])" class="v-caps vh-gold">{{ dateOf(posts[0]) }}</small>
          <h3>{{ posts[0].title }}</h3>
          <p v-if="posts[0].description" class="vh-muted">{{ posts[0].description }}</p>
        </router-link>
        <div class="vh-mag__list">
          <router-link v-for="a in posts.slice(1, 4)" :key="a.id" :to="postRoute(a)" class="vh-mag__item">
            <img v-if="a.image" :src="postImage(a)" :srcset="postSrcset(a)" alt="" loading="lazy" sizes="(max-width: 760px) 96px, 140px" @error="dropSrcset" />
            <span>
              <small v-if="dateOf(a)" class="v-caps vh-gold">{{ dateOf(a) }}</small>
              <b>{{ a.title }}</b>
            </span>
          </router-link>
        </div>
      </div>
    </section>

    <kalio-quick-buy v-model="sheet" :product="picked" />
  </div>
</template>

<script>
import CurrencyMixin from "@selldone/components-vue/mixin/currency/CurrencyMixin.ts";
import ValeroCard from "./ValeroCard.vue";
import KalioQuickBuy from "../kalio/KalioQuickBuy.vue";
import {
  aisleImage,
  aisleRoute,
  aisles,
  catalogueRoute,
  dealsRoute,
  featured,
  dropSrcset,
  offers,
  percentOff,
  photoSrcset,
  priceOf,
  productImage,
  sellerRoute,
  vendorImage,
  vendors,
} from "../kalio/kalio-catalog";
import { quickAdd } from "../kalio/kalio-basket";
import { DEALS_FILTER, findAisle, listProducts, money, photo, waysOf } from "./valero-home";
import { currentCurrency, currentLanguage } from "../region-switcher/region";
import { t } from "../kalio/i18n/kalio-i18n";
import { dateParts, editionsActive, journalPage, journalRoute, postRoute } from "../kalio/pages/kalio-journal";

export default {
  name: "ValeroHome",
  components: { ValeroCard, KalioQuickBuy },
  mixins: [CurrencyMixin],
  inject: ["$shop"],

  data() {
    return {
      aisleList: [],
      sellerList: [],
      edit: [],
      has_deals: true,
      freshList: [],
      posts: [],
      hovered: null,
      sellersOf: new Map(),
      shelfOf: new Map(),
      sheet: false,
      picked: null,
    };
  },

  computed: {
    shopTitle() {
      return this.$shop?.title || "Valero";
    },
    currency() {
      return currentCurrency();
    },
    readerLang() {
      return currentLanguage();
    },
    heroPhoto() {
      return photo("valero-hero-dinners");
    },
    seasonPhoto() {
      return photo("valero-season-produce");
    },
    catalogueRoute() {
      return catalogueRoute();
    },
    dealsRoute() {
      return dealsRoute();
    },
    bestRoute() {
      return catalogueRoute({ sort: "bestselling" });
    },
    journalRoute() {
      return journalRoute();
    },
    fresh() {
      return findAisle(this.aisleList, /produce|fruit|veg|fresh/i) || this.aisleList[0] || null;
    },
    ways() {
      return waysOf(this.$shop).slice(0, 3);
    },
  },

  watch: {
    /* A language picked on the home: the journal's posts in their editions
       for it (nothing to do while no edition is named). */
    readerLang() {
      if (editionsActive()) this.loadPosts();
    },
    fresh(aisle) {
      if (!aisle) return;
      listProducts(aisle.name, 8, { sort: "bestselling" }).then((list) => (this.freshList = list.filter((p) => p.icon).slice(0, 4)));
    },
  },

  mounted() {
    aisles().then((list) => {
      this.aisleList = featured(list);
      this.hovered = this.aisleList[0] || null;
    });
    vendors().then((list) => (this.sellerList = list.filter((v) => v && v.name)));
    offers().then(({ sellersOf, shelfOf }) => {
      this.sellersOf = sellersOf;
      this.shelfOf = shelfOf;
    });
    /* The biggest savings first; the best sellers when nothing is on offer. */
    listProducts(null, 40, { filter: DEALS_FILTER, sort: "bestselling" }).then((list) => {
      const deals = list.filter((p) => this.percent(p) > 0).sort((a, b) => this.percent(b) - this.percent(a));
      if (deals.length >= 4) {
        this.edit = deals.slice(0, 8);
        return;
      }
      this.has_deals = false;
      listProducts(null, 8, { sort: "bestselling" }).then((best) => (this.edit = best));
    });
    this.loadPosts();
  },

  methods: {
    /* 05 From the journal: the four newest notes, each in the visitor's
       edition (journalPage), the latest read winning. */
    loadPosts() {
      const ask = (this.postsAsk = (this.postsAsk || 0) + 1);
      journalPage({ limit: 4 })
        .then(({ articles }) => {
          if (ask === this.postsAsk) this.posts = articles || [];
        })
        .catch(() => {
          if (ask === this.postsAsk) this.posts = [];
        });
    },
    money,
    aisleRoute,
    aisleImage,
    sellerRoute,
    postRoute,
    dropSrcset,
    /** The post's photo from the shop's resizer, at the size it is shown. */
    postSrcset(a, big = false) {
      const set = photoSrcset(this.postImage(a));
      /* The resizer stops at 768; the lead photo is 673px wide on a computer,
         so a sharp screen takes the original (1600px). */
      return set && big ? `${set}, ${this.postImage(a)} 1600w` : set;
    },
    /** "Nov 7, 2026", or nothing. */
    dateOf(a) {
      return dateParts(a?.created_at).full;
    },
    vendorImage(v) {
      return vendorImage(v);
    },
    image(p) {
      return productImage(p);
    },
    /** Selldone’s 128px thumbnail, for the small squares. */
    thumb(p) {
      return productImage(p, true);
    },
    percent(p) {
      return percentOff(this.$shop, p) || 0;
    },
    priceNow(p) {
      return priceOf(this.$shop, p, this.currency).now || 0;
    },
    productRoute(p) {
      return { name: window.$storefront.routes.PRODUCT_PAGE, params: { product_id: p.id } };
    },
    sellerName(p) {
      const sellers = this.sellersOf.get(p.id) || [];
      return sellers.length > 1 ? t("valero.home.makerCount", { one: "{n} maker", other: "{n} makers" }, { n: sellers.length }) : sellers[0]?.name || "";
    },
    shelf(v) {
      return (this.shelfOf.get(v.id) || []).filter((p) => p.icon).slice(0, 4);
    },
    makerLine(v) {
      const text = (v.description || "").trim();
      return text && text.length < 140 ? text : "";
    },
    postImage(a) {
      return /^https?:/.test(a.image) ? a.image : window.CDN.GET_SHOP_IMAGE_PATH(a.image);
    },
    quickBuy(product) {
      quickAdd(this, product, (picked) => {
        this.picked = picked;
        this.sheet = true;
      });
    },
  },
};
</script>
