/* Valero in this language: the shared Kalio base and Valero's own words, one chunk. */
import base from "./base/da";
import own from "./valero.da";

export default { ...base, ...own } as Record<string, string>;
