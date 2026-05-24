import { controllerNextItemInterface } from "@/src/shared/presentation/http/interfaces/controller-next-item-meta.interface";

export interface httpControllerResponseWithData {
  message: string,
  data: unknown,
  next_item: controllerNextItemInterface,
}
