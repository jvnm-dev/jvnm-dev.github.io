import { g as getDefaultExportFromCjs, a as createCommonjsModule } from './common/_commonjsHelpers-7b5f3d4c.js';
import { r as react } from './common/index-426ee155.js';

var vanilla = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', { value: true });

var createStoreImpl = function createStoreImpl(createState) {
  var state;
  var listeners = new Set();

  var setState = function setState(partial, replace) {
    var nextState = typeof partial === 'function' ? partial(state) : partial;

    if (nextState !== state) {
      var _previousState = state;
      state = replace ? nextState : Object.assign({}, state, nextState);
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
    return listeners.clear();
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

exports["default"] = createStore;
});

var createStore__default = /*@__PURE__*/getDefaultExportFromCjs(vanilla);

function h(a,b){return a===b&&(0!==a||1/a===1/b)||a!==a&&b!==b}var k="function"===typeof Object.is?Object.is:h,l=react.useState,m=react.useEffect,n=react.useLayoutEffect,p$1=react.useDebugValue;function q$1(a,b){var d=b(),f=l({inst:{value:d,getSnapshot:b}}),c=f[0].inst,g=f[1];n(function(){c.value=d;c.getSnapshot=b;r$1(c)&&g({inst:c});},[a,d,b]);m(function(){r$1(c)&&g({inst:c});return a(function(){r$1(c)&&g({inst:c});})},[a]);p$1(d);return d}
function r$1(a){var b=a.getSnapshot;a=a.value;try{var d=b();return !k(a,d)}catch(f){return !0}}function t$1(a,b){return b()}var u$1="undefined"===typeof window||"undefined"===typeof window.document||"undefined"===typeof window.document.createElement?t$1:q$1;var useSyncExternalStore=void 0!==react.useSyncExternalStore?react.useSyncExternalStore:u$1;

var useSyncExternalStoreShim_production_min = {
	useSyncExternalStore: useSyncExternalStore
};

var shim = createCommonjsModule(function (module) {

{
  module.exports = useSyncExternalStoreShim_production_min;
}
});

function p(a,b){return a===b&&(0!==a||1/a===1/b)||a!==a&&b!==b}var q="function"===typeof Object.is?Object.is:p,r=shim.useSyncExternalStore,t=react.useRef,u=react.useEffect,v=react.useMemo,w=react.useDebugValue;
var useSyncExternalStoreWithSelector=function(a,b,e,l,g){var c=t(null);if(null===c.current){var f={hasValue:!1,value:null};c.current=f;}else f=c.current;c=v(function(){function a(a){if(!c){c=!0;d=a;a=l(a);if(void 0!==g&&f.hasValue){var b=f.value;if(g(b,a))return k=b}return k=a}b=k;if(q(d,a))return b;var e=l(a);if(void 0!==g&&g(b,e))return b;d=a;return k=e}var c=!1,d,k,m=void 0===e?null:e;return [function(){return a(b())},null===m?void 0:function(){return a(m())}]},[b,e,l,g]);var d=r(a,c[0],c[1]);
u(function(){f.hasValue=!0;f.value=d;},[d]);w(d);return d};

var withSelector_production_min = {
	useSyncExternalStoreWithSelector: useSyncExternalStoreWithSelector
};

var withSelector = createCommonjsModule(function (module) {

{
  module.exports = withSelector_production_min;
}
});

function useStore(api, selector = api.getState, equalityFn) {
  const slice = withSelector.useSyncExternalStoreWithSelector(api.subscribe, api.getState, api.getServerState || api.getState, selector, equalityFn);
  react.useDebugValue(slice);
  return slice;
}
const createImpl = (createState) => {
  const api = typeof createState === "function" ? createStore__default(createState) : createState;
  const useBoundStore = (selector, equalityFn) => useStore(api, selector, equalityFn);
  Object.assign(useBoundStore, api);
  return useBoundStore;
};
const create = (createState) => createState ? createImpl(createState) : createImpl;
var create$1 = create;

var __pika_web_default_export_for_treeshaking__ = create$1;

export { __pika_web_default_export_for_treeshaking__ as default };
