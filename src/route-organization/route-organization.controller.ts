// Libraries
import { Body, Controller, Param, Patch, Post } from '@nestjs/common';

// DTOs
import type { RouteDto } from '@/src/route-organization/application/dtos/route.dto';

// Commands
import { AssignRouteToVendorCommand } from '@/src/route-organization/application/commands/assign-route-to-vendor.command';
import { CreateNewRouteCommand } from '@/src/route-organization/application/commands/create-new-route.command';
import { DeactivateRouteCommand } from './application/commands/deactivate-route.command';
import { UpdateRouteCommand } from '@/src/route-organization/application/commands/update-route.command';
import { ReactivateRouteCommand } from '@/src/route-organization/application/commands/reactivate-route.command';
import { UnassignRouteToVendorCommand } from '@/src/route-organization/application/commands/unassign-route-to-vendor.command';

@Controller('route-organization')
export class RouteOrganizationController {
	constructor(
		private readonly assignRouteToVendorCommand: AssignRouteToVendorCommand,
		private readonly createNewRouteCommand: CreateNewRouteCommand,
		private readonly deactivateRouteCommand: DeactivateRouteCommand,
		private readonly updateRouteCommand: UpdateRouteCommand,
		private readonly reactivateRouteCommand: ReactivateRouteCommand,
		private readonly unassignRouteToVendorCommand: UnassignRouteToVendorCommand,
	) {}

	@Patch('/routes/days/:id_route_day/assign/:id_user')
	async assignRouteDayToVendor(
		@Param('id_route_day') id_route_day: string,
		@Param('id_user') id_user: string,
		@Body() body: { expired_at?: Date; id_assigned_route_day?: string },
	) {
		await this.assignRouteToVendorCommand.execute(
			id_user,
			id_route_day,
			body.expired_at,
			body.id_assigned_route_day,
		);

		return { message: 'Route day assigned successfully' };
	}

	@Post('/routes')
	async createRoute(@Body() body: Partial<RouteDto>) {
		await this.createNewRouteCommand.execute(
			body.route_name!,
			body.description,
		);

		return { message: 'Route created successfully' };
	}

	@Patch('/routes/:id_route')
	async updateRoute(
		@Param('id_route') id_route: string,
		@Body() body: Partial<RouteDto>,
	) {
		await this.updateRouteCommand.execute(
			id_route,
			body.route_name,
			body.description,
		);

		return { message: 'Route updated successfully' };
	}

	@Patch('/routes/:id_route/deactivate')
	async deactivateRoute(@Param('id_route') id_route: string) {
		await this.deactivateRouteCommand.execute(id_route);
		return { message: 'Route deactivated successfully' };
	}

	@Patch('/routes/:id_route/reactivate')
	async reactivateRoute(@Param('id_route') id_route: string) {
		await this.reactivateRouteCommand.execute(id_route);
		return { message: 'Route reactivated successfully' };
	}

	@Patch('/routes/days/unassign/:id_user')
	async unassignRouteDayFromVendor(
		@Param('id_user') id_user: string,
		@Body() body: { id_route_days: string[] },
	) {
		await this.unassignRouteToVendorCommand.execute(
			id_user,
			body.id_route_days ?? [],
		);

		return { message: 'Route day unassigned successfully' };
	}
}