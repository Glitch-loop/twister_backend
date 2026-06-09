// Enums
import { LOCATION_STATUS_ENUM } from '@/src/clients/core/enums/client-status.enum';

// Constants
import { GENERAL_PUBLIC_CLIENT } from '@/src/clients/core/constants/client-constants';

// Object values
import { NoteObjectValue } from '@/src/clients/core/object-values/note.object-value';
import { LocationTypeObjectValue } from '@/src/clients/core/object-values/location-type.object-value';

// Entities
import { TaxClientInformationEntity } from '@/src/clients/core/entities/tax-client-information.entity';
import { LocationEntity } from '@/src/clients/core/entities/location.entity';
import { FurnitureEntity } from '@/src/clients/core/entities/furniture.entity';
import { BusinessRuleException } from '@/src/shared/errors/BusinessRuleException';

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

  modifyClient(
    _legal_name?: string,
    _postal_code?: string,
    _fiscal_regime?: string,
    _name?: string,
    _cellphone?: string,
    _email?: string,
  ): TaxClientInformationEntity {
    if (this._taxClientInformation === null) {
      throw new Error('Client does not exist for modification.');
    }

    this._taxClientInformation = new TaxClientInformationEntity(
      this._taxClientInformation.id_client,
      _legal_name ?? this._taxClientInformation.legal_name,
      _postal_code ?? this._taxClientInformation.postal_code,
      _fiscal_regime ?? this._taxClientInformation.fiscal_regime,
      _name ?? this._taxClientInformation.name,
      _cellphone ?? this._taxClientInformation.cellphone,
      _email ?? this._taxClientInformation.email,
      this._taxClientInformation.created_at,
      new Date(),
    );

    return this._taxClientInformation;
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
    _location_type: LocationTypeObjectValue,
    _created_at: Date | null,
    _updated_at: Date | null,
    _id_client?: string,
    _address_reference?: string,
  ): LocationEntity {
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
      LOCATION_STATUS_ENUM.CLIENT_PROSPECT,
      _id_creator,
      _id_client ?? GENERAL_PUBLIC_CLIENT.id_client,
      _created_at ?? new Date(),
      _updated_at ?? new Date(),
      _location_type,
      [],
      _address_reference ?? null,
    );

    this._locations.push(newLocation);
    
    return newLocation;
  }

  confirmNewClient(idLocation: string): LocationEntity {
    const clientToConfirm: LocationEntity|undefined = this.locations.find((location) => location.id_location === idLocation);

    if(clientToConfirm === undefined) throw new BusinessRuleException(`The location with the ID: ${idLocation} is corrupted. Location should belong to ${this._taxClientInformation?.id_client} but it shouldn't`)

    if(clientToConfirm.status_location !== LOCATION_STATUS_ENUM.CLIENT_PROSPECT) throw new BusinessRuleException(`Only clients with status of prospect (${LOCATION_STATUS_ENUM.CLIENT_PROSPECT}) can be confirmed as new clients. The client with id ${clientToConfirm.id_client} has the status ${clientToConfirm.status_location}`)
      
    const updatedLocation = new LocationEntity(
      clientToConfirm.id_location,
      clientToConfirm.street,
      clientToConfirm.ext_number,
      clientToConfirm.colony,
      clientToConfirm.postal_code,
      clientToConfirm.location_name,
      clientToConfirm.latitude,
      clientToConfirm.longitude,
      LOCATION_STATUS_ENUM.CLIENT,
      clientToConfirm.id_creator,
      clientToConfirm.id_client,
      clientToConfirm.created_at,
      new Date(),
      clientToConfirm.location_type,
      clientToConfirm.notes,
      clientToConfirm.address_reference,
    );

    this._locations = this._locations.map((loc) =>
      loc.id_location === idLocation ? updatedLocation : loc,
    );

    return updatedLocation;
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
           
          [...loc.notes, ..._notes.filter((note) => note.id_owner === loc.id_location)],
          loc.address_reference,
        );
      }
      return loc;
    });
  }

  createNoteForLocation(
    _id_note: string,
    _id_location: string,
    _note: string,
    _created_at?: Date,
  ): NoteObjectValue {
    const note = new NoteObjectValue(
      _id_note,
      _note,
      _id_location,
      _created_at ?? new Date(),
    );

    this.addNoteToLocation(_id_location, [note]);

    return note;
  }

  addFurniture(
    _id_furniture: string,
    _delivered_date: Date,
    _description_furniture: string,
    _id_location: string,
  ): FurnitureEntity {
    const existingFurniture:FurnitureEntity|undefined = this._furnitures.find((fur) => fur.id_furniture === _id_furniture);
    
    if (existingFurniture !== undefined) {
      throw new Error('Furniture is already registered for this client.');
    }

    const existingLocation:LocationEntity|undefined = this._locations.find((loc) => loc.id_location === _id_location);

    if (existingLocation === undefined) {
      throw new Error('Location does not exist for this client.');
    }

    const { status_location } = existingLocation;

    if (status_location === LOCATION_STATUS_ENUM.CLIENT_PROSPECT
    || status_location === LOCATION_STATUS_ENUM.CLIENT) {
      const newFurniture = new FurnitureEntity(
        _id_furniture,
        _delivered_date,
        _description_furniture,
        _id_location,
      );

      this._furnitures.push(newFurniture);

      return newFurniture;
    } else {
      throw new Error('Furniture can only be added to locations with status CLIENT_PROSPECT or CLIENT.');
    }
  }

  modifyFurniture(
    _id_furniture: string,
    _delivered_date?: Date,
    _description_furniture?: string,
    _id_location?: string,
  ): FurnitureEntity {
    const existingFurniture = this._furnitures.find(
      (fur) => fur.id_furniture === _id_furniture,
    );

    if (existingFurniture === undefined) {
      throw new Error('Furniture does not exist for this client.');
    }

    const targetLocationId = _id_location ?? existingFurniture.id_location;
    const targetLocation = this._locations.find(
      (loc) => loc.id_location === targetLocationId,
    );

    if (targetLocation === undefined) {
      throw new Error('Location does not exist for this client.');
    }

    if (
      targetLocation.status_location !== LOCATION_STATUS_ENUM.CLIENT_PROSPECT &&
      targetLocation.status_location !== LOCATION_STATUS_ENUM.CLIENT
    ) {
      throw new Error(
        'Furniture can only be assigned to locations with status CLIENT_PROSPECT or CLIENT.',
      );
    }

    const updatedFurniture = new FurnitureEntity(
      existingFurniture.id_furniture,
      _delivered_date ?? existingFurniture.delivered_date,
      _description_furniture ?? existingFurniture.description_furniture,
      targetLocationId,
    );

    this._furnitures = this._furnitures.map((fur) =>
      fur.id_furniture === _id_furniture ? updatedFurniture : fur,
    );

    return updatedFurniture;
  }

  modifyLocation(
    _id_location: string,
    _street?: string,
    _ext_number?: string,
    _colony?: string,
    _postal_code?: string,
    _location_name?: string,
    _latitude?: string,
    _longitude?: string,
    _status_location?: LOCATION_STATUS_ENUM,
    _id_creator?: string,
    _id_client?: string,
    _location_type?: LocationTypeObjectValue,
    _address_reference?: string | null,
  ): LocationEntity {
    const existingLocation = this._locations.find(
      (loc) => loc.id_location === _id_location,
    );

    if (existingLocation === undefined) {
      throw new Error('Location does not exist for this client.');
    }

    const updatedLocation = new LocationEntity(
      existingLocation.id_location,
      _street ?? existingLocation.street,
      _ext_number ?? existingLocation.ext_number,
      _colony ?? existingLocation.colony,
      _postal_code ?? existingLocation.postal_code,
      _location_name ?? existingLocation.location_name,
      _latitude ?? existingLocation.latitude,
      _longitude ?? existingLocation.longitude,
      _status_location ?? existingLocation.status_location,
      _id_creator ?? existingLocation.id_creator,
      _id_client ?? existingLocation.id_client,
      existingLocation.created_at,
      new Date(),
      _location_type ?? existingLocation.location_type,
      existingLocation.notes,
      _address_reference ?? existingLocation.address_reference,
    );

    this._locations = this._locations.map((loc) =>
      loc.id_location === _id_location ? updatedLocation : loc,
    );

    return updatedLocation;
  }

  deactivateLocation(_id_location: string, _deactivation_type: number): LocationEntity {

    /*
      Business rule:
      Both prospects or clients can be deactivated.
    */

    let locationStatus: LOCATION_STATUS_ENUM = LOCATION_STATUS_ENUM.CLOSED; // Default deactivation status

    if (_deactivation_type === 1) {
      locationStatus = LOCATION_STATUS_ENUM.CLOSED;
    } else if (_deactivation_type === 2) {
      locationStatus = LOCATION_STATUS_ENUM.SHUTDOWN;
    } else if (_deactivation_type === 3) {
      locationStatus = LOCATION_STATUS_ENUM.CHURNED;
    } else {
      throw new Error(`Invalid deactivation type: ${_deactivation_type}`);
    }

        const existingLocation = this._locations.find(
      (loc) => loc.id_location === _id_location,
    );

    if (existingLocation === undefined) {
      throw new Error('Location does not exist for this client.');
    }

    const updatedLocation = new LocationEntity(
      existingLocation.id_location,
      existingLocation.street,
      existingLocation.ext_number,
      existingLocation.colony,
      existingLocation.postal_code,
      existingLocation.location_name,
      existingLocation.latitude,
      existingLocation.longitude,
      locationStatus,
      existingLocation.id_creator,
      existingLocation.id_client,
      existingLocation.created_at,
      new Date(),
      existingLocation.location_type,
      existingLocation.notes,
      existingLocation.address_reference,
    );


    return updatedLocation;
  }

  deactivateClient(): TaxClientInformationEntity {
    if (this._taxClientInformation === null) {
      throw new Error('Client does not exist for deactivation.');
    }

    if (this._taxClientInformation.id_client === GENERAL_PUBLIC_CLIENT.id_client) {
      throw new Error('General public client cannot be deactivated.');
    }

    /*
      Business rule:
      When client is deactivated, the client information of the location is update to 
      general public client.
      
      The status of the location doesn't change. This is updated independently.
    */
   // TODO: Consider if before of deactivating a client, all its locations must be deactivated first.
    this._locations = this._locations.map((location) =>
      new LocationEntity(
        location.id_location,
        location.street,
        location.ext_number,
        location.colony,
        location.postal_code,
        location.location_name,
        location.latitude,
        location.longitude,
        location.status_location,
        location.id_creator,
        location.id_client,
        location.created_at,
        new Date(),
        location.location_type,
        location.notes,
        location.address_reference,
      ),
    );

    // TODO: Consider if add a status field to the client entity.
    this._taxClientInformation = new TaxClientInformationEntity(
      this._taxClientInformation.id_client,
      this._taxClientInformation.legal_name,
      this._taxClientInformation.postal_code,
      this._taxClientInformation.fiscal_regime,
      this._taxClientInformation.name,
      this._taxClientInformation.cellphone,
      this._taxClientInformation.email,
      this._taxClientInformation.created_at,
      new Date(),
    );

    return this._taxClientInformation;
  }



  get taxClientInformation(): TaxClientInformationEntity | null {
    return this._taxClientInformation;
  }

  get locations(): LocationEntity[] {
    return this._locations;
  }

  get furnitures(): FurnitureEntity[] {
    return this._furnitures;
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
