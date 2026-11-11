/* Valero in this language: the shared Kalio base and Valero's own words, one chunk. */
import base from "./base/ar";
import own from "./valero.ar";

export default { ...base, ...own } as Record<string, string>;
