/* Valero in this language: the shared Kalio base and Valero's own words, one chunk. */
import base from "./base/fr";
import own from "./valero.fr";

export default { ...base, ...own } as Record<string, string>;
