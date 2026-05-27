// Object values
import { LocationTypeObjectValue } from '@/src/clients/core/object-values/location-type.object-value';

export class LocationTypeAggregate {
  private _locationTypes: LocationTypeObjectValue[];
  
  constructor(locationTypes: LocationTypeObjectValue[]) {
    this._locationTypes = locationTypes;
  }

  createLocationType(_id_location_type: string, _name_location_type: string): LocationTypeObjectValue {
    // Business rule: A location type must have a unique name.
    const newLocationType: LocationTypeObjectValue = new LocationTypeObjectValue(
      _id_location_type,
      _name_location_type.trim().toLowerCase(),
      new Date(),
    );

    const existingLocationType = this._locationTypes.find((lt) => lt.location_type_name === newLocationType.location_type_name);
    if (existingLocationType) {
      throw new Error('A location type with this name already exists.');
    }

    this._locationTypes.push(newLocationType);

    return newLocationType;
  }
}