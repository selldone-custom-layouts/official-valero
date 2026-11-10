<!--
  Valero — a product card (design D, 7 November 2026).

  An editorial card: the packshot on an ivory square (no corners) with the
  saving as a small champagne label, then who sells it in small capitals,
  the name, the price with the old one struck through and the unit, and
  "Add to bag" as a hairline text button. The foot is Kalio’s
  KalioCardStep, so every behaviour the owner asked for stays: "Add to bag"
  becomes "− n in bag +" in place, a product with sizes opens the quick-buy
  sheet, and nothing pops up. Prices are Selldone’s own (priceOf).
-->
<template>
  <article :class="{ '-sale': was }" class="t-card -valero">
    <router-link :to="to" class="t-card__pic" tabindex="-1" aria-hidden="true">
      <img v-if="picture" :alt="product.title" :src="picture" :srcset="srcset(product)" loading="lazy" sizes="(max-width: 760px) 53vw, 300px" @error="dropSrcset" />
      <span v-if="off > 0" class="t-card__tag">−{{ off }}%</span>
    </router-link>

    <p v-if="sellerLabel" class="t-card__by v-caps">{{ sellerLabel }}</p>

    <router-link :to="to" class="t-card__name">{{ product.title }}</router-link>

    <div class="t-card__price">
      <u-price :amount="now" :currency="price.currency" class="t-card__now" />
      <s v-if="was" class="t-card__was"><u-price :amount="was" :currency="price.currency" /></s>
      <span v-if="product.unit" class="t-card__unit">per {{ product.unit }}</span>
    </div>

    <kalio-card-step
      :addable="() => !!product.quantity"
      :adder="() => $emit('quick-buy', product)"
      :product="product"
      :sold-out="() => !product.quantity"
      card
      class="t-card__foot"
    />
  </article>
</template>

<script>
import { currentCurrency } from "../region-switcher/region";
import CurrencyMixin from "@selldone/components-vue/mixin/currency/CurrencyMixin.ts";
import KalioCardStep from "../kalio/KalioCardStep.vue";
import { percentOff, priceOf, productImage, productSrcset, dropSrcset } from "../kalio/kalio-catalog";

export default {
  name: "ValeroCard",
  components: { KalioCardStep },
  mixins: [CurrencyMixin],

  props: {
    product: { type: Object, required: true },
    /** The sellers that offer it (kalio-catalog's offers()). */
    sellers: { type: Array, default: () => [] },
  },

  emits: ["quick-buy"],

  computed: {
    shop() {
      return this.$store.getters.getShop;
    },
    currency() {
      return currentCurrency();
    },
    price() {
      return priceOf(this.shop, this.product, this.currency);
    },
    now() {
      return this.price.now;
    },
    was() {
      return this.price.was;
    },
    off() {
      return percentOff(this.shop, this.product);
    },
    /* The original stays the src; the srcset (productSrcset) gives the
       browser the size the card is shown at. */
    picture() {
      return productImage(this.product);
    },
    to() {
      return { name: window.$storefront.routes.PRODUCT_PAGE, params: { product_id: this.product.id } };
    },
  },

  methods: {
    srcset(product) {
      return productSrcset(product);
    },
    dropSrcset,
  },
};
</script>
