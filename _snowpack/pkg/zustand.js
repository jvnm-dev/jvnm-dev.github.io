import { a as createCommonjsModule } from './common/_commonjsHelpers-6d0ad781.js';
import { r as react$1 } from './common/index-42adcad2.js';

var vanilla_1 = createCommonjsModule(function (module, exports) {

var createStoreImpl = function createStoreImpl(createState) {
  var state;
  var listeners = new Set();
  var setState = function setState(partial, replace) {
    var nextState = typeof partial === 'function' ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      var _previousState = state;
      state = (replace != null ? replace : typeof nextState !== 'object') ? nextState : Object.assign({}, state, nextState);
      listeners.forEach(function (listener) {
        return listener(state, _previousState);
      });
    }
  };
  var getState = function getState() {
    return state;
  };
  var subscribe = function subscribe(listener) {
    listeners.add(listener);
    return function () {
      return listeners.delete(listener);
    };
  };
  var destroy = function destroy() {
    listeners.clear();
  };
  var api = {
    setState: setState,
    getState: getState,
    subscribe: subscribe,
    destroy: destroy
  };
  state = createState(setState, getState, api);
  return api;
};
var createStore = function createStore(createState) {
  return createState ? createStoreImpl(createState) : createStoreImpl;
};
var vanilla = (function (createState) {
  return createStore(createState);
});

exports.createStore = createStore;
exports.default = vanilla;

module.exports = vanilla;
module.exports.createStore = createStore;
exports.default = module.exports;
});

function h(a,b){return a===b&&(0!==a||1/a===1/b)||a!==a&&b!==b}var k="function"===typeof Object.is?Object.is:h,l=react$1.useState,m=react$1.useEffect,n=react$1.useLayoutEffect,p=react$1.useDebugValue;function q(a,b){var d=b(),f=l({inst:{value:d,getSnapshot:b}}),c=f[0].inst,g=f[1];n(function(){c.value=d;c.getSnapshot=b;r(c)&&g({inst:c});},[a,d,b]);m(function(){r(c)&&g({inst:c});return a(function(){r(c)&&g({inst:c});})},[a]);p(d);return d}
function r(a){var b=a.getSnapshot;a=a.value;try{var d=b();return !k(a,d)}catch(f){return !0}}function t(a,b){return b()}var u="undefined"===typeof window||"undefined"===typeof window.document||"undefined"===typeof window.document.createElement?t:q;var useSyncExternalStore=void 0!==react$1.useSyncExternalStore?react$1.useSyncExternalStore:u;

var useSyncExternalStoreShim_production_min = {
	useSyncExternalStore: useSyncExternalStore
};

var shim = createCommonjsModule(function (module) {

{
  module.exports = useSyncExternalStoreShim_production_min;
}
});

function p$1(a,b){return a===b&&(0!==a||1/a===1/b)||a!==a&&b!==b}var q$1="function"===typeof Object.is?Object.is:p$1,r$1=shim.useSyncExternalStore,t$1=react$1.useRef,u$1=react$1.useEffect,v=react$1.useMemo,w=react$1.useDebugValue;
var useSyncExternalStoreWithSelector=function(a,b,e,l,g){var c=t$1(null);if(null===c.current){var f={hasValue:!1,value:null};c.current=f;}else f=c.current;c=v(function(){function a(a){if(!c){c=!0;d=a;a=l(a);if(void 0!==g&&f.hasValue){var b=f.value;if(g(b,a))return k=b}return k=a}b=k;if(q$1(d,a))return b;var e=l(a);if(void 0!==g&&g(b,e))return b;d=a;return k=e}var c=!1,d,k,m=void 0===e?null:e;return [function(){return a(b())},null===m?void 0:function(){return a(m())}]},[b,e,l,g]);var d=r$1(a,c[0],c[1]);
u$1(function(){f.hasValue=!0;f.value=d;},[d]);w(d);return d};

var withSelector_production_min = {
	useSyncExternalStoreWithSelector: useSyncExternalStoreWithSelector
};

var withSelector = createCommonjsModule(function (module) {

{
  module.exports = withSelector_production_min;
}
});

const {useSyncExternalStoreWithSelector: useSyncExternalStoreWithSelector$1} = withSelector;
function useStore(api, selector = api.getState, equalityFn) {
  const slice = useSyncExternalStoreWithSelector$1(api.subscribe, api.getState, api.getServerState || api.getState, selector, equalityFn);
  react$1.useDebugValue(slice);
  return slice;
}
const createImpl = (createState) => {
  if ((import.meta.env && import.meta.env.MODE) !== "production" && typeof createState !== "function") {
    console.warn("[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`.");
  }
  const api = typeof createState === "function" ? vanilla_1.createStore(createState) : createState;
  const useBoundStore = (selector, equalityFn) => useStore(api, selector, equalityFn);
  Object.assign(useBoundStore, api);
  return useBoundStore;
};
const create = (createState) => createState ? createImpl(createState) : createImpl;
var react = (createState) => {
  if ((import.meta.env && import.meta.env.MODE) !== "production") {
    console.warn("[DEPRECATED] Default export is deprecated. Instead use `import { create } from 'zustand'`.");
  }
  return create(createState);
};

export default react;
