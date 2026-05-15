// Models
import type { LocationNoteModel } from '@/src/application/models/location-note.model';

// Guards
import { isRecord } from '@/src/shared/guards/utils';

export const isLocationNoteModel = (value: unknown): value is LocationNoteModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_location_note === 'string' &&
    typeof value.note === 'string' &&
    typeof value.id_location === 'string'
  );
};
