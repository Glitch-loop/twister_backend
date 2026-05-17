import { TaxClientInformationEntity } from '@/src/clients/core/entities/tax-client-information.entity';

/*
  Bussines rule:
  This "constant" was created attending the business rule of having a "client" that represents
  the general public, if a selling is made an a client is not provided, by defualt
  the selling will be registered under "the general puclic client".
*/

export const GENERAL_PUBLIC_CLIENT = new TaxClientInformationEntity(
  '041c6093-a97b-4f4c-ab8e-6d1e35689555',
  'PÚBLICO EN GENERAL',
  '48327',  
  '616 – Sin obligaciones fiscales',
  'PÚBLICO EN GENERAL',
  '0000000000',
  '',
  new Date('2026-05-13 19:01:48+00'),
  new Date('2026-05-13 19:01:52+00'),
);
