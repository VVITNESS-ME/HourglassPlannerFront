import { jwtDecode, JwtPayload } from 'jwt-decode';
export const decodeJwt = (token: string): JwtPayload => {
  return jwtDecode<JwtPayload>(token);
};
