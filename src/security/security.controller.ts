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
import { httpResponseLoginInterface } from '../shared/presentation/http/interfaces/http-response-login.interface';
import { UserTokenManager } from './core/entities/UserTokenManager';

class SecurityLoginDto {
	constructor(
		readonly cellphone: string,
		readonly password: string,
	) {}
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
			required: ['cellphone', 'password'],
			properties: {
				cellphone: {
					type: 'string',
					example: '3215898747',
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
	@ApiBadRequestResponse({ description: 'cellphone and password are required' })
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	@ApiInternalServerErrorResponse({
		description: 'Server configuration or Supabase error',
	})
	async login(@Body() body: SecurityLoginDto): Promise<httpResponseLoginInterface>{
		if (!body?.cellphone || !body?.password) {
			throw new BadRequestException('cellphone and password are required');
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
			.eq('cellphone', body.cellphone)
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
		
		const tokenManager = new UserTokenManager(data.id_user, data.cellphone, jwtSecret)

		return {
			message: "Login sucessfully.",
			data: tokenManager.generateToken(),
		};
	}
}
