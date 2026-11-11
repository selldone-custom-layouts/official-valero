/* Valero in this language: the shared Kalio base and Valero's own words, one chunk. */
import base from "./base/pa";
import own from "./valero.pa";

export default { ...base, ...own } as Record<string, string>;
