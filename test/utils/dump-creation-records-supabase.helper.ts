import { dumpRecordInterface } from "@/test/interfaces/dump-record.interface";
import { SupabaseClient } from "@supabase/supabase-js";
import { dumpRecordType } from "../types/dump-record.types";

/*
* The purpose of this function is to create a dump record in the database.
* This dump record should only be used for testing purposes.
* 
*/
export async function createDumpRecordInDatabase(client: SupabaseClient, id: string, record_type: dumpRecordType, payload: any): Promise<dumpRecordInterface> {
  try {
    if (record_type === 'facilities') await client.from('facilities').insert(payload);
    if (record_type === 'facility_types') await client.from('facility_types').insert(payload); 
    if (record_type === 'inventories') await client.from('inventories').insert(payload);
    if (record_type === 'inventories_balance') await client.from('inventories_balance').insert(payload);
    if (record_type === 'inventory_operation_descriptions') await client.from('inventory_operation_descriptions').insert(payload);
    if (record_type === 'inventory_operations') await client.from('inventory_operations').insert(payload);
    // if (record_type === 'products') await client.from('inventory_operations').insert(payload);
    if (record_type === 'users') await client.from('users').insert(payload);
    
    return { id: id, record_type: record_type, payload: payload } as dumpRecordInterface;
  } catch (error) {
    throw new Error("An error has happended during dump record creation: ", error);
  }
}

export function createDumpRecord(id: string, record_type: dumpRecordType, payload: any): dumpRecordInterface {
  return { id: id, record_type: record_type, payload: payload };
}

export async function deleteDumpRecordInDatabase(client: SupabaseClient, dumpRecord: dumpRecordInterface[]):Promise<void> {
  const orderedDumpRecord: dumpRecordInterface[] = dumpRecord.sort((a, b) => levelOfDependency(a.record_type) - levelOfDependency(b.record_type));

  for (const dumpRecord of orderedDumpRecord) {
    const { id, record_type } = dumpRecord;
    if (record_type === 'facilities') await client.from('facilities').delete().eq('id_facility', id);
    if (record_type === 'facility_types') await client.from('facility_types').delete().eq('id_facility_type', id); 
    if (record_type === 'inventories') await client.from('inventory_operation_descriptions').delete().eq('id_inventory', id);
    if (record_type === 'inventories_balance') await client.from('inventory_operation_descriptions').delete().eq('id_inventory_balance', id);
    if (record_type === 'inventory_operation_descriptions') await client.from('inventory_operation_descriptions').delete().eq('id_inventory_operation_description', id);
    if (record_type === 'inventory_operations') await client.from('inventory_operations').delete().eq('id_inventory_operation', id);
    if (record_type === 'users') await client.from('users').delete().eq('id_facility_type', id);
  }
}


/*
 * This function gives a number depending on the level of dependency of the table. 
 * As more dependecies it has, the number will be greater.
 * 
 * Dependencies include:
 * - Direct dependencies
 * - Indirect dependencies
 */
function levelOfDependency(record_type: dumpRecordType): number {
  if (record_type === 'facility_types'
  || record_type === 'inventories_balance'
  || record_type === 'inventory_operation_descriptions'
  ) return 0;
  
  if (record_type === 'inventory_operations'
  || record_type === 'inventories'
  || record_type === 'facilities'
  ) return 1;

  if (record_type === 'products'
  || record_type === 'users'
  ) return 2;

  throw new Error("Dump record type doesn't exist")

}