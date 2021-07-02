import Cookies from "js-cookie";

import Userfront from "../src/index.js";
import { getIframe, resolvers } from "../src/iframe.js";
import { logout } from "../src/logout.js";
import { setCookie } from "../src/cookies.js";
import utils from "./config/utils.js";

jest.mock("axios");

const tenantId = "abcd9876";
Userfront.init(tenantId);

// Using `window.location.assign` rather than `window.location.href =` because
// JSDOM throws an error "Error: Not implemented: navigation (except hash changes)"
// JSDOM complains about this is because JSDOM does not implement methods like window.alert, window.location.assign, etc.
// https://stackoverflow.com/a/54477957
delete window.location;
window.location = {
  assign: jest.fn(),
  origin: "https://example.com",
  href: "https://example.com/login",
};

describe("logout", () => {
  beforeEach(() => {
    setCookie(utils.accessTokenUserDefaults, {}, "access");
    setCookie(utils.idTokenUserDefaults, {}, "id");
  });

  afterEach(() => {
    window.location.assign.mockClear();
  });

  // TODO re-enable tests below once iframe is re-established

  xit("should send a request to the iframe (which clears its own refresh cookie), then clear the access and ID token cookies, then redirect", async () => {
    const redirectPath = "/login";
    const redirectTo = `https://example.com${redirectPath}`;

    // Mock the iframe response to input with an event listener
    const iframe = getIframe();
    let resolver;
    const promise = new Promise((resolve) => {
      resolver = resolve;
    });
    let messageId;
    const mockEventListener = async (e) => {
      messageId = e.data.messageId;
      e.data.redirectTo = redirectTo;
      resolvers[messageId].resolve(e);
      resolver(e.data);
    };
    iframe.contentWindow.addEventListener("message", mockEventListener);

    // Access and ID token cookies should both exist before logout
    expect(Cookies.get(`access.${tenantId}`)).toBeTruthy();
    expect(Cookies.get(`id.${tenantId}`)).toBeTruthy();
    expect(Userfront.accessToken()).toBeTruthy();
    expect(Userfront.idToken()).toBeTruthy();

    // Call logout()
    await logout();

    // Should have sent correct info into the iframe
    await expect(promise).resolves.toEqual({
      type: "logout",
      redirectTo,
      tenantId,
      messageId,
    });

    // Should have cleared the access and ID tokens
    expect(Cookies.get(`access.${tenantId}`)).toBeFalsy();
    expect(Cookies.get(`id.${tenantId}`)).toBeFalsy();
    expect(Userfront.accessToken()).toBeFalsy();
    expect(Userfront.idToken()).toBeFalsy();

    // Should have redirected correctly
    expect(window.location.assign).toHaveBeenCalledWith(redirectPath);

    // Remove the event listener
    iframe.contentWindow.removeEventListener("message", mockEventListener);
  });

  xit("should remove cookies and redirect to root if iframe fails", async () => {
    // Mock the iframe response to input
    const iframe = getIframe();
    let messageId;
    iframe.contentWindow.addEventListener("message", async (e) => {
      messageId = e.data.messageId;
      resolvers[messageId].reject(e);
    });

    // Access and ID token cookies should both exist before logout
    expect(Cookies.get(`access.${tenantId}`)).toBeTruthy();
    expect(Cookies.get(`id.${tenantId}`)).toBeTruthy();
    expect(Userfront.accessToken()).toBeTruthy();
    expect(Userfront.idToken()).toBeTruthy();

    // Call logout()
    await logout();

    // Should have cleared the access and ID tokens
    expect(Cookies.get(`access.${tenantId}`)).toBeFalsy();
    expect(Cookies.get(`id.${tenantId}`)).toBeFalsy();
    expect(Userfront.accessToken()).toBeFalsy();
    expect(Userfront.idToken()).toBeFalsy();

    // Should redirect to root
    expect(window.location.assign).toHaveBeenCalledWith("/");
  });
});
