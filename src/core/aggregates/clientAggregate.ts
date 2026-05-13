// Enums
import { CLIENT_STATUS_ENUM } from '../enums/clientStatusEnum';

// Object values
import { NoteObjectValue } from '../object-values/noteObjectValue';
import { LocationTypeObjectValue } from '../object-values/locationTypeObjectValue';

// Entities
import { TaxClientInformationEntity } from '../entities/taxClientInformationEntity';
import { LocationEntity } from '../entities/locationEntity';
import { FurnitureEntity } from '../entities/furnitureEntity';

export class ClientAggregate {
  private _taxClientInformation: TaxClientInformationEntity | null;
  private _locations: LocationEntity[];
  private _furnitures: FurnitureEntity[];

  // Optionally, store the client entity if needed

  constructor(
    taxClientInformation: TaxClientInformationEntity | null,
    locations: LocationEntity[],
    furnitures: FurnitureEntity[],
  ) {
    // A location or client cannot exist if it doesn't have a client (tax information).
    // Business rule: If there is not an specific client for a particular location, then
    // the location must fall into general public client.
    if (
      taxClientInformation === null &&
      (locations.length > 0 || furnitures.length > 0)
    ) {
      throw new Error(
        'Tax client information is required when locations or furnitures are provided.',
      );
    }

    if (taxClientInformation !== null) {
      if (
        !locations.every(
          (loc) => loc.id_client === taxClientInformation.id_client,
        )
      ) {
        throw new Error(
          'All locations must have id_client matching the tax client id.',
        );
      }
    }

    const locationIds = new Set(locations.map((loc) => loc.id_location));
    if (!furnitures.every((fur) => locationIds.has(fur.id_location))) {
      throw new Error(
        'All furnitures must have id_location matching one of the client locations.',
      );
    }
    this._taxClientInformation = taxClientInformation;
    this._locations = locations;
    this._furnitures = furnitures;
  }

  createClient(
    _id_client: string,
    _legal_name: string,
    _postal_code: string,
    _fiscal_regime: string,
    _name: string,
    _cellphone: string,
    _email: string,
  ): void {
    this._taxClientInformation = new TaxClientInformationEntity(
      _id_client,
      _legal_name,
      _postal_code,
      _fiscal_regime,
      _name,
      _cellphone,
      _email,
      new Date(),
      new Date(),
    );
  }

  createLocation(
    _id_location: string,
    _street: string,
    _ext_number: string,
    _colony: string,
    _postal_code: string,
    _location_name: string,
    _latitude: string,
    _longitude: string,
    _id_creator: string,
    _id_client: string,
    _created_at: Date | null,
    _updated_at: Date | null,
    _location_type: LocationTypeObjectValue,
    // _notes: NoteObjectValue[],
    _address_reference: string | null,
  ): void {
    if (
      this._locations.find((loc) => loc.id_location === _id_location) !== undefined
    ) {
      throw new Error('Location is already registered for this client.');
    }

    // Business rule: All new locations (clients) are created as "PROSPECTS".

    const newLocation = new LocationEntity(
      _id_location,
      _street,
      _ext_number,
      _colony,
      _postal_code,
      _location_name,
      _latitude,
      _longitude,
      CLIENT_STATUS_ENUM.CLIENT_PROSPECT,
      _id_creator,
      _id_client,
      _created_at ?? new Date(),
      _updated_at ?? new Date(),
      _location_type,
      [],
      _address_reference,
    );

    this._locations.push(newLocation);
  }

  addNoteToLocation(_id_location: string, _notes: NoteObjectValue[]): void {
    const locationSet = new Set(this._locations.map((loc) => loc.id_location));

    for (const note of _notes) {
      if (!locationSet.has(note.id_owner)) {
        throw new Error(
          `Location with id ${note.id_owner} does not exist for this client.`,
        );
      }
    }

    this._locations = this._locations.map((loc) => {
      if (loc.id_location === _id_location) {
        return new LocationEntity(
          loc.id_location,
          loc.street,
          loc.ext_number,
          loc.colony,
          loc.postal_code,
          loc.location_name,
          loc.latitude,
          loc.longitude,
          loc.status_location,
          loc.id_creator,
          loc.id_client,
          loc.created_at,
          loc.updated_at,
          loc.location_type,
          // eslint-disable-next-line prettier/prettier
          [...loc.notes, ..._notes.filter((note) => note.id_owner === loc.id_location)],
          loc.address_reference,
        );
      }
      return loc;
    });
  }

  // confirmClient(store: any): void {
  //   // Placeholder: logic to confirm client with a store (type not defined)
  //   throw new Error('Not implemented: confirmClient');
  // }

  // addFurniture(type: any): void {
  //   // Placeholder: logic to add a furniture of a given type
  //   throw new Error('Not implemented: addFurniture');
  // }

  // removeFurniture(type: any): void {
  //   // Placeholder: logic to remove a furniture of a given type
  //   throw new Error('Not implemented: removeFurniture');
  // }
}
