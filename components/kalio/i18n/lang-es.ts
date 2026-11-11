/* Valero in this language: the shared Kalio base and Valero's own words, one chunk. */
import base from "./base/es";
import own from "./valero.es";

export default { ...base, ...own } as Record<string, string>;
