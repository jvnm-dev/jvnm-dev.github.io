var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
const DEVTOOLS = Symbol();
const devtools = (fn, options) => (set, get, api) => {
  let extension;
  try {
    extension = window.__REDUX_DEVTOOLS_EXTENSION__ || window.top.__REDUX_DEVTOOLS_EXTENSION__;
  } catch {
  }
  if (!extension) {
    delete api.devtools;
    return fn(set, get, api);
  }
  const namedSet = (state, replace, name) => {
    set(state, replace);
    if (!api.dispatch && api.devtools) {
      api.devtools.send(api.devtools.prefix + (name || "action"), get());
    }
  };
  api.setState = namedSet;
  const initialState = fn(namedSet, get, api);
  if (!api.devtools) {
    const savedSetState = api.setState;
    api.setState = (state, replace) => {
      const newState = api.getState();
      if (state !== newState) {
        savedSetState(state, replace);
        if (state !== newState[DEVTOOLS] && api.devtools) {
          api.devtools.send(api.devtools.prefix + "setState", api.getState());
        }
      }
    };
    options = typeof options === "string" ? { name: options } : options;
    const connection = api.devtools = extension.connect(__spreadValues({}, options));
    connection.prefix = (options == null ? void 0 : options.name) ? `${options.name} > ` : "";
    connection.subscribe((message) => {
      var _a, _b, _c, _d;
      if (message.type === "ACTION" && message.payload) {
        try {
          api.setState(JSON.parse(message.payload));
        } catch (e) {
          console.error("please dispatch a serializable value that JSON.parse() support\n", e);
        }
      } else if (message.type === "DISPATCH" && message.state) {
        const jumpState = message.payload.type === "JUMP_TO_ACTION" || message.payload.type === "JUMP_TO_STATE";
        const newState = api.getState();
        newState[DEVTOOLS] = JSON.parse(message.state);
        if (!api.dispatch && !jumpState) {
          api.setState(newState);
        } else if (jumpState) {
          api.setState(newState[DEVTOOLS]);
        } else {
          savedSetState(newState);
        }
      } else if (message.type === "DISPATCH" && ((_a = message.payload) == null ? void 0 : _a.type) === "COMMIT") {
        connection.init(api.getState());
      } else if (message.type === "DISPATCH" && ((_b = message.payload) == null ? void 0 : _b.type) === "IMPORT_STATE") {
        const actions = (_c = message.payload.nextLiftedState) == null ? void 0 : _c.actionsById;
        const computedStates = ((_d = message.payload.nextLiftedState) == null ? void 0 : _d.computedStates) || [];
        computedStates.forEach(({ state }, index) => {
          const action = actions[index] || "No action found";
          if (index === 0) {
            connection.init(state);
          } else {
            savedSetState(state);
            connection.send(action, api.getState());
          }
        });
      }
    });
    connection.init(initialState);
  }
  return initialState;
};
const toThenable = (fn) => (input) => {
  try {
    const result = fn(input);
    if (result instanceof Promise) {
      return result;
    }
    return {
      then(onFulfilled) {
        return toThenable(onFulfilled)(result);
      },
      catch(_onRejected) {
        return this;
      }
    };
  } catch (e) {
    return {
      then(_onFulfilled) {
        return this;
      },
      catch(onRejected) {
        return toThenable(onRejected)(e);
      }
    };
  }
};
const persist = (config, baseOptions) => (set, get, api) => {
  let options = __spreadValues({
    getStorage: () => localStorage,
    serialize: JSON.stringify,
    deserialize: JSON.parse,
    partialize: (state) => state,
    version: 0,
    merge: (persistedState, currentState) => __spreadValues(__spreadValues({}, currentState), persistedState)
  }, baseOptions);
  if (options.blacklist || options.whitelist) {
    console.warn(`The ${options.blacklist ? "blacklist" : "whitelist"} option is deprecated and will be removed in the next version. Please use the 'partialize' option instead.`);
  }
  let hasHydrated = false;
  const hydrationListeners = new Set();
  const finishHydrationListeners = new Set();
  let storage;
  try {
    storage = options.getStorage();
  } catch (e) {
  }
  if (!storage) {
    return config((...args) => {
      console.warn(`[zustand persist middleware] Unable to update item '${options.name}', the given storage is currently unavailable.`);
      set(...args);
    }, get, api);
  } else if (!storage.removeItem) {
    console.warn(`[zustand persist middleware] The given storage for item '${options.name}' does not contain a 'removeItem' method, which will be required in v4.`);
  }
  const thenableSerialize = toThenable(options.serialize);
  const setItem = () => {
    const state = options.partialize(__spreadValues({}, get()));
    if (options.whitelist) {
      Object.keys(state).forEach((key) => {
        var _a;
        !((_a = options.whitelist) == null ? void 0 : _a.includes(key)) && delete state[key];
      });
    }
    if (options.blacklist) {
      options.blacklist.forEach((key) => delete state[key]);
    }
    let errorInSync;
    const thenable = thenableSerialize({ state, version: options.version }).then((serializedValue) => storage.setItem(options.name, serializedValue)).catch((e) => {
      errorInSync = e;
    });
    if (errorInSync) {
      throw errorInSync;
    }
    return thenable;
  };
  const savedSetState = api.setState;
  api.setState = (state, replace) => {
    savedSetState(state, replace);
    void setItem();
  };
  const configResult = config((...args) => {
    set(...args);
    void setItem();
  }, get, api);
  let stateFromStorage;
  const hydrate = () => {
    var _a;
    if (!storage)
      return;
    hasHydrated = false;
    hydrationListeners.forEach((cb) => cb(get()));
    const postRehydrationCallback = ((_a = options.onRehydrateStorage) == null ? void 0 : _a.call(options, get())) || void 0;
    return toThenable(storage.getItem.bind(storage))(options.name).then((storageValue) => {
      if (storageValue) {
        return options.deserialize(storageValue);
      }
    }).then((deserializedStorageValue) => {
      if (deserializedStorageValue) {
        if (typeof deserializedStorageValue.version === "number" && deserializedStorageValue.version !== options.version) {
          if (options.migrate) {
            return options.migrate(deserializedStorageValue.state, deserializedStorageValue.version);
          }
          console.error(`State loaded from storage couldn't be migrated since no migrate function was provided`);
        } else {
          return deserializedStorageValue.state;
        }
      }
    }).then((migratedState) => {
      stateFromStorage = options.merge(migratedState, configResult);
      set(stateFromStorage, true);
      return setItem();
    }).then(() => {
      postRehydrationCallback == null ? void 0 : postRehydrationCallback(stateFromStorage, void 0);
      hasHydrated = true;
      finishHydrationListeners.forEach((cb) => cb(stateFromStorage));
    }).catch((e) => {
      postRehydrationCallback == null ? void 0 : postRehydrationCallback(void 0, e);
    });
  };
  api.persist = {
    setOptions: (newOptions) => {
      options = __spreadValues(__spreadValues({}, options), newOptions);
      if (newOptions.getStorage) {
        storage = newOptions.getStorage();
      }
    },
    clearStorage: () => {
      var _a;
      (_a = storage == null ? void 0 : storage.removeItem) == null ? void 0 : _a.call(storage, options.name);
    },
    rehydrate: () => hydrate(),
    hasHydrated: () => hasHydrated,
    onHydrate: (cb) => {
      hydrationListeners.add(cb);
      return () => {
        hydrationListeners.delete(cb);
      };
    },
    onFinishHydration: (cb) => {
      finishHydrationListeners.add(cb);
      return () => {
        finishHydrationListeners.delete(cb);
      };
    }
  };
  hydrate();
  return stateFromStorage || configResult;
};

export { devtools, persist };
