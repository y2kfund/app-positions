import { defineComponent as c, createElementBlock as p, openBlock as r, createElementVNode as n } from "vue";
const i = { class: "card" }, _ = /* @__PURE__ */ c({
  __name: "Positions",
  setup(o) {
    return (t, e) => (r(), p("section", i, [...e[0] || (e[0] = [
      n("h1", null, "Positions app", -1),
      n("p", null, "This is a minimal standalone Vue 3 app. No app-core used.", -1)
    ])]));
  }
}), l = (o, t) => {
  const e = o.__vccOpts || o;
  for (const [s, a] of t)
    e[s] = a;
  return e;
}, f = /* @__PURE__ */ l(_, [["__scopeId", "data-v-ef3ff7eb"]]);
export {
  f as Positions,
  f as default
};
