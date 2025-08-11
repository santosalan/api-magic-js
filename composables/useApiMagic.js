import axios from "axios";

export function useApiMagic() {
  let host = null;
  let port = null;
  let prefix = null;
  let actionRoutes = null;
  let namedReturn = true;
  let tokenField = null;
  let toJson = false;
  let toStream = false;
  let element = null;
  let auth = null;
  let advancedOptions = {};
  let rawResponse = false;

  function setElement(value) {
    if (!element || element.trim() === "") {
      element = value;
    }
  }

  function getElement() {
    return namedReturn ? element : null;
  }

  function elementSetter(el) {
    setElement(el.trim());
    return api;
  }

  function authSetter(username, password, type = "basic") {
    if (type.toLowerCase() !== "basic") {
      auth = { username, password, type };
    } else {
      auth = { username, password };
    }
    return api;
  }

  function toJsonSetter() {
    toJson = true;
    return api;
  }

  function toStreamSetter() {
    toStream = true;
    return api;
  }

  function setBase({ baseHost, basePort = "", basePrefix = "" }) {
    host = baseHost;
    port = basePort;
    prefix = basePrefix;
  }

  function setAdvancedOptions(baseAdvancedOptions = {}) {
    advancedOptions = { ...baseAdvancedOptions };
  }

  async function call(name, args = []) {
    setElement(name);
    return await proccess(name, args);
  }

  async function proccess(name, args) {
    if (!host || host.trim() === "") {
      throw new Error("ERROR - Set up HOST required.");
    }

    if (await verifyRoute(name)) {
      return await apiRequest(name, args, getElement());
    } else {
      return JSON.stringify({ error: "Route not found!" });
    }
  }

  async function verifyRoute(route) {
    if (!actionRoutes || actionRoutes.trim() === "") return true;

    const json = await apiRequest(actionRoutes, ["POST"]);
    const routes = JSON.parse(json);

    return routes.some((r) => r.action === route);
  }

  async function apiRequest(url, args, el = null) {
    const method = args[0] || "GET";
    const pathSegments = Array.isArray(args[1]) ? args[1] : [];
    const params = args[2] || {};
    const headers = args[3] || {};

    let requestUrl =
      url + (pathSegments.length ? "/" + pathSegments.join("/") : "");

    const instance = axios.create({
      baseURL: `${host}${port}${prefix}/`,
      headers,
      ...advancedOptions,
    });

    if (tokenField) {
      params[tokenField] = token();
    }

    const options = {
      method,
      url: requestUrl,
    };

    if (auth) {
      options.auth = auth;
    }

    if (toJson) {
      options.data = params;
    } else if (toStream) {
      options.responseType = "stream";
      if (method.toUpperCase() !== "GET") {
        options.data = params;
      } else {
        options.params = params;
      }
    } else {
      if (method.toUpperCase() === "GET") {
        options.params = params;
      } else {
        options.data = new URLSearchParams(params);
        options.headers["Content-Type"] = "application/x-www-form-urlencoded";
      }
    }

    const response = await instance.request(options);

    if (rawResponse) {
      return response;
    }

    if (toStream) {
      return response.data;
    }

    const data = response.data;
    return el ? JSON.stringify({ [el]: data }) : JSON.stringify(data);
  }

  function token() {
    return "";
  }

  const api = {
    call,
    toJson: toJsonSetter,
    toStream: toStreamSetter,
    element: elementSetter,
    auth: authSetter,
    setBase,
    setAdvancedOptions,
    setRawResponse: (r) => (rawResponse = r),
    setActionRoutes: (r) => (actionRoutes = r),
    setTokenField: (f) => (tokenField = f),
    setNamedReturn: (v) => (namedReturn = v),
  };

  return api;
}
