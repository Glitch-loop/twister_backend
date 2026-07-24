// Libraries
import { Injectable } from '@nestjs/common';

// Enums
import { ROUTE_STATUS_ENUM } from '@/src/route-organization/core/enums/route-status.enum';
import { ROUTE_ORGANIZATION_STRATEGIES_ENUM } from '@/src/route-organization/core/enums/route-organization-strategies.enum';

// Dtos
import { AssignRouteDayToVendorDto } from '@/src/route-organization/application/dtos/assign-route-day-to-vendor.dto';
import { RouteDayLocationProposalDto } from '@/src/route-organization/application/dtos/route-day-location-proposal.dto';
import { RouteDayLocationDto } from '@/src/route-organization/application/dtos/route-day-location.dto';
import { RouteDayProposalDto } from '@/src/route-organization/application/dtos/route-day-proposal.dto';
import { RouteDayDto } from '@/src/route-organization/application/dtos/route-day.dto';
import { RouteDto } from '@/src/route-organization/application/dtos/route.dto';
import { OrganizationStrategyDto } from '@/src/route-organization/application/dtos/route-day-organization-strategy.dto';

// Entities
import { AssignedRouteDayEntity } from '@/src/route-organization/core/entities/assigned-route-day.entity';
import { RouteDayEntity } from '@/src/route-organization/core/entities/route-day.entity';
import { RouteDayProposalEntity } from '@/src/route-organization/core/entities/route-day-proposal.entity';
import { RouteEntity } from '@/src/route-organization/core/entities/route.entity';
import { OrganizationStrategyEntity } from '@/src/route-organization/core/entities/organization-strategy.entity';

// Object values
import { RouteDayLocationObjectValue } from '@/src/route-organization/core/value-objects/route-day-location.object-value';

// Models
import { RouteDayModel } from '@/src/route-organization/application/models/route-day.model';

// Dtos guards
import { isAssignRouteDayToVendorDto } from '@/src/route-organization/application/guards/dtos/assign-route-day-to-vendor.guard';
import { isRouteDayLocationProposalDto } from '@/src/route-organization/application/guards/dtos/route-day-location-proposal.guard';
import { isRouteDayProposalDto } from '@/src/route-organization/application/guards/dtos/route-day-proposal.guard';
import { isRouteDayDto } from '@/src/route-organization/application/guards/dtos/route-day.guard';
import { isRouteDto } from '@/src/route-organization/application/guards/dtos/route.guard';
import { isOrganizationStrategyDto } from '@/src/route-organization/application/guards/dtos/route-day-organization-strategy.guard';

// Entities guards
import { isAssignedRouteDayEntity } from '@/src/route-organization/application/guards/entities/assigned-route-day.guard';
import { isRouteDayEntity } from '@/src/route-organization/application/guards/entities/route-day.guard';
import { isRouteDayProposalEntity } from '@/src/route-organization/application/guards/entities/route-day-proposal.guard';
import { isRouteEntity } from '@/src/route-organization/application/guards/entities/route.guard';
import { isOrganizationStrategyEntity } from '@/src/route-organization/application/guards/entities/organization-strategy.guard';

@Injectable()
export class Mapper {
	constructor() {}

	// ==================== OVERLOADED FUNCTIONS FOR MAPPING ====================
	// toDomainObject overloads
	toDomainObject(dto: AssignRouteDayToVendorDto): AssignedRouteDayEntity;
	toDomainObject(dto: RouteDayLocationProposalDto, idOwner: string): RouteDayLocationObjectValue;
	toDomainObject(dto: RouteDayProposalDto): RouteDayProposalEntity;
	toDomainObject(dto: RouteDayDto): RouteDayEntity;
	toDomainObject(dto: RouteDto): RouteEntity;
	toDomainObject(dto: OrganizationStrategyDto): OrganizationStrategyEntity;
	toDomainObject(
		dto: AssignRouteDayToVendorDto | RouteDayLocationProposalDto | RouteDayProposalDto | RouteDayDto | RouteDto | OrganizationStrategyDto,
		idOwner?: string,
	): AssignedRouteDayEntity | RouteDayLocationObjectValue | RouteDayProposalEntity | RouteDayEntity | RouteEntity | OrganizationStrategyEntity {
		if (isAssignRouteDayToVendorDto(dto)) {
			return this.assignRouteDayToVendorDtoToDomainObject(dto);
		}

		if (isRouteDayLocationProposalDto(dto) && typeof idOwner === 'string') {
			return this.routeDayLocationProposalDtoToDomainObject(dto, idOwner);
		}

		if (isRouteDayProposalDto(dto)) {
			return this.routeDayProposalDtoToDomainObject(dto);
		}

		if (isRouteDayDto(dto)) {
			return this.routeDayDtoToDomainObject(dto);
		}

		if (isRouteDto(dto)) {
			return this.routeDtoToDomainObject(dto);
		}

		if (isOrganizationStrategyDto(dto)) {
			return this.organizationStrategyDtoToDomainObject(dto);
		}

		throw new Error('Invalid input for mapping to domain object');
	}

	// toDto overloads
	toDto(domainObject: AssignedRouteDayEntity): AssignRouteDayToVendorDto;
	toDto(domainObject: RouteDayLocationObjectValue, asProposalDto: true): RouteDayLocationProposalDto;
	toDto(domainObject: RouteDayLocationObjectValue): RouteDayLocationDto;
	toDto(domainObject: RouteDayProposalEntity, proposalLocations: RouteDayLocationObjectValue[]): RouteDayProposalDto;
	toDto(domainObject: RouteDayEntity): RouteDayDto;
	toDto(domainObject: RouteEntity): RouteDto;
	toDto(domainObject: OrganizationStrategyEntity): OrganizationStrategyDto;
	toDto(
		domainObject: AssignedRouteDayEntity | RouteDayLocationObjectValue | RouteDayProposalEntity | RouteDayEntity | RouteEntity | OrganizationStrategyEntity,
		metadata?: boolean | RouteDayLocationObjectValue[],
	): AssignRouteDayToVendorDto | RouteDayLocationProposalDto | RouteDayLocationDto | RouteDayProposalDto | RouteDayDto | RouteDto | OrganizationStrategyDto {
		if (isAssignedRouteDayEntity(domainObject)) {
			return this.assignedRouteDayDomainObjectToDto(domainObject);
		}

		if (domainObject instanceof RouteDayLocationObjectValue) {
			if (metadata === true) {
				return this.routeDayLocationDomainObjectToRouteDayLocationProposalDto(domainObject);
			}

			return this.routeDayLocationDomainObjectToDto(domainObject);
		}

		if (isRouteDayProposalEntity(domainObject)) {
			if (!Array.isArray(metadata)) {
				throw new Error('Invalid input for mapping RouteDayProposalEntity to dto: proposal locations are required');
			}

			return this.routeDayProposalDomainObjectToDto(domainObject, metadata);
		}

		if (isRouteDayEntity(domainObject)) {
			return this.routeDayDomainObjectToDto(domainObject);
		}

		if (isRouteEntity(domainObject)) {
			return this.routeDomainObjectToDto(domainObject);
		}

		if (isOrganizationStrategyEntity(domainObject)) {
			return this.organizationStrategyDomainObjectToDto(domainObject);
		}

		throw new Error('Invalid input for mapping to dto');
	}

	// This conversion was requested explicitly for route-day DTO to route-day model.
	toModel(dto: RouteDayDto): RouteDayModel {
		if (!isRouteDayDto(dto)) {
			throw new Error('Invalid input for mapping to model');
		}

		return this.routeDayDtoToModel(dto);
	}

	// ==================== MAPPER METHODS DOMAIN OBJECT to DTO ====================
	private routeDayLocationDomainObjectToDto(domainObject: RouteDayLocationObjectValue): RouteDayLocationDto {
		return new RouteDayLocationDto(
			domainObject.position_in_route,
			domainObject.id_location,
			domainObject.id_owner,
			domainObject.id_route_day_location ?? '',
		);
	}

	private routeDayLocationDomainObjectToRouteDayLocationProposalDto(domainObject: RouteDayLocationObjectValue): RouteDayLocationProposalDto {
		return new RouteDayLocationProposalDto(
			domainObject.id_route_day_location,
			domainObject.position_in_route,
			domainObject.id_location,
		);
	}

	private routeDayDomainObjectToDto(domainObject: RouteDayEntity): RouteDayDto {
		return new RouteDayDto(
			domainObject.id_route_day,
			domainObject.id_route,
			domainObject.id_day,
			domainObject.locations.map((location) => this.routeDayLocationDomainObjectToDto(location)),
		);
	}

	private routeDomainObjectToDto(domainObject: RouteEntity): RouteDto {
		return {
			id_route: domainObject.id_route,
			route_name: domainObject.route_name,
			description: domainObject.description === null ? undefined : domainObject.description,
		};
	}

	private organizationStrategyDomainObjectToDto(domainObject: OrganizationStrategyEntity): OrganizationStrategyDto {
		return new OrganizationStrategyDto(
			domainObject.id_organization_strategy,
			domainObject.organization_strategy_name,
			domainObject.is_used,
			domainObject.created_at,
		);
	}

	private routeDayProposalDomainObjectToDto(
		domainObject: RouteDayProposalEntity,
		proposalLocations: RouteDayLocationObjectValue[],
	): RouteDayProposalDto {
		return new RouteDayProposalDto(
			domainObject.id_route_day_proposal,
			domainObject.proposal_name,
			domainObject.created_at,
			domainObject.id_route_day,
			proposalLocations.map((location) => this.routeDayLocationDomainObjectToRouteDayLocationProposalDto(location)),
		);
	}

	// ==================== MAPPER METHODS DTO to DOMAIN OBJECT ====================
	private assignRouteDayToVendorDtoToDomainObject(dto: AssignRouteDayToVendorDto): AssignedRouteDayEntity {
		if (!dto.id_assigned_route_day) {
			throw new Error('id_assigned_route_day is required for mapping AssignRouteDayToVendorDto to AssignedRouteDayEntity');
		}

		return new AssignedRouteDayEntity(
			dto.id_assigned_route_day,
			new Date(),
			dto.id_route_day,
			dto.id_user,
			dto.expired_at,
		);
	}

	private routeDayDtoToDomainObject(dto: RouteDayDto): RouteDayEntity {
		return new RouteDayEntity(
			dto.id_route_day,
			dto.id_route,
			dto.id_day,
			dto.locations.map((location) =>
				new RouteDayLocationObjectValue(
					location.position_in_route,
					location.id_location,
					location.id_location,
					location.id_route_day_location,
				),
			),
		);
	}

	private routeDtoToDomainObject(dto: RouteDto): RouteEntity {
		return new RouteEntity(
			dto.id_route,
			dto.route_name,
			ROUTE_STATUS_ENUM.ACTIVE,
			dto.description === undefined ? null : dto.description,
		);
	}

	private organizationStrategyDtoToDomainObject(dto: OrganizationStrategyDto): OrganizationStrategyEntity {
		const strategyId = this.toOrganizationStrategyEnum(dto.id_organization_strategy);

		return new OrganizationStrategyEntity(
			strategyId,
			dto.organization_strategy_name,
			dto.is_used,
			dto.created_at,
		);
	}

	private toOrganizationStrategyEnum(
		strategyId: string,
	): ROUTE_ORGANIZATION_STRATEGIES_ENUM {
		if (Object.values(ROUTE_ORGANIZATION_STRATEGIES_ENUM).includes(strategyId as ROUTE_ORGANIZATION_STRATEGIES_ENUM)) {
			return strategyId as ROUTE_ORGANIZATION_STRATEGIES_ENUM;
		}

		throw new Error(`Invalid organization strategy id: ${strategyId}`);
	}

	private routeDayLocationProposalDtoToDomainObject(
		dto: RouteDayLocationProposalDto,
		idOwner: string,
	): RouteDayLocationObjectValue {
		return new RouteDayLocationObjectValue(
			dto.position_in_route,
			dto.id_location,
			idOwner,
			dto.id_route_day_location_proposal,
		);
	}

	private routeDayProposalDtoToDomainObject(dto: RouteDayProposalDto): RouteDayProposalEntity {
		return new RouteDayProposalEntity(
			dto.id_route_day_proposal,
			dto.proposal_name,
			dto.created_at instanceof Date ? dto.created_at : new Date(dto.created_at),
			dto.id_route_day,
		);
	}

	private assignedRouteDayDomainObjectToDto(domainObject: AssignedRouteDayEntity): AssignRouteDayToVendorDto {
		return new AssignRouteDayToVendorDto(
			domainObject.id_route_day,
			domainObject.id_user,
			domainObject.id_assigned_route_day,
			domainObject.expired_at,
		);
	}

	// ==================== MAPPER METHODS DTO to MODEL ====================
	private routeDayDtoToModel(dto: RouteDayDto): RouteDayModel {
		return {
			id_route_day: dto.id_route_day,
			id_route: dto.id_route,
			id_day: dto.id_day,
		};
	}

	// ==================== SPECIALIZED TRANSFORMATIONS ====================
	routeDayDomainObjectToRouteDto(domainObject: RouteDayEntity): RouteDto {
		return {
			id_route: domainObject.id_route,
			route_name: '',
			description: undefined,
		};
	}
}
