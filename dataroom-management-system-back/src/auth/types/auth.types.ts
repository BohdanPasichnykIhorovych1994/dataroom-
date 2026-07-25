export type JwtPayload = {
  sub: string;
  email: string;
};

export type AuthUser = {
  id: string;
  email: string;
};

export type AuthResponse = {
  accessToken: string;
  expiresIn: string;
  user: AuthUser;
};
