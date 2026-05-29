// Libraries
import { Injectable } from '@nestjs/common';

// Interfaces
import { RouteRepository } from '@/src/route-organization/core/interfaces/route.repository';

// Entities
import { RouteEntity } from '@/src/route-organization/core/entities/route.entity';
import { RouteDayEntity } from '@/src/route-organization/core/entities/route-day.entity';
import { AssignedRouteDayEntity } from '@/src/route-organization/core/entities/assigned-route-day.entity';
import { DayEntity } from '@/src/route-organization/core/entities/day.entity';
import { OrganizationStrategyEntity } from '@/src/route-organization/core/entities/organization-strategy.entity';

// Value Objects
import { RouteDayLocationObjectValue } from '@/src/route-organization/core/value-objects/route-day-location.object-value';

// Datasources
import { SupabaseDataSource } from '@/src/shared/infrastructure/datasources/supabase-data-source';

// Models
import { RouteModel } from '@/src/route-organization/application/models/route.model';
import { DayModel } from '@/src/route-organization/application/models/day.model';
import { RouteDayModel } from '@/src/route-organization/application/models/route-day.model';
import { OrganizationStrategyModel } from '@/src/route-organization/application/models/organization-strategy.model';

// Mappers
import { Mapper } from '@/src/route-organization/application/mappers/entity-model.mapper';
import { AssignedRouteDayModel } from '@/src/route-organization/application/models/assigned-route-day.model';
import { RouteDayLocationModel } from '@/src/route-organization/application/models/route-day-location.model';

@Injectable()
export class SupabaseRouteRepository implements RouteRepository {
  constructor(
    private readonly supabaseDataSource: SupabaseDataSource,
    private readonly mapper: Mapper,
  ) {}

  private get supabase() {
    return this.supabaseDataSource.getClient();
  }

  async deleteRouteDayLocations(id_route_day: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('route_day_locations')
        .delete()
        .eq('id_route_day', id_route_day);

      if (error) {
        throw new Error(`Failed to delete route day locations: ${error.message}`);
      }
    } catch (error) {
      throw new Error(
        `Failed to delete route day locations: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async insertRouteDayLocations(routeDayLocations: RouteDayLocationObjectValue[]): Promise<void> {
    if (routeDayLocations.length === 0) {
      return;
    }

    try {
      const routeDayLocationsToInsert = routeDayLocations.map((location) => {
        if (!location.id_route_day_location && !location.id_owner) {
          throw new Error('Invalid route day location payload: missing owner id');
        }

        return {
          ...(location.id_route_day_location
            ? { id_route_day_location: location.id_route_day_location }
            : {}),
          position_in_route: location.position_in_route,
          id_location: location.id_location,
          id_route_day: location.id_owner,
        };
      });

      const { error } = await this.supabase
        .from('route_day_locations')
        .insert(routeDayLocationsToInsert);

      if (error) {
        throw new Error(`Failed to insert route day locations: ${error.message}`);
      }
    } catch (error) {
      throw new Error(
        `Failed to insert route day locations: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async createRoute(routeEntity: RouteEntity, routeDays: RouteDayEntity[]): Promise<void> {
    try {
      const routeModel: RouteModel = this.mapper.toModel(routeEntity);
      const routeDayModels: RouteDayModel[] = routeDays.map((routeDay) => this.mapper.toModel(routeDay));
      
      const routeResponse = await this.supabase
        .from('routes')
        .insert(routeModel);
       
      if (routeResponse.error) {
        throw new Error(`Failed to insert route: ${routeResponse.error.message}`);
      }

      if (routeDayModels.length > 0) {
        const routeDayResponse = await this.supabase
          .from('route_days')
          .insert(routeDayModels);

        if (routeDayResponse.error) {
          throw new Error(`Failed to insert route days: ${routeDayResponse.error.message}`);
        }
      }
    } catch (error) {
      throw new Error(
        `Failed to insert route day locations: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async updateRoute(idRoute: string, updatedData: Partial<RouteEntity>): Promise<void> {
    try {
      const payload: Partial<RouteModel> = {
        ...(updatedData.route_name !== undefined && { route_name: updatedData.route_name }),
        ...(updatedData.route_status !== undefined && { route_status: updatedData.route_status }),
        ...(updatedData.description !== undefined && { description: updatedData.description }),
      };

      if (Object.keys(payload).length === 0) {
        return;
      }

      const { error } = await this.supabase
        .from('routes')
        .update(payload)
        .eq('id_route', idRoute);
      
      if (error) {
        throw new Error(`Failed to update route: ${error.message}`);
      }

    } catch (error) {
      throw new Error(
        `Failed to update route: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async createRouteDayAssignation(assignedRouteDayEntity: AssignedRouteDayEntity): Promise<void> {
    try {
      const assignedRouteDayModel = this.mapper.toModel(assignedRouteDayEntity);
      

      const { error } = await this.supabase
        .from('assigned_route_days')
        .insert(assignedRouteDayModel);
      
      if (error) {
        throw new Error(`Failed to assign route day to vendor: ${error.message}`);
      }

    } catch (error) {
      throw new Error(
        `Failed to assign route day to vendor: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async removeRouteDayAssignation(assignedRouteDayEntity: AssignedRouteDayEntity[]): Promise<void> {
    try {

      const assignedRouteDayModel:AssignedRouteDayModel[] = assignedRouteDayEntity.map((assignation) => { return this.mapper.toModel(assignation); });

      const assignationToDelete: string[] = assignedRouteDayModel.map((assingation) => { return assingation.id_assigned_route_day})

      const { error } = await this.supabase
        .from('assigned_route_days')
        .delete()
        .in('id_assigned_route_day', assignationToDelete);
      
      if (error) {
        throw new Error(`Failed to unassign route day from vendor: ${error.message}`);
      }

    } catch (error) {
      throw new Error(
        `Failed to unassign route day from vendor: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async createRouteDay(routeDayEntity: RouteDayEntity): Promise<void> {
    try {
      const routeDayModel: RouteDayModel = this.mapper.toModel(routeDayEntity);

      const { error } = await this.supabase
        .from('route_days')
        .insert(routeDayModel);

      if (error) {
        throw new Error(`Failed to create route day: ${error.message}`);
      }
    } catch (error) {
      throw new Error(
        `Failed to create route day: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async listOrganizationStrategies(): Promise<OrganizationStrategyEntity[]> {
    try {
      const { data, error } = await this.supabase
        .from('organization_strategies')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        throw new Error(`Failed to list organization strategies: ${error.message}`);
      }

      return ((data ?? []) as OrganizationStrategyModel[]).map(
        (strategyModel) => new OrganizationStrategyEntity(
          strategyModel.id_organization_strategy,
          strategyModel.organization_strategy_name,
          strategyModel.is_used,
          new Date(strategyModel.created_at),
        ),
      );
    } catch (error) {
      throw new Error(
        `Failed to list organization strategies: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async selectOrganizationStrategy(idOrganizationStratgy: string): Promise<void> {
    try {
      const { error: resetError } = await this.supabase
        .from('organization_strategies')
        .update({ is_used: 0 })
        .not('id_organization_strategy', 'is', null);

      if (resetError) {
        throw new Error(`Failed to reset organization strategy selection: ${resetError.message}`);
      }

      const { data, error } = await this.supabase
        .from('organization_strategies')
        .update({ is_used: 1 })
        .eq('id_organization_strategy', idOrganizationStratgy)
        .select('id_organization_strategy')
        .maybeSingle();

      if (error) {
        throw new Error(`Failed to select organization strategy: ${error.message}`);
      }

      if (!data) {
        throw new Error(`Organization strategy with id ${idOrganizationStratgy} was not found.`);
      }
    } catch (error) {
      throw new Error(
        `Failed to select organization strategy: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async listDays(): Promise<DayEntity[]> {
    try {
      const { data, error } = await this.supabase
        .from('days')
        .select('*')
        .order('order_to_show', { ascending: true });

      if (error) {
        throw new Error(`Failed to list days: ${error.message}`);
      }

      return ((data ?? []) as DayModel[]).map((dayModel) =>
        this.mapper.toDomainObject(dayModel),
      );
    } catch (error) {
      throw new Error(
        `Failed to list days: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async listRoutes(route_name?: string, route_status?: number): Promise<RouteEntity[]> {
    try {
      let query = this.supabase
        .from('routes')
        .select('*')
        .order('route_name', { ascending: true });

      if (route_name) {
        query = query.ilike('route_name', `%${route_name}%`);
      }

      if (route_status !== undefined) {
        query = query.eq('route_status', route_status);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to list routes: ${error.message}`);
      }

      return ((data ?? []) as RouteModel[]).map((routeModel) =>
        this.mapper.toDomainObject(routeModel),
      );
    } catch (error) {
      throw new Error(
        `Failed to list routes: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async retrieveRoutesByRouteId(idRetrieveRoutes: string[]): Promise<RouteEntity[]> {
    if (idRetrieveRoutes.length === 0) {
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from('routes')
        .select('*')
        .in('id_route', idRetrieveRoutes);

      if (error) {
        throw new Error(`Failed to retrieve routes: ${error.message}`);
      }

      return ((data ?? []) as RouteModel[]).map((routeModel) =>
        this.mapper.toDomainObject(routeModel),
      );
    } catch (error) {
      throw new Error(
        `Failed to retrieve routes: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async retrieveRouteDay(idRetrieveRouteDays: string[]): Promise<RouteDayEntity[]> {
    console.log("IDS: ", idRetrieveRouteDays)
    if (idRetrieveRouteDays.length === 0) {
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from('route_days')
        .select('*')
        .in('id_route_day', idRetrieveRouteDays);
      
      if (error) {
        throw new Error(`Failed to retrieve route days: ${error.message}`);
      }

      return this.buildRouteDay(((data ?? []) as RouteDayModel[]));
    } catch (error) {
      throw new Error(
        `Failed to retrieve route days: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async retrieveRouteDayByRouteId(idRoutes: string[]): Promise<RouteDayEntity[]> {
    if (idRoutes.length === 0) {
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from('route_days')
        .select('*')
        .in('id_route', idRoutes);

      if (error) {
        throw new Error(`Failed to retrieve route days by route id: ${error.message}`);
      }

      return this.buildRouteDay(((data ?? []) as RouteDayModel[]));

    } catch (error) {
      throw new Error(
        `Failed to retrieve route day by route id: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async retrieveRouteDayByUserId(idUsers: string[]): Promise<RouteDayEntity[]> {
    if (idUsers.length === 0) {
      return [];
    }

    try {
      const { data: assignments, error: assignmentsError } = await this.supabase
        .from('assigned_route_days')
        .select('id_route_day')
        .in('id_user', idUsers);

      if (assignmentsError) {
        throw new Error(`Failed to retrieve assigned route days by user id: ${assignmentsError.message}`);
      }

      const routeDayIds = [...new Set((assignments ?? []).map((assignment) => assignment.id_route_day as string))];

      if (routeDayIds.length === 0) {
        return [];
      }

      const { data, error } = await this.supabase
        .from('route_days')
        .select('*')
        .in('id_route_day', routeDayIds);

      if (error) {
        throw new Error(`Failed to retrieve route days for user assignments: ${error.message}`);
      }

      return this.buildRouteDay(((data ?? []) as RouteDayModel[]));
    } catch (error) {
      throw new Error(
        `Failed to retrieve route day by user id: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private async buildRouteDay(routeDays: RouteDayModel[]): Promise<RouteDayEntity[]> {
    if (routeDays.length === 0) {
      return [];
    } 

    const routeDaysId: string[] = routeDays.map((routeDay) => routeDay.id_route_day);
    const routeDayLocationsMap: Map<string, RouteDayLocationModel[]> = new Map();

    const routeDayLocationModels: RouteDayLocationModel[] = await this.retrieveRouteDayLocations(routeDaysId);

    for (const routeDayLocationModel of routeDayLocationModels) {
      const locations = routeDayLocationsMap.get(routeDayLocationModel.id_route_day) ?? [];
      locations.push(routeDayLocationModel);
      routeDayLocationsMap.set(routeDayLocationModel.id_route_day, locations);
    }

    return routeDays.map(
      (routeDay) => this.mapper.toDomainObject(routeDay, routeDayLocationsMap.get(routeDay.id_route_day) ?? []),
    );
  }

  private async retrieveRouteDayLocations(idRouteDays: string[]): Promise<RouteDayLocationModel[]> {
    if (idRouteDays.length === 0) {
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from('route_day_locations')
        .select('*')
        .in('id_route_day', idRouteDays);

      if (error) {
        throw new Error(`Failed to retrieve route days locations by route day id: ${error.message}`);
      }

      return ((data ?? []) as RouteDayLocationModel[]);

    } catch (error) {
      throw new Error(
        `Failed to retrieve route days locations by route day id: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async retrieveRouteDayAssignaments(idRouteDays: string[]): Promise<AssignedRouteDayEntity[]> {
    if (idRouteDays.length === 0) {
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from('assigned_route_days')
        .select('*')
        .in('id_route_day', idRouteDays);

      if (error) {
        throw new Error(`Failed to retrieve route days locations by route day id: ${error.message}`);
      }
      return data.map((assignation:AssignedRouteDayModel) => this.mapper.toDomainObject(assignation));

    } catch (error) {
      throw new Error(
        `Failed to retrieve route days locations by route day id: ${error instanceof Error ? error.message : String(error)}`,
      );
    }    
  }
}
