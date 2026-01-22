import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

async function hashPassword(password: string): Promise<string> {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

const createAccessToken = (payload: object) => {
  const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: (process.env.ACCESS_TOKEN_EXPIRES_IN ?? '1d') as jwt.SignOptions['expiresIn'],
  });
  return token;
};

const createRefreshToken = (payload: object) => {
  const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN ?? '7d') as jwt.SignOptions['expiresIn'],
  });
  return token;
};

// export const verifyJWT = (token: string, secret: string) => {
//   // Implementation for verifying a JWT
// };


export { hashPassword, createAccessToken, createRefreshToken };