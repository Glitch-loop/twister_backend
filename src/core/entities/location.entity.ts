// Object values
import { NoteObjectValue } from '@/src/core/object-values/note.object-value';
import { LocationTypeObjectValue } from '@/src/core/object-values/location-type.object-value';

// Enums
import { CLIENT_STATUS_ENUM } from '@/src/core/enums/client-status.enum';

export class LocationEntity {
  constructor(
    public readonly id_location: string,
    public readonly street: string,
    public readonly ext_number: string,
    public readonly colony: string,
    public readonly postal_code: string,
    public readonly location_name: string,
    public readonly latitude: string,
    public readonly longitude: string,
    public readonly status_location: CLIENT_STATUS_ENUM,
    public readonly id_creator: string,
    public readonly id_client: string,
    public readonly created_at: Date,
    public readonly updated_at: Date,
    public readonly location_type: LocationTypeObjectValue,
    public readonly notes: NoteObjectValue[],
    public readonly address_reference: string | null,
  ) {}
}
