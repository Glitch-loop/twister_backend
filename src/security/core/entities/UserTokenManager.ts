import { createHmac, timingSafeEqual } from 'crypto';
export class UserTokenManager {
  private idUser: string|null;
  private cellphone: string|null;
  private secret: string|null;
  
  constructor(
    _idUser: string|null,
    _cellphone: string|null,
    _secret: string|null
  ) {
    this.idUser = _idUser;
    this.cellphone = _cellphone

    if (_secret === null) {
      	const jwtSecret = process.env.JWT_SECRET;

        if (jwtSecret === undefined) throw new Error("Missing jwt secret in configuration")
        this.secret = jwtSecret;
    } else {
      this.secret = _secret;
    }
  }

  generateToken():string {
    if (this.idUser === null || this.cellphone === null || this.secret === null) 
      throw new Error("Initialize the TokenManager class correctly for generating a token.") 
    const header = {
			alg: 'HS256',
			typ: 'JWT',
		};

		const iat = Math.floor(Date.now() / 1000);
		const exp = iat + 8 * 60 * 60;
  
		const payload = {
			sub: this.idUser,
			cellphone: this.cellphone,
			iat,
			exp,
		};


		const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
		const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
		const unsignedToken = `${encodedHeader}.${encodedPayload}`;
		const signature = createHmac('sha256', this.secret)
			.update(unsignedToken)
			.digest('base64url');

    return `${unsignedToken}.${signature}`;
  }

  isTokenValid(token: string): boolean {
    if (this.secret === null) {
      return false;
    }

    if (!token || typeof token !== 'string') {
      return false;
    }

    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return false;
    }

    const [encodedHeader, encodedPayload, signature] = tokenParts;

    try {
      const headerJson = Buffer.from(encodedHeader, 'base64url').toString('utf8');
      const payloadJson = Buffer.from(encodedPayload, 'base64url').toString('utf8');

      const header = JSON.parse(headerJson) as { alg?: string; typ?: string };
      const payload = JSON.parse(payloadJson) as {
        sub?: string;
        cellphone?: string;
        iat?: number;
        exp?: number;
      };

      if (header.alg !== 'HS256' || header.typ !== 'JWT') {
        return false;
      }

      if (
        typeof payload.sub !== 'string'
        || typeof payload.cellphone !== 'string'
        || typeof payload.exp !== 'number'
      ) {
        return false;
      }

      if (this.idUser !== null && payload.sub !== this.idUser) {
        return false;
      }

      if (this.cellphone !== null && payload.cellphone !== this.cellphone) {
        return false;
      }

      const now = Math.floor(Date.now() / 1000);
      if (payload.exp <= now) {
        return false;
      }

      const unsignedToken = `${encodedHeader}.${encodedPayload}`;
      const expectedSignature = createHmac('sha256', this.secret)
        .update(unsignedToken)
        .digest('base64url');

      const signatureBuffer = Buffer.from(signature);
      const expectedSignatureBuffer = Buffer.from(expectedSignature);

      if (signatureBuffer.length !== expectedSignatureBuffer.length) {
        return false;
      }

      return timingSafeEqual(signatureBuffer, expectedSignatureBuffer);
    } catch {
      return false;
    }

  }
}