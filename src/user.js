import { store } from "./store.js";
import { put } from "./api.js";
import { refresh } from "./refresh.js";
import { getJwtPayload } from "./utils.js";

/**
 * Update the user record on Userfront
 * @param {Object} payload User properties to update e.g. { name: 'John Doe' }
 */
export async function update(payload) {
  if (!payload || Object.keys(payload).length < 1) {
    return console.warn("Missing user properties to update");
  }

  // Make request to update the user
  await put(`/self`, payload, {
    headers: {
      authorization: `Bearer ${store.tokens.accessToken}`,
    },
  });

  // Refresh the access and ID tokens, and set the store.user object from the ID token
  await refresh();

  return store.user;
}

/**
 * Determine whether the access token has a given role
 * @param {String} roleName
 * @param {Object} options
 * @returns {Boolean}
 */
export function hasRole(roleName, { tenantId } = {}) {
  try {
    if (!store.tokens.accessToken || !store.tenantId) {
      return false;
    }
    const { authorization } = getJwtPayload(store.tokens.accessToken);
    if (!authorization) {
      return false;
    }
    tenantId = tenantId || store.tenantId;
    if (!authorization[tenantId] || !authorization[tenantId].roles) {
      return false;
    }
    return authorization[tenantId].roles.indexOf(roleName) > -1;
  } catch (error) {
    return false;
  }
}
