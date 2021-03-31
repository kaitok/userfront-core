import Userfront from "../src/index.js";

/**
 * Using Rewire, we can get an unexported function from our module:
 * const signupWithSSO = Userfront.__get__("signupWithSSO");
 *
 * and also set a function this way:
 * const mockFn = jest.fn()
 * Userfront.__set__("signupWithSSO", mockFn);
 */

const tenantId = "abcdefg";
Userfront.init(tenantId);

describe("signupWithSSO", () => {
  it("should throw if provider is missing", () => {
    Userfront.signupWithSSO = Userfront.__get__("signupWithSSO");

    expect(() => Userfront.signupWithSSO()).toThrowError(
      new Error("Missing provider")
    );
  });
});

describe("loginWithSSO", () => {
  it("should throw if provider is missing", () => {
    Userfront.loginWithSSO = Userfront.__get__("loginWithSSO");

    expect(() => Userfront.loginWithSSO()).toThrowError(
      new Error("Missing provider")
    );
  });
});

describe("getProviderLink", () => {
  it("should throw if provider is missing", () => {
    Userfront.getProviderLink = Userfront.__get__("getProviderLink");

    expect(() => {
      return Userfront.getProviderLink();
    }).toThrowError(new Error("Missing provider"));
  });

  it("should throw if tenant ID is missing", () => {
    Userfront.getProviderLink = Userfront.__get__("getProviderLink");

    expect(() => {
      Userfront.store.tenantId = "";
      return Userfront.getProviderLink("google");
    }).toThrowError(new Error("Missing tenant ID"));
  });
});

describe("addInitCallback", () => {
  it("should add callbacks that are fired when Userfront.init(tenantId) is called", () => {
    const tenantId = "a9b8c7d6";
    const callbackA = jest.fn();
    const callbackB = jest.fn();

    // Add callbacks
    Userfront.addInitCallback(callbackA);
    Userfront.addInitCallback(callbackB);

    // Call Userfront.init()
    Userfront.init(tenantId);

    // Assert that callbacks were called
    expect(callbackA).toHaveBeenCalled();
    expect(callbackA).toHaveBeenCalledWith({ tenantId });
    expect(callbackB).toHaveBeenCalled();
    expect(callbackB).toHaveBeenCalledWith({ tenantId });

    // Calling Userfront.init() again should not call the callbacks again
    jest.clearAllMocks();
    Userfront.init(tenantId);

    expect(callbackA).not.toHaveBeenCalled();
    expect(callbackB).not.toHaveBeenCalled();
  });
});
