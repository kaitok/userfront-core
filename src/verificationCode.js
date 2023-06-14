import { post, put } from "./api.js";
import { store } from "./store.js";
import { throwFormattedError } from "./utils.js";
import { getMfaHeaders, handleLoginResponse } from "./authentication.js";
import { getPkceRequestQueryParams } from "./pkce.js";

/**
 * Verify that proper identifier is available for the channel
 * @property {String} channel "sms" or "email"
 * @property {String} phoneNumber
 * @property {String} email
 */
function enforceChannel({ channel, phoneNumber, email }) {
  if (channel !== "sms" && channel !== "email") {
    throw new Error("Invalid channel");
  }
  if (channel === "sms" && !phoneNumber) {
    throw new Error(`SMS verification code requires "phoneNumber"`);
  } else if (channel === "email" && !email) {
    throw new Error(`Email verification code requires "email"`);
  }
}

/**
 * Send a verification code to the provided email address or phone number.
 * @property {String} channel "sms" (default) or "email"
 * @property {String} phoneNumber
 * @property {String} email
 * @property {String} name
 * @property {String} username
 * @property {Object} data
 */
export async function sendVerificationCode({
  channel = "sms",
  phoneNumber,
  email,
  name,
  username,
  data,
}) {
  try {
    enforceChannel({
      channel,
      phoneNumber,
      email,
    });

    const { data: res } = await post(
      `/auth/code`,
      {
        channel,
        email,
        phoneNumber,
        name,
        username,
        data,
        tenantId: store.tenantId,
      },
      {
        headers: getMfaHeaders(),
      }
    );
    return res;
  } catch (error) {
    throwFormattedError(error);
  }
}

/**
 * Log a user in with a token/uuid combo passed into the function or
 * in the URL querystring. ?token=...&uuid=...
 * @param {String} token
 * @param {UUID} uuid
 * @param {String} redirect - do not redirect if false, or redirect to given path
 */
export async function loginWithVerificationCode({
  channel,
  verificationCode,
  email,
  phoneNumber,
  redirect,
  handleUpstreamResponse,
  handleTokens,
  handleRedirect,
} = {}) {
  try {
    enforceChannel({
      channel,
      phoneNumber,
      email,
    });

    const { data } = await put(
      `/auth/code`,
      {
        channel,
        verificationCode,
        email,
        phoneNumber,
        tenantId: store.tenantId,
      },
      {
        headers: getMfaHeaders(),
        params: getPkceRequestQueryParams(),
      }
    );

    // Handle the API response to the login request
    return handleLoginResponse({
      data,
      redirect,
      handleUpstreamResponse,
      handleTokens,
      handleRedirect,
    });
  } catch (error) {
    throwFormattedError(error);
  }
}
