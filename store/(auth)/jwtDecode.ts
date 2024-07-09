import { JwtPayload, jwtDecode } from 'jwt-decode';

interface ExtendedJwtPayload extends JwtPayload {
  email: string;
  sub: string;
}

export const decodeJwt = (token: string): ExtendedJwtPayload => {
  return jwtDecode<ExtendedJwtPayload>(token);
};
