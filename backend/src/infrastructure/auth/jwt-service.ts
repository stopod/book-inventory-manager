import * as jose from 'jose';

export class JwtService {
  private readonly JWT_SECRET: Uint8Array;
  private readonly JWT_REFRESH_SECRET: Uint8Array;
  private readonly ACCESS_TOKEN_EXPIRATION = '15m';
  private readonly REFRESH_TOKEN_EXPIRATION = '7d';

  constructor() {
    const secret = process.env.JWT_SECRET || 'fallback_secret_key_for_development_only';
    this.JWT_SECRET = new TextEncoder().encode(secret);
    this.JWT_REFRESH_SECRET = new TextEncoder().encode(`${secret}_refresh`);
  }

  async generateToken(userId: string): Promise<string> {
    return await new jose.SignJWT({ sub: userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(this.ACCESS_TOKEN_EXPIRATION)
      .sign(this.JWT_SECRET);
  }

  async generateRefreshToken(userId: string): Promise<string> {
    return await new jose.SignJWT({ sub: userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(this.REFRESH_TOKEN_EXPIRATION)
      .sign(this.JWT_REFRESH_SECRET);
  }

  async verifyToken(token: string): Promise<jose.JWTPayload> {
    const { payload } = await jose.jwtVerify(token, this.JWT_SECRET);
    return payload;
  }

  async verifyRefreshToken(token: string): Promise<jose.JWTPayload> {
    const { payload } = await jose.jwtVerify(token, this.JWT_REFRESH_SECRET);
    return payload;
  }
}
