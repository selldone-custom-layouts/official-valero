<!--
  Kalio — Sign in.

  Replaces Selldone's need-login sheet (SStorefrontNeedLoginDialog), which
  opened on the shop's round icon and "Hi, Please login" over four buttons in
  four colours. Kalio's is a card in two halves: the shop's wordmark on deep
  green with what an account is for, and the ways to continue as one quiet
  stack. On a phone it rises from the bottom and the green half shrinks to
  a header.

  The sign-in itself is untouched: the methods, the redirects, the email
  code and the token are Selldone's SShopLogin, placed inside. The sheet
  opens on the same app event ("need-login") and hides the phone's bottom
  bar while it is open, as Selldone's did.
-->
<template>
  <!-- Valero (sign-in, design D): on a computer a split window, a dark photo
       with one serif line beside the form; on a phone the form alone, as a
       sheet from the bottom. The shop's own ways in, why an account helps,
       and the terms. -->
  <v-dialog
    v-model="show"
    :fullscreen="false"
    :persistent="busyUser"
    :transition="compact ? 'dialog-bottom-transition' : 'dialog-transition'"
    aria-labelledby="k-signin-title"
    class="k-signin-overlay t-signin-overlay"
    content-class="k-signin t-signin"
    :max-width="compact || !photo ? 460 : 940"
    scrollable
  >
    <div :class="{ '-split': !compact && photo }" class="v-signin">
    <div v-if="!compact && photo" aria-hidden="true" class="v-signin__photo">
      <img :src="photo" alt="" />
      <p>{{ t("valero.signin.photo", "Your bag waits for you, whenever you come back.") }}</p>
    </div>
    <div class="t-signin__card">
      <button :aria-label="t('common.close', 'Close')" class="t-signin__x" type="button" @click="show = false">
        <v-icon>close</v-icon>
      </button>
      <p class="t-signin__mark v-caps">{{ t("signin.title", "Welcome to {shop}", { shop: shopTitle }) }}</p>
      <h2 id="k-signin-title" class="t-signin__title">{{ t("valero.signin.title", "Sign in") }}</h2>
      <p class="t-signin__lede">
        {{
          sellerCount > 1
            ? t("valero.signin.ledeMakers", "One account for every maker on {shop}, your orders and your saved things.", { shop: shopTitle })
            : t("valero.signin.lede", "Your account is made as you sign in.")
        }}
      </p>
      <s-shop-login v-model:show="show" class="k-signin__methods t-signin__methods" />
      <ul class="t-signin__perks">
        <li><v-icon size="20">local_shipping</v-icon>{{ t("signin.perks.orders", "Follow every order to your door") }}</li>
        <li><v-icon size="20">replay</v-icon>{{ t("valero.signin.perks.again", "Buy your usual again in one tap") }}</li>
        <li><v-icon size="20">favorite_border</v-icon>{{ t("signin.perks.saved", "Keep favourites for next week") }}</li>
        <li v-if="sellerCount > 1">
          <v-icon size="20">storefront</v-icon>{{ t("signin.perks.sellers", { one: "One bag across {n} independent maker", other: "One bag across {n} independent makers" }, { n: sellerCount }) }}
        </li>
      </ul>
      <p class="t-signin__legal">
        {{ t("signin.legal.lead", "By continuing you agree to {shop}’s", { shop: shopTitle }) }}
        <router-link :to="{ name: window.$storefront.routes.SHOP_PROFILE_PAGE_TERMS }" @click="show = false">{{ t("signin.legal.terms", "Terms") }}</router-link>
        {{ t("signin.legal.and", "and") }}
        <router-link :to="{ name: window.$storefront.routes.SHOP_PROFILE_PAGE_PRIVACY }" @click="show = false">{{ t("valero.signin.privacy", "Privacy") }}</router-link>.
      </p>
      <div v-if="busyUser" class="k-signin__busy">
        <v-progress-circular color="primary" indeterminate size="36" width="3" />
      </div>
    </div>
    </div>
  </v-dialog>
</template>

<script>
import { throttle } from "lodash-es";
import SShopLogin from "@selldone/components-vue/storefront/login/SShopLogin.vue";
import { EventBus } from "@selldone/components-vue/utils/events/EventBus.ts";
import { aisleImage, aisles, tintFor, vendors } from "../kalio-catalog";
import { photo } from "../../valero/valero-home";

/* Selldone's words for the ways in ("Login with Google", "Login by
   Email") and for the email steps, as a shop says them now. English only;
   other languages keep their own. */
const WORDS = {
  title: "Sign in",
  email_login_step_1: "Enter your email and we’ll send you a six-digit code. No password needed.",
  email_login_step_2: "We’ll send the code to this address. Is it right?",
  email_login_step_3: "Enter the six-digit code we sent you. It expires in 10 minutes.",
  login_google: "Continue with Google",
  login_apple: "Continue with Apple",
  login_facebook: "Continue with Facebook",
  login_email: "Continue with email",
  login_account: "Continue with Selldone",
  login_sms: "Continue with phone",
};

export default {
  name: "KalioSignIn",
  components: { SShopLogin },
  inject: ["$shop"],

  data() {
    return {
      window: window,
      show: false,
      aisleList: [],
      sellerCount: 0,
    };
  },

  computed: {
    /** The photo beside the form on a computer (assets/valero/). */
    photo() {
      return photo("valero-signin-bread");
    },
    shopTitle() {
      return this.$shop?.title || "Kalio";
    },
    busyUser() {
      return this.$store.getters.getBusyUser;
    },
    compact() {
      return this.$vuetify.display.xs;
    },
    rings() {
      return this.aisleList.filter((aisle) => aisle.icon).slice(0, 4);
    },
  },

  watch: {
    show(value) {
      this.$store.commit("setForceHideNavigation", value);
      if (value && !this.aisleList.length) this.read();
    },
  },

  created() {
    const i18n = window.$i18n_global;
    const locale = i18n?.locale?.value ?? i18n?.locale;
    if (i18n?.mergeLocaleMessage && String(locale).startsWith("en")) {
      i18n.mergeLocaleMessage(locale, { global: { need_login: WORDS } });
    }

    EventBus.$on(
      "need-login",
      throttle((show) => {
        this.show = show;
      }, 800),
    );
  },

  methods: {
    aisleImage,
    tint: tintFor,

    read() {
      aisles().then((list) => (this.aisleList = list));
      vendors().then((list) => (this.sellerCount = list.length));
    },
  },
};
</script>
