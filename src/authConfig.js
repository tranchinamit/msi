/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { LogLevel } from "@azure/msal-browser";

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const msalConfig = {
  auth: {
    clientId: "5e4c1018-217b-4c31-ac64-9910486cc769",
    authority:
      "https://login.microsoftonline.com/b16e6c57-2a05-4527-9210-ddb885add7d4",
    // redirectUri: "http://localhost:3000",
    redirectUri: "https://msi-sp.vercel.app",
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
            return;
        }
      },
    },
  },
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
  //   scopes: ["User.Read"],
  scopes: ["User.Read", "Files.Read", "Files.Read.All", "Sites.Read.All"],
};

/**
 * Add here the scopes to request when obtaining an access token for MS Graph API. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const graphConfig = {
  graphMe: () => "https://graph.microsoft.com/v1.0/me", //e.g. https://graph.microsoft.com/v1.0/me
  sharedWithMe: () => "https://graph.microsoft.com/v1.0/me/drive/sharedWithMe",
  search: () => "https://graph.microsoft.com/v1.0/me/drive/root/search",
  getFileByFileId: (fileId) =>
    `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/content`,
  getFileBySiteId: (siteId) =>
    `https://graph.microsoft.com/v1.0/sites/${siteId}/drive/root/children`,
  getFileByPath: (path) =>
    `https://graph.microsoft.com/v1.0/me/drive/root:/${path}:/content`,
  getFileByDriveIdAndFileId: (driveId, remoteFileId) =>
    `https://graph.microsoft.com/v1.0/drives/${driveId}/items/${remoteFileId}/content`,
};

// Get file metadata	GET /me/drive/items/{file-id}
// Download a file	GET /me/drive/items/{file-id}/content
// List files in SharePoint	GET /sites/{site-id}/drive/root/children
// List shared files	GET /me/drive/sharedWithMe
