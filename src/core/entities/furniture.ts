export class Furniture {
  constructor(
    public readonly id_furniture: string,
    public readonly delivered_date: Date,
    public readonly description_furniture: string,
    public readonly id_location: string,
  ) {}
}
