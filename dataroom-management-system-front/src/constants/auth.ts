export enum AUTH_PATH {
  LOGIN = "/login",
  SIGN_UP = "/signup",
}

export enum REMEMBER_FLAG {
  ON = "1",
  OFF = "0",
}

export enum AUTH_HEADER_SCHEME {
  BEARER = "Bearer",
}

export const AUTH_TOKEN_STORAGE_KEY = "dataroom_token";
export const AUTH_REMEMBER_STORAGE_KEY = "dataroom_remember";
