import { LocationNoteDto } from '@/src/clients/application/dtos/location-note.dto';
import { isRecord } from "@/src/shared/application/guards/utils";

export const isLocationNoteDto = (value: unknown): value is LocationNoteDto => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_location_note === 'string' &&
    typeof value.note === 'string' &&
    typeof value.id_location === 'string' &&
    value.created_at instanceof Date
  );
};