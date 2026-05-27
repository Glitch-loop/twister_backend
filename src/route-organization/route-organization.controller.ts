// Libraries
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
	ApiBody,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiTags,
} from '@nestjs/swagger';

// DTOs
import { RouteRequestDto } from './application/dtos/route-request.dto';
import { CreateRouteDayProposalRequestDto } from '@/src/route-organization/application/dtos/create-route-day-proposal-request.dto';
import { RouteDayDto } from '@/src/route-organization/application/dtos/route-day.dto';
import { RouteDayProposalDto } from '@/src/route-organization/application/dtos/route-day-proposal.dto';
import { RouteDto } from '@/src/route-organization/application/dtos/route.dto';
import { UpdateRouteDayProposalRequestDto } from '@/src/route-organization/application/dtos/update-route-day-proposal-request.dto';

// Presentation
import { httpControllerResponse } from '@/src/shared/presentation/http/interfaces/controller-response.interface';
import { httpFormatter } from '@/src/shared/presentation/http/handlers/http-formatter.handler';

// Value Objects
import { RouteDayLocationObjectValue } from '@/src/route-organization/core/value-objects/route-day-location.object-value';

// Commands
import { AssignRouteToVendorCommand } from '@/src/route-organization/application/commands/assign-route-to-vendor.command';
import { CreateNewRouteCommand } from '@/src/route-organization/application/commands/create-new-route.command';
import { DeactivateRouteCommand } from './application/commands/deactivate-route.command';
import { OrganizeRouteDayCommand } from '@/src/route-organization/application/commands/organize-route-day.command';
import { UpdateRouteCommand } from '@/src/route-organization/application/commands/update-route.command';
import { ReactivateRouteCommand } from '@/src/route-organization/application/commands/reactivate-route.command';
import { UnassignRouteToVendorCommand } from '@/src/route-organization/application/commands/unassign-route-to-vendor.command';
import { CreateRouteDayProposalCommand } from '@/src/route-organization/application/commands/create-route-day-proposal.command';
import { DeleteRouteDayProposalCommand } from '@/src/route-organization/application/commands/delete-route-day-proposal.command';
import { UpdateRouteDayProposalCommand } from '@/src/route-organization/application/commands/update-route-day-proposal.command';

// Queries
import { ListRouteDaysQuery } from '@/src/route-organization/application/queries/list-route-days.query';
import { ListRouteDaysProposalsQuery } from '@/src/route-organization/application/queries/list-route-days-proposals.query';
import { ListRoutesQuery } from '@/src/route-organization/application/queries/list-routes.query';
import { RetrieveRouteDaysProposalsByIdProposalQuery } from '@/src/route-organization/application/queries/retrieve-route-days-proposals-by-proposal-id_proposal.query';
import { RetrieveRouteDayByRouteDayIdQuery } from '@/src/route-organization/application/queries/retrieve-route-day-by-route_day-id.query';
import { RetrieveAssignedRouteDaysByIdUserQuery } from './application/queries/retrieve-assigned-route-days-by-id-user.query';

@ApiTags('Route Organization')
@Controller('route-organization')
export class RouteOrganizationController {
	constructor(
		private readonly assignRouteToVendorCommand: AssignRouteToVendorCommand,
		private readonly createNewRouteCommand: CreateNewRouteCommand,
		private readonly deactivateRouteCommand: DeactivateRouteCommand,
		private readonly organizeRouteDayCommand: OrganizeRouteDayCommand,
		private readonly updateRouteCommand: UpdateRouteCommand,
		private readonly reactivateRouteCommand: ReactivateRouteCommand,
		private readonly unassignRouteToVendorCommand: UnassignRouteToVendorCommand,
		private readonly listRoutesQuery: ListRoutesQuery,
		private readonly listRouteDaysQuery: ListRouteDaysQuery,
		private readonly retrieveRouteDayByRouteDayIdQuery: RetrieveRouteDayByRouteDayIdQuery,
		private readonly retrieveAssignedRouteDaysByIdUserQuery: RetrieveAssignedRouteDaysByIdUserQuery,

		// Related to route proposals
		private readonly createRouteDayProposalCommand: CreateRouteDayProposalCommand,
		private readonly updateRouteDayProposalCommand: UpdateRouteDayProposalCommand,
		private readonly deleteRouteDayProposalCommand: DeleteRouteDayProposalCommand,
		private readonly listRouteDaysProposalsQuery: ListRouteDaysProposalsQuery,
		private readonly retrieveRouteDaysProposalsByIdProposalQuery: RetrieveRouteDaysProposalsByIdProposalQuery,
	) {}

	@ApiOperation({
		summary: 'Create route',
		description: `Creates a new route with a name and optional description.
When the user creates a new route, it is also created a route day per day.
Right now (26-05-26), a route day is created from "Monday" to "Saturday".

Although it could be a configuration on which the user decides the days which 
route days will be created, so far there was not be an 'use case' on which 
this behavior is needed.`,
	})
	@ApiBody({ type: RouteRequestDto })
	@ApiOkResponse({ description: 'Standardized response with operation message.' })
	@Post('/routes')
	async createRoute(@Body() body: RouteRequestDto): Promise<httpControllerResponse> {
		await this.createNewRouteCommand.execute(
			body.route_name,
			body.description,
		);

		const httpResponseFormatter = new httpFormatter();
		return httpResponseFormatter.createResponse('Route created successfully');
	}

	@ApiOperation({
		summary: 'Update route',
		description: 'Updates route information by route identifier.',
	})
	@ApiParam({ name: 'id_route', description: 'Route identifier', type: String })
	@ApiBody({ type: RouteRequestDto })
	@ApiOkResponse({ description: 'Standardized response with operation message.' })
	@Patch('/routes/:id_route')
	async updateRoute(
		@Param('id_route') id_route: string,
		@Body() body: RouteRequestDto,
	): Promise<httpControllerResponse> {
		await this.updateRouteCommand.execute(
			id_route,
			body.route_name,
			body.description,
		);

		const httpResponseFormatter = new httpFormatter();
		return httpResponseFormatter.createResponse('Route updated successfully');
	}

	@ApiOperation({
		summary: 'List routes',
		description: 'Returns a collection of routes with optional filters. This endpoint does not use pagination by design.',
	})
	@ApiQuery({ name: 'route_name', required: false, type: String, description: 'Filter by route name.' })
	@ApiQuery({ name: 'route_status', required: false, type: String, description: 'Filter by route status (numeric enum).' })
	@ApiOkResponse({ description: 'Standardized response with routes collection.', type: RouteDto })
	@Get('/routes')
	async listRoutes(
		@Query('route_name') route_name?: string,
		@Query('route_status') route_status?: string,
	): Promise<httpControllerResponse> {
		const parsedRouteStatus = route_status !== undefined ? Number.parseInt(route_status, 10) : undefined;
		const routes: RouteDto[] = await this.listRoutesQuery.execute(route_name, parsedRouteStatus);

		const httpResponseFormatter = new httpFormatter();
		return httpResponseFormatter.createResponse('Routes listed successfully.', routes);
	}

	@ApiOperation({
		summary: 'List route days by route ids',
		description: 'Retrieves route days for the provided route ids. Maximum 100 route ids and no pagination.',
	})
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				id_routes: {
					type: 'array',
					items: { type: 'string', format: 'uuid' },
				},
			},
			required: ['id_routes'],
		},
	})
	@ApiOkResponse({ description: 'Standardized response with route days collection.', type: RouteDayDto })
	@Post('/routes/days/routes/ids')
	async listRouteDaysByRouteIds(
		@Body() body: { id_routes: string[] },
	): Promise<httpControllerResponse> {
		const routeDays: RouteDayDto[] = await this.listRouteDaysQuery.execute(body.id_routes ?? []);

		const httpResponseFormatter = new httpFormatter();
		return httpResponseFormatter.createResponse('Route days listed successfully.', routeDays);
	}

	@ApiOperation({
		summary: 'Retrieve route days by ids',
		description: 'Retrieves specific route days by ids. Limit is 100 and there is no pagination.',
	})
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				id_route_days: {
					type: 'array',
					items: { type: 'string', format: 'uuid' },
				},
			},
			required: ['id_route_days'],
		},
	})
	@ApiOkResponse({ description: 'Standardized response with retrieved route days.', type: RouteDto })
	@Post('/routes/days/ids')
	async retrieveRouteDayByRouteDayId(
		@Body() body: { id_route_days: string[] },
	): Promise<httpControllerResponse> {
		console.log(body)
		const routeDays: RouteDayDto[] = await this.retrieveRouteDayByRouteDayIdQuery.execute(
			body.id_route_days ?? [],
		);

		const httpResponseFormatter = new httpFormatter();
		return httpResponseFormatter.createResponse('Route days retrieved successfully.', routeDays);
	}

	@ApiOperation({
		summary: 'Retrieve route days by user ids',
		description: 'Retrieves all route days assigned to the provided user ids. Maximum 100 ids and no pagination.',
	})
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				id_users: {
					type: 'array',
					items: { type: 'string', format: 'uuid' },
					example: ['53dc3ca4-f9db-4c22-86b6-8f71fc562dc5', '9f3a1e8a-23cc-49e2-8f07-c4f40c1597af'],
				},
			},
			required: ['id_users'],
		},
	})
	@ApiOkResponse({ description: 'Standardized response with assigned route days.', type: RouteDto })
	@Post('/routes/days/users/ids')
	async retrieveRouteDayAsignedToUser(
		@Body() body: { id_users: string[] },
	): Promise<httpControllerResponse> {
		const id_users = body.id_users ?? [];
		const routeDaysAssigned = await this.retrieveAssignedRouteDaysByIdUserQuery.execute(id_users);
		const httpResponseFormatter = new httpFormatter();
		return httpResponseFormatter.createResponse('Route days retrieved successfully', routeDaysAssigned);
	}

	@ApiOperation({
		summary: 'Deactivate route',
		description: 'Deactivates a route by route identifier.',
	})
	@ApiParam({ name: 'id_route', description: 'Route identifier', type: String })
	@ApiOkResponse({ description: 'Standardized response with operation message.' })
	@Patch('/routes/:id_route/deactivate')
	async deactivateRoute(@Param('id_route') id_route: string): Promise<httpControllerResponse> {
		await this.deactivateRouteCommand.execute(id_route);

		const httpResponseFormatter = new httpFormatter();
		return httpResponseFormatter.createResponse('Route deactivated successfully');
	}

	@ApiOperation({
		summary: 'Reactivate route',
		description: 'Reactivates a route by route identifier.',
	})
	@ApiParam({ name: 'id_route', description: 'Route identifier', type: String })
	@ApiOkResponse({ description: 'Standardized response with operation message.' })
	@Patch('/routes/:id_route/reactivate')
	async reactivateRoute(@Param('id_route') id_route: string): Promise<httpControllerResponse> {
		await this.reactivateRouteCommand.execute(id_route);

		const httpResponseFormatter = new httpFormatter();
		return httpResponseFormatter.createResponse('Route reactivated successfully');
	}

		@ApiOperation({
		summary: 'Assign route day to vendor',
		description: `Assigns one route day to a vendor, optionally with an expiration date.
If user don't set an expiration date for a route day assignation, it is considered that
that route day was assigned to the vendor (his default route).`,
	})
	@ApiParam({ name: 'id_route_day', description: 'Route day identifier', type: String })
	@ApiParam({ name: 'id_user', description: 'Vendor user identifier', type: String })
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				expired_at: { type: 'string', format: 'date-time', example: '2026-05-30T17:00:00.000Z' },
			},
		},
	})
	@ApiOkResponse({ description: 'Standardized response with operation message.' })
	@Patch('/routes/days/:id_route_day/assign/:id_user')
	async assignRouteDayToVendor(
		@Param('id_route_day') id_route_day: string,
		@Param('id_user') id_user: string,
		@Body() body: { expired_at?: Date },
	): Promise<httpControllerResponse> {

		await this.assignRouteToVendorCommand.execute(
			id_user,
			id_route_day,
			body ? body.expired_at : undefined,
		);

		const httpResponseFormatter = new httpFormatter();
		return httpResponseFormatter.createResponse('Route day assigned successfully');
	}

	@ApiOperation({
		summary: 'Unassign route days from vendor',
		description: 'Unassigns one or multiple route days from a vendor user.',
	})
	@ApiParam({ name: 'id_user', description: 'Vendor user identifier', type: String })
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				id_route_days: {
					type: 'array',
					items: { type: 'string', format: 'uuid' },
					example: [
						'53dc3ca4-f9db-4c22-86b6-8f71fc562dc5',
						'9f3a1e8a-23cc-49e2-8f07-c4f40c1597af',
					],
				},
			},
			required: ['id_route_days'],
		},
	})
	@ApiOkResponse({ description: 'Standardized response with operation message.' })
	@Patch('/routes/days/unassign/:id_user')
	async unassignRouteDayFromVendor(
		@Param('id_user') id_user: string,
		@Body() body: { id_route_days: string[] },
	): Promise<httpControllerResponse> {
		await this.unassignRouteToVendorCommand.execute(
			id_user,
			body.id_route_days ?? [],
		);

		const httpResponseFormatter = new httpFormatter();
		return httpResponseFormatter.createResponse('Route day unassigned successfully');
	}

	@ApiOperation({
		summary: 'Organize route day',
		description: 'Sets locations order for a route day based on input positions.',
	})
	@ApiParam({ name: 'id_route_day', description: 'Route day identifier', type: String })
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				locations: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							position_in_route: { type: 'number', example: 1 },
							id_location: { type: 'string', format: 'uuid', example: 'f4c9b6fd-3d5a-4f4f-9c5a-5f2c0e2ebc41' },
							id_route_day_location: {
								type: 'string',
								format: 'uuid',
								example: '0f8183df-3b17-4fbf-bf28-c0bf260ee4e1',
							},
						},
						required: ['position_in_route', 'id_location', 'id_route_day_location'],
					},
				},
			},
			required: ['locations'],
		},
	})
	@ApiOkResponse({ description: 'Standardized response with operation message.' })
	@Patch('/routes/days/:id_route_day/organize')
	async organizeRouteDay(
		@Param('id_route_day') id_route_day: string,
		@Body() body: { locations: Array<{ position_in_route: number; id_location: string; id_route_day_location: string }> },
	): Promise<httpControllerResponse> {
		const routeDayLocations = body.locations.map(
			(location) =>
				new RouteDayLocationObjectValue(
					location.position_in_route,
					location.id_location,
					id_route_day,
					location.id_route_day_location,
				),
		);

		await this.organizeRouteDayCommand.execute(id_route_day, routeDayLocations);

		const httpResponseFormatter = new httpFormatter();
		return httpResponseFormatter.createResponse('Route day organized successfully');
	}

	// About route day proposals ----------------------------------------------------
	@ApiOperation({
		summary: 'Create route day proposal',
		description: 'Creates a route day proposal and stores the proposed ordered locations.',
	})
	@ApiBody({ type: CreateRouteDayProposalRequestDto })
	@ApiOkResponse({ description: 'Standardized response with operation message.' })
	@Post('/routes/days/proposals')
	async createRouteDayProposal(
		@Body() body: CreateRouteDayProposalRequestDto,
	): Promise<httpControllerResponse> {
		await this.createRouteDayProposalCommand.execute(
			body.proposal_name,
			body.id_route_day,
			body.locations,
		);

		const httpResponseFormatter = new httpFormatter();
		return httpResponseFormatter.createResponse('Route day proposal created successfully');
	}

	@ApiOperation({
		summary: 'List route day proposals',
		description: 'Returns a paginated list of route day proposals with optional filtering.',
	})
	@ApiQuery({ name: 'limit', required: false, type: String, description: 'Page size (max 100).' })
	@ApiQuery({ name: 'next_item', required: false, type: String, description: 'Opaque cursor for next page.' })
	@ApiQuery({ name: 'proposal_name', required: false, type: String, description: 'Filter by proposal name.' })
	@ApiQuery({ name: 'id_route_day', required: false, type: String, description: 'Filter by route day id.' })
	@ApiOkResponse({ description: 'Standardized paginated response with proposals collection.', type: [RouteDayProposalDto] })
	@Get('/routes/days/proposals')
	async listRouteDayProposals(
		@Query('limit') limit?: string,
		@Query('proposal_name') proposal_name?: string,
		@Query('id_route_day') id_route_day?: string,
		@Query('next_item') next_item?: string,
	): Promise<httpControllerResponse> {
		let parsedLimit: number = 100;
		let next_id: string | undefined = undefined;
		let next_date: string | undefined = undefined;

		const httpRequestFormatter = new httpFormatter();
		const httpResponseFormatter = new httpFormatter();

		if (next_item) {
			const paginationInformation = httpRequestFormatter.decodingNextItemForPagination(next_item);
			next_id = paginationInformation.id;
			if (paginationInformation.created_at) next_date = paginationInformation.created_at;
		}

		if (limit) parsedLimit = Number.parseInt(limit, 10);

		const proposals: RouteDayProposalDto[] = await this.listRouteDaysProposalsQuery.execute(
			parsedLimit,
			proposal_name,
			id_route_day,
			next_date,
			next_id,
		);

		return httpResponseFormatter.createResponse(
			'Route day proposals listed successfully.',
			proposals,
			parsedLimit,
			'id_route_day_proposal',
			'created_at',
		);
	}

	@ApiOperation({
		summary: 'Retrieve route day proposals by ids',
		description: 'Retrieves specific route day proposals by ids. Limit is 100 and there is no pagination.',
	})
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				id_route_day_proposals: {
					type: 'array',
					items: { type: 'string', format: 'uuid' },
				},
			},
			required: ['id_route_day_proposals'],
		},
	})
	@ApiOkResponse({ description: 'Standardized response with retrieved proposals.', type: [RouteDayProposalDto] })
	@Post('/routes/days/proposals/ids')
	async retrieveRouteDayProposalsById(
		@Body() body: { id_route_day_proposals: string[] },
	): Promise<httpControllerResponse> {
		const proposals = await this.retrieveRouteDaysProposalsByIdProposalQuery.execute(
			body.id_route_day_proposals ?? [],
		);

		const httpResponseFormatter = new httpFormatter();
		return httpResponseFormatter.createResponse('Route day proposals retrieved successfully.', proposals);
	}

	@ApiOperation({
		summary: 'Update route day proposal',
		description: 'Updates proposal name and/or proposal locations.',
	})
	@ApiParam({ name: 'id_route_day_proposal', description: 'Route day proposal identifier', type: String })
	@ApiBody({ type: UpdateRouteDayProposalRequestDto })
	@ApiOkResponse({ description: 'Standardized response with operation message.' })
	@Patch('/routes/days/proposals/:id_route_day_proposal')
	async updateRouteDayProposal(
		@Param('id_route_day_proposal') id_route_day_proposal: string,
		@Body() body: UpdateRouteDayProposalRequestDto,
	): Promise<httpControllerResponse> {
		await this.updateRouteDayProposalCommand.execute(
			id_route_day_proposal,
			body.proposal_name,
			body.locations,
		);

		const httpResponseFormatter = new httpFormatter();
		return httpResponseFormatter.createResponse('Route day proposal updated successfully');
	}

	@ApiOperation({
		summary: 'Delete route day proposal',
		description: 'Deletes a route day proposal and its proposal locations.',
	})
	@ApiParam({ name: 'id_route_day_proposal', description: 'Route day proposal identifier', type: String })
	@ApiOkResponse({ description: 'Standardized response with operation message.' })
	@Patch('/routes/days/proposals/:id_route_day_proposal/delete')
	async deleteRouteDayProposal(
		@Param('id_route_day_proposal') id_route_day_proposal: string,
	): Promise<httpControllerResponse> {
		await this.deleteRouteDayProposalCommand.execute(id_route_day_proposal);

		const httpResponseFormatter = new httpFormatter();
		return httpResponseFormatter.createResponse('Route day proposal deleted successfully');
	}

}