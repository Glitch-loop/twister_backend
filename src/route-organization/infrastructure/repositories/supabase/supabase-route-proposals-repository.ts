import { Injectable } from '@nestjs/common';

import { RouteDayLocationProposalModel } from '@/src/route-organization/application/models/route-day-location-proposal.model';
import { RouteDayProposalModel } from '@/src/route-organization/application/models/route-day-proposal.model';
import { Mapper } from '@/src/route-organization/application/mappers/entity-model.mapper';
import { RouteDayProposalEntity } from '@/src/route-organization/core/entities/route-day-proposal.entity';
import { RouteProposalRepository } from '@/src/route-organization/core/interfaces/route-proposals.repository';
import { RouteDayLocationObjectValue } from '@/src/route-organization/core/value-objects/route-day-location.object-value';
import { SupabaseDataSource } from '@/src/infrastructure/datasources/supabase-data-source';

@Injectable()
export class SupabaseRouteProposalsRepository implements RouteProposalRepository {
  constructor(
    private readonly supabaseDataSource: SupabaseDataSource,
    private readonly mapper: Mapper,
  ) {}

  private get supabase() {
    return this.supabaseDataSource.getClient();
  }

  async createRouteDayProposal(
    routeDayProposal: RouteDayProposalEntity,
    routeDayLocationProposals: RouteDayLocationObjectValue[],
  ): Promise<void> {
    try {
      const routeDayProposalModel: RouteDayProposalModel = this.mapper.toModel(routeDayProposal);

      const { error: routeDayProposalError } = await this.supabase
        .from('route_day_proposals')
        .insert(routeDayProposalModel);

      if (routeDayProposalError) {
        throw new Error(`Failed to insert route day proposal: ${routeDayProposalError.message}`);
      }

      if (routeDayLocationProposals.length === 0) {
        return;
      }

      const routeDayLocationProposalModels: RouteDayLocationProposalModel[] = routeDayLocationProposals.map((location) => {
        if (!location.id_route_day_location_proposal) {
          throw new Error('Missing id_route_day_location_proposal in route day proposal location payload.');
        }

        if (location.id_owner !== routeDayProposal.id_route_day_proposal) {
          throw new Error(
            `Invalid route day proposal location owner id ${location.id_owner}. Expected ${routeDayProposal.id_route_day_proposal}.`,
          );
        }

        return {
          id_route_day_location_proposal: location.id_route_day_location_proposal,
          position_in_route: location.position_in_route,
          id_route_day_proposal: location.id_owner,
          id_location: location.id_location,
        };
      });

      const { error: routeDayLocationProposalError } = await this.supabase
        .from('route_day_location_proposals')
        .insert(routeDayLocationProposalModels);

      if (routeDayLocationProposalError) {
        throw new Error(`Failed to insert route day location proposals: ${routeDayLocationProposalError.message}`);
      }
    } catch (error) {
      throw new Error(
        `Failed to create route day proposal: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async updateRouteDayProposal(
    idRouteDayProposal: string,
    updatedData: Partial<RouteDayProposalEntity>,
    routeDayLocationProposals?: RouteDayLocationObjectValue[],
  ): Promise<void> {
    try {
      const payload: Partial<RouteDayProposalModel> = {
        ...(updatedData.proposal_name !== undefined && { proposal_name: updatedData.proposal_name }),
        ...(updatedData.id_route_day !== undefined && { id_route_day: updatedData.id_route_day }),
      };

      if (Object.keys(payload).length > 0) {
        const { error } = await this.supabase
          .from('route_day_proposals')
          .update(payload)
          .eq('id_route_day_proposal', idRouteDayProposal);

        if (error) {
          throw new Error(`Failed to update route day proposal: ${error.message}`);
        }
      }

      if (!routeDayLocationProposals) {
        return;
      }

      const { error: deleteLocationsError } = await this.supabase
        .from('route_day_location_proposals')
        .delete()
        .eq('id_route_day_proposal', idRouteDayProposal);

      if (deleteLocationsError) {
        throw new Error(`Failed to clear route day location proposals: ${deleteLocationsError.message}`);
      }

      if (routeDayLocationProposals.length === 0) {
        return;
      }

      const routeDayLocationProposalModels: RouteDayLocationProposalModel[] = routeDayLocationProposals.map((location) => {
        if (!location.id_route_day_location_proposal) {
          throw new Error('Missing id_route_day_location_proposal in route day proposal location payload.');
        }

        if (location.id_owner !== idRouteDayProposal) {
          throw new Error(
            `Invalid route day proposal location owner id ${location.id_owner}. Expected ${idRouteDayProposal}.`,
          );
        }

        return {
          id_route_day_location_proposal: location.id_route_day_location_proposal,
          position_in_route: location.position_in_route,
          id_route_day_proposal: location.id_owner,
          id_location: location.id_location,
        };
      });

      const { error: insertLocationsError } = await this.supabase
        .from('route_day_location_proposals')
        .insert(routeDayLocationProposalModels);

      if (insertLocationsError) {
        throw new Error(`Failed to insert route day location proposals: ${insertLocationsError.message}`);
      }
    } catch (error) {
      throw new Error(
        `Failed to update route day proposal: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async deleteRouteDayProposal(idRouteDayProposal: string): Promise<void> {
    try {
      const { error: deleteLocationsError } = await this.supabase
        .from('route_day_location_proposals')
        .delete()
        .eq('id_route_day_proposal', idRouteDayProposal);

      if (deleteLocationsError) {
        throw new Error(`Failed to delete route day proposal locations: ${deleteLocationsError.message}`);
      }

      const { error: deleteProposalError } = await this.supabase
        .from('route_day_proposals')
        .delete()
        .eq('id_route_day_proposal', idRouteDayProposal);

      if (deleteProposalError) {
        throw new Error(`Failed to delete route day proposal: ${deleteProposalError.message}`);
      }
    } catch (error) {
      throw new Error(
        `Failed to delete route day proposal: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async listRouteDayProposals(
    limit: number,
    lastCreatedAt?: string,
    lastIdRouteDayProposal?: string,
    proposalName?: string,
    idRouteDay?: string,
  ): Promise<RouteDayProposalEntity[]> {
    try {
      let query = this.supabase
        .from('route_day_proposals')
        .select('*')
        .order('created_at', { ascending: true })
        .order('id_route_day_proposal', { ascending: true })
        .limit(limit);

      if (lastCreatedAt) {
        query = query.gt('created_at', lastCreatedAt);
      }

      if (lastIdRouteDayProposal) {
        query = query.neq('id_route_day_proposal', lastIdRouteDayProposal);
      }

      if (proposalName) {
        query = query.ilike('proposal_name', `%${proposalName}%`);
      }

      if (idRouteDay) {
        query = query.eq('id_route_day', idRouteDay);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to list route day proposals: ${error.message}`);
      }

      return ((data ?? []) as RouteDayProposalModel[]).map((proposal) => this.mapper.toDomainObject(proposal));
    } catch (error) {
      throw new Error(
        `Failed to list route day proposals: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async retrieveRouteDayProposalById(idRouteDayProposals: string[]): Promise<RouteDayProposalEntity[]> {
    if (idRouteDayProposals.length === 0) {
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from('route_day_proposals')
        .select('*')
        .in('id_route_day_proposal', idRouteDayProposals);

      if (error) {
        throw new Error(`Failed to retrieve route day proposals by id: ${error.message}`);
      }

      return ((data ?? []) as RouteDayProposalModel[]).map((proposal) => this.mapper.toDomainObject(proposal));
    } catch (error) {
      throw new Error(
        `Failed to retrieve route day proposals by id: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async retrieveRouteDayLocationProposalsByRouteDayProposalId(
    idRouteDayProposals: string[],
  ): Promise<RouteDayLocationObjectValue[]> {
    if (idRouteDayProposals.length === 0) {
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from('route_day_location_proposals')
        .select('*')
        .in('id_route_day_proposal', idRouteDayProposals)
        .order('position_in_route', { ascending: true });

      if (error) {
        throw new Error(`Failed to retrieve route day location proposals by proposal id: ${error.message}`);
      }

      return ((data ?? []) as RouteDayLocationProposalModel[]).map((model) => this.mapper.toDomainObject(model));
    } catch (error) {
      throw new Error(
        `Failed to retrieve route day location proposals by proposal id: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
