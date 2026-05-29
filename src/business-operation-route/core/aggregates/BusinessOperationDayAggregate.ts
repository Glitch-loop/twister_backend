import { BusinessRuleException } from '@/src/shared/errors/BusinessRuleException';

import { WorkDayOperationHistoricEntity } from '@/src/business-operation-route/core/entities/work-day-operation-historic.entity';
import { DAY_OPERATIONS_ENUM } from '@/src/business-operation-route/core/enums/day-operations.enum';

type CreateBusinessOperationParams = {
	id_work_day_operation: string;
	id_work_day: string;
	id_operation_type: DAY_OPERATIONS_ENUM;
	created_at: Date;
	id_client?: string;
	id_route_transaction?: string;
	id_route_day?: string;
	id_day_operation_dependent?: string;
};

export class BusinessOperationDay {
	private dayOperations: WorkDayOperationHistoricEntity[] | null;
	private initialDayOperations: WorkDayOperationHistoricEntity[] | null;

	constructor(dayOperations: WorkDayOperationHistoricEntity[] | null) {
		if (dayOperations === null) {
			this.dayOperations = null;
			this.initialDayOperations = null;
			return;
		}

		const orderedOperations = [...dayOperations].sort(
			(a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
		);

		this.dayOperations = orderedOperations;
		this.initialDayOperations = [...orderedOperations];
	}

	createBusinessOperation(params: CreateBusinessOperationParams): void {
		switch (params.id_operation_type) {
			case DAY_OPERATIONS_ENUM.route_client_attention:
				this.registerAttendTodaysClient(params);
				return;
			case DAY_OPERATIONS_ENUM.attention_out_of_route:
				this.registerClientAttentionOutOfRoute(params);
				return;
			case DAY_OPERATIONS_ENUM.new_client_registration:
				this.registerCreateNewClient(params);
				return;
			case DAY_OPERATIONS_ENUM.attend_client_petition:
				this.registerAttendClientPetition(params);
				return;
			case DAY_OPERATIONS_ENUM.route_transaction:
			case DAY_OPERATIONS_ENUM.cancel_route_transaction:
			case DAY_OPERATIONS_ENUM.product_devolution:
			case DAY_OPERATIONS_ENUM.sales:
			case DAY_OPERATIONS_ENUM.product_reposition:
				this.registerRouteTransactionOperation(params);
				return;
			case DAY_OPERATIONS_ENUM.start_shift_inventory:
			case DAY_OPERATIONS_ENUM.restock_inventory:
			case DAY_OPERATIONS_ENUM.product_devolution_inventory:
			case DAY_OPERATIONS_ENUM.end_shift_inventory:
			case DAY_OPERATIONS_ENUM.consult_inventory:
			case DAY_OPERATIONS_ENUM.cancel_inventory_operation:
				this.registerInventoryOperation(params);
				return;
			default:
				throw new BusinessRuleException('Unsupported business operation type.');
		}
	}

	getDayOperations(): WorkDayOperationHistoricEntity[] | null {
		return this.dayOperations;
	}

	getNewDayOperations(): WorkDayOperationHistoricEntity[] | null {
		if (this.dayOperations === null && this.initialDayOperations === null) {
			return null;
		}

		return this.dayOperations!.filter((dayOperation) => {
			if (this.initialDayOperations === null) {
				return true;
			}

			return !this.initialDayOperations.find(
				(initialOperation) => initialOperation.id_work_day_operation === dayOperation.id_work_day_operation,
			);
		});
	}

	determineCurrentOperation(): WorkDayOperationHistoricEntity | null {
		const indexCurrentOperation = this.determineIndexCurrentOperation();

		if (indexCurrentOperation === -1 || this.dayOperations === null) {
			return null;
		}

		return this.dayOperations[indexCurrentOperation];
	}

	private registerAttendTodaysClient(params: CreateBusinessOperationParams): void {
		if (!params.id_client) {
			throw new BusinessRuleException('id_client is required for route client attention operations.');
		}

		if (!this.dayOperations) {
			this.dayOperations = [];
		}

		const newDayOperation = new WorkDayOperationHistoricEntity(
			params.id_work_day_operation,
			DAY_OPERATIONS_ENUM.route_client_attention,
			params.created_at,
			params.id_work_day,
			params.id_client,
			undefined,
			params.id_route_day,
			undefined,
		);

		this.dayOperations.push(newDayOperation);
	}

	private registerClientAttentionOutOfRoute(params: CreateBusinessOperationParams): void {
		if (!params.id_client) {
			throw new BusinessRuleException('id_client is required for attention out of route operations.');
		}

		this.verifyClientIsNotBeingRepeatedForClientOperations(params.id_client);

		const newDayOperation = new WorkDayOperationHistoricEntity(
			params.id_work_day_operation,
			DAY_OPERATIONS_ENUM.attention_out_of_route,
			params.created_at,
			params.id_work_day,
			params.id_client,
			undefined,
			params.id_route_day,
			params.id_day_operation_dependent,
		);

		this.insertOperationDayNextToCurrentOperation(newDayOperation);
	}

	private registerCreateNewClient(params: CreateBusinessOperationParams): void {
		if (!params.id_client) {
			throw new BusinessRuleException('id_client is required for new client registration operations.');
		}

		this.verifyClientIsNotBeingRepeatedForClientOperations(params.id_client);

		const newDayOperation = new WorkDayOperationHistoricEntity(
			params.id_work_day_operation,
			DAY_OPERATIONS_ENUM.new_client_registration,
			params.created_at,
			params.id_work_day,
			params.id_client,
			undefined,
			params.id_route_day,
			params.id_day_operation_dependent,
		);

		this.insertOperationDayNextToCurrentOperation(newDayOperation);
	}

	private registerAttendClientPetition(params: CreateBusinessOperationParams): void {
		if (!params.id_client) {
			throw new BusinessRuleException('id_client is required for attend client petition operations.');
		}

		this.verifyClientIsNotBeingRepeatedForClientOperations(params.id_client);

		const newDayOperation = new WorkDayOperationHistoricEntity(
			params.id_work_day_operation,
			DAY_OPERATIONS_ENUM.attend_client_petition,
			params.created_at,
			params.id_work_day,
			params.id_client,
			undefined,
			params.id_route_day,
			params.id_day_operation_dependent,
		);

		this.insertOperationDayNextToCurrentOperation(newDayOperation);
	}

	private registerRouteTransactionOperation(params: CreateBusinessOperationParams): void {
		if (!params.id_route_transaction) {
			throw new BusinessRuleException('id_route_transaction is required for route transaction operations.');
		}

		const newDayOperation = new WorkDayOperationHistoricEntity(
			params.id_work_day_operation,
			params.id_operation_type,
			params.created_at,
			params.id_work_day,
			params.id_client,
			params.id_route_transaction,
			params.id_route_day,
			params.id_day_operation_dependent,
		);

		this.insertOperationDayNextToCurrentOperation(newDayOperation);
	}

	private registerInventoryOperation(params: CreateBusinessOperationParams): void {
		const newDayOperation = new WorkDayOperationHistoricEntity(
			params.id_work_day_operation,
			params.id_operation_type,
			params.created_at,
			params.id_work_day,
			undefined,
			undefined,
			params.id_route_day,
			params.id_day_operation_dependent,
		);

		this.insertOperationDayNextToCurrentOperation(newDayOperation);
	}

	private insertOperationDayNextToCurrentOperation(newDayOperation: WorkDayOperationHistoricEntity): void {
		if (!this.dayOperations) {
			this.dayOperations = [newDayOperation];
			return;
		}

		const indexCurrentOperation = this.determineIndexCurrentOperation();

		if (indexCurrentOperation === -1) {
			this.dayOperations.unshift(newDayOperation);
			return;
		}

		this.dayOperations.splice(indexCurrentOperation + 1, 0, newDayOperation);
	}

	private determineIndexCurrentOperation(): number {
		let indexCurrentOperationDay = -1;

		if (!this.dayOperations) {
			return indexCurrentOperationDay;
		}

		const dayOperationOrdered = [...this.dayOperations].sort(
			(a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
		);

		const dependentOperations = new Map<string, string[]>();

		for (const dayOperation of dayOperationOrdered) {
			if (
				dayOperation.id_day_operation_dependent !== undefined
				&& dayOperation.id_day_operation_dependent !== ''
			) {
				const dependents = dependentOperations.get(dayOperation.id_day_operation_dependent) ?? [];
				dependents.push(dayOperation.id_work_day_operation);
				dependentOperations.set(dayOperation.id_day_operation_dependent, dependents);
			}
		}

		for (let index = 0; index < dayOperationOrdered.length; index += 1) {
			const dayOperation = dayOperationOrdered[index];

			if (dayOperation.id_operation_type === DAY_OPERATIONS_ENUM.route_client_attention) {
				if (!dependentOperations.has(dayOperation.id_work_day_operation)) {
					indexCurrentOperationDay = index;
					break;
				}
			}
		}

		if (indexCurrentOperationDay === -1) {
			return dayOperationOrdered.length > 0 ? dayOperationOrdered.length - 1 : -1;
		}

		return indexCurrentOperationDay;
	}

	private verifyClientIsNotBeingRepeatedForClientOperations(idClient: string): void {
		if (this.dayOperations === null) {
			throw new BusinessRuleException(
				'There are no operations registered for the day. So the operation cannot be registered.',
			);
		}

		const isClientAlreadyRegistered = this.dayOperations.some((dayOperation) => {
			return dayOperation.id_client === idClient
				&& (
					dayOperation.id_operation_type === DAY_OPERATIONS_ENUM.route_client_attention
					|| dayOperation.id_operation_type === DAY_OPERATIONS_ENUM.attend_client_petition
					|| dayOperation.id_operation_type === DAY_OPERATIONS_ENUM.new_client_registration
					|| dayOperation.id_operation_type === DAY_OPERATIONS_ENUM.attention_out_of_route
				);
		});

		if (isClientAlreadyRegistered) {
			throw new BusinessRuleException(
				'The client you try to register already exists in the current business operations day flow.',
			);
		}
	}
}