import { LocationNoteDto } from "@/src/clients/application/dtos/location_note.dto";

export interface LocationDto {
  id_location: string;
  street: string;
  ext_number: string;
  colony: string;
  postal_code: string;
  location_name: string;
  latitude: string;
  longitude: string;
  status_location: number;
  id_creator: string;
  id_client: string;
  id_location_type: string;
  created_at: Date;
  updated_at: Date;
  notes: LocationNoteDto[];
  address_reference?: string;
}
