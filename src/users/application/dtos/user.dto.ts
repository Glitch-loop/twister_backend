export interface UserDto {
  id_user: string;
  cellphone: string;
  name: string;
  password: string;
  status: number;
  salary: number;
  created_at: Date;
  updated_at: Date;
  assigned_roles: number[]
  address?: string;
  rfc?: string;
  imss?: string;
}
