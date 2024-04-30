export type AuthObject = {
  access_token: string;
  expires_in: number;
  jti: string;
  scope: string;
  token_type: string;
};

export type JwtObject = {
  exp: string;
  user_name: string;
  authorities: string[];
  jti: string;
  client_id: string;
  scope: string[];
};
