// Libraries
import { 
	Body, 
	Controller, 
	Get, 
	Param, 
	Patch, 
	Post, 
	Query,
} from '@nestjs/common';

import {
	ApiBody,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiTags,
} from '@nestjs/swagger';

// DTOs
import { StartShiftWorkDayRequestDto } from '@/src/business-operation-route/application/dtos/start-work-day-request.dto';
import { FinishWorkDayRequestDto } from '@/src/business-operation-route/application/dtos/finish-work-day-request.dto';
import { CreateWorkDayNoteRequestDto } from '@/src/business-operation-route/application/dtos/create-work-day-note-request.dto';
import { WorkDayDto } from '@/src/business-operation-route/application/dtos/work-day.dto';
import { WorkDayOperationHistoricDto } from '@/src/business-operation-route/application/dtos/work-day-operation-historic.dto';

// Commands
import { StartWorkDayCommand } from '@/src/business-operation-route/application/commands/start-work-day.command';
import { UpdateWorkDayCommand } from '@/src/business-operation-route/application/commands/finish-work-day.command';
import { CreateWorkDayNoteCommand } from '@/src/business-operation-route/application/commands/create-work-day-note.command';
import { RegisterWorkDayBusinessOperationsCommand } from '@/src/business-operation-route/application/commands/register-work-day-business-operations.command';

// Queries
import { ListWorkDayQuery } from '@/src/business-operation-route/application/queries/list-work-day.query';
import { ListWorkDayOperationsHistoricQuery } from '@/src/business-operation-route/application/queries/list-work-day-operations-historic.query';
import { RetrieveWorkDayByWorkDayIdQuery } from '@/src/business-operation-route/application/queries/retrieve-work-day-by-work-day-id.query';
import { RetrieveWorkDayOperationsHistoricByWorkDayIdQuery } from '@/src/business-operation-route/application/queries/retrieve-work-day-operations-historic-by-work-day-id.query';

// Core
import { DAY_OPERATIONS_ENUM } from '@/src/business-operation-route/core/enums/day-operations.enum';

// Presentation
import { httpControllerResponse } from '@/src/shared/presentation/http/interfaces/controller-response.interface';
import { httpFormatter } from '@/src/shared/presentation/http/handlers/http-formatter.handler';
import { BusinessOperationBroker } from './Providers/BusinessOperationBroker';

@ApiTags('Business Operation Route')
@Controller('business-operation-route')
export class BusinessOperationRouteController {
	constructor(
		private readonly startWorkDayCommand: StartWorkDayCommand,
		private readonly updateWorkDayCommand: UpdateWorkDayCommand,
		private readonly createWorkDayNoteCommand: CreateWorkDayNoteCommand,
		private readonly registerWorkDayBusinessOperationsCommand: RegisterWorkDayBusinessOperationsCommand,
		private readonly listWorkDayQuery: ListWorkDayQuery,
		private readonly listWorkDayOperationsHistoricQuery: ListWorkDayOperationsHistoricQuery,
		private readonly retrieveWorkDayByWorkDayIdQuery: RetrieveWorkDayByWorkDayIdQuery,
		private readonly retrieveWorkDayOperationsHistoricByWorkDayIdQuery: RetrieveWorkDayOperationsHistoricByWorkDayIdQuery,
		private readonly businessOperationBroker: BusinessOperationBroker
	) {}
	@ApiOperation({
		summary: 'Start work day',
		description: `Starts a new work day.

Note:
- If "id_work_day" is not provided the server will assign an uuid automatically.
- If "start_date" is not provided, the work day will be registered with the 
date at moment of the creation.`,
	})
	@ApiOkResponse({ description: 'Standardized response with operation message.' })
	@Post('/work-days')
	async startWorkDay(@Body() body: StartShiftWorkDayRequestDto): Promise<httpControllerResponse> {
		await this.startWorkDayCommand.execute(
			new Date(body.start_date),
			body.start_petty_cash,
			body.id_route_day,
			body.id_user,
			body.id_work_day,
		);

		const httpResponseFormatter = new httpFormatter();
		return httpResponseFormatter.createResponse('Work day started successfully.');
	}

	@ApiOperation({
		summary: 'Finish work day',
		description: 'Finishes a work day and returns a standardized controller response.',
	})
	@ApiParam({ name: 'id_work_day', description: 'Work day identifier', type: String })
	@ApiOkResponse({ description: 'Standardized response with operation message.' })
	@Patch('/work-days/:id_work_day')
	async finishWorkDay(
		@Param('id_work_day') id_work_day: string,
		@Body() body: FinishWorkDayRequestDto,
	): Promise<httpControllerResponse> {
		await this.updateWorkDayCommand.execute(
			id_work_day,
			body.finish_date,
			body.final_petty_cash,
		);

		const httpResponseFormatter = new httpFormatter();
		return httpResponseFormatter.createResponse('Work day finished successfully.');
	}

	@ApiOperation({
		summary: 'Create work day note',
		description: 'Creates a note for a work day and returns a standardized controller response.',
	})
	@ApiParam({ name: 'id_work_day', description: 'Work day identifier', type: String })
	@ApiOkResponse({ description: 'Standardized response with operation message.' })
	@Post('/work-days/:id_work_day/notes')
	async createWorkDayNote(
		@Param('id_work_day') id_work_day: string,
		@Body() body: CreateWorkDayNoteRequestDto,
	): Promise<httpControllerResponse> {
		await this.createWorkDayNoteCommand.execute(
			id_work_day,
			body.note,
			new Date(body.created_at),
		);

		const httpResponseFormatter = new httpFormatter();
		return httpResponseFormatter.createResponse('Work day note created successfully.');
	}

	@ApiOperation({
		summary: 'Add work day operations',
		description: `Adds operation records to a work day and returns a standardized controller response.
Supported operations:
Related to inventory
- start_shift_inventory: 				${DAY_OPERATIONS_ENUM.start_shift_inventory}
- restock_inventory: 						${DAY_OPERATIONS_ENUM.restock_inventory}
- end_shift_inventory: 					${DAY_OPERATIONS_ENUM.end_shift_inventory}
- product_devolution_inventory: ${DAY_OPERATIONS_ENUM.product_devolution_inventory}
- consult_inventory: 						${DAY_OPERATIONS_ENUM.consult_inventory}
- cancel_inventory_operation:		${DAY_OPERATIONS_ENUM.cancel_inventory_operation}

For this type of day operations, it's required the following fields: 

- id_inventory_operation

Related to route transaction
- product_devolution: 			${DAY_OPERATIONS_ENUM.product_devolution}
- sales: 										${DAY_OPERATIONS_ENUM.sales}
- sample: 									${DAY_OPERATIONS_ENUM.sample}
- product_reposition: 			${DAY_OPERATIONS_ENUM.product_reposition}
- route_transaction: 				${DAY_OPERATIONS_ENUM.route_transaction}
- cancel_route_transaction: ${DAY_OPERATIONS_ENUM.cancel_route_transaction}

For this type of day operations, it's required the following fields: 

- id_route_transaction
- latitude and longitude are required fields, but since it is being tested the mechanism 
for retrieve the location, this two fields are set as optional.

Related to client operations
- prospect_registration: 		${DAY_OPERATIONS_ENUM.prospect_registration}
- new_client_confirmation: 	${DAY_OPERATIONS_ENUM.new_client_confirmation}
- attention_out_of_route: 	${DAY_OPERATIONS_ENUM.attention_out_of_route}
- route_client_attention: 	${DAY_OPERATIONS_ENUM.route_client_attention}
- attend_client_petition: 	${DAY_OPERATIONS_ENUM.attend_client_petition}
- client_visited: 					${DAY_OPERATIONS_ENUM.client_visited}


For this type of day operations, it's required the following fields: 

- id_locaion


Special cases. These are cases that needs all the information described below
and particular information that needs the case

new_client_confirmation

- id_route_transaction

`,
	})
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				id_work_day: {
					type: 'string',
					format: 'uuid',
				},
				operations: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id_operation_type: {
								type: 'string',
								enum: Object.values(DAY_OPERATIONS_ENUM),
							},
							created_at: { type: 'string', format: 'date-time' },
							latitude: { type: 'string', example: '19.45602930548609' },
							longitude: { type: 'string', example: '-99.13450312485135' },
							id_location: { type: 'string', format: 'uuid' },
							id_route_transaction: { type: 'string', format: 'uuid' },
							id_inventory_operation: { type: 'string', format: 'uuid' },
							id_route_day: { type: 'string', format: 'uuid' },
							id_day_operation_dependent: { type: 'string', format: 'uuid' },
							id_work_day_operation: { type: 'string', format: 'uuid' },
						},
						required: ['id_operation_type'],
					},
				},
			},
			required: ['id_work_day', 'operations'],
		},
	})
	@ApiOkResponse({ description: 'Standardized response with operation message.' })
	@Post('/work-days/operations')
	async addWorkDayOperations(
		@Body()
		body: {
			id_work_day: string;
			operations: Array<{
				id_operation_type: DAY_OPERATIONS_ENUM;
				created_at?: Date;
				latitude: string;
				longitude: string;
				id_location?: string;
				id_route_transaction?: string;
				id_inventory_operation?: string;
				id_route_day: string;
				id_day_operation_dependent?: string;
				id_work_day_operation?: string;
			}>;
		},
	): Promise<httpControllerResponse> {
		await this.registerWorkDayBusinessOperationsCommand.execute(body.id_work_day, body.operations);

		const httpResponseFormatter = new httpFormatter();
		return httpResponseFormatter.createResponse('Work day operations added successfully.');
	}

	@ApiOperation({
		summary: 'List work days',
		description: 'Returns a paginated collection of work days with optional filters.',
	})
	@ApiQuery({ name: 'limit', required: false, type: String, description: 'Page size (max 1000).' })
	@ApiQuery({ name: 'next_item', required: false, type: String, description: 'Opaque cursor for next page.' })
	@ApiQuery({ name: 'start_date_start_work_day', required: false, type: String })
	@ApiQuery({ name: 'end_date_end_work_day', required: false, type: String })
	@ApiQuery({ name: 'final_pretty_cash', required: false, type: String })
	@ApiQuery({ name: 'id_route_day', required: false, type: String, isArray: true })
	@ApiQuery({ name: 'id_vendor', required: false, type: String, isArray: true })
	@ApiQuery({ name: 'id_pay_stub', required: false, type: String, isArray: true })
	@ApiOkResponse({ description: 'Standardized paginated response with work day collection.', type: [WorkDayDto] })
	@Get('/work-days')
	async listWorkDays(
		@Query('limit') limit?: string,
		@Query('next_item') next_item?: string,
		@Query('start_date_start_work_day') start_date_start_work_day?: string,
		@Query('end_date_end_work_day') end_date_end_work_day?: string,
		@Query('final_pretty_cash') final_pretty_cash?: string,
		@Query('id_route_day') id_route_day?: string[],
		@Query('id_vendor') id_vendor?: string[],
		@Query('id_pay_stub') id_pay_stub?: string[],
	): Promise<httpControllerResponse> {

		const toDate = (value?: string): Date | undefined => {
			if (!value) return undefined;
			const parsed = new Date(value);
			return Number.isNaN(parsed.getTime()) ? undefined : parsed;
		};

		let next_id: string | undefined;
		let next_date: string | undefined;
		let parsedLimit: number | undefined;

		const parsedFinalPettyCash = final_pretty_cash ? Number.parseFloat(final_pretty_cash) : undefined;
		const startDate = toDate(start_date_start_work_day);
		const endDate = toDate(end_date_end_work_day);
		const idRouteDay = id_route_day;
		const idVendor = id_vendor;
		const idPayStub = id_pay_stub;
		const httpRequestFormatter = new httpFormatter();

		if (next_item) {
			const paginationInformation = httpRequestFormatter.decodingNextItemForPagination(next_item);
			next_id = paginationInformation.id;
			if (paginationInformation.created_at) next_date = paginationInformation.created_at;
		}

		if (limit) parsedLimit = Number.parseInt(limit, 10);

		const data: WorkDayDto[] = await this.listWorkDayQuery.execute(
			parsedLimit,
			startDate,
			endDate,
			parsedFinalPettyCash,
			idRouteDay,
			idVendor,
			idPayStub,
			next_date,
			next_id,
		);

		const httpResponseFormatter = new httpFormatter();
		return httpResponseFormatter.createResponse(
			'Work days listed successfully.',
			data,
			parsedLimit,
			'id_work_day',
			'start_date',
		);
	}

	@ApiOperation({
		summary: 'List work day operations historic',
		description: 'Returns a paginated collection of work day operation historic with optional filters.',
	})
	@ApiQuery({ name: 'limit', required: false, type: String, description: 'Page size (max 1000).' })
	@ApiQuery({ name: 'next_item', required: false, type: String, description: 'Opaque cursor for next page.' })
	@ApiQuery({ name: 'start_date_created_at', required: false, type: String })
	@ApiQuery({ name: 'end_date_created_at', required: false, type: String })
	@ApiQuery({ name: 'id_location', required: false, type: String })
	@ApiQuery({ name: 'id_route_transaction', required: false, type: String, isArray: true })
	@ApiQuery({ name: 'id_route_day', required: false, type: String, isArray: true })
	@ApiQuery({ name: 'operation_type', required: false, enum: DAY_OPERATIONS_ENUM, isArray: true })
	@ApiQuery({ name: 'id_work_day', required: false, type: String, isArray: true })
	@ApiOkResponse({ description: 'Standardized paginated response with work day operation historic collection.', type: [WorkDayOperationHistoricDto] })
	@Get('/work-days/operations')
	async listWorkDayOperationsHistoric(
		@Query('limit') limit?: string,
		@Query('next_item') next_item?: string,
		@Query('start_date_created_at') start_date_created_at?: string,
		@Query('end_date_created_at') end_date_created_at?: string,
		@Query('id_location') id_location?: string,
		@Query('id_route_transaction') id_route_transaction?: string | string[],
		@Query('id_route_day') id_route_day?: string | string[],
		@Query('operation_type') operation_type?: string | string[],
		@Query('id_work_day') id_work_day?: string | string[],
	): Promise<httpControllerResponse> {
		const toArray = (value?: string | string[]): string[] | undefined => {
			if (!value) return undefined;
			if (Array.isArray(value)) return value.filter((item) => item.length > 0);

			return value
				.split(',')
				.map((item) => item.trim())
				.filter((item) => item.length > 0);
		};

		const toDate = (value?: string): Date | undefined => {
			if (!value) return undefined;
			const parsed = new Date(value);
			return Number.isNaN(parsed.getTime()) ? undefined : parsed;
		};

		let next_id: string | undefined;
		let next_date: string | undefined;
		let parsedLimit: number | undefined;

		const parsedIdLocation = id_location ? Number.parseInt(id_location, 10) : undefined;
		const startDate = toDate(start_date_created_at);
		const endDate = toDate(end_date_created_at);
		const idRouteTransaction = toArray(id_route_transaction);
		const idRouteDay = toArray(id_route_day);
		const operationTypeRaw = toArray(operation_type);
		const idWorkDay = toArray(id_work_day);
		const operationType = operationTypeRaw?.filter((value): value is DAY_OPERATIONS_ENUM =>
			Object.values(DAY_OPERATIONS_ENUM).includes(value as DAY_OPERATIONS_ENUM),
		);

		const httpRequestFormatter = new httpFormatter();

		if (next_item) {
			const paginationInformation = httpRequestFormatter.decodingNextItemForPagination(next_item);
			next_id = paginationInformation.id;
			if (paginationInformation.created_at) next_date = paginationInformation.created_at;
		}

		if (limit) parsedLimit = Number.parseInt(limit, 10);

		const data: WorkDayOperationHistoricDto[] = await this.listWorkDayOperationsHistoricQuery.execute(
			parsedLimit,
			startDate,
			endDate,
			parsedIdLocation,
			idRouteTransaction,
			idRouteDay,
			operationType,
			idWorkDay,
			next_date,
			next_id,
		);

		const httpResponseFormatter = new httpFormatter();
		return httpResponseFormatter.createResponse(
			'Work day operations historic listed successfully.',
			data,
			parsedLimit,
			'id_work_day_operation',
			'created_at',
		);
	}

	@ApiOperation({
		summary: 'Retrieve work days by IDs',
		description: 'Retrieves specific work day records from an explicit list of IDs.',
	})
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				id_work_days: {
					type: 'string',
					example: '5e8e8ad0-8a84-4326-95d5-84f4f2c13711,2d291bb8-2fe8-4e82-93d8-11cf80e302f8',
					description: 'Comma-separated work day IDs.',
				},
			},
			required: ['id_work_days'],
		},
	})
	@ApiOkResponse({ description: 'Standardized response with retrieved work days.', type: [WorkDayDto] })
	@Post('/work-days/ids')
	async retrieveWorkDayByWorkDayId(
		@Body() body: { id_work_days: string[] },
	): Promise<httpControllerResponse> {

		const data: WorkDayDto[] = await this.retrieveWorkDayByWorkDayIdQuery.execute(body.id_work_days);

		const httpResponseFormatter = new httpFormatter();
		return httpResponseFormatter.createResponse('Work days retrieved successfully.', data);
	}

	@ApiOperation({
		summary: 'Retrieve work day operations historic by work day IDs',
		description: 'Retrieves specific work day operation historic records using work day identifiers.',
	})
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				id_work_days: {
					type: 'string',
					example: '5e8e8ad0-8a84-4326-95d5-84f4f2c13711,2d291bb8-2fe8-4e82-93d8-11cf80e302f8',
					description: 'Comma-separated work day IDs.',
				},
			},
			required: ['id_work_days'],
		},
	})
	@ApiOkResponse({
		description: 'Standardized response with retrieved work day operation historic records.',
		type: [WorkDayOperationHistoricDto],
	})
	@Post('/work-days/operations/ids')
	async retrieveWorkDayOperationsHistoricByWorkDayId(
		@Body() body: { id_work_days: string },
	): Promise<httpControllerResponse> {
		const idWorkDays = (body.id_work_days ?? '')
			.split(',')
			.map((item) => item.trim())
			.filter((item) => item.length > 0);

		const data: WorkDayOperationHistoricDto[] =
			await this.retrieveWorkDayOperationsHistoricByWorkDayIdQuery.execute(idWorkDays);

		const httpResponseFormatter = new httpFormatter();
		return httpResponseFormatter.createResponse('Work day operations historic retrieved successfully.', data);
	}
}
