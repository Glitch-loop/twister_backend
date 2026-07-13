import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
	ApiBody,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiTags,
} from '@nestjs/swagger';

import {
	CreateTransactionRequestDto,
	CreateTransactionDescriptionRequestDto,
} from '@/src/sellings/application/dtos/create-transaction-request.dto';
import { TransactionDto } from '@/src/sellings/application/dtos/transaction.dto';
import { CancelTransactionCommand } from '@/src/sellings/application/commands/cancel-transaction.command';
import { RegisterTransactionCommand } from '@/src/sellings/application/commands/register-transaction.command';
import { ListTransactionsQuery } from '@/src/sellings/application/queries/list-transactions.query';
import { RetrieveTransactionsByIdTransactionQuery } from '@/src/sellings/application/queries/retrieve-transactions-by-id-transaction.query';
import { ROUTE_TRANSACTION_OPERATION_TYPE } from '@/src/sellings/core/enums/route-transaction-operation-type.enum';

import { httpFormatter } from '@/src/shared/presentation/http/handlers/http-formatter.handler';
import { httpControllerResponse } from '@/src/shared/presentation/http/interfaces/controller-response.interface';

@ApiTags('Sellings')
@Controller('sellings')
export class SellingsController {
	constructor(
		private readonly registerTransactionCommand: RegisterTransactionCommand,
		private readonly cancelTransactionCommand: CancelTransactionCommand,
		private readonly listTransactionsQuery: ListTransactionsQuery,
		private readonly retrieveTransactionsByIdTransactionQuery: RetrieveTransactionsByIdTransactionQuery,
	) {}

	@ApiOperation({
		summary: 'Create transaction',
		description: `Creates a route transaction and returns a standardized controller response.

The request receives IDs only for relational references.

Known IDs:
Payment method IDs
- credit card: 0706f60e-69ae-462f-946e-450be1f914a6
- debit card: 412ad9d7-b51a-4a25-9f10-ff61b4c8bd27
- cash: 52757755-1471-44c3-b6d5-07f7f83a0f6f
- transfer: b68e6be3-8919-41dd-9d09-6527884e162e

Payment schema IDs
- IMMEDIATE: 0184d0e0-c9b6-4758-b757-dea6adb28bc5
- DEFERRED: a5c8cb96-860c-4f40-bff2-3fb80fde2ef4

Route transaction operation type IDs
- SALES: ${ROUTE_TRANSACTION_OPERATION_TYPE.SALES}
- PRODUCT_DEVOLUTION: ${ROUTE_TRANSACTION_OPERATION_TYPE.PRODUCT_DEVOLUTION}
- PRODUCT_REPOSITION: ${ROUTE_TRANSACTION_OPERATION_TYPE.PRODUCT_REPOSITION}
- COURTESY: ${ROUTE_TRANSACTION_OPERATION_TYPE.COURTESY}

Considerations:
- If id_transaction is not provided, it is going to be created automatically.
- If id_transaction_description is not provided, it is going to be created automatically.
- If created_at from transaction is not provided, it is going to be created automatically.
- If created_at from transaction description is not provided, it is going to be created automatically.

`,
	})
	@ApiBody({ type: CreateTransactionRequestDto })
	@ApiOkResponse({ description: 'Standardized response with operation message.' })
	@Post('/transactions')
	async registerTransaction(@Body() body: CreateTransactionRequestDto): Promise<httpControllerResponse> {
		await this.registerTransactionCommand.execute(
			body.received_amount,
			body.id_work_day,
			body.id_payment_method,
			body.id_payment_schema,
			body.created_by,
			(body.transaction_descriptions ?? []).map((description: CreateTransactionDescriptionRequestDto) => ({
				id_transaction_description: description.id_transaction_description,
				price_at_moment: description.price_at_moment,
				cost_at_moment: description.cost_at_moment,
				quantity: description.quantity,
				created_at: description.created_at,
				id_transaction_operation_type: description.id_transaction_operation_type,
				id_product: description.id_product,
			})),
			body.id_invoice_concept,
			body.latitude,
			body.longitude,
			body.id_client,
			body.id_transaction,
			body.created_at,
			body.id_location,
			body.cfdi,
		);

		const httpResponseFormatter = new httpFormatter();
		return httpResponseFormatter.createResponse('Transaction created successfully.');
	}

	@ApiOperation({
		summary: 'Cancel transaction',
		description: 'Cancels a transaction by id_transaction and returns a standardized controller response.',
	})
	@ApiParam({ name: 'id_transaction', description: 'Transaction identifier', type: String })
	@ApiOkResponse({ description: 'Standardized response with operation message.' })
	@Patch('/transactions/:id_transaction/cancel')
	async cancelTransaction(@Param('id_transaction') idTransaction: string): Promise<httpControllerResponse> {
		await this.cancelTransactionCommand.execute(idTransaction);

		const httpResponseFormatter = new httpFormatter();
		return httpResponseFormatter.createResponse('Transaction cancelled successfully.');
	}

	@ApiOperation({
		summary: 'List transactions',
		description: 'Returns a paginated collection of transactions with optional filters.',
	})
	@ApiQuery({ name: 'limit', required: false, type: String, description: 'Page size (max 1000).' })
	@ApiQuery({ name: 'next_item', required: false, type: String, description: 'Opaque cursor for next page.' })
	@ApiQuery({ name: 'cfdi', required: false, type: String })
	@ApiQuery({ name: 'received_amount', required: false, type: String })
	@ApiQuery({ name: 'transaction_status', required: false, type: Number, isArray: true })
	@ApiQuery({ name: 'id_location', required: false, type: String, isArray: true })
	@ApiQuery({ name: 'id_client', required: false, type: String, isArray: true })
	@ApiQuery({ name: 'id_work_day', required: false, type: String, isArray: true })
	@ApiQuery({ name: 'id_payment_method', required: false, type: String, isArray: true })
	@ApiQuery({ name: 'id_payment_schema', required: false, type: String, isArray: true })
	@ApiOkResponse({ description: 'Standardized paginated response with transactions collection.', type: [TransactionDto] })
	@Get('/transactions')
	async listTransactions(
		@Query('limit') limit?: string,
		@Query('next_item') next_item?: string,
		@Query('cfdi') cfdi?: string,
		@Query('received_amount') received_amount?: string,
		@Query('transaction_status') transaction_status?: string | string[],
		@Query('id_location') id_location?: string | string[],
		@Query('id_client') id_client?: string | string[],
		@Query('id_work_day') id_work_day?: string | string[],
		@Query('id_payment_method') id_payment_method?: string | string[],
		@Query('id_payment_schema') id_payment_schema?: string | string[],
	): Promise<httpControllerResponse> {
		const toArray = (value?: string | string[]): string[] | undefined => {
			if (!value) return undefined;
			if (Array.isArray(value)) return value.filter((item) => item.length > 0);

			return value
				.split(',')
				.map((item) => item.trim())
				.filter((item) => item.length > 0);
		};

		let nextId: string | undefined = undefined;
		let nextDate: string | undefined = undefined;
		let parsedLimit: number | undefined = undefined;

		const transactionStatusValues = toArray(transaction_status);
		const parsedTransactionStatus = transactionStatusValues?.map((value) => Number.parseInt(value, 10))
			.filter((value) => Number.isInteger(value));

		const httpRequestFormatter = new httpFormatter();
		const httpResponseFormatter = new httpFormatter();

		if (next_item) {
			const paginationInformation = httpRequestFormatter.decodingNextItemForPagination(next_item);
			nextId = paginationInformation.id;
			if (paginationInformation.created_at) nextDate = paginationInformation.created_at;
		}

		if (limit) parsedLimit = Number.parseInt(limit, 10);

		const data: TransactionDto[] = await this.listTransactionsQuery.execute(
			parsedLimit,
			cfdi,
			received_amount,
			parsedTransactionStatus,
			toArray(id_location),
			toArray(id_client),
			toArray(id_work_day),
			toArray(id_payment_method),
			toArray(id_payment_schema),
			nextId,
			nextDate,
		);

		return httpResponseFormatter.createResponse(
			'Transactions listed successfully.',
			data,
			parsedLimit,
			'id_transaction',
			'created_at',
		);
	}

	@ApiOperation({
		summary: 'Retrieve transactions by IDs',
		description: 'Retrieves specific transaction records from an explicit list of IDs.',
	})
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				id_transactions: {
					type: 'array',
					items: { type: 'string', format: 'uuid' },
				},
			},
			required: ['id_transactions'],
		},
	})
	@ApiOkResponse({ description: 'Standardized response with retrieved transactions.', type: [TransactionDto] })
	@Post('/transactions/ids')
	async retrieveTransactionsByIdTransaction(
		@Body() body: { id_transactions: string[] },
	): Promise<httpControllerResponse> {
		const data: TransactionDto[] = await this.retrieveTransactionsByIdTransactionQuery.execute(
			body.id_transactions ?? [],
		);

		const httpResponseFormatter = new httpFormatter();
		return httpResponseFormatter.createResponse('Transactions retrieved successfully.', data);
	}
}
