<!--
  Valero — the top of a seller's page (seller page design A, 7 November 2026).

  A banner with a photo of what the seller sells most, their round mark,
  their name and a line built from their own aisles ("breads, dairy and
  the pantry"), and three live numbers: products, aisles, on sale. Tabs
  under it narrow the listing below (Shop, Deals, New) or jump to About.
  Then the seller's aisles as tiles with how many products each holds, and
  a row of the seller's deals. The page's listing (every product of this
  seller, with Valero's filter bar) follows under "All of Mason's products".

  Selldone's seller record has a name, a mark and a description; the
  numbers and aisles come from the seller's own product list.
-->
<template>
  <div class="t-sellerpage">
    <nav :aria-label="t('pages.breadcrumb', 'Breadcrumb')" class="t-crumbs">
      <router-link :to="{ name: window.$storefront.routes.SHOP_PAGE }">{{ $shop.title }}</router-link>
      <v-icon aria-hidden="true" class="k-flip" size="16">chevron_right</v-icon>
      <span>{{ t("valero.theMakers", "The makers") }}</span>
      <v-icon aria-hidden="true" class="k-flip" size="16">chevron_right</v-icon>
      <span aria-current="page">{{ vendor ? vendor.name : t("valero.seller", "Seller") }}</span>
    </nav>

    <section class="t-sban">
      <div :style="cover ? { backgroundImage: `url(${cover})` } : null" aria-hidden="true" class="t-sban__cover"></div>
      <div class="t-sban__body">
        <span class="t-sban__mark">
          <img v-if="mark" :src="mark" alt="" />
          <v-icon v-else size="40">storefront</v-icon>
        </span>
        <div class="t-sban__who">
          <p class="v-caps vh-gold t-sban__eyebrow">{{ t("valero.seller.eyebrow", "The maker") }}</p>
          <h1>{{ vendor ? vendor.name : "" }}</h1>
          <p>{{ t("valero.seller.on", "An independent maker on {shop}", { shop: $shop.title }) }}<template v-if="sells_line"> · {{ sells_line }}</template></p>
        </div>
        <div class="t-sban__facts">
          <div v-if="total !== null"><b>{{ formatNumber(total) }}</b><span>{{ t("valero.seller.products", { one: "product", other: "products" }, { n: total }) }}</span></div>
          <div v-if="aisleTiles.length"><b>{{ formatNumber(aisleTiles.length) }}</b><span>{{ t("footer.facts.aisles", { one: "aisle", other: "aisles" }, { n: aisleTiles.length }) }}</span></div>
          <div v-if="on_sale !== null"><b>{{ formatNumber(on_sale) }}</b><span>{{ t("valero.seller.onSale", "on sale") }}</span></div>
        </div>
      </div>
    </section>

    <nav :aria-label="t('valero.seller.sections', 'Seller sections')" class="t-stabs">
      <button :class="{ '-on': tab === 'shop' }" type="button" @click="$emit('tab', 'shop')">{{ t("valero.seller.tab.shop", "Shop") }}</button>
      <button v-if="on_sale" :class="{ '-on': tab === 'deals' }" type="button" @click="$emit('tab', 'deals')">
        {{ t("valero.seller.tab.deals", "Deals ({n})", { n: on_sale }) }}
      </button>
      <button :class="{ '-on': tab === 'new' }" type="button" @click="$emit('tab', 'new')">{{ t("valero.seller.tab.new", "New") }}</button>
      <button type="button" @click="toAbout">{{ t("valero.seller.tab.about", "About {name}", { name: vendor ? vendor.name : "" }) }}</button>
    </nav>

    <section v-if="aisleTiles.length" class="t-sec">
      <header class="t-sec__head">
        <h2 class="t-sec__title">{{ vendor ? t("valero.seller.aislesOf", "{name}’s aisles", { name: vendor.name }) : t("valero.theAisles", "The aisles") }}</h2>
      </header>
      <div class="t-saisles">
        <router-link v-for="a in aisleTiles" :key="a.aisle.id" :to="a.to" class="t-saisle">
          <img v-if="a.image" :src="a.image" alt="" loading="lazy" />
          {{ a.aisle.title || a.aisle.name }}
          <span>{{ t("valero.seller.productCount", { one: "{n} product", other: "{n} products" }, { n: a.count }) }}</span>
        </router-link>
      </div>
    </section>

    <valero-row
      v-if="on_sale"
      :key="'deals-' + vendorId"
      :filter="{ only_has_discount: true }"
      :limit="12"
      :title="vendor ? t('valero.seller.offersFrom', 'Offers from {name}', { name: vendor.name }) : t('valero.seller.offersFromThis', 'Offers from this maker')"
      :vendor="vendorId"
      sort="bestselling"
    />

    <section id="t-seller-about" class="t-sabout">
      <h2 class="t-sec__title">{{ vendor ? t("valero.seller.tab.about", "About {name}", { name: vendor.name }) : t("valero.seller.aboutThis", "About this maker") }}</h2>
      <p v-if="vendor && vendor.description">{{ vendor.description }}</p>
      <p v-else>
        {{
          sells_line
            ? t("valero.seller.aboutWith", { one: "{name} is one of {n} independent makers on {shop}, with {aisles}. Everything they sell joins the same bag as the other makers’ products, with one checkout.", other: "{name} is one of {n} independent makers on {shop}, with {aisles}. Everything they sell joins the same bag as the other makers’ products, with one checkout." }, { n: seller_count, name: vendor ? vendor.name : t("valero.seller.thisMaker", "This maker"), shop: $shop.title, aisles: sells_line })
            : t("valero.seller.about", { one: "{name} is one of {n} independent makers on {shop}. Everything they sell joins the same bag as the other makers’ products, with one checkout.", other: "{name} is one of {n} independent makers on {shop}. Everything they sell joins the same bag as the other makers’ products, with one checkout." }, { n: seller_count, name: vendor ? vendor.name : t("valero.seller.thisMaker", "This maker"), shop: $shop.title })
        }}
      </p>
    </section>

    <h2 class="t-sall">
      {{ vendor ? t("valero.seller.allOf", "All of {name}’s products", { name: vendor.name }) : t("listing.allProducts", "All products") }}
      <span v-if="total !== null">{{ formatNumber(total) }}</span>
    </h2>
  </div>
</template>

<script>
import ValeroRow from "../ValeroRow.vue";
import { locale } from "../../kalio/i18n/kalio-i18n";
import { photo } from "../valero-home";
import { aisleImage, aisleRoute, aisles, countProducts, featured, offers, vendorImage, vendors } from "../../kalio/kalio-catalog";

/* The banner's photo, from the seller's first aisle. */
const COVERS = [
  [/bread|bakery/i, "valero-tile-bakery"],
  [/breakfast|cereal/i, "valero-tile-breakfast"],
  [/produce|fruit|veg/i, "valero-finds-produce"],
  [/meat|seafood|fish/i, "valero-tile-meat"],
  [/snack/i, "valero-tile-snacks"],
  [/household|clean/i, "valero-tile-household"],
  [/coffee|beverage|drink/i, "valero-finds-coffee"],
];

export default {
  name: "ValeroSellerTop",
  components: { ValeroRow },
  inject: ["$shop"],
  emits: ["tab"],

  props: {
    vendorId: { type: [Number, String], required: true },
    /** Which tab the listing shows: shop, deals or new. */
    tab: { type: String, default: "shop" },
  },

  data() {
    return {
      window,
      vendor: null,
      total: null,
      on_sale: null,
      aisleTiles: [],
      seller_count: 0,
    };
  },

  computed: {
    mark() {
      return vendorImage(this.vendor);
    },
    sells_line() {
      const names = this.aisleTiles.slice(0, 3).map((a) => String(a.aisle.title || a.aisle.name).toLowerCase().replace(/&amp;/g, "&"));
      if (!names.length) return "";
      if (names.length === 1) return names[0];
      try {
        return new Intl.ListFormat(locale(), { style: "long", type: "conjunction" }).format(names);
      } catch {
        return names.join(", ");
      }
    },
    cover() {
      const first = this.aisleTiles[0]?.aisle;
      const label = first ? `${first.title || ""} ${first.name || ""}` : "";
      const hit = COVERS.find(([re]) => re.test(label));
      return photo(hit ? hit[1] : "valero-hero-1-weekly") || photo("valero-hero-1-weekly");
    },
  },

  watch: {
    vendorId: { handler: "fetch", immediate: true },
  },

  methods: {
    fetch() {
      const id = this.vendorId;
      const mine = () => String(id) === String(this.vendorId);
      this.vendor = null;
      this.total = null;
      this.on_sale = null;
      this.aisleTiles = [];
      window.$storefront.vendor
        .getVendor(id)
        .then(({ vendor }) => mine() && (this.vendor = vendor || null))
        .catch(() => null);
      countProducts(null, { vendor_id: id }).then((n) => mine() && (this.total = n));
      countProducts(null, { vendor_id: id, filter: JSON.stringify({ only_has_discount: true }) }).then((n) => mine() && (this.on_sale = n));
      vendors().then((list) => (this.seller_count = list.length));
      Promise.all([offers(), aisles()]).then(([{ shelfOf }, list]) => {
        if (!mine()) return;
        const shelf = shelfOf.get(Number(id)) || shelfOf.get(id) || [];
        const counts = new Map();
        for (const p of shelf) counts.set(p.category_id, (counts.get(p.category_id) || 0) + 1);
        this.aisleTiles = featured(list.filter((a) => counts.has(a.id))).map((aisle) => ({
          aisle,
          count: counts.get(aisle.id),
          image: aisle.icon ? aisleImage(aisle, 128) : null,
          to: aisleRoute(aisle),
        }));
      });
    },
    toAbout() {
      document.getElementById("t-seller-about")?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
  },
};
</script>
