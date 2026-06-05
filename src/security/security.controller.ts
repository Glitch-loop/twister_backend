import {
	BadRequestException,
	Body,
	Controller,
	InternalServerErrorException,
	Post,
	UnauthorizedException,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { createClient } from '@supabase/supabase-js';
import { createHmac } from 'crypto';

class SecurityLoginDto {
	phone: string;
	password: string;
}

@ApiTags('Security')
@Controller('security')
export class SecurityController {
	@Post('login')
	@ApiOperation({
		summary: 'Authenticate user by phone and password and return JWT',
	})
	@ApiBody({
		description: 'Credentials for authentication',
		schema: {
			type: 'object',
			required: ['phone', 'password'],
			properties: {
				phone: {
					type: 'string',
					example: '+525512345678',
				},
				password: {
					type: 'string',
					example: 'MySecurePassword123',
				},
			},
		},
	})
	@ApiOkResponse({
		description: 'Authenticated successfully',
		schema: {
			type: 'object',
			properties: {
				access_token: {
					type: 'string',
					example:
						'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0IiwiY2VsbHBob25lIjoiKzUyNTUxMjM0NTY3OCIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDAzNjAwfQ.signature',
				},
			},
		},
	})
	@ApiBadRequestResponse({ description: 'phone and password are required' })
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	@ApiInternalServerErrorResponse({
		description: 'Server configuration or Supabase error',
	})
	async login(@Body() body: SecurityLoginDto) {
		if (!body?.phone || !body?.password) {
			throw new BadRequestException('phone and password are required');
		}

		const supabaseUrl = process.env.PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
		const supabaseAnonKey =
			process.env.PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;
		const jwtSecret = process.env.JWT_SECRET;

		if (!supabaseUrl || !supabaseAnonKey) {
			throw new InternalServerErrorException(
				'Supabase credentials are not configured',
			);
		}

		if (!jwtSecret) {
			throw new InternalServerErrorException('JWT_SECRET is not configured');
		}

		const supabase = createClient(supabaseUrl, supabaseAnonKey);

		const { data, error } = await supabase
			.from('users')
			.select('id_user, cellphone')
			.eq('cellphone', body.phone)
			.eq('password', body.password)
			.limit(1)
			.maybeSingle();

		if (error) {
			throw new InternalServerErrorException(
				`Authentication query failed: ${error.message}`,
			);
		}

		if (!data) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const header = {
			alg: 'HS256',
			typ: 'JWT',
		};

		const iat = Math.floor(Date.now() / 1000);
		const exp = iat + 60 * 60;

		const payload = {
			sub: data.id_user,
			cellphone: data.cellphone,
			iat,
			exp,
		};

		const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
		const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
		const unsignedToken = `${encodedHeader}.${encodedPayload}`;
		const signature = createHmac('sha256', jwtSecret)
			.update(unsignedToken)
			.digest('base64url');

		return {
			access_token: `${unsignedToken}.${signature}`,
		};
	}
}
