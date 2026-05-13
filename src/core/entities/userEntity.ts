export class UserEntity {
  constructor(
    public readonly id_user: string,
    public readonly cellphone: string,
    public readonly name: string,
    public readonly password: string,
    public readonly status: number,
    public readonly salary: number,
    public readonly created_at: Date,
    public readonly updated_at: Date,
    public readonly address?: string,
    public readonly rfc?: string,
    public readonly imss?: string,
  ) {}
}
