/*
 * Kalio — the sample texts of the shop's own pages (5 November 2026).
 *
 * About us, Terms of use and Privacy come from the shop's profiles in the
 * Selldone dashboard. molino has written none of them yet, and the owner
 * asked for full pages in the meantime, filled with general text that says
 * it is a test and not real. These are those texts; each page shows them,
 * under KalioSampleNote, only while the shop's own profile is missing.
 *
 * Nothing here is a promise: the terms do not form an agreement and the
 * policy is not the shop's policy. Dates, numbers and names in the letter
 * are marked as examples.
 */

export interface Section {
  title: string;
  text: string[];
}

export function termsSample(shop: string): { short: string[]; sections: Section[] } {
  return {
    short: [
      `Products are sold by independent sellers; ${shop} runs the shop.`,
      "You pay at checkout, or on delivery where a seller offers it.",
      "Report a damaged or wrong item within 7 days.",
      "Each order has a message thread with its seller.",
    ],
    sections: [
      {
        title: "Who we are",
        text: [
          `${shop} is an online marketplace. The products are sold by independent sellers; ${shop} runs the shop where you find them and place your order.`,
        ],
      },
      {
        title: "Your account",
        text: [
          "You need an account, or a guest checkout where the shop offers one, to order. Keep your sign-in details to yourself and tell us if you think someone else has used them.",
          "Sample paragraph: a fuller explanation would go here, written in plain words, with examples of what this means for an order.",
        ],
      },
      {
        title: "Orders and prices",
        text: [
          "Prices are set by each seller and shown with taxes as stated at checkout. An order is placed when you confirm it; the seller confirms it when they accept it.",
        ],
      },
      {
        title: "Payment",
        text: [
          `You pay at checkout, or on delivery where the seller offers cash on delivery. Card payments are handled by the payment provider and are not stored by ${shop}.`,
        ],
      },
      {
        title: "Delivery",
        text: [
          "Delivery times and costs are shown before you pay. The seller sends the items; you can follow the order and message the seller from your account.",
        ],
      },
      {
        title: "Returns and refunds",
        text: [
          "If something arrives damaged or wrong, tell the seller from the order page within 7 days. Fresh food can be refunded but not returned.",
        ],
      },
      {
        title: "Changes to these terms",
        text: ["We may update these terms. The date at the top shows the latest version."],
      },
    ],
  };
}

export function privacySample(shop: string): { short: string[]; sections: Section[] } {
  return {
    short: [
      "We use your details to take and deliver orders.",
      "Sellers see only what they need to send your order.",
      "We do not sell your data.",
      "You choose which optional cookies to allow.",
    ],
    sections: [
      {
        title: "What we collect",
        text: [
          "Your name, contact details and delivery address; what you order; and how you use the shop (pages viewed, searches).",
        ],
      },
      {
        title: "Why we use it",
        text: [
          "To take and deliver your orders, to let sellers and you talk about an order, to keep the shop secure and to improve it.",
          "Sample paragraph: a fuller explanation would go here, written in plain words, with an example for each use.",
        ],
      },
      {
        title: "Who sees it",
        text: [
          "The seller who fills your order sees what they need to send it. Payment providers handle card details. We do not sell your data.",
        ],
      },
      {
        title: "How long we keep it",
        text: ["Order records for as long as the law requires; your account until you close it."],
      },
      {
        title: "Your rights",
        text: ["You can see, correct, download or delete your data, and say no to marketing at any time."],
      },
      {
        title: "Cookies",
        text: ["Essential cookies keep you signed in and your bag full. Anything optional is your choice, below."],
      },
    ],
  };
}

export function aboutSample(shop: string) {
  return {
    title: "Why we built one basket",
    lead: "Good grocers are often small, and shopping several of them used to mean several trips, several baskets and several deliveries. We wanted their shelves side by side, in one place, with one checkout.",
    text: [
      `So ${shop} is a marketplace: each product comes from an independent seller, prices are theirs, and they pack and send what you order from them. We look after the shop itself — the aisles, the basket and the account where you follow your orders.`,
    ],
    values: [
      { title: "Clear prices", text: "The price you see is the one you pay, with the unit price under it and savings marked plainly." },
      { title: "Your choice of seller", text: "When two shops stock the same item, both are shown and you pick." },
      { title: "Less waste", text: "Sizes that fit a week, and seasonal picks in the journal." },
      { title: "People you can reach", text: "Every order has a message thread with the shop that sent it." },
    ],
    timeline: [
      { when: "Spring", text: "The first seller joins and the first aisles open. (Example.)" },
      { when: "Summer", text: "A second seller joins; both sell from one basket. (Example.)" },
      { when: "Today", text: "Every aisle, every seller, one checkout. (Example.)" },
    ],
    sign: `— the ${shop} team`,
  };
}

/** A shop page's text with its markup taken out, for "is it empty?". */
export function plainText(html: string | null | undefined): string {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
