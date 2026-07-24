export class LocationsModel {
  constructor(
    public readonly id_location: string,
    public readonly street: string,
    public readonly ext_number: string,
    public readonly colony: string,
    public readonly postal_code: string,
    public readonly address_reference: string | null,
    public readonly location_name: string,
    public readonly latitude: string,
    public readonly longitude: string,
    public readonly status_location: number,
    public readonly id_creator: string,
    public readonly id_client: string,
    public readonly id_location_type: string,
    public readonly created_at: string,
    public readonly updated_at: string,
  ) {}
}
