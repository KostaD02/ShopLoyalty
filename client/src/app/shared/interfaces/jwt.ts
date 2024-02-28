export interface JwtResponse {
  access_token: string;
  refresh_token: string;
}

export interface JwtTimes {
  exp: number;
  iat: number;
}
