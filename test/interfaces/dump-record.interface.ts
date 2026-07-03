import { dumpRecordType } from "@/test/types/dump-record.types";

export interface dumpRecordInterface {
  id: string,
  payload: object,
  record_type: dumpRecordType
}