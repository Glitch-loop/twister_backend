// Libraries
import { Body, Controller, Param, Patch, Post } from '@nestjs/common';

// DTOs
import type { RouteDto } from '@/src/route-organization/application/dtos/route.dto';

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
	) {}

	@Post('/routes')
	async createRoute(@Body() body: Partial<RouteDto>): Promise<httpControllerResponse> {
		await this.createNewRouteCommand.execute(
			body.route_name!,
			body.description,
		);

		const httpResponseFormatter = new httpFormatter();
		return httpResponseFormatter.createResponse('Route created successfully');
	}

	@Patch('/routes/days/:id_route_day/assign/:id_user')
	async assignRouteDayToVendor(
		@Param('id_route_day') id_route_day: string,
		@Param('id_user') id_user: string,
		@Body() body: { expired_at?: Date },
	): Promise<httpControllerResponse> {
		await this.assignRouteToVendorCommand.execute(
			id_user,
			id_route_day,
			body.expired_at,
		);

		const httpResponseFormatter = new httpFormatter();
		return httpResponseFormatter.createResponse('Route day assigned successfully');
	}


	@Patch('/routes/:id_route')
	async updateRoute(
		@Param('id_route') id_route: string,
		@Body() body: Partial<RouteDto>,
	): Promise<httpControllerResponse> {
		await this.updateRouteCommand.execute(
			id_route,
			body.route_name,
			body.description,
		);

		const httpResponseFormatter = new httpFormatter();
		return httpResponseFormatter.createResponse('Route updated successfully');
	}

	@Patch('/routes/:id_route/deactivate')
	async deactivateRoute(@Param('id_route') id_route: string): Promise<httpControllerResponse> {
		await this.deactivateRouteCommand.execute(id_route);

		const httpResponseFormatter = new httpFormatter();
		return httpResponseFormatter.createResponse('Route deactivated successfully');
	}

	@Patch('/routes/:id_route/reactivate')
	async reactivateRoute(@Param('id_route') id_route: string): Promise<httpControllerResponse> {
		await this.reactivateRouteCommand.execute(id_route);

		const httpResponseFormatter = new httpFormatter();
		return httpResponseFormatter.createResponse('Route reactivated successfully');
	}

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
					undefined,
				),
		);

		await this.organizeRouteDayCommand.execute(id_route_day, routeDayLocations);

		const httpResponseFormatter = new httpFormatter();
		return httpResponseFormatter.createResponse('Route day organized successfully');
	}
}