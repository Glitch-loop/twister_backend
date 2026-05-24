import { httpResponseInterface } from "@/src/shared/presentation/http/interfaces/http-response.interface";
import { controllerNextItemInterface } from "../interfaces/controller-next-item-meta.interface";
import { httpControllerResponse } from "../interfaces/controller-response.interface";
import { isRecord, isArray } from "@/src/shared/application/guards/utils";
import { isControllerNextItem } from "../../guards/controller-next-item.guard";

export class httpFormatter {
  private httpServerResponse:httpResponseInterface;

  constructor() {
    this.httpServerResponse = { message: "Ok" };
  }

  /**
   * Builds a controller response and optionally appends pagination metadata.
   *
   * When pagination is used, the caller should request one extra item
   * (limit + 1). If the array length is greater than the provided limit,
   * this method removes the extra item and uses it to build the cursor
   * metadata for the next page.
   *
   * The extra item is inspected dynamically using the provided field names:
   * - id_item_field_name: field used as unique identifier for next item
   * - created_at_field_name: field used as secondary cursor value
   *
   * @param message Response message.
   * @param data Response payload, usually an array when paginating.
   * @param limit Requested page size.
   * @param id_item_field_name Name of the identifier field in each item.
   * @param created_at_field_name Name of the created-at field in each item.
   * @returns A standardized controller response with optional pagination meta.
   */
  public createResponse(message: string, data?: unknown, limit?: number, id_item_field_name?: string, created_at_field_name?: string): httpControllerResponse {
    let metadataPagination: controllerNextItemInterface|undefined = undefined 
    console.log("Creating response: ", data)
    if(isArray(data) && limit) {
      console.log("Data length: ", data.length)
      console.log("Limit: ", limit)
      if (data.length > limit) { // It means that there is a page in the table.
        data.pop();
        const nextItem: unknown = data[data.length - 1];

        if(isRecord(nextItem)) {
          if(id_item_field_name && created_at_field_name) {
            if (typeof nextItem[id_item_field_name] === "string" 
            && (
              nextItem[created_at_field_name] instanceof Date
              || typeof nextItem[created_at_field_name] === 'string'
            )) {
              const createdAtValue = nextItem[created_at_field_name] instanceof Date
                ? nextItem[created_at_field_name].toISOString()
                : nextItem[created_at_field_name];

              metadataPagination = {
                limit: limit,
                id: nextItem[id_item_field_name],
                created_at: createdAtValue,
              };
            }
          }
        } else {
          throw new Error('Controller violates contrat.');
        }
      } else { // It means the user has reached the last page.
        metadataPagination = {
          limit: limit,
          id: undefined,
          created_at: undefined,
        };
      }
    } else metadataPagination = undefined;
    

    return {
      message: message,
      data: data,
      meta: metadataPagination,
    }
  }

  public addMessage(message: string): void {
    this.httpServerResponse.message = message;
  }

  public addData(data: unknown): void {
    if(typeof data === 'object' 
    && data !== null 
    && data !== undefined) {
      this.httpServerResponse.data = data;
    }
  }

  public addPaginationMetaData(next_item: unknown): void {
    console.log(next_item)
    console.log("Is controller next item; ", isControllerNextItem(next_item))
    if(isControllerNextItem(next_item)) {
      const { limit, id, created_at } = next_item;
      if(id && created_at) {
        const next_item_encoded = Buffer.from(
          JSON.stringify(next_item),
          'utf8'
        ).toString('base64');
        
        this.httpServerResponse.meta = {
          limit: limit,
          has_next_page: true,
          next_item: next_item_encoded
        };
      } else {
        this.httpServerResponse.meta = {
          limit: limit,
          has_next_page: false,
          next_item: null
        };
      }
    } else {
      this.httpServerResponse.meta = undefined;
    }
  }

  public getResponse () {
    return this.httpServerResponse;
  }

  public decodingNextItemForPagination(next_item: string): controllerNextItemInterface {
      const next_item_encoded = Buffer.from(
        next_item,
        'base64'
      ).toString('utf8');


      return JSON.parse(next_item_encoded) as controllerNextItemInterface
  }


}