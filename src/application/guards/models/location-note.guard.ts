import type { LocationNoteModel } from '../../models/location-note.model';

import { isRecord } from '../utils';

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
