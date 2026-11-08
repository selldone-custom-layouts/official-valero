<!--
  - Copyright (c) 2023. Selldone® Business OS™
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

<!--
  Kalio: Contact us (8 November 2026). The owner's buyer test found
  Selldone's own page here: a heading, a tall empty block, and far below it
  a form on a fixed off-white card (white on white in a dark Layout), with a
  red "Store profile not found" when the shop has written no contact page.

  Now, in the Layout's own tokens (so it is Dino's lavender or Valero's
  hairline black): the heading and three ways to the right answer (an
  order's own messages, the questions page, About) beside the form in a
  card. The shop's own contact page, when it has one, shows under the ways;
  without one nothing complains. The form and its sending are Selldone's.
-->
<template>
  <!-- The official pages' frame (the crumbs, the page width) is drawn by
       their parent route. -->
  <div class="k-contact">
      <div class="k-contact__grid">
        <section class="k-contact__side">
          <h1 class="k-official__title">Contact us</h1>
          <p class="k-contact__lede">Write to the shop here and the answer comes to your email. These may answer you sooner:</p>

          <ul class="k-contact__ways">
            <li>
              <v-icon>receipt_long</v-icon>
              <div>
                <b>About an order</b>
                <span>Each order has its own messages with the seller who sent it.</span>
                <router-link :to="{ name: window.$storefront.routes.HISTORY_ORDERS_PHYSICAL }">Your orders</router-link>
              </div>
            </li>
            <li>
              <v-icon>help_outline</v-icon>
              <div>
                <b>Before you buy</b>
                <span>What shoppers ask most, answered.</span>
                <router-link :to="{ name: 'ShopFAQ' }">Questions and answers</router-link>
              </div>
            </li>
            <li>
              <v-icon>storefront</v-icon>
              <div>
                <b>About the shop</b>
                <span>Who runs it and how an order works.</span>
                <router-link :to="{ name: window.$storefront.routes.SHOP_PROFILE_PAGE_ABOUT_US }">About us</router-link>
              </div>
            </li>
          </ul>

          <s-article-editor
            v-if="profile?.body"
            :body="profile.body"
            :edit="false"
            :enable-title="false"
            :only-view="true"
            class="k-contact__profile"
          />
        </section>

        <section aria-labelledby="k-contact-form" class="k-contact__card">
          <div v-if="submitted" class="k-contact__done">
            <v-icon size="40">check_circle</v-icon>
            <h2 id="k-contact-form">Thank you, it is on its way</h2>
            <p>The shop answers by email, usually within a day.</p>
            <router-link :to="{ name: window.$storefront.routes.SHOP_PAGE }" class="k-btn k-btn--solid">Back to the shop</router-link>
          </div>

          <template v-else>
            <h2 id="k-contact-form">Write to us</h2>

            <div v-if="USER()" class="k-contact__who">
              <v-avatar v-if="USER().id" size="44"><v-img :src="getUserAvatar(USER().id)" /></v-avatar>
              <div>
                <b>{{ USER().name }}</b>
                <small>{{ USER().email || USER().phone }}</small>
              </div>
            </div>
            <template v-else>
              <v-text-field v-model="name" label="Your name" persistent-placeholder placeholder="Jane Doe" variant="outlined" />
              <v-text-field
                v-model="email"
                :rules="[GlobalRules.required(), GlobalRules.email()]"
                class="english-field"
                label="Email, for the answer"
                persistent-placeholder
                placeholder="you@example.com"
                prepend-inner-icon="mail_outline"
                variant="outlined"
              />
              <v-text-field
                v-model="phone"
                class="english-field"
                label="Phone (optional)"
                persistent-placeholder
                placeholder="+1 000 000 0000"
                prepend-inner-icon="phone"
                variant="outlined"
              />
            </template>

            <v-textarea
              v-model="message"
              :rules="[GlobalRules.required()]"
              auto-grow
              label="Your message"
              persistent-placeholder
              placeholder="An order number helps, if it is about an order."
              rows="5"
              variant="outlined"
            />

            <button :disabled="!canSend || busy_send" class="k-btn k-btn--solid k-contact__send" type="button" @click="sendForm">
              <v-progress-circular v-if="busy_send" indeterminate size="18" width="2" />
              <template v-else>Send<v-icon size="18">send</v-icon></template>
            </button>
          </template>
        </section>
      </div>
  </div>
</template>

<script lang="ts">
import NotificationService from "@selldone/components-vue/plugins/notification/NotificationService.ts";

import SArticleEditor from "@selldone/components-vue/article/SArticleEditor.vue";

export default {
  name: "StorefrontPageOfficialContactUs",
  components: { SArticleEditor },
  inject: ["$shop"],

  data: () => ({
    profile: null,
    busy: false,

    name: null,
    email: null,
    phone: null,
    message: "",
    category: null,

    busy_send: false,
    submitted: false,
  }),

  computed: {
    canSend() {
      const mail = this.USER() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email || "");
      return !!mail && !!this.message && this.message.trim().length > 0;
    },
  },

  created() {
    this.setPageTitle("Contact us");
    this.fetchProfile();

    if (this.USER()) {
      this.name = this.USER().name;
      this.email = this.USER().email;
      this.phone = this.USER().phone;
    }
  },

  methods: {
    /** The shop's own contact page, if it wrote one. A shop without one is
     *  normal: no error for the shopper. */
    fetchProfile() {
      this.busy = true;
      axios
        .get(window.XAPI.GET_SHOP_PROFILE(this.$shop.name, "contact-us"))
        .then(({ data }) => {
          this.profile = data?.error ? null : data.profile;
        })
        .catch(() => (this.profile = null))
        .finally(() => {
          this.busy = false;
        });
    },

    sendForm() {
      this.message = this.message.replace(/<[^>]*>?/gm, "");
      if (!this.canSend) return;

      this.busy_send = true;

      axios
        .post(window.XAPI.POST_CONTACT_US_FORM(this.$shop.name), {
          name: this.name,
          email: this.email,
          phone: this.phone,
          message: this.message,
          category: this.category,
          url: window.location.href,
        })
        .then(({ data }) => {
          if (!data.error) {
            this.name = null;
            this.email = null;
            this.phone = null;
            this.message = "";
            this.category = null;
            this.submitted = true;
          } else {
            NotificationService.showErrorAlert(null, data.error_msg);
          }
        })
        .catch((error) => {
          NotificationService.showLaravelError(error);
        })
        .finally(() => {
          this.busy_send = false;
        });
    },
  },
};
</script>

<style lang="scss">
/* In the Layout's tokens: Dino's are lavender and round, Valero's black
   with square corners and hairlines. */
.k-contact {
  padding-bottom: 64px;

  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
    gap: 36px;
    align-items: start;
    margin-top: 6px;
  }

  &__lede {
    max-width: 46ch;
    margin: 10px 0 0;
    color: var(--k-muted);
    font-size: 16px;
    line-height: 1.5;
  }

  &__ways {
    display: grid;
    gap: 12px;
    margin: 22px 0 0;
    padding: 0;
    list-style: none;

    li {
      display: grid;
      grid-template-columns: 44px minmax(0, 1fr);
      gap: 14px;
      align-items: start;
      padding: 16px;
      border-radius: var(--k-radius);
      background: var(--k-card);
      box-shadow: 0 0 0 1px var(--k-line);
    }

    > li > .v-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--k-radius-sm);
      background: var(--k-wash);
      color: var(--k-green) !important;
    }

    b {
      display: block;
      color: var(--k-ink);
      font-family: var(--k-display);
      font-size: 17px;
      font-weight: 600;
    }

    span {
      display: block;
      margin-top: 2px;
      color: var(--k-muted);
      font-size: 14px;
      line-height: 1.45;
    }

    a {
      display: inline-block;
      margin-top: 6px;
      color: var(--k-green) !important;
      font-size: 14px;
      font-weight: 700;
    }
  }

  &__profile {
    margin-top: 22px;
  }

  &__card {
    display: grid;
    gap: 6px;
    padding: 24px;
    border-radius: var(--k-radius-lg);
    background: var(--k-card);
    box-shadow: 0 0 0 1px var(--k-line);

    h2 {
      margin: 0 0 12px;
      color: var(--k-ink);
      font-family: var(--k-display);
      font-size: 24px;
      font-weight: 600;
    }
  }

  &__who {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
    padding: 12px;
    border-radius: var(--k-radius);
    background: var(--k-wash);

    b,
    small {
      display: block;
    }

    small {
      color: var(--k-muted);
    }
  }

  &__send {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    height: 50px;
    margin-top: 6px;

    &:disabled {
      opacity: 0.5;
      cursor: default;
    }
  }

  &__done {
    display: grid;
    justify-items: center;
    gap: 8px;
    padding: 28px 8px;
    text-align: center;

    > .v-icon {
      color: #16a34a !important;
    }

    p {
      margin: 0 0 8px;
      color: var(--k-muted);
    }
  }

  @media (max-width: 860px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 24px;
    }

    &__card {
      padding: 18px;
    }
  }
}

</style>
