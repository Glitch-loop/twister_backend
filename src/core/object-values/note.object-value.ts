export class NoteObjectValue {
  constructor(
    public readonly id_note: string,
    public readonly note: string,
    public readonly id_owner: string, // work day, location notes, etc.
    public readonly created_at?: Date,
  ) {}
}
