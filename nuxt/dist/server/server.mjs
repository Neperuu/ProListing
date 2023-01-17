import { reactive, getCurrentInstance, toRef, isRef, inject, defineComponent, computed, ref, h, resolveComponent, version, unref, withCtx, createVNode, createTextVNode, openBlock, createBlock, useSSRContext, defineAsyncComponent, provide, onErrorCaptured, createApp } from "vue";
import { $fetch } from "ofetch";
import { useRuntimeConfig as useRuntimeConfig$1 } from "#internal/nitro";
import { createHooks } from "hookable";
import { getContext } from "unctx";
import "destr";
import { hasProtocol, parseURL, joinURL, isEqual, stringifyParsedURL, stringifyQuery, parseQuery } from "ufo";
import { createError as createError$1, sendRedirect } from "h3";
import { createHead as createHead$1, useHead } from "@unhead/vue";
import { renderDOMHead, debouncedRenderDOMHead } from "@unhead/dom";
import { ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrRenderSuspense } from "vue/server-renderer";
import { Navbar, NavbarLogo, Rating, Avatar, Carousel } from "flowbite-vue";
const appConfig = useRuntimeConfig$1().app;
const baseURL = () => appConfig.baseURL;
const nuxtAppCtx = getContext("nuxt-app");
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    provide: void 0,
    globalName: "nuxt",
    payload: reactive({
      data: {},
      state: {},
      _errors: {},
      ...{ serverRendered: true }
    }),
    static: {
      data: {}
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: {},
    ...options
  };
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  {
    if (nuxtApp.ssrContext) {
      nuxtApp.ssrContext.nuxt = nuxtApp;
    }
    nuxtApp.ssrContext = nuxtApp.ssrContext || {};
    if (nuxtApp.ssrContext.payload) {
      Object.assign(nuxtApp.payload, nuxtApp.ssrContext.payload);
    }
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.payload.config = {
      public: options.ssrContext.runtimeConfig.public,
      app: options.ssrContext.runtimeConfig.app
    };
  }
  const runtimeConfig = options.ssrContext.runtimeConfig;
  const compatibilityConfig = new Proxy(runtimeConfig, {
    get(target, prop) {
      var _a;
      if (prop === "public") {
        return target.public;
      }
      return (_a = target[prop]) != null ? _a : target.public[prop];
    },
    set(target, prop, value) {
      {
        return false;
      }
    }
  });
  nuxtApp.provide("config", compatibilityConfig);
  return nuxtApp;
}
async function applyPlugin(nuxtApp, plugin) {
  if (typeof plugin !== "function") {
    return;
  }
  const { provide: provide2 } = await callWithNuxt(nuxtApp, plugin, [nuxtApp]) || {};
  if (provide2 && typeof provide2 === "object") {
    for (const key in provide2) {
      nuxtApp.provide(key, provide2[key]);
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  for (const plugin of plugins2) {
    await applyPlugin(nuxtApp, plugin);
  }
}
function normalizePlugins(_plugins2) {
  const plugins2 = _plugins2.map((plugin) => {
    if (typeof plugin !== "function") {
      return null;
    }
    if (plugin.length > 1) {
      return (nuxtApp) => plugin(nuxtApp, nuxtApp.provide);
    }
    return plugin;
  }).filter(Boolean);
  return plugins2;
}
function defineNuxtPlugin(plugin) {
  plugin[NuxtPluginIndicator] = true;
  return plugin;
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => args ? setup(...args) : setup();
  {
    return nuxtAppCtx.callAsync(nuxt, fn);
  }
}
function useNuxtApp() {
  const nuxtAppInstance = nuxtAppCtx.tryUse();
  if (!nuxtAppInstance) {
    const vm = getCurrentInstance();
    if (!vm) {
      throw new Error("nuxt instance unavailable");
    }
    return vm.appContext.app.$nuxt;
  }
  return nuxtAppInstance;
}
function useRuntimeConfig() {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
function defineAppConfig(config) {
  return config;
}
const useError = () => toRef(useNuxtApp().payload, "error");
const showError = (_err) => {
  const err = createError(_err);
  try {
    const nuxtApp = useNuxtApp();
    nuxtApp.callHook("app:error", err);
    const error = useError();
    error.value = error.value || err;
  } catch {
    throw err;
  }
  return err;
};
const clearError = async (options = {}) => {
  const nuxtApp = useNuxtApp();
  const error = useError();
  nuxtApp.callHook("app:error:cleared", options);
  if (options.redirect) {
    await nuxtApp.$router.replace(options.redirect);
  }
  error.value = null;
};
const createError = (err) => {
  const _err = createError$1(err);
  _err.__nuxt_error = true;
  return _err;
};
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = "$s" + _key;
  const nuxt = useNuxtApp();
  const state = toRef(nuxt.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxt.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
const useRouter = () => {
  var _a;
  return (_a = useNuxtApp()) == null ? void 0 : _a.$router;
};
const useRoute = () => {
  if (getCurrentInstance()) {
    return inject("_route", useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
const navigateTo = (to, options) => {
  if (!to) {
    to = "/";
  }
  const toPath = typeof to === "string" ? to : to.path || "/";
  const isExternal = hasProtocol(toPath, true);
  if (isExternal && !(options == null ? void 0 : options.external)) {
    throw new Error("Navigating to external URL is not allowed by default. Use `nagivateTo (url, { external: true })`.");
  }
  if (isExternal && parseURL(toPath).protocol === "script:") {
    throw new Error("Cannot navigate to an URL with script protocol.");
  }
  const router = useRouter();
  {
    const nuxtApp = useNuxtApp();
    if (nuxtApp.ssrContext && nuxtApp.ssrContext.event) {
      const redirectLocation = isExternal ? toPath : joinURL(useRuntimeConfig().app.baseURL, router.resolve(to).fullPath || "/");
      return nuxtApp.callHook("app:redirected").then(() => sendRedirect(nuxtApp.ssrContext.event, redirectLocation, (options == null ? void 0 : options.redirectCode) || 302));
    }
  }
  if (isExternal) {
    if (options == null ? void 0 : options.replace) {
      location.replace(toPath);
    } else {
      location.href = toPath;
    }
    return Promise.resolve();
  }
  return (options == null ? void 0 : options.replace) ? router.replace(to) : router.push(to);
};
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
const DEFAULT_EXTERNAL_REL_ATTRIBUTE = "noopener noreferrer";
function defineNuxtLink(options) {
  const componentName = options.componentName || "NuxtLink";
  return defineComponent({
    name: componentName,
    props: {
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      prefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      noPrefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      prefetchedClass: {
        type: String,
        default: void 0,
        required: false
      },
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      }
    },
    setup(props, { slots }) {
      const router = useRouter();
      const to = computed(() => {
        return props.to || props.href || "";
      });
      const isExternal = computed(() => {
        if (props.external) {
          return true;
        }
        if (props.target && props.target !== "_self") {
          return true;
        }
        if (typeof to.value === "object") {
          return false;
        }
        return to.value === "" || hasProtocol(to.value, true);
      });
      const prefetched = ref(false);
      const el = void 0;
      return () => {
        var _a, _b, _c;
        if (!isExternal.value) {
          return h(
            resolveComponent("RouterLink"),
            {
              ref: void 0,
              to: to.value,
              ...prefetched.value && !props.custom ? { class: props.prefetchedClass || options.prefetchedClass } : {},
              activeClass: props.activeClass || options.activeClass,
              exactActiveClass: props.exactActiveClass || options.exactActiveClass,
              replace: props.replace,
              ariaCurrentValue: props.ariaCurrentValue,
              custom: props.custom
            },
            slots.default
          );
        }
        const href = typeof to.value === "object" ? (_b = (_a = router.resolve(to.value)) == null ? void 0 : _a.href) != null ? _b : null : to.value || null;
        const target = props.target || null;
        const rel = props.noRel ? null : firstNonUndefined(props.rel, options.externalRelAttribute, href ? DEFAULT_EXTERNAL_REL_ATTRIBUTE : "") || null;
        const navigate = () => navigateTo(href, { replace: props.replace });
        if (props.custom) {
          if (!slots.default) {
            return null;
          }
          return slots.default({
            href,
            navigate,
            route: router.resolve(href),
            rel,
            target,
            isExternal: isExternal.value,
            isActive: false,
            isExactActive: false
          });
        }
        return h("a", { ref: el, href, rel, target }, (_c = slots.default) == null ? void 0 : _c.call(slots));
      };
    }
  });
}
const __nuxt_component_0 = defineNuxtLink({ componentName: "NuxtLink" });
function isObject(value) {
  return value !== null && typeof value === "object";
}
function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isObject(value) && isObject(object[key])) {
      object[key] = _defu(value, object[key], (namespace ? `${namespace}.` : "") + key.toString(), merger);
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => arguments_.reduce((p, c) => _defu(p, c, "", merger), {});
}
const defuFn = createDefu((object, key, currentValue, _namespace) => {
  if (typeof object[key] !== "undefined" && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});
const cfg0 = defineAppConfig({
  title: "Hello Nuxt",
  theme: {
    dark: true,
    colors: {
      primary: "#ff0000"
    }
  }
});
const inlineConfig = {};
defuFn(cfg0, inlineConfig);
const tailwind = "";
const components = {};
const _nuxt_components_plugin_mjs_KR1HBZs4kY = defineNuxtPlugin((nuxtApp) => {
  for (const name in components) {
    nuxtApp.vueApp.component(name, components[name]);
    nuxtApp.vueApp.component("Lazy" + name, components[name]);
  }
});
function createHead(initHeadObject) {
  const unhead = createHead$1();
  const legacyHead = {
    unhead,
    install(app) {
      if (version.startsWith("3")) {
        app.config.globalProperties.$head = unhead;
        app.provide("usehead", unhead);
      }
    },
    use(plugin) {
      unhead.use(plugin);
    },
    resolveTags() {
      return unhead.resolveTags();
    },
    headEntries() {
      return unhead.headEntries();
    },
    headTags() {
      return unhead.resolveTags();
    },
    push(input, options) {
      return unhead.push(input, options);
    },
    addEntry(input, options) {
      return unhead.push(input, options);
    },
    addHeadObjs(input, options) {
      return unhead.push(input, options);
    },
    addReactiveEntry(input, options) {
      const api = useHead(input, options);
      if (typeof api !== "undefined")
        return api.dispose;
      return () => {
      };
    },
    removeHeadObjs() {
    },
    updateDOM(document, force) {
      if (force)
        renderDOMHead(unhead, { document });
      else
        debouncedRenderDOMHead(unhead, { delayFn: (fn) => setTimeout(() => fn(), 50), document });
    },
    internalHooks: unhead.hooks,
    hooks: {
      "before:dom": [],
      "resolved:tags": [],
      "resolved:entries": []
    }
  };
  unhead.addHeadObjs = legacyHead.addHeadObjs;
  unhead.updateDOM = legacyHead.updateDOM;
  unhead.hooks.hook("dom:beforeRender", (ctx) => {
    for (const hook of legacyHead.hooks["before:dom"]) {
      if (hook() === false)
        ctx.shouldRender = false;
    }
  });
  if (initHeadObject)
    legacyHead.addHeadObjs(initHeadObject);
  return legacyHead;
}
version.startsWith("2.");
const appHead = { "meta": [{ "name": "viewport", "content": "width=device-width, initial-scale=1" }, { "charset": "utf-8" }], "link": [], "style": [], "script": [], "noscript": [] };
const node_modules_nuxt_dist_head_runtime_lib_vueuse_head_plugin_mjs_D7WGfuP1A0 = defineNuxtPlugin((nuxtApp) => {
  const head = createHead();
  head.push(appHead);
  nuxtApp.vueApp.use(head);
  nuxtApp._useHead = useHead;
  {
    nuxtApp.ssrContext.renderMeta = async () => {
      const { renderSSRHead } = await import("@unhead/ssr");
      const meta = await renderSSRHead(head.unhead);
      return {
        ...meta,
        bodyScriptsPrepend: meta.bodyTagsOpen,
        bodyScripts: meta.bodyTags
      };
    };
  }
});
const globalMiddleware = [];
function getRouteFromPath(fullPath) {
  if (typeof fullPath === "object") {
    fullPath = stringifyParsedURL({
      pathname: fullPath.path || "",
      search: stringifyQuery(fullPath.query || {}),
      hash: fullPath.hash || ""
    });
  }
  const url = parseURL(fullPath.toString());
  return {
    path: url.pathname,
    fullPath,
    query: parseQuery(url.search),
    hash: url.hash,
    params: {},
    name: void 0,
    matched: [],
    redirectedFrom: void 0,
    meta: {},
    href: fullPath
  };
}
const node_modules_nuxt_dist_app_plugins_router_mjs_PJLmOmdFeM = defineNuxtPlugin((nuxtApp) => {
  const initialURL = nuxtApp.ssrContext.url;
  const routes = [];
  const hooks = {
    "navigate:before": [],
    "resolve:before": [],
    "navigate:after": [],
    error: []
  };
  const registerHook = (hook, guard) => {
    hooks[hook].push(guard);
    return () => hooks[hook].splice(hooks[hook].indexOf(guard), 1);
  };
  const baseURL2 = useRuntimeConfig().app.baseURL;
  const route = reactive(getRouteFromPath(initialURL));
  async function handleNavigation(url, replace) {
    try {
      const to = getRouteFromPath(url);
      for (const middleware of hooks["navigate:before"]) {
        const result = await middleware(to, route);
        if (result === false || result instanceof Error) {
          return;
        }
        if (result) {
          return handleNavigation(result, true);
        }
      }
      for (const handler of hooks["resolve:before"]) {
        await handler(to, route);
      }
      Object.assign(route, to);
      if (false)
        ;
      for (const middleware of hooks["navigate:after"]) {
        await middleware(to, route);
      }
    } catch (err) {
      for (const handler of hooks.error) {
        await handler(err);
      }
    }
  }
  const router = {
    currentRoute: route,
    isReady: () => Promise.resolve(),
    options: {},
    install: () => Promise.resolve(),
    push: (url) => handleNavigation(url, false),
    replace: (url) => handleNavigation(url, true),
    back: () => window.history.go(-1),
    go: (delta) => window.history.go(delta),
    forward: () => window.history.go(1),
    beforeResolve: (guard) => registerHook("resolve:before", guard),
    beforeEach: (guard) => registerHook("navigate:before", guard),
    afterEach: (guard) => registerHook("navigate:after", guard),
    onError: (handler) => registerHook("error", handler),
    resolve: getRouteFromPath,
    addRoute: (parentName, route2) => {
      routes.push(route2);
    },
    getRoutes: () => routes,
    hasRoute: (name) => routes.some((route2) => route2.name === name),
    removeRoute: (name) => {
      const index = routes.findIndex((route2) => route2.name === name);
      if (index !== -1) {
        routes.splice(index, 1);
      }
    }
  };
  nuxtApp.vueApp.component("RouterLink", {
    functional: true,
    props: {
      to: String,
      custom: Boolean,
      replace: Boolean,
      activeClass: String,
      exactActiveClass: String,
      ariaCurrentValue: String
    },
    setup: (props, { slots }) => {
      const navigate = () => handleNavigation(props.to, props.replace);
      return () => {
        var _a;
        const route2 = router.resolve(props.to);
        return props.custom ? (_a = slots.default) == null ? void 0 : _a.call(slots, { href: props.to, navigate, route: route2 }) : h("a", { href: props.to, onClick: (e) => {
          e.preventDefault();
          return navigate();
        } }, slots);
      };
    }
  });
  nuxtApp._route = route;
  nuxtApp._middleware = nuxtApp._middleware || {
    global: [],
    named: {}
  };
  const initialLayout = useState("_layout");
  nuxtApp.hooks.hookOnce("app:created", async () => {
    router.beforeEach(async (to, from) => {
      var _a;
      to.meta = reactive(to.meta || {});
      if (nuxtApp.isHydrating) {
        to.meta.layout = (_a = initialLayout.value) != null ? _a : to.meta.layout;
      }
      nuxtApp._processingMiddleware = true;
      const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
      for (const middleware of middlewareEntries) {
        const result = await callWithNuxt(nuxtApp, middleware, [to, from]);
        {
          if (result === false || result instanceof Error) {
            const error = result || createError$1({
              statusCode: 404,
              statusMessage: `Page Not Found: ${initialURL}`
            });
            return callWithNuxt(nuxtApp, showError, [error]);
          }
        }
        if (result || result === false) {
          return result;
        }
      }
    });
    router.afterEach(() => {
      delete nuxtApp._processingMiddleware;
    });
    await router.replace(initialURL);
    if (!isEqual(route.fullPath, initialURL)) {
      await callWithNuxt(nuxtApp, navigateTo, [route.fullPath]);
    }
  });
  return {
    provide: {
      route,
      router
    }
  };
});
const _plugins = [
  _nuxt_components_plugin_mjs_KR1HBZs4kY,
  node_modules_nuxt_dist_head_runtime_lib_vueuse_head_plugin_mjs_D7WGfuP1A0,
  node_modules_nuxt_dist_app_plugins_router_mjs_PJLmOmdFeM
];
const _imports_0 = "" + globalThis.__buildAssetsURL("hand-waving-fill-svgrepo-com.78ffe974.svg");
const _imports_1 = "" + globalThis.__buildAssetsURL("Amazon_logo.60a60cfd.svg");
const _imports_2 = "" + globalThis.__buildAssetsURL("Sample-MP4-Video-File-for-Testing.d6617a00.mp4");
const _imports_3 = "" + globalThis.__buildAssetsURL("clock-stopwatch-svgrepo-com.2e833981.svg");
const _sfc_main$1 = {
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    const pictures = [
      {
        "src": "https://i.picsum.photos/id/253/1920/1080.jpg?hmac=VS8GClQ4qjXQVAHOAhICufO17nxlzjDOObvN_BSIyt0",
        "alt": "Picture 1"
      },
      {
        "src": "https://i.picsum.photos/id/27/1920/1080.jpg?hmac=G_-bZTX0jNizgP6a00LunndV6A-BueaTryVN-ARrDxA",
        "alt": "Picture 2"
      },
      {
        "src": "https://i.picsum.photos/id/570/1920/1080.jpg?hmac=GrPj9g_cV2WHQPt582h1bKvbTSRzDejP6FOf7P20Q8Y",
        "alt": "Picture 3"
      }
    ];
    let toggleActive = true;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><section class="relative bg-gradient-to-b from-black to-purple-900 text-white flex flex-col items-center justify-center">`);
      _push(ssrRenderComponent(unref(Navbar), { class: "bg-transparent pt-10 ml-24 mr-24" }, {
        logo: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(NavbarLogo), {
              "image-url": "https://flowbite.com/docs/images/logo.svg",
              link: "#",
              alt: "ProListing logo"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<h2 class="text-3xl"${_scopeId2}> ProListing</h2>`);
                } else {
                  return [
                    createVNode("h2", { class: "text-3xl" }, " ProListing")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(NavbarLogo), {
                "image-url": "https://flowbite.com/docs/images/logo.svg",
                link: "#",
                alt: "ProListing logo"
              }, {
                default: withCtx(() => [
                  createVNode("h2", { class: "text-3xl" }, " ProListing")
                ]),
                _: 1
              })
            ];
          }
        }),
        "right-side": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button type="button" class="flex text-white bg-orange-700 hover:bg-orange-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-3 md:mr-0 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"${_scopeId}>Get started <svg class="w-5 h-5 ml-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"${_scopeId}><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"${_scopeId}></path></svg></button>`);
          } else {
            return [
              createVNode("button", {
                type: "button",
                class: "flex text-white bg-orange-700 hover:bg-orange-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-3 md:mr-0 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
              }, [
                createTextVNode("Get started "),
                (openBlock(), createBlock("svg", {
                  class: "w-5 h-5 ml-3",
                  fill: "currentColor",
                  viewBox: "0 0 20 20",
                  xmlns: "http://www.w3.org/2000/svg"
                }, [
                  createVNode("path", {
                    "fill-rule": "evenodd",
                    d: "M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z",
                    "clip-rule": "evenodd"
                  })
                ]))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="ml-24 mr-24 mt-10 flex items-center justify-center flex-col text-center pb-52"><p class="flex">Introducing ProListing.ai <img class="w-5 h-5 ml-2"${ssrRenderAttr("src", _imports_0)} alt="Hand waving icon" srcset=""></p><h1 class="text-5xl w-4/5 p-5">SuperCharge your Amazon Product Listing with the Power of AI!</h1><p class="p-3 w-3/6">Selling online? Create, Optimize and Enhance all your Product Listings with Artifitial Intelligence to <strong class="text-orange-700">SuperCharge Your Listings!</strong></p><div class="w-3/5 flex text-center space-x-2 p-3"><button type="button" class="w-1/2 text-white bg-orange-700 hover:bg-orange-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-3 md:mr-0"> SuperCharge Your Listing NOW! </button><button type="button" class="w-1/2 text-white bg-transparent border-2 border-orange-700 hover:border-white hover:text-orange-700 font-medium rounded-lg text-sm px-5 py-2.5 mr-3 md:mr-0"> Request a Demo </button></div><div class="w-2/5 flex items-center justify-center text-center space-x-3 px-3 py-1 mt-10 bg-zinc-800 rounded-md">`);
      _push(ssrRenderComponent(unref(Rating), {
        class: "",
        rating: 5
      }, null, _parent));
      _push(`<p class="text-xs">527 satisfied customers</p><div class="flex">`);
      _push(ssrRenderComponent(unref(Avatar), {
        class: "left-6 z-40",
        size: "xs",
        rounded: "",
        img: "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
      }, null, _parent));
      _push(ssrRenderComponent(unref(Avatar), {
        class: "left-4 z-30",
        size: "xs",
        rounded: "",
        img: "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
      }, null, _parent));
      _push(ssrRenderComponent(unref(Avatar), {
        class: "left-2 z-20",
        size: "xs",
        rounded: "",
        img: "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
      }, null, _parent));
      _push(ssrRenderComponent(unref(Avatar), {
        class: "z-10",
        size: "xs",
        rounded: "",
        img: "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
      }, null, _parent));
      _push(`</div></div><div class="w-4/5 flex p-10 space-x-24"><div class="flex flex-col text-xs text-left"><p><strong>More than 2323 E-Commerce owners</strong></p><p>have already improved their Ecommerce listings with AI!</p></div><div class="flex space-x-4"><img class="w-15 h-7"${ssrRenderAttr("src", _imports_1)} alt="Amazon logo" srcset=""><img class="w-15 h-7"${ssrRenderAttr("src", _imports_1)} alt="Amazon logo" srcset=""><img class="w-15 h-7"${ssrRenderAttr("src", _imports_1)} alt="Amazon logo" srcset=""></div></div></div><div class="absolute w-3/5 -bottom-1/4 overflow-visible border-8 border-black border-opacity-25"><video autoplay loop muted><source${ssrRenderAttr("src", _imports_2)} type="video/mp4"> Your browser does not support the video tag. </video></div></section><section class="bg-white h-50 text-black"><div class="ml-24 mr-24 pt-72 flex items-center justify-center flex-col text-center"><h2 class="text-xl"><strong>Super Charge Your E-Commerce Product Listings with AI:</strong></h2><h2 class="text-xl">Create, Optimize and Enhance Copywriting for Better COnversions and Higher Sales</h2><p class="mt-10">With our cutting-edge Ai software, generate product listings copies in no time to supercharge your sales. our advanced algorithms will analyze your listing, identify your target audirnce and optimize the content to appeal to your ideal custumors. Whether you&#39;re selling online or on Amazon, our powerful tools will help you creqte listings that are compelling and captivating, driving higher conversions and boosting your sales. </p><p class="mt-10">So why wait? Get started today and supercharge your product listings with AI!</p><h2 class="text-xl mt-10"><strong>Already trusted by more than 500 Brands</strong></h2><div class="w-2/5 flex items-center justify-center text-center space-x-3 px-3 py-1 mt-10 bg-zinc-200 rounded-md">`);
      _push(ssrRenderComponent(unref(Rating), {
        class: "",
        rating: 5
      }, null, _parent));
      _push(`<p class="text-xs">527 satisfied customers</p><div class="flex">`);
      _push(ssrRenderComponent(unref(Avatar), {
        class: "left-6 z-40",
        size: "xs",
        rounded: "",
        img: "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
      }, null, _parent));
      _push(ssrRenderComponent(unref(Avatar), {
        class: "left-4 z-30",
        size: "xs",
        rounded: "",
        img: "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
      }, null, _parent));
      _push(ssrRenderComponent(unref(Avatar), {
        class: "left-2 z-20",
        size: "xs",
        rounded: "",
        img: "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
      }, null, _parent));
      _push(ssrRenderComponent(unref(Avatar), {
        class: "z-10",
        size: "xs",
        rounded: "",
        img: "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
      }, null, _parent));
      _push(`</div></div><div class="w-4/5 flex p-10 items-center justify-center space-x-4"><img class="w-15 h-7"${ssrRenderAttr("src", _imports_1)} alt="Amazon logo" srcset=""><img class="w-15 h-7"${ssrRenderAttr("src", _imports_1)} alt="Amazon logo" srcset=""><img class="w-15 h-7"${ssrRenderAttr("src", _imports_1)} alt="Amazon logo" srcset=""><img class="w-15 h-7"${ssrRenderAttr("src", _imports_1)} alt="Amazon logo" srcset=""><img class="w-15 h-7"${ssrRenderAttr("src", _imports_1)} alt="Amazon logo" srcset=""></div><button type="button" class="w-2/5 mb-10 text-white bg-orange-700 hover:bg-orange-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-3 md:mr-0"> SuperCharge Your Listing NOW! </button></div><div class="bg-zinc-800 flex items-center justify-center text-center p-10"><div class="flex flex-col w-1/5"><h1 class="text-4xl text-orange-700">5400+</h1><h2 class="text-xl text-white">Listings generated</h2></div><div class="flex flex-col w-1/5"><h1 class="text-4xl text-orange-700">500+</h1><h2 class="text-xl text-white">Trusting Brands</h2></div><div class="flex flex-col w-1/5"><h1 class="text-4xl text-orange-700">5</h1><h2 class="text-xl text-white">Languages available</h2></div></div><div class="ml-24 mr-24 pt-20 flex items-center justify-center flex-col text-center"><h2 class="text-xl flex"><strong>Your product Listings Copywriting from Hours to Seconds!</strong><img class="relative w-5 h-5 ml-2 -bottom-1"${ssrRenderAttr("src", _imports_3)} alt="Clock stopwatch icon" srcset=""></h2><h2 class="text-xl">Generate a Full listing in less then 30 seconds!</h2>`);
      _push(ssrRenderComponent(unref(Carousel), {
        class: "w-4/5 h-full mt-20 mb-20",
        slide: true,
        "slide-interval": 4e3,
        pictures,
        controls: false
      }, null, _parent));
      _push(`<h2 class="text-xl flex mt-10"><strong>Our pricing</strong></h2><p class="mt-10">Whether you&#39;re a small startup a global brand or an agency, we&#39;ve got the right plan for you to supercharge your product listings with AI. Sign up today and choose from a range of monthly plans that include everything you need to optimize your listings and boost your sales. </p><p class="mt-10"><strong>so what are you waiting for? Start supercharging NOW!</strong></p><div class="flex space-x-2 mt-10"><p>Pay anually and save!</p><div class="flex justify-between items-center"><div class="${ssrRenderClass([{ "bg-orange-700": unref(toggleActive) }, "w-8 h-5 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out"])}"><div class="${ssrRenderClass([{ "translate-x-3": unref(toggleActive) }, "bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out"])}"></div></div></div></div><div class="flex space-x-5 w-4/5 mt-10"><div class="cursor-pointer flex items-center justify-center flex-col text-center w-1/3 border-2 border-white hover:border-orange-600 rounded-2xl"><h2 class="text-xl mt-6"><strong>Lite</strong></h2><p>For Beginners</p><p class="text-xl mt-6"><strong>10 Listings</strong></p><ol class="text-sm leading-7"><li>SEO optimization</li><li>Title Content</li><li>Bullet Points Content</li><li>Description content</li><li>Export Listing</li><li>Unlimited Revisions</li><li>English Only</li></ol><p class="text-xs mt-16">$<strong class="text-5xl">49</strong>/month</p><p class="text-xs">Billed Annually</p><button type="button" class="w-3/5 mt-10 mb-10 text-orange-600 bg-white border-2 border-orange-600 hover:bg-orange-600 hover:text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-3 md:mr-0"> Start Now </button></div><div class="cursor-pointer flex items-center justify-center flex-col text-center w-1/3 border-2 border-white hover:border-orange-600 rounded-2xl"><h2 class="text-xl mt-6"><strong>Lite</strong></h2><p>For Beginners</p><p class="text-xl mt-6"><strong>10 Listings</strong></p><ol class="text-sm leading-7"><li>SEO optimization</li><li>Title Content</li><li>Bullet Points Content</li><li>Description content</li><li>Export Listing</li><li>Unlimited Revisions</li><li>English Only</li></ol><p class="text-xs mt-16">$<strong class="text-5xl">49</strong>/month</p><p class="text-xs">Billed Annually</p><button type="button" class="w-3/5 mt-10 mb-10 text-orange-600 bg-white border-2 border-orange-600 hover:bg-orange-600 hover:text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-3 md:mr-0"> Start Now </button></div><div class="cursor-pointer flex items-center justify-center flex-col text-center w-1/3 border-2 border-white hover:border-orange-600 rounded-2xl"><h2 class="text-xl mt-6"><strong>Lite</strong></h2><p>For Beginners</p><p class="text-xl mt-6"><strong>10 Listings</strong></p><ol class="text-sm leading-7"><li>SEO optimization</li><li>Title Content</li><li>Bullet Points Content</li><li>Description content</li><li>Export Listing</li><li>Unlimited Revisions</li><li>English Only</li></ol><p class="text-xs mt-16">$<strong class="text-5xl">49</strong>/month</p><p class="text-xs">Billed Annually</p><button type="button" class="w-3/5 mt-10 mb-10 text-orange-600 bg-white border-2 border-orange-600 hover:bg-orange-600 hover:text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-3 md:mr-0"> Start Now </button></div></div></div></section><!--]-->`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const ErrorComponent = defineAsyncComponent(() => import("./_nuxt/error-component.6ba8a040.js").then((r) => r.default || r));
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    provide("_route", useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        callWithNuxt(nuxtApp, showError, [err]);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(error)) {
            _push(ssrRenderComponent(unref(ErrorComponent), { error: unref(error) }, null, _parent));
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$1), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
let entry;
const plugins = normalizePlugins(_plugins);
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (err) {
      await nuxt.callHook("app:error", err);
      nuxt.payload.error = nuxt.payload.error || err;
    }
    return vueApp;
  };
}
const entry$1 = (ctx) => entry(ctx);
export {
  __nuxt_component_0 as _,
  entry$1 as default,
  useNuxtApp as u
};
//# sourceMappingURL=server.mjs.map
