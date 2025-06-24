import { setLoader } from "../../state/slice/common/loginSlice";
import store from "../../store/store";
import guest from "./lib/guest";
import { GUEST_TYPE } from "./types";

class AppOperation {
  guest;
  constructor() {
    this.base_url = process.env.REACT_APP_SERVICE_URL;
    this.root_path = ``;
    this.guest = guest(this);
    // this.customer = customer(this);
    this.customerToken = null;
  }

  post(path, params, type = ADMIN_TYPE) {
    return this.send(path, "POST", null, params, type);
  }

  patch(path, params, type = ADMIN_TYPE) {
    return this.send(path, "PATCH", null, params, type);
  }

  put(path, params, type = ADMIN_TYPE) {
    return this.send(path, "PUT", null, params, type);
  }

  get(path, params, data, type = ADMIN_TYPE) {
    return this.send(path, "GET", params, data, type);
  }

  delete(path, params, type = ADMIN_TYPE) {
    return this.send(path, "DELETE", params, null, type);
  }

  async send(url, method, params, data, type) {
    const fullUrl = new URL(url, this.base_url + this.root_path);

    if (params) {
      const queryParams = new URLSearchParams(params);
      fullUrl.search = queryParams.toString();
    }

    const missingFields = fullUrl.pathname.match(/(\{[a-zA-Z0-9_]+\})/g);
    if (missingFields && missingFields.length > 0) {
      throw new Error(`URL missing parameters: ${missingFields.join(", ")}`);
    }

    const headers = {
      "Content-Type": "application/json",
    };

    if (this.customerToken && !type === GUEST_TYPE) {
      headers["Authorization"] = ` ${this.customerToken}`;
    }

    const bodyData = data instanceof FormData ? data : JSON.stringify(data);

    try {
      store.dispatch(setLoader(true));

      const response = await fetch(fullUrl.href, {
        method,
        headers,
        body: bodyData,
      });

      const status = response.status;
      const responseData = await response.json();

      if (response.ok) {
        store.dispatch;
        store.dispatch(setLoader(false));
        return { ...responseData, code: status };
      } else {
        store.dispatch(setLoader(false));
        throw { code: status, ...responseData };
      }
    } catch (error) {
      store.dispatch(setLoader(false));
      console.log(this.getErrorMessageForResponse(error), "checking");

      throw { message: error.message || "Something went wrong in server" };
    }
  }

  getErrorMessageForResponse(data) {
    let message;
    try {
      message = JSON.parse(data.data).message;
    } catch (e) {
      console.log(e);
    }

    switch (data.code) {
      // 100  Informational

      case 100: {
        message = message ? message : "Continue";
        break;
      }

      case 101: {
        message = message ? message : "Switching Protocols";
        break;
      }

      case 102: {
        message = message ? message : "Processing";
        break;
      }

      //Success

      case 201: {
        message = message ? message : "Created";
        break;
      }
      case 202: {
        message = message ? message : "Accepted";
        break;
      }
      case 203: {
        message = message ? message : "Non-authoritative Information";
        break;
      }
      case 204: {
        message = message ? message : "No Content";
        break;
      }
      case 205: {
        message = message ? message : "Reset Content";
        break;
      }
      case 206: {
        message = message ? message : "Partial Content";
        break;
      }
      case 207: {
        message = message ? message : "Multi-Status";
        break;
      }
      case 208: {
        message = message ? message : "Already Reported";
        break;
      }
      case 226: {
        message = message ? message : "IM Used";
        break;
      }

      // 300 Redirection

      case 300: {
        message = message ? message : "Multiple Choices";
        break;
      }
      case 301: {
        message = message ? message : "Moved Permanently";
        break;
      }
      case 302: {
        message = message ? message : "Found";
        break;
      }
      case 303: {
        message = message ? message : "See Other";
        break;
      }
      case 304: {
        message = message ? message : "Not Modified";
        break;
      }
      case 305: {
        message = message ? message : "Use Proxy";
        break;
      }
      case 307: {
        message = message ? message : "Temporary Redirect";
        break;
      }
      case 308: {
        message = message ? message : "Permanent Redirect";
        break;
      }

      // 400 Client Error

      case 400: {
        message = message ? message : "Bad Request";
        break;
      }
      case 401: {
        message = message ? message : "Unauthorized";
        break;
      }
      case 402: {
        message = message ? message : "Payment Required";
        break;
      }
      case 403: {
        message = message ? message : "Forbidden";
        break;
      }
      case 404: {
        message = message ? message : "Not Found";
        break;
      }
      case 405: {
        message = message ? message : "Method Not Allowed";
        break;
      }
      case 406: {
        message = message ? message : "Not Acceptable";
        break;
      }
      case 407: {
        message = message ? message : "Proxy Authentication Required";
        break;
      }
      case 408: {
        message = message ? message : "Request Timeout";
        break;
      }
      case 409: {
        message = message ? message : "Conflict";
        break;
      }
      case 410: {
        message = message ? message : "Gone";
        break;
      }
      case 411: {
        message = message ? message : "Length Required";
        break;
      }
      case 412: {
        message = message ? message : "Precondition Failed";
        break;
      }
      case 413: {
        message = message ? message : "Payload Too Large";
        break;
      }
      case 414: {
        message = message ? message : "Request-URI Too Long";
        break;
      }
      case 415: {
        message = message ? message : "Unsupported Media Type";
        break;
      }
      case 416: {
        message = message ? message : "Requested Range Not Satisfiable";
        break;
      }
      case 417: {
        message = message ? message : "Expectation Failed";
        break;
      }
      case 418: {
        message = message ? message : "I'm a teapot";
        break;
      }
      case 421: {
        message = message ? message : "Misdirected Request";
        break;
      }
      case 422: {
        message = message ? message : "Unprocessable Entity";
        break;
      }
      case 423: {
        message = message ? message : "Locked";
        break;
      }
      case 424: {
        message = message ? message : " Failed Dependency";
        break;
      }
      case 426: {
        message = message ? message : "Upgrade Required";
        break;
      }
      case 428: {
        message = message ? message : "Precondition Required";
        break;
      }
      case 429: {
        message = message ? message : "Too Many Requests";
        break;
      }
      case 431: {
        message = message ? message : "Request Header Fields Too Large";
        break;
      }
      case 444: {
        message = message ? message : "Connection Closed Without Response";
        break;
      }
      case 451: {
        message = message ? message : "Unavailable For Legal Reasons";
        break;
      }
      case 499: {
        message = message ? message : "Client Closed Request";
        break;
      }

      // 500 Server Error

      case 500: {
        message = message ? message : "Internal Server Error";
        break;
      }
      case 501: {
        message = message ? message : "Not Implemented";
        break;
      }
      case 502: {
        message = message ? message : "Internal Server Error";
        break;
      }
      case 503: {
        message = message ? message : "Service Unavailable";
        break;
      }
      case 504: {
        message = message ? message : "Gateway Timeout";
        break;
      }
      case 505: {
        message = message ? message : "HTTP Version Not Supported";
        break;
      }
      case 506: {
        message = message ? message : "Variant Also Negotiates";
        break;
      }
      case 507: {
        message = message ? message : "Insufficient Storage";
        break;
      }
      case 508: {
        message = message ? message : "Loop Detected";
        break;
      }
      case 510: {
        message = message ? message : "Not Extended";
        break;
      }
      case 511: {
        message = message ? message : "Network Authentication Required";
        break;
      }
      case 599: {
        message = message ? message : "Network Connect Timeout Error";
        break;
      }
    }

    return message;
  }

  setCustomerToken(token) {
    this.customerToken = token;
  }
}

const appOperation = new AppOperation();

export default appOperation;
