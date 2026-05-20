// Libraries
import { Injectable } from '@nestjs/common';

// Interfaces
import { RouteRepository } from '@/src/route-organization/core/interfaces/route.repository';

// Entities
import { RouteEntity } from '@/src/route-organization/core/entities/route.entity';
import { RouteDayEntity } from '@/src/route-organization/core/entities/route-day.entity';
import { AssignedRouteDayEntity } from '@/src/route-organization/core/entities/assigned-route-day.entity';

// Value Objects
import { RouteDayLocationObjectValue } from '@/src/route-organization/core/value-objects/route-day-location.object-value';

// Datasources
import { SupabaseDataSource } from '@/src/infrastructure/datasources/supabase-data-source';

// Models
import { RouteModel } from '@/src/application/models/route.model';
import { RouteDayModel } from '@/src/route-organization/application/models/route-day.model';

// Mappers
import { Mapper } from '@/src/route-organization/application/mappers/entity-model.mapper';

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
      
      const routeDayResponse = await this.supabase
        .from('route_days')
        .insert(routeDayModels);
      
      if (routeDayResponse.error) {
        throw new Error(`Failed to insert route days: ${routeDayResponse.error.message}`);
      }

    } catch (error) {
      throw new Error(
        `Failed to insert route day locations: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async updateRoute(routeEntity: RouteEntity): Promise<void> {
    try {
      const routeModel: RouteModel = this.mapper.toModel(routeEntity);

      const { error } = await this.supabase
        .from('routes')
        .update(routeModel)
        .eq('id_route', routeModel.id_route);
      
      if (error) {
        throw new Error(`Failed to update route: ${error.message}`);
      }

    } catch (error) {
      throw new Error(
        `Failed to update route: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async assignRouteDayToVendor(assignedRouteDayEntity: AssignedRouteDayEntity): Promise<void> {
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

  async unassignRouteDayToVendor(idVendor: string, idRouteDay: string[]): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('assigned_route_days')
        .delete()
        .eq('id_vendor', idVendor)
        .in('id_route_day', idRouteDay);
      
      if (error) {
        throw new Error(`Failed to unassign route day from vendor: ${error.message}`);
      }

    } catch (error) {
      throw new Error(
        `Failed to unassign route day from vendor: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
