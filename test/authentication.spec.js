import Userfront from "../src/index.js";
import api from "../src/api.js";
import {
  authenticationData,
  setFirstFactors,
  isMfaRequired,
  handleMfaRequired,
  getMfaHeaders,
  clearMfa,
  resetMfa,
} from "../src/authentication.js";

jest.mock("../src/api.js");

const blankAuthenticationData = {
  ...authenticationData,
};

describe("Authentication service", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    for (const key in authenticationData) {
      authenticationData[key] = blankAuthenticationData[key];
    }
  });

  describe("setFirstFactors", () => {
    it("should update the available first factors when passed a valid auth flow", async () => {
      const authentication = {
        firstFactors: [
          {
            channel: "email",
            strategy: "password",
          },
          {
            channel: "email",
            strategy: "link",
          },
        ],
      };
      Userfront.init("demo1234");

      setFirstFactors(authentication);
      expect(authenticationData.firstFactors).toEqual(
        authentication.firstFactors
      );
    });

    it("should fail gracefully for bad inputs", async () => {
      expect(() => {
        setFirstFactors(null);
      }).not.toThrow();
      expect(() => {
        setFirstFactors("bad input");
      }).not.toThrow();
      expect(() => {
        setFirstFactors({ mode: "test" });
      }).not.toThrow();
      expect(() => {
        setFirstFactors({ firstFactors: ["corrupt", "data"] });
      }).not.toThrow();
    });
  });

  describe("isMfaRequired()", () => {
    it("should return true if MFA is currently required", () => {
      authenticationData.firstFactorToken = "uf_live_first_factor_sometoken";
      expect(isMfaRequired()).toEqual(true);
    });
    it("should return false if MFA is not currently required", () => {
      authenticationData.firstFactorToken = "";
      expect(isMfaRequired()).toEqual(false);
    });
  });

  describe("handleMfaRequired()", () => {
    it("should do nothing if the response is not an MFA Required response", () => {
      const mockResponse = {
        message: "OK",
        result: {
          channel: "sms",
          phoneNumber: "+15558675309",
          submittedAt: "2022-10-21T23:26:07.146Z",
          messageId: "fe3194f6-da85-48aa-a24e-3eab4c5c19d1",
        },
      };
      handleMfaRequired(mockResponse);
      expect(authenticationData).toEqual(blankAuthenticationData);
    });
    it("should set the MFA service state if it is an MFA Required response", () => {
      const mockResponse = {
        message: "MFA required",
        isMfaRequired: true,
        firstFactorToken:
          "uf_test_first_factor_207a4d56ce7e40bc9dafb0918fb6599a",
        authentication: {
          firstFactor: {
            strategy: "link",
            channel: "email",
          },
          secondFactors: [
            {
              strategy: "totp",
              channel: "authenticator",
            },
            {
              strategy: "verificationCode",
              channel: "sms",
            },
          ],
        },
      };
      handleMfaRequired(mockResponse);
      expect(authenticationData.secondFactors).toEqual([
        {
          strategy: "totp",
          channel: "authenticator",
        },
        {
          strategy: "verificationCode",
          channel: "sms",
        },
      ]);
    });
  });

  describe("getMfaHeaders()", () => {
    it("should return an authorization header if there is a firstFactorToken set", () => {
      authenticationData.firstFactorToken = "uf_test_first_factor_token";
      const headers = getMfaHeaders();
      expect(headers).toEqual({
        authorization: "Bearer uf_test_first_factor_token",
      });
    });
    it("should return an empty object if there is no firstFactorToken set", () => {
      const headers = getMfaHeaders();
      expect(headers).toEqual({});
    });
  });

  it("clearMfa should clear the transient MFA state", () => {
    authenticationData.secondFactors = [
      {
        strategy: "totp",
        channel: "authenticator",
      },
      {
        strategy: "verificationCode",
        channel: "sms",
      },
    ];
    authenticationData.firstFactorToken = "uf_test_first_factor_token";
    authenticationData.firstFactors = [
      {
        channel: "email",
        strategy: "password",
      },
    ];
    clearMfa();
    expect(authenticationData.secondFactors).toEqual([]);
    expect(authenticationData.firstFactorToken).toEqual(null);
    expect(authenticationData.firstFactors).toEqual([
      {
        channel: "email",
        strategy: "password",
      },
    ]);
  });

  it("resetMfa should reset the MFA service to the uninitialized state", () => {
    authenticationData.secondFactors = [
      {
        strategy: "totp",
        channel: "authenticator",
      },
      {
        strategy: "verificationCode",
        channel: "sms",
      },
    ];
    authenticationData.firstFactorToken = "uf_test_first_factor_token";
    authenticationData.firstFactors = [
      {
        channel: "email",
        strategy: "password",
      },
    ];
    resetMfa();
    expect(authenticationData.secondFactors).toEqual([]);
    expect(authenticationData.firstFactorToken).toEqual(null);
    expect(authenticationData.firstFactors).toEqual([]);
  });
});