import { BusinessRuleException } from "@/src/shared/errors/BusinessRuleException";
import { AssignedRouteDayEntity } from "../entities/assigned-route-day.entity";


export class RouteDayAssignation {
  private routeDayAssgnation: AssignedRouteDayEntity|null;

  constructor(_routeDayAssgnation?: AssignedRouteDayEntity) {
    if (_routeDayAssgnation) this.routeDayAssgnation = _routeDayAssgnation
    else this.routeDayAssgnation = null;
  }

  public isAssignationExpired():boolean {
    if (this.routeDayAssgnation === null) throw new Error("Assignation has not been initialized");

    if (this.routeDayAssgnation.expired_at === undefined) {
      return false;
    }
    
    return Date.now() < this.routeDayAssgnation.expired_at.getDate();
  }

  public createAssignation(
    _routeDayAssigned: string,
    _idRouteDay: string,
    _idUser: string,
    _expiredAt?: Date
  ): AssignedRouteDayEntity {
    if(_expiredAt) {
      if (_expiredAt.getDate() <= Date.now()) throw new BusinessRuleException("Invalid assignation. The expiration must be greater than the current day.")
    }

    const newRouteAssignation = new AssignedRouteDayEntity(
      _routeDayAssigned,
      new Date(),
      _idRouteDay,
      _idUser,
      _expiredAt
    )

    this.routeDayAssgnation = newRouteAssignation;

    return newRouteAssignation;
  }
}