 
// Libraries
import { Injectable } from '@nestjs/common';

// Enums

// Dtos

// Entities
import { AssignedRouteDayEntity } from '@/src/route-organization/core/entities/assigned-route-day.entity';
import { DayEntity } from '@/src/route-organization/core/entities/day.entity';
import { RouteEntity } from '@/src/route-organization/core/entities/route.entity';
import { RouteDayProposalEntity } from '@/src/route-organization/core/entities/route-day-proposal.entity';
import { RouteDayEntity } from '@/src/route-organization/core/entities/route-day.entity';

// Object values
import { RouteDayLocationObjectValue } from '@/src/route-organization/core/value-objects/route-day-location.object-value';

// Models
import { AssignedRouteDayModel } from '@/src/route-organization/application/models/assigned-route-day.model';
import { DayModel } from '@/src/route-organization/application/models/day.model';
import { RouteModel } from '@/src/route-organization/application/models/route.model';
import { RouteDayLocationProposalModel } from '@/src/route-organization/application/models/route-day-location-proposal.model';
import { RouteDayLocationModel } from '@/src/route-organization/application/models/route-day-location.model';
import { RouteDayProposalModel } from '@/src/route-organization/application/models/route-day-proposal.model';
import { RouteDayModel } from '@/src/route-organization/application/models/route-day.model';

// Dtos guards

// Entities guards
import { isAssignedRouteDayEntity } from '@/src/route-organization/application/guards/entities/assigned-route-day.guard';
import { isDayEntity } from '@/src/route-organization/application/guards/entities/day.guard';
import { isRouteEntity } from '@/src/route-organization/application/guards/entities/route.guard';
import { isRouteDayProposalEntity } from '@/src/route-organization/application/guards/entities/route-day-proposal.guard';
import { isRouteDayEntity } from '@/src/route-organization/application/guards/entities/route-day.guard';

// Models guards
import { isAssignedRouteDayModel } from '@/src/route-organization/application/guards/models/assigned-route-day.guard';
import { isDayModel } from '@/src/route-organization/application/guards/models/day.guard';
import { isRouteModel } from '@/src/route-organization/application/guards/models/route.guard';
import { isRouteDayLocationProposalModel } from '@/src/route-organization/application/guards/models/route-day-location-proposal.guard';
import { isRouteDayLocationModel } from '@/src/route-organization/application/guards/models/route-day-location.guard';
import { isRouteDayProposalModel } from '@/src/route-organization/application/guards/models/route-day-proposal.guard';
import { isRouteDayModel } from '@/src/route-organization/application/guards/models/route-day.guard';

@Injectable()
export class Mapper {
  constructor() {}

  // ==================== OVERLOADED FUNCTIONS FOR MAPPING ====================
  // toDomainObject overloads
  toDomainObject(model: AssignedRouteDayModel): AssignedRouteDayEntity;
  toDomainObject(model: DayModel): DayEntity;
  toDomainObject(model: RouteModel): RouteEntity;
  toDomainObject(model: RouteDayLocationProposalModel): RouteDayLocationObjectValue;
  toDomainObject(model: RouteDayLocationModel): RouteDayLocationObjectValue;
  toDomainObject(model: RouteDayProposalModel): RouteDayProposalEntity;
  toDomainObject(model: RouteDayModel): RouteDayEntity;
  toDomainObject(
    model:
      | AssignedRouteDayModel
      | DayModel
      | RouteModel
      | RouteDayLocationProposalModel
      | RouteDayLocationModel
      | RouteDayProposalModel
      | RouteDayModel,
  ):
    | AssignedRouteDayEntity
    | DayEntity
    | RouteEntity
    | RouteDayLocationObjectValue
    | RouteDayProposalEntity
    | RouteDayEntity {
    if (isAssignedRouteDayModel(model)) {
      return this.assignedRouteDayModelToDomainObject(model);
    }

    if (isDayModel(model)) {
      return this.dayModelToDomainObject(model);
    }

    if (isRouteModel(model)) {
      return this.routeModelToDomainObject(model);
    }

    if (isRouteDayLocationProposalModel(model)) {
      return this.routeDayLocationProposalModelToDomainObject(model);
    }

    if (isRouteDayLocationModel(model)) {
      return this.routeDayLocationModelToDomainObject(model);
    }

    if (isRouteDayProposalModel(model)) {
      return this.routeDayProposalModelToDomainObject(model);
    }

    if (isRouteDayModel(model)) {
      return this.routeDayModelToDomainObject(model);
    }

    throw new Error('Invalid input for mapping to domain object');
  }

  // toModel overloads
  toModel(domainObject: RouteDayEntity): RouteDayModel;
  toModel(domainObject: AssignedRouteDayEntity): AssignedRouteDayModel;
  toModel(domainObject: DayEntity): DayModel;
  toModel(domainObject: RouteEntity): RouteModel;
  toModel(domainObject: RouteDayLocationObjectValue): RouteDayLocationProposalModel | RouteDayLocationModel;
  toModel(domainObject: RouteDayProposalEntity): RouteDayProposalModel;
  toModel(
    domainObject:
      | RouteDayEntity
      | AssignedRouteDayEntity
      | DayEntity
      | RouteEntity
      | RouteDayLocationObjectValue
      | RouteDayProposalEntity
  ):
    | AssignedRouteDayModel
    | DayModel
    | RouteModel
    | RouteDayLocationProposalModel
    | RouteDayLocationModel
    | RouteDayProposalModel
    | RouteDayModel {
    if (isAssignedRouteDayEntity(domainObject)) {
      return this.assignedRouteDayDomainObjectToModel(domainObject);
    }

    if (isDayEntity(domainObject)) {
      return this.dayDomainObjectToModel(domainObject);
    }

    if (isRouteEntity(domainObject)) {
      return this.routeDomainObjectToModel(domainObject);
    }

    if (domainObject instanceof RouteDayLocationObjectValue) {
      return this.routeDayLocationDomainObjectToModel(domainObject);
    }

    if (isRouteDayProposalEntity(domainObject)) {
      return this.routeDayProposalDomainObjectToModel(domainObject);
    }

    if (isRouteDayEntity(domainObject)) {
      return this.routeDayDomainObjectToModel(domainObject);
    }

    throw new Error('Invalid input for mapping to model');
  }
  
  // ==================== MAPPER METHODS DOMAIN OBJECT to MODEL ====================
  private assignedRouteDayDomainObjectToModel(domainObject: AssignedRouteDayEntity): AssignedRouteDayModel {
    return {
      id_assigned_route_day: domainObject.id_assigned_route_day,
      created_at: domainObject.created_at,
      expired_at: domainObject.expired_at,
      id_route_day: domainObject.id_route_day,
      id_user: domainObject.id_user,
    };
  }

  private dayDomainObjectToModel(domainObject: DayEntity): DayModel {
    return {
      id_day: domainObject.id_day,
      day_name: domainObject.day_name,
      order_to_show: domainObject.order_to_show,
    };
  }

  private routeDomainObjectToModel(domainObject: RouteEntity): RouteModel {
    return {
      id_route: domainObject.id_route,
      route_name: domainObject.route_name,
      route_status: domainObject.route_status,
      description: domainObject.description,
    };
  }

  private routeDayLocationProposalDomainObjectToModel(domainObject: RouteDayLocationObjectValue): RouteDayLocationProposalModel {
    if (!domainObject.id_route_day_location_proposal) {
      throw new Error('Missing id_route_day_location_proposal in RouteDayLocationObjectValue');
    }

    return {
      id_route_day_location_proposal: domainObject.id_route_day_location_proposal,
      position_in_route: domainObject.position_in_route,
      id_route_day_proposal: domainObject.id_owner,
      id_location: domainObject.id_location,
    };
  }

  private routeDayLocationDomainObjectToModel(domainObject: RouteDayLocationObjectValue): RouteDayLocationModel | RouteDayLocationProposalModel {
    if (domainObject.id_route_day_location_proposal) {
      return this.routeDayLocationProposalDomainObjectToModel(domainObject);
    }

    if (!domainObject.id_route_day_location) {
      throw new Error('Missing id_route_day_location in RouteDayLocationObjectValue');
    }

    return {
      id_route_day_location: domainObject.id_route_day_location,
      position_in_route: domainObject.position_in_route,
      id_location: domainObject.id_location,
      id_route_day: domainObject.id_owner,
    };
  }

  private routeDayProposalDomainObjectToModel(domainObject: RouteDayProposalEntity): RouteDayProposalModel {
    return {
      id_route_day_proposal: domainObject.id_route_day_proposal,
      proposal_name: domainObject.proposal_name,
      created_at: domainObject.created_at,
      id_route_day: domainObject.id_route_day,
    };
  }

  private routeDayDomainObjectToModel(domainObject: RouteDayEntity): RouteDayModel {
    return {
      id_route_day: domainObject.id_route_day,
      id_route: domainObject.id_route,
      id_day: domainObject.id_day,
    };
  }


  // ==================== MAPPER METHODS MODEL to DOMAIN OBJECT ====================
  private assignedRouteDayModelToDomainObject(model: AssignedRouteDayModel): AssignedRouteDayEntity {
    if (typeof model.created_at === 'string' && isNaN(Date.parse(model.created_at))) {
      throw new Error('Invalid created_at format in AssignedRouteDayModel');
    }

    if (typeof model.expired_at === 'string' && isNaN(Date.parse(model.expired_at))) {
      throw new Error('Invalid expired_at format in AssignedRouteDayModel');
    }

    return new AssignedRouteDayEntity(
      model.id_assigned_route_day,
      new Date(model.created_at),
      model.id_route_day,
      model.id_user,
      model.expired_at ? new Date(model.expired_at) : undefined,
    );
  }

  private dayModelToDomainObject(model: DayModel): DayEntity {
    return new DayEntity(
      model.day_name,
      model.id_day,
      model.order_to_show,
    );
  }

  private routeModelToDomainObject(model: RouteModel): RouteEntity {
    return new RouteEntity(
      model.id_route,
      model.route_name,
      model.route_status,
      model.description,
    );
  }

  private routeDayLocationProposalModelToDomainObject(model: RouteDayLocationProposalModel): RouteDayLocationObjectValue {
    return new RouteDayLocationObjectValue(
      model.position_in_route,
      model.id_location,
      model.id_route_day_proposal,
      undefined,
      model.id_route_day_location_proposal,
    );
  }

  private routeDayLocationModelToDomainObject(model: RouteDayLocationModel): RouteDayLocationObjectValue {
    return new RouteDayLocationObjectValue(
      model.position_in_route,
      model.id_location,
      model.id_route_day,
      model.id_route_day_location,
      undefined,
    );
  }

  private routeDayProposalModelToDomainObject(model: RouteDayProposalModel): RouteDayProposalEntity {
    if (typeof model.created_at === 'string' && isNaN(Date.parse(model.created_at))) {
      throw new Error('Invalid created_at format in RouteDayProposalModel');
    }

    return new RouteDayProposalEntity(
      model.id_route_day_proposal,
      model.proposal_name,
      new Date(model.created_at),
      model.id_route_day,
    );
  }

  private routeDayModelToDomainObject(model: RouteDayModel): RouteDayEntity {
    return new RouteDayEntity(
      model.id_route_day,
      model.id_route,
      model.id_day,
      [],
    );
  }

}
