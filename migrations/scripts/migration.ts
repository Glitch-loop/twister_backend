import { createClient } from "@supabase/supabase-js";
import { InventoryOperationDescriptionsModel as OldInventoryOperationDescriptionsModel } from "../models/models_old_schema/inventory-operation-descriptions.model";
import { InventoryOperationsModel as OldInventoryOperationsModel } from "../models/models_old_schema/inventory-operations.model";
import { ProductsModel as OldProductsModel } from "../models/models_old_schema/products.model";
import { RouteDayProposalsModel as OldRouteDayProposalsModel } from "../models/models_old_schema/route-day-proposals.model";
import { RouteDayStoreProposalsModel as OldRouteDayStoreProposalsModel } from "../models/models_old_schema/route-day-store-proposals.model";
import { RouteDayStoresModel as OldRouteDayStoresModel } from "../models/models_old_schema/route-day-stores.model";
import { RouteDaysModel as OldRouteDaysModel } from "../models/models_old_schema/route-days.model";
import { RouteTransactionDescriptionsModel as OldRouteTransactionDescriptionsModel } from "../models/models_old_schema/route-transaction-descriptions.model";
import { RouteTransactionsModel as OldRouteTransactionsModel } from "../models/models_old_schema/route-transactions.model";
import { RoutesModel as OldRoutesModel } from "../models/models_old_schema/routes.model";
import { StoresModel as OldStoresModel } from "../models/models_old_schema/stores.model";
import { WorkDaysModel as OldWorkDaysModel } from "../models/models_old_schema/work-days.model";
import { InventoriesModel as NewInventoriesModel } from "../models/models_new_schema/inventories.model";
import { InventoryConfigurationForOperationsModel as NewInventoryConfigurationForOperationsModel } from "../models/models_new_schema/inventory-configuration-for-operations.model";
import { InventoryOperationDescriptionsModel as NewInventoryOperationDescriptionsModel } from "../models/models_new_schema/inventory-operation-descriptions.model";
import { InventoryOperationsModel as NewInventoryOperationsModel } from "../models/models_new_schema/inventory-operations.model";
import { LocationsModel as NewLocationsModel } from "../models/models_new_schema/locations.model";
import { ProductsModel as NewProductsModel } from "../models/models_new_schema/products.model";
import { RouteDayLocationProposalsModel as NewRouteDayLocationProposalsModel } from "../models/models_new_schema/route-day-location-proposals.model";
import { RouteDayLocationsModel as NewRouteDayLocationsModel } from "../models/models_new_schema/route-day-locations.model";
import { RouteDayProposalsModel as NewRouteDayProposalsModel } from "../models/models_new_schema/route-day-proposals.model";
import { RouteDaysModel as NewRouteDaysModel } from "../models/models_new_schema/route-days.model";
import { RoutesModel as NewRoutesModel } from "../models/models_new_schema/routes.model";
import { TransactionDescriptionsModel as NewTransactionDescriptionsModel } from "../models/models_new_schema/transaction-descriptions.model";
import { TransactionsModel as NewTransactionsModel } from "../models/models_new_schema/transactions.model";
import { WorkDaysModel as NewWorkDaysModel } from "../models/models_new_schema/work-days.model";
import { ProductPriceModel as NewProductPricesModel } from "../models/models_new_schema/product-price.model";
import { WorkDayOperationHistoricModel } from "../models/models_new_schema/work-day-operation-historic.model";
// Enums

import { ROUTE_INVENTORY_OPERATION_TYPE } from '../../src/inventories/core/enums/route-inventory-operation-type.enum';
import { MOVEMENT_TYPE_ENUM } from "../../src/inventories/core/enums/movement-type.enum";
import { INVENTORY_CONTEXT_ENUM } from "../../src/inventories/core/enums/inventory-context.enum";

import crypto from 'crypto';


type oldDatabaseTableType =
  | "products"
  | "stores"
  | "routes"
  | "work_days"
  | "route_days"
  | "route_day_stores"
  | "route_day_proposals"
  | "route_day_store_proposals"
  | "route_transactions"
  | "route_transaction_descriptions"
  | "inventory_operations"
  | "inventory_operation_descriptions";

type newDatabaseTableType =
  | "products"
  | "product_prices"
  | "locations"
  | "routes"
  | "work_days"
  | "route_days"
  | "route_day_locations"
  | "route_day_proposals"
  | "route_day_location_proposals"
  | "transactions"
  | "transaction_descriptions"
  | "inventory_operations"
  | "inventory_operation_descriptions"
  | "work_day_operations_historic"
  | "inventories"
  | "inventory_configuration_for_operations";

const OLD_SCHEMA_TABLES: oldDatabaseTableType[] = [
  "products",
  "stores",
  "routes",
  "work_days",
  "route_days",
  "route_day_stores",
  "route_day_proposals",
  "route_day_store_proposals",
  "route_transactions",
  "route_transaction_descriptions",
  "inventory_operations",
  "inventory_operation_descriptions",
];

const NEW_SCHEMA_TABLES: newDatabaseTableType[] = [
  "products",
  "product_prices",
  "locations",
  "routes",
  "work_days",
  "route_days",
  "route_day_locations",
  "route_day_proposals",
  "route_day_location_proposals",
  "transactions",
  "transaction_descriptions",
  "inventory_operations",
  "inventory_operation_descriptions",
  "work_day_operations_historic",
  "inventories",
  "inventory_configuration_for_operations",
];

type TableRow = Record<string, unknown>;
type SupabaseClientType = ReturnType<typeof createClient>;
type RuntimeInsertClient = {
  from: (tableName: string) => {
    insert: (rows: object[]) => Promise<{ error: { message: string } | null }>;
  };
};

type OldSchemaSnapshot = {
  products: OldProductsModel[];
  stores: OldStoresModel[];
  routes: OldRoutesModel[];
  work_days: OldWorkDaysModel[];
  route_days: OldRouteDaysModel[];
  route_day_stores: OldRouteDayStoresModel[];
  route_day_proposals: OldRouteDayProposalsModel[];
  route_day_store_proposals: OldRouteDayStoreProposalsModel[];
  route_transactions: OldRouteTransactionsModel[];
  route_transaction_descriptions: OldRouteTransactionDescriptionsModel[];
  inventory_operations: OldInventoryOperationsModel[];
  inventory_operation_descriptions: OldInventoryOperationDescriptionsModel[];
};

type NewSchemaSnapshot = {
  products: NewProductsModel[];
  product_prices: NewProductPricesModel[];
  locations: NewLocationsModel[];
  routes: NewRoutesModel[];
  work_days: NewWorkDaysModel[];
  route_days: NewRouteDaysModel[];
  route_day_locations: NewRouteDayLocationsModel[];
  route_day_proposals: NewRouteDayProposalsModel[];
  route_day_location_proposals: NewRouteDayLocationProposalsModel[];
  transactions: NewTransactionsModel[];
  transaction_descriptions: NewTransactionDescriptionsModel[];
  inventory_operations: NewInventoryOperationsModel[];
  inventory_operation_descriptions: NewInventoryOperationDescriptionsModel[];
  work_day_operations_historic: WorkDayOperationHistoricModel[];
  inventories: NewInventoriesModel[];
  inventory_configuration_for_operations: NewInventoryConfigurationForOperationsModel[];
};

type Step4ReferenceMaps = {
  productsById: Map<string, NewProductsModel>;
  locationsById: Map<string, NewLocationsModel>;
  workDaysById: Map<string, NewWorkDaysModel>;
};

const DEFAULT_LOCATION_CLIENT_ID = "041c6093-a97b-4f4c-ab8e-6d1e35689555";
const DEFAULT_LOCATION_TYPE_ID = "c272bb96-cf1a-4d8f-8598-179e6869847a";
const DEFAULT_MEASUREMENT_UNIT_ID = "4ec2e2fc-625b-4b45-a75f-4b028fb32ea0";
const DEFAULT_PAYMENT_SCHEMA_ID = "a5c8cb96-860c-4f40-bff2-3fb80fde2ef4";
const VISIT_DAY_OPERATION = "45354223-2156-46d0-8aa7-6f178f85671a";
const DEFAULT_WAREHOUSE_ID = "09064209-234a-4ed7-a249-af97ec8f8bcf";
const DEFAULT_WAREHOUSE_DEVOLUTION_ID = "f890c854-25fa-4b3c-882e-aa5c30fe095a";


// Function to cast fields
function asString(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return `${value}`;
  }


  throw new Error("Expected a primitive value that can be converted to string.");
}

function asNullableString(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  return asString(value);
}

function asNumber(value: unknown): number {
  return Number(value);
}

function asNullableNumber(value: unknown): number | null {
  return value === null || value === undefined ? null : Number(value);
}

function nowIso(): string {
  return new Date().toISOString();
}

// Environment variables
function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

// Inserting rows
async function insertRows<T extends object>(
  client: SupabaseClientType,
  tableName: newDatabaseTableType,
  rows: T[],
): Promise<number> {
  if (rows.length === 0) {
    return 0;
  }

  const chunkSize = 500;
  const runtimeInsertClient = client as unknown as RuntimeInsertClient;

  for (let index = 0; index < rows.length; index += chunkSize) {
    const batch = rows.slice(index, index + chunkSize);
    const { error } = await runtimeInsertClient.from(tableName).insert(batch);
    if (error) {
      throw new Error(`Error inserting into '${tableName}': ${error.message}`);
    }
  }

  return rows.length;
}

// Fetch recods
async function fetchAllRowsFromTable(
  client: SupabaseClientType,
  tableName: string,
  pageSize = 1000,
): Promise<TableRow[]> {
  const allRows: TableRow[] = [];
  let from = 0;

  while (true) {
    const to = from + pageSize - 1;
    const { data, error } = await client
      .from(tableName)
      .select("*")
      .range(from, to);

    if (error) {
      throw new Error(`Error retrieving records from table '${tableName}': ${error.message}`);
    }

    const pageRows = (data ?? []) as TableRow[];
    allRows.push(...pageRows);

    if (pageRows.length < pageSize) {
      break;
    }

    from += pageSize;
  }

  return allRows;
}

async function fetchModelsFromTable<T>(
  client: SupabaseClientType,
  tableName: oldDatabaseTableType | newDatabaseTableType,
  sourceName: "target-new" | "origin-old",
  mapper: (row: TableRow) => T,
): Promise<T[]> {
  const rows = await fetchAllRowsFromTable(client, tableName);
  console.log(`[${sourceName}] ${tableName}: ${rows.length} records retrieved.`);
  return rows.map(mapper);
}


function filterMissingById<T>(rows: T[], existingIds: Set<string>, getId: (row: T) => string): T[] {
  return rows.filter((row) => !existingIds.has(getId(row)));
}


async function fetchOldSchemaSnapshot<T extends oldDatabaseTableType>(
  client: SupabaseClientType,
  oldTableType: T,
): Promise<OldSchemaSnapshot[T]> {
  switch (oldTableType) {
    case "products":
      return await fetchModelsFromTable(client, "products", "origin-old", (row) => new OldProductsModel(
        asString(row.product_name),
        asNullableString(row.barcode),
        asNullableNumber(row.weight),
        asNullableString(row.unit),
        asNumber(row.comission),
        asNumber(row.price),
        asNumber(row.product_status),
        asNumber(row.order_to_show),
        asString(row.id_product),
      )) as OldSchemaSnapshot[T];
    case "stores":
      return await fetchModelsFromTable(client, "stores", "origin-old", (row) => new OldStoresModel(
        asString(row.street),
        asString(row.ext_number),
        asString(row.colony),
        asString(row.postal_code),
        asNullableString(row.address_reference),
        asString(row.store_name),
        asNullableString(row.owner_name),
        asNullableString(row.cellphone),
        asString(row.latitude),
        asString(row.longitude),
        asString(row.creation_date),
        asString(row.creation_context),
        asNumber(row.status_store),
        asString(row.id_creator),
        asString(row.id_store),
      )) as OldSchemaSnapshot[T];
    case "routes":
      return await fetchModelsFromTable(client, "routes", "origin-old", (row) => new OldRoutesModel(
        asString(row.route_name),
        asNullableString(row.description),
        asNumber(row.route_status),
        asString(row.id_route),
        asNullableString(row.id_vendor),
      )) as OldSchemaSnapshot[T];
    case "work_days":
      return await fetchModelsFromTable(client, "work_days", "origin-old", (row) => new OldWorkDaysModel(
        asString(row.start_date),
        asNullableString(row.finish_date),
        asString(row.id_work_day),
        asString(row.id_route),
        asString(row.id_vendor),
        asNullableString(row.id_commission),
        asNumber(row.start_petty_cash),
        asNullableNumber(row.final_petty_cash),
        asNullableString(row.comment),
        asString(row.id_route_day),
      )) as OldSchemaSnapshot[T];
    case "route_days":
      return await fetchModelsFromTable(client, "route_days", "origin-old", (row) => new OldRouteDaysModel(
        asString(row.id_route_day),
        asString(row.id_route),
        asString(row.id_day),
      )) as OldSchemaSnapshot[T];
    case "route_day_stores":
      return await fetchModelsFromTable(client, "route_day_stores", "origin-old", (row) => new OldRouteDayStoresModel(
        asNumber(row.position_in_route),
        asString(row.id_route_day_store),
        asString(row.id_store),
        asString(row.id_route_day),
      )) as OldSchemaSnapshot[T];
    case "route_day_proposals":
      return [] as OldSchemaSnapshot[T];
    case "route_day_store_proposals":
      return [] as OldSchemaSnapshot[T];
    case "route_transactions":
      return await fetchModelsFromTable(client, "route_transactions", "origin-old", (row) => new OldRouteTransactionsModel(
        asString(row.date),
        asNumber(row.state),
        asString(row.id_route_transaction),
        asString(row.id_work_day),
        asString(row.id_store),
        asString(row.id_payment_method),
        asNumber(row.cash_received),
      )) as OldSchemaSnapshot[T];
    case "route_transaction_descriptions":
      return await fetchModelsFromTable(client, "route_transaction_descriptions", "origin-old", (row) => new OldRouteTransactionDescriptionsModel(
        asNumber(row.price_at_moment),
        asNumber(row.amount),
        asString(row.id_route_transaction_description),
        asString(row.id_route_transaction),
        asString(row.id_route_transaction_operation_type),
        asString(row.id_product),
        asNullableNumber(row.comission_at_moment),
        asString(row.created_at),
      )) as OldSchemaSnapshot[T];
    case "inventory_operations":
      return await fetchModelsFromTable(client, "inventory_operations", "origin-old", (row) => new OldInventoryOperationsModel(
        asString(row.sign_confirmation),
        asString(row.date),
        asNumber(row.audit),
        asString(row.id_inventory_operation),
        asString(row.id_inventory_operation_type),
        asString(row.id_work_day),
        asNumber(row.state),
      )) as OldSchemaSnapshot[T];
    case "inventory_operation_descriptions":
      return await fetchModelsFromTable(client, "inventory_operation_descriptions", "origin-old", (row) => new OldInventoryOperationDescriptionsModel(
        asNumber(row.amount),
        asNumber(row.price_at_moment),
        asString(row.id_inventory_operation),
        asString(row.id_product),
        asString(row.created_at),
        asString(row.id_inventory_operation_description),
      )) as OldSchemaSnapshot[T];
    default: {
      throw new Error("Unsupported old schema table.");
    }
  }
}

async function fetchNewSchemaSnapshot<T extends newDatabaseTableType>(
  client: SupabaseClientType,
  newTableType: T,
): Promise<NewSchemaSnapshot[T]> {
  switch (newTableType) {
    case "products":
      return await fetchModelsFromTable(client, "products", "target-new", (row) => new NewProductsModel(
        asString(row.id_product),
        asString(row.product_name),
        asNullableString(row.barcode),
        asNumber(row.cost),
        asNumber(row.product_status),
        asNumber(row.quantity_presentation),
        asNumber(row.order_to_show),
        asString(row.id_measurement_unit),
        asString(row.created_at),
      )) as NewSchemaSnapshot[T];
    case "product_prices":
      return await fetchModelsFromTable(client, "product_prices", "target-new", (row) => new NewProductPricesModel(
        asNumber(row.price),
        asString(row.created_at),
        asString(row.id_product),
        asNullableString(row.id_facility),
        asNullableString(row.id_location),
        asNullableString(row.id_route_day),
      )) as NewSchemaSnapshot[T];
    case "locations":
      return await fetchModelsFromTable(client, "locations", "target-new", (row) => new NewLocationsModel(
        asString(row.id_location),
        asString(row.street),
        asString(row.ext_number),
        asString(row.colony),
        asString(row.postal_code),
        asNullableString(row.address_reference),
        asString(row.location_name),
        asString(row.latitude),
        asString(row.longitude),
        asNumber(row.status_location),
        asString(row.id_creator),
        asString(row.id_client),
        asString(row.id_location_type),
        asString(row.created_at),
        asString(row.updated_at),
      )) as NewSchemaSnapshot[T];
    case "routes":
      return await fetchModelsFromTable(client, "routes", "target-new", (row) => new NewRoutesModel(
        asString(row.id_route),
        asString(row.route_name),
        asNullableString(row.description),
        asNumber(row.route_status),
      )) as NewSchemaSnapshot[T];
    case "work_days":
      return await fetchModelsFromTable(client, "work_days", "target-new", (row) => new NewWorkDaysModel(
        asString(row.id_work_day),
        asString(row.start_date),
        asNullableString(row.finish_date),
        asNumber(row.start_petty_cash),
        asNullableNumber(row.final_petty_cash),
        asString(row.id_route_day),
        asString(row.id_user),
        asNullableString(row.id_payment_stub),
      )) as NewSchemaSnapshot[T];
    case "route_days":
      return await fetchModelsFromTable(client, "route_days", "target-new", (row) => new NewRouteDaysModel(
        asString(row.id_route_day),
        asString(row.id_route),
        asString(row.id_day),
      )) as NewSchemaSnapshot[T];
    case "route_day_locations":
      return await fetchModelsFromTable(client, "route_day_locations", "target-new", (row) => new NewRouteDayLocationsModel(
        asNumber(row.position_in_route),
        asString(row.id_route_day_location),
        asString(row.id_location),
        asString(row.id_route_day),
      )) as NewSchemaSnapshot[T];
    case "route_day_proposals":
      return [] as NewSchemaSnapshot[T];
    case "route_day_location_proposals":
      return [] as NewSchemaSnapshot[T];
    case "transactions":
      return await fetchModelsFromTable(client, "transactions", "target-new", (row) => new NewTransactionsModel(
        asString(row.id_transaction),
        asNullableString(row.cfdi),
        asNumber(row.state),
        asNumber(row.received_amount),
        asNullableString(row.id_invoice_concept),
        asString(row.created_at),
        asNullableString(row.id_location),
        asString(row.id_client),
        asString(row.id_work_day),
        asString(row.id_payment_method),
        asString(row.id_payment_schema),
        asNullableString(row.latitude),
        asNullableString(row.longitude),
        asNullableString(row.created_by),
      )) as NewSchemaSnapshot[T];
    case "transaction_descriptions":
      return await fetchModelsFromTable(client, "transaction_descriptions", "target-new", (row) => new NewTransactionDescriptionsModel(
        asString(row.id_transaction_description),
        asString(row.id_transaction),
        asString(row.id_product),
        asString(row.id_transaction_operation_type),
        asNumber(row.price_at_moment),
        asNumber(row.cost_at_moment),
        asNumber(row.quantity),
        asString(row.created_at),
      )) as NewSchemaSnapshot[T];
    case "inventory_operations":
      return await fetchModelsFromTable(client, "inventory_operations", "target-new", (row) => new NewInventoryOperationsModel(
        asString(row.id_inventory_operation),
        asNullableString(row.document_reference),
        asNumber(row.movement_type),
        asNullableString(row.latitude),
        asNullableString(row.longitude),
        asNullableString(row.inventory_operation_reference),
        asString(row.created_by),
        asString(row.id_inventory_origin),
        asString(row.id_inventory_target),
        asString(row.created_at),
      )) as NewSchemaSnapshot[T];
    case "inventory_operation_descriptions":
      return await fetchModelsFromTable(client, "inventory_operation_descriptions", "target-new", (row) => new NewInventoryOperationDescriptionsModel(
        asString(row.id_inventory_operation_description),
        asString(row.id_inventory_operation),
        asString(row.id_product),
        asNumber(row.quantity),
        asNumber(row.price_at_moment),
        asNumber(row.cost_at_moment),
        asString(row.created_at),
      )) as NewSchemaSnapshot[T];
    case "work_day_operations_historic":
      return await fetchModelsFromTable(client, "work_day_operations_historic", "target-new", (row) => new WorkDayOperationHistoricModel(
        asString(row.id_operation_type),
        asString(row.created_at),
        asString(row.id_work_day),
        asString(row.id_route_day),
        asNullableString(row.latitude),
        asNullableString(row.longitude),
        asNullableString(row.id_route_transaction),
        asNullableString(row.id_inventory_operation),
        asNullableString(row.id_location),
        asNullableString(row.id_day_operation_dependent),
        asNullableString(row.id_work_day_operation) ?? undefined,
      )) as NewSchemaSnapshot[T];
    case "inventories":
      return await fetchModelsFromTable(client, "inventories", "target-new", (row) => new NewInventoriesModel(
        asString(row.id_inventory),
        asNumber(row.inventory_context),
        asNumber(row.is_active),
        asString(row.inventory_name),
        asNumber(row.stock_validation),
        asNullableString(row.assigned_to),
        asNullableString(row.assigned_facility),
        asString(row.created_by),
        asString(row.updated_at),
        asString(row.created_at),
      )) as NewSchemaSnapshot[T];
    case "inventory_configuration_for_operations":
      return await fetchModelsFromTable(client, "inventory_configuration_for_operations", "target-new", (row) => new NewInventoryConfigurationForOperationsModel(
        asString(row.id_inventory_configuration),
        asString(row.origin_inventory),
        asString(row.target_inventory),
        asString(row.created_by),
        asNullableString(row.user_assigned_to),
        asNullableString(row.facility_assigned_to),
        asString(row.inventory_operation_type),
        asString(row.created_at),
      )) as NewSchemaSnapshot[T];
    default: {
      throw new Error("Unsupported new schema table.");
    }
  }
}

async function getRowsToMigrate<
  TOldRow extends object,
  TNewRow extends object,
>(
  oldDbClient: SupabaseClientType,
  newDbClient: SupabaseClientType,
  originDbTable: oldDatabaseTableType,
  targetDbTable: newDatabaseTableType,
  getOriginId: (row: TOldRow) => string,
  getTargetId: (row: TNewRow) => string,
): Promise<TOldRow[]> {
  const [originRecords, targetRecords] = await Promise.all([
    fetchOldSchemaSnapshot(oldDbClient, originDbTable) as Promise<TOldRow[]>,
    fetchNewSchemaSnapshot(newDbClient, targetDbTable) as Promise<TNewRow[]>,
  ]);

  const targetIds = new Set(targetRecords.map(getTargetId));
  return filterMissingById<TOldRow>(originRecords, targetIds, getOriginId);
}

async function productProcess(oldDbClient: SupabaseClientType, newDbClient: SupabaseClientType): Promise<void> {
  console.log(`[Process] Starting product migration`);

  const rowsToMigrate = await getRowsToMigrate<OldProductsModel, NewProductsModel>(
    oldDbClient,
    newDbClient,
    "products",
    "products",
    (row) => row.id_product,
    (row) => row.id_product,
  );

  console.log(`[Process] Products to migrate: ${rowsToMigrate.length}. As part of the migration 'product price' record will be created.`);

  const currentDate = nowIso();

  const productRows = rowsToMigrate.map((row) => ({
    id_product: row.id_product,
    product_name: row.product_name,
    barcode: row.barcode,
    cost: 0,
    product_status: row.product_status,
    quantity_presentation: 0,
    order_to_show: row.order_to_show,
    id_measurement_unit: DEFAULT_MEASUREMENT_UNIT_ID,
    created_at: currentDate,
  }));

  const productPriceRows = rowsToMigrate.map((product) => ({ 
      price: product.price,
      created_at: currentDate,
      id_product: product.id_product,
      id_facility: null,
      id_location: null,
      id_route_day: null
  }));

  const insertedProducts = await insertRows(newDbClient, "products", productRows);
  const insertedProductsPrices = await insertRows(newDbClient, "product_prices", productPriceRows);

  console.log(`[Process] Inserted products: ${insertedProducts}`);
  console.log(`[Process] Inserted product prices: ${insertedProductsPrices}`);
}

async function locationProcess(originDbClient: SupabaseClientType, targetDbClient: SupabaseClientType): Promise<void> {
  console.log(`[Process] Starting location migration`);
  const idCreatorSet = new Set<string>();
  const rowsToMigrate = await getRowsToMigrate<OldStoresModel, NewLocationsModel>(
    originDbClient,
    targetDbClient,
    "stores",
    "locations",
    (row) => row.id_store,
    (row) => row.id_location,
  );

  console.log(`[Process] Locations to migrate: ${rowsToMigrate.length}.`);

  const locationRows = rowsToMigrate.map((row) => 
    {
      idCreatorSet.add(row.id_creator)
      return {
        id_location: row.id_store,
        street: row.street,
        ext_number: row.ext_number,
        colony: row.colony,
        postal_code: row.postal_code,
        address_reference: row.address_reference,
        location_name: row.store_name,
        latitude: row.latitude,
        longitude: row.longitude,
        status_location: row.status_store,
        id_creator: row.id_creator,
        id_client: DEFAULT_LOCATION_CLIENT_ID,
        id_location_type: DEFAULT_LOCATION_TYPE_ID,
        created_at: row.creation_date,
        updated_at: row.creation_date,
      }
    }
  );  
  console.info(`[Info] Set of id creators:`)
  idCreatorSet.forEach((value) => console.log(value))
  const insertedLocations = await insertRows(targetDbClient, "locations", locationRows);
  console.log(`[Process] Inserted locations: ${insertedLocations}`);

}

async function routeRecordsProcess(originDbClient: SupabaseClientType, targetDbClient: SupabaseClientType): Promise<void> {
  console.log(`[Process] Starting routes migration`);

  const routesToMigrate = await getRowsToMigrate<OldRoutesModel, NewRoutesModel>(
    originDbClient,
    targetDbClient,
    "routes",
    "routes",
    (row) => row.id_route,
    (row) => row.id_route,
  );

  console.log(`[Process] Routes to migrate: ${routesToMigrate.length}.`);

  const routeRows = routesToMigrate.map((row) => ({
    id_route: row.id_route,
    route_name: row.route_name,
    description: row.description,
    route_status: row.route_status,
  }));

  const insertedLocations = await insertRows(targetDbClient, "routes", routeRows);
  
  console.log(`[Process] Inserted routes: ${insertedLocations}`);

  console.log(`[Process] route_days to migrate: ${routesToMigrate.length}.`);

  const routeDaysToMigrate = await getRowsToMigrate<OldRouteDaysModel, NewRouteDaysModel>(
    originDbClient,
    targetDbClient,
    "route_days",
    "route_days",
    (row) => row.id_route_day,
    (row) => row.id_route_day,
  );

  const routeDayRows = routeDaysToMigrate.map((row) => ({
    id_route_day: row.id_route_day,
    id_route: row.id_route,
    id_day: row.id_day,
  }));

  const insertedRouteDays = await insertRows(targetDbClient, "route_days", routeDayRows);
  
  console.log(`[Process] Inserted route_days: ${insertedRouteDays}`);

  console.log(`[Process] Starting route_days_locations migration`);

  const routeDayLocationsToMigrate = await getRowsToMigrate<OldRouteDayStoresModel, NewRouteDayLocationsModel>(
    originDbClient,
    targetDbClient,
    "route_day_stores",
    "route_day_locations",
    (row) => row.id_route_day_store,
    (row) => row.id_route_day_location,
  );

  const routeDayLocationsRows = routeDayLocationsToMigrate.map((row) => ({
    position_in_route: row.position_in_route,
    id_route_day_location: row.id_route_day_store,
    id_location: row.id_store,
    id_route_day: row.id_route_day,
  }));

  const insertedRouteDayLocations = await insertRows(targetDbClient, "route_day_locations", routeDayLocationsRows);

  console.log(`[Process] Inserted route_day_locations: ${insertedRouteDayLocations}`);

}

async function workDayProcess(originDbClient: SupabaseClientType, targetDbClient: SupabaseClientType): Promise<void> {
  console.log(`[Process] Starting work_days migration.`);

  const rowsToMigrate = await getRowsToMigrate<OldWorkDaysModel, NewWorkDaysModel>(
    originDbClient,
    targetDbClient,
    "work_days",
    "work_days",
    (row) => row.id_work_day,
    (row) => row.id_work_day,
  );

  console.log(`[Process] Locations to migrate: ${rowsToMigrate.length}.`);  
  const workDayRows = rowsToMigrate.map((row) => ({
    id_work_day: row.id_work_day,
    start_date: row.start_date,
    finish_date: row.finish_date,
    start_petty_cash: row.start_petty_cash,
    final_petty_cash: row.final_petty_cash,
    id_route_day: row.id_route_day,
    id_user: row.id_vendor,
    id_payment_stub: null,
  }));

  const insertedWorkDays = await insertRows(targetDbClient, "work_days", workDayRows);
  console.log(`[Process] Inserted work_days: ${insertedWorkDays}.`);
}

async function transactionProcess(originDbClient: SupabaseClientType, targetDbClient: SupabaseClientType): Promise<void> {
  const transactionDescriptionByTransactionMap: Map<string, number> = new Map<string, number>()
  const transactionRows: NewTransactionsModel[] = [];
  const transactionDescriptionRows: NewTransactionDescriptionsModel[] = [];
  const dayOperationRows: WorkDayOperationHistoricModel[] = [];

  console.log(`[Process] Starting transaction migration.`)
  
  // Retrieve necessary information
  console.log(`[Process] Retrieving workdays.`)
  const workDays = await fetchNewSchemaSnapshot(targetDbClient, "work_days");
  
  console.log(`[Process] Retrieving product prices.`)
  const products = await fetchNewSchemaSnapshot(targetDbClient, "products");
  
  console.log(`[Process] Retrieving loctions.`)
  const locations = await fetchNewSchemaSnapshot(targetDbClient, "locations");
  
  const workDaysMap: Map<string, NewWorkDaysModel> = new Map<string, NewWorkDaysModel>();
  const productsMap: Map<string, NewProductsModel> = new Map<string, NewProductsModel>();
  const locationsMap: Map<string, NewLocationsModel> = new Map<string, NewLocationsModel>();
  
  products.forEach((product) => { productsMap.set(product.id_product, product) });
  workDays.forEach((workday) => { workDaysMap.set(workday.id_work_day, workday) });  
  locations.forEach((location) => { locationsMap.set(location.id_location, location) });

  // Retrieve transactions and transaction descriptions.
  console.log(`[Process] Retrieving transaction and transaction descriptions.`)
  const transactionToMigrate = await getRowsToMigrate<OldRouteTransactionsModel, NewTransactionsModel>(
    originDbClient,
    targetDbClient,
    "route_transactions",
    "transactions",
    (row) => row.id_route_transaction,
    (row) => row.id_transaction,
  );
  console.log(`[Process] All transactions (transaction with and without transaction descriptions): ${transactionToMigrate.length}.`);
  
  const descriptionsToMigrate = await getRowsToMigrate<OldRouteTransactionDescriptionsModel, NewTransactionDescriptionsModel>(
    originDbClient,
    targetDbClient,
    "route_transaction_descriptions",
    "transaction_descriptions",
    (row) => row.id_route_transaction_description,
    (row) => row.id_transaction_description,
  );

  // Transforming from origin models to new models.
  descriptionsToMigrate.forEach((row) => {
    const product = productsMap.get(row.id_product);

    // Keep tracking route transaction descriptions.
    const { id_route_transaction } = row; 
    if (transactionDescriptionByTransactionMap.has(id_route_transaction)) {
      const counter = transactionDescriptionByTransactionMap.get(id_route_transaction)!;
      transactionDescriptionByTransactionMap.set(id_route_transaction, counter + 1);
    } else {
      transactionDescriptionByTransactionMap.set(id_route_transaction, 1);
    }

    transactionDescriptionRows.push(
      {
        id_transaction_description: row.id_route_transaction_description,
        id_transaction: row.id_route_transaction,
        id_product: row.id_product,
        id_transaction_operation_type: row.id_route_transaction_operation_type,
        price_at_moment: row.price_at_moment,
        cost_at_moment: product?.cost ?? 0,
        quantity: row.amount,
        created_at: row.created_at,
      }
    );
  });

  transactionToMigrate.forEach((row) => {
    const { id_route_transaction } = row;
    const location = locationsMap.get(row.id_store);
    const workDay = workDaysMap.get(row.id_work_day);

    if (workDay === undefined) {
      throw new Error(`Error during transforming origin model to target model for transaction: work day with id ${row.id_work_day} doesn't exist`)
    }

    // Ignoring transactions that doesn't have descriptions (movements)
    if(transactionDescriptionByTransactionMap.has(id_route_transaction)) {      
      transactionRows.push(
        {
          id_transaction: row.id_route_transaction,
          cfdi: null,
          state: row.state,
          received_amount: row.cash_received,
          id_invoice_concept: null,
          created_at: row.date,
          id_location: row.id_store,
          id_client: DEFAULT_LOCATION_CLIENT_ID,
          id_work_day: row.id_work_day,
          id_payment_method: row.id_payment_method,
          id_payment_schema: DEFAULT_PAYMENT_SCHEMA_ID,
          latitude: location?.latitude ?? null,
          longitude: location?.longitude ?? null,
          created_by: workDay?.id_user ?? null,
        }
      );
    }

    // For each transaction, create a visit for that client.
    dayOperationRows.push(
      new WorkDayOperationHistoricModel(
        VISIT_DAY_OPERATION,
        row.date,
        row.id_work_day,
        workDay.id_route_day,
        location?.latitude ?? null,
        location?.longitude ?? null,
        row.id_route_transaction,
        null,
        row.id_store,
        null,
        crypto.randomUUID()
      )
    );
  });

  console.log(`[Process] Transactions to migrate (only transactions with at least one transaction description): ${transactionRows.length}.`);
  console.log(`[Process] Transaction descriptions to migrate: ${transactionDescriptionRows.length}.`);
  console.log(`[Process] Day operations to to migrate: ${dayOperationRows.length}.`);

  const insertedTransactions = await insertRows(targetDbClient, "transactions", transactionRows);
  console.log(`[Process] Inserted transactions: ${insertedTransactions}`);

  const insertedTransactionDescriptions = await insertRows(targetDbClient, "transaction_descriptions", transactionDescriptionRows);
  console.log(`[Process] Inserted transaction descriptions: ${insertedTransactionDescriptions}`);

  const insertedDayOperations = await insertRows(targetDbClient, "work_day_operations_historic", dayOperationRows);
  console.log(`[Process] Inserted transaction descriptions: ${insertedDayOperations}`);

}

async function createVisitForTransactions(originDbClient: SupabaseClientType, targetDbClient: SupabaseClientType) {
  const dayOperationRows: WorkDayOperationHistoricModel[] = [];
  console.log(`[Process] Starting process for create a visit per transaction.`);
  const transaction = await fetchOldSchemaSnapshot(originDbClient, "route_transactions");

  // Retrieve necessary information
  console.log(`[Process] Retrieving workdays.`)
  const workDays = await fetchNewSchemaSnapshot(targetDbClient, "work_days");
  
  console.log(`[Process] Retrieving product prices.`)
  const products = await fetchNewSchemaSnapshot(targetDbClient, "products");
  
  console.log(`[Process] Retrieving loctions.`)
  const locations = await fetchNewSchemaSnapshot(targetDbClient, "locations");
  
  const workDaysMap: Map<string, NewWorkDaysModel> = new Map<string, NewWorkDaysModel>();
  const productsMap: Map<string, NewProductsModel> = new Map<string, NewProductsModel>();
  const locationsMap: Map<string, NewLocationsModel> = new Map<string, NewLocationsModel>();
  
  products.forEach((product) => { productsMap.set(product.id_product, product) });
  workDays.forEach((workday) => { workDaysMap.set(workday.id_work_day, workday) });  
  locations.forEach((location) => { locationsMap.set(location.id_location, location) });

  transaction.forEach((row) => {
    const location = locationsMap.get(row.id_store);
    const workDay = workDaysMap.get(row.id_work_day);

    if (workDay === undefined) {
      throw new Error(`Error during transforming origin model to target model for transaction: work day with id ${row.id_work_day} doesn't exist`)
    }

    // For each transaction, create a visit for that client.
    dayOperationRows.push(
      new WorkDayOperationHistoricModel(
        VISIT_DAY_OPERATION,
        row.date,
        row.id_work_day,
        workDay.id_route_day,
        location?.latitude ?? null,
        location?.longitude ?? null,
        row.id_route_transaction,
        null,
        row.id_store,
        null,
        crypto.randomUUID()
      )
    );
  });

  console.log(`[Process] Day operations to to migrate: ${dayOperationRows.length}.`);

  const insertedDayOperations = await insertRows(targetDbClient, "work_day_operations_historic", dayOperationRows);
  console.log(`[Process] Inserted transaction descriptions: ${insertedDayOperations}`);
}

async function inventoryOperationProcess(originDbClient: SupabaseClientType, targetDbClient: SupabaseClientType): Promise<void> {
  console.log(`[Process] Starting inventory_operation migration.`);

  const workDaysMap: Map<string, NewWorkDaysModel> = new Map<string, NewWorkDaysModel>();
  const productsMap: Map<string, NewProductsModel> = new Map<string, NewProductsModel>();
  const inventoryOperationMap: Map<string, OldInventoryOperationsModel> = new Map<string, OldInventoryOperationsModel>();
  const inventoriesMap: Map<string, Map<number, string>> = new Map<string, Map<number, string>>();
  const inventoryOperationDescriptionsMap: Map<string, NewInventoryOperationDescriptionsModel[]> = new Map<string, NewInventoryOperationDescriptionsModel[]>();

  // Retrieve necessary information
  console.log(`[Process] Retrieving workdays.`)
  const workDays = await fetchNewSchemaSnapshot(targetDbClient, "work_days");
  
  console.log(`[Process] Retrieving product prices.`)
  const products = await fetchNewSchemaSnapshot(targetDbClient, "products");
  
  console.log(`[Process] Retrieving product prices.`)
  const inventories = await fetchNewSchemaSnapshot(targetDbClient, "inventories");
  
  console.log(`[Process] Retrieving inventory operation from origin database.`)
  const inventoryOperation = await fetchOldSchemaSnapshot(originDbClient, "inventory_operations");

  products.forEach((product) => { productsMap.set(product.id_product, product) });
  workDays.forEach((workday) => { workDaysMap.set(workday.id_work_day, workday) });  
  inventoryOperation.forEach((invOp) => { inventoryOperationMap.set(invOp.id_inventory_operation, invOp) });  

  // Mapping all users
  inventories.forEach((inventory) => { 
    const { id_inventory, inventory_context, assigned_to } = inventory;

    if (assigned_to !== null) {
      if (inventoriesMap.has(assigned_to)) {
        const userInventories: Map<number, string> = inventoriesMap.get(assigned_to)!;
        userInventories.set(inventory_context, id_inventory);
        inventoriesMap.set(assigned_to, userInventories);
      } else {
        const userInventories: Map<number, string> = new Map<number, string>();
        userInventories.set(inventory_context, id_inventory);
        inventoriesMap.set(assigned_to, userInventories);
      }
    }
  });
  
  console.log("[Process] Retrieving inventory operations to migrate.");
  const inventoryOperationsToMigrate = await getRowsToMigrate<OldInventoryOperationsModel, NewInventoryOperationsModel>(
    originDbClient,
    targetDbClient,
    "inventory_operations",
    "inventory_operations",
    (row) => row.id_inventory_operation,
    (row) => row.id_inventory_operation,
  );

  console.log("[Process] Retrieving inventory operations descriptions to migrate.");
  const inventoryOperationDescriptionsToMigrate = await getRowsToMigrate<OldInventoryOperationDescriptionsModel, NewInventoryOperationDescriptionsModel>(
    originDbClient,
    targetDbClient,
    "inventory_operation_descriptions",
    "inventory_operation_descriptions",
    (row) => row.id_inventory_operation_description,
    (row) => row.id_inventory_operation_description,
  );


  console.log("[Process] For the following transaformations, it's important to consider the following warnings.");
  console.warn(`[Warning] The user that owns an inventory operation must have all the inventories: PRODUCT_RESERVATION (${INVENTORY_CONTEXT_ENUM.PRODUCT_RESERVATION}), AVAILABLE_FOR_SALE (${INVENTORY_CONTEXT_ENUM.AVAILABLE_FOR_SALE}), SHRINKAGE (${INVENTORY_CONTEXT_ENUM.SHRINKAGE}).`);
  console.warn(`[Warning] All of the inventory operations that implies an WAREHOUSE inventory will be set as default to const DEFAULT_WAREHOUSE_ID (${DEFAULT_WAREHOUSE_ID}) which is the main warehouse at the moment.`);
  console.warn(`[Warning] All of the inventory operations that implies an DEVOLUTION WAREHOUSE inventory will be set as default to const DEFAULT_WAREHOUSE_ID (${DEFAULT_WAREHOUSE_DEVOLUTION_ID}) which is the main warehouse at the moment.`);
  
  console.log("[Process] Transforming from origin model to target model for inventory operations.");
  const inventoryOperationRows = inventoryOperationsToMigrate.map((row) => {
    let originInventory:string = "";
    let targetInventory: string = "";
    let movementType: MOVEMENT_TYPE_ENUM = MOVEMENT_TYPE_ENUM.INTERNAL_MOVEMENT;
    
    const workDay = workDaysMap.get(row.id_work_day);
    
    if (!workDay) {
      throw new Error(
        `Cannot map inventory operation '${row.id_inventory_operation}' because work_day '${row.id_work_day}' is missing in target database.`,
      );
    }
    
    const { id_user } = workDay;

    const userInventories = inventoriesMap.get(id_user);

    if (userInventories === undefined) throw new Error(`Error during inventory operation migration. It was not possible to find the inventories of the user: ${id_user}.`)

    if(userInventories.get(INVENTORY_CONTEXT_ENUM.PRODUCT_RESERVATION) === undefined) 
      throw new Error(`Error during inventory operation migration. The user ${id_user} doesn't have a inventory of context PRODUCT_RESERVATION (${INVENTORY_CONTEXT_ENUM.PRODUCT_RESERVATION})`);

    if(userInventories.get(INVENTORY_CONTEXT_ENUM.AVAILABLE_FOR_SALE) === undefined) 
      throw new Error(`Error during inventory operation migration. The user ${id_user} doesn't have a inventory of type AVAILABLE_FOR_SALE (${INVENTORY_CONTEXT_ENUM.AVAILABLE_FOR_SALE})`);

    if(userInventories.get(INVENTORY_CONTEXT_ENUM.SHRINKAGE) === undefined) 
      throw new Error(`Error during inventory operation migration. The user ${id_user} doesn't have a inventory of type SHRINKAGE (${INVENTORY_CONTEXT_ENUM.SHRINKAGE})`);


    if (row.id_inventory_operation_type as ROUTE_INVENTORY_OPERATION_TYPE === ROUTE_INVENTORY_OPERATION_TYPE.start_shift_inventory) {
      movementType = MOVEMENT_TYPE_ENUM.INTERNAL_MOVEMENT;
      originInventory = userInventories.get(INVENTORY_CONTEXT_ENUM.PRODUCT_RESERVATION)!;
      targetInventory = userInventories.get(INVENTORY_CONTEXT_ENUM.AVAILABLE_FOR_SALE)!;
    } else if (row.id_inventory_operation_type as ROUTE_INVENTORY_OPERATION_TYPE === ROUTE_INVENTORY_OPERATION_TYPE.restock_inventory) {
      movementType = MOVEMENT_TYPE_ENUM.INTERNAL_MOVEMENT;
      originInventory = DEFAULT_WAREHOUSE_ID;
      targetInventory = userInventories.get(INVENTORY_CONTEXT_ENUM.AVAILABLE_FOR_SALE)!;
    } else if (row.id_inventory_operation_type as ROUTE_INVENTORY_OPERATION_TYPE === ROUTE_INVENTORY_OPERATION_TYPE.product_devolution_inventory) {
      movementType = MOVEMENT_TYPE_ENUM.INTERNAL_MOVEMENT;
      originInventory = userInventories.get(INVENTORY_CONTEXT_ENUM.AVAILABLE_FOR_SALE)!
      targetInventory = DEFAULT_WAREHOUSE_DEVOLUTION_ID;
    } else if (row.id_inventory_operation_type as ROUTE_INVENTORY_OPERATION_TYPE === ROUTE_INVENTORY_OPERATION_TYPE.end_shift_inventory) {
      movementType = MOVEMENT_TYPE_ENUM.INTERNAL_MOVEMENT;
      originInventory = userInventories.get(INVENTORY_CONTEXT_ENUM.AVAILABLE_FOR_SALE)!;
      targetInventory = DEFAULT_WAREHOUSE_ID;
    } else {
      throw new Error(`inventory`)
    }

    return {
      id_inventory_operation: row.id_inventory_operation,
      document_reference: null,
      movement_type: movementType,
      latitude: null,
      longitude: null,
      inventory_operation_reference: null,
      created_by: workDay.id_user,
      id_inventory_origin: originInventory,
      id_inventory_target: targetInventory,
      created_at: row.date,
    };
  });

  console.log(`[Process] Inventory operations to migrate: ${inventoryOperationRows.length}.`);

  const inventoryOperationDescriptionRows = inventoryOperationDescriptionsToMigrate.map((row) => {
    const product = productsMap.get(row.id_product);
    const inventoryOperationDesc = {
      id_inventory_operation_description: row.id_inventory_operation_description,
      id_inventory_operation: row.id_inventory_operation,
      id_product: row.id_product,
      quantity: row.amount,
      price_at_moment: row.price_at_moment,
      cost_at_moment: product?.cost ?? 0,
      created_at: row.created_at,
    };


    const inventoryOperationDescriptions:NewInventoryOperationDescriptionsModel[]|undefined = inventoryOperationDescriptionsMap.get(row.id_inventory_operation);
    
    if(inventoryOperationDescriptions === undefined) inventoryOperationDescriptionsMap.set(row.id_inventory_operation, [ inventoryOperationDesc ]);
    else {
      inventoryOperationDescriptions.push(inventoryOperationDesc);
      inventoryOperationDescriptionsMap.set(row.id_inventory_operation, inventoryOperationDescriptions);
    }
    

    return inventoryOperationDesc;
  });

  console.log(`[Process] Inventory operations descriptions to migrate: ${inventoryOperationDescriptionRows.length}.`);

  console.log("[Process] Transforming from origin model to target model for cancelation inventory operations.");
  const cancelInventoryOperations: NewInventoryOperationsModel[] = [];
  const cancelInventoryOperationsDescriptions: NewInventoryOperationDescriptionsModel[] = [];

  inventoryOperationsToMigrate.forEach((row) => {
    const { state, id_inventory_operation_type } = row;
    let originInventory:string = "";
    let targetInventory: string = "";
    let movementType: MOVEMENT_TYPE_ENUM = MOVEMENT_TYPE_ENUM.INTERNAL_MOVEMENT;

    if (state === 0) {
      const workDay = workDaysMap.get(row.id_work_day);
      
      if (!workDay)
        throw new Error(`Cannot map inventory operation '${row.id_inventory_operation}' because work_day '${row.id_work_day}' is missing in target database.`);
      
      const { id_user } = workDay;
  
      const userInventories = inventoriesMap.get(id_user);
      
      if (userInventories === undefined) throw new Error(`Error during inventory operation migration. It was not possible to find the inventories of the user: ${id_user}.`)
  
      if(userInventories.get(INVENTORY_CONTEXT_ENUM.PRODUCT_RESERVATION) === undefined) 
        throw new Error(`Error during inventory operation migration. The user ${id_user} doesn't have a inventory of context PRODUCT_RESERVATION (${INVENTORY_CONTEXT_ENUM.PRODUCT_RESERVATION})`);
  
      if(userInventories.get(INVENTORY_CONTEXT_ENUM.AVAILABLE_FOR_SALE) === undefined) 
        throw new Error(`Error during inventory operation migration. The user ${id_user} doesn't have a inventory of type AVAILABLE_FOR_SALE (${INVENTORY_CONTEXT_ENUM.AVAILABLE_FOR_SALE})`);
  
      if(userInventories.get(INVENTORY_CONTEXT_ENUM.SHRINKAGE) === undefined) 
        throw new Error(`Error during inventory operation migration. The user ${id_user} doesn't have a inventory of type SHRINKAGE (${INVENTORY_CONTEXT_ENUM.SHRINKAGE})`);
  
      if (id_inventory_operation_type as ROUTE_INVENTORY_OPERATION_TYPE === ROUTE_INVENTORY_OPERATION_TYPE.start_shift_inventory) {
        movementType = MOVEMENT_TYPE_ENUM.INTERNAL_MOVEMENT;
        targetInventory = userInventories.get(INVENTORY_CONTEXT_ENUM.PRODUCT_RESERVATION)!;
        originInventory = userInventories.get(INVENTORY_CONTEXT_ENUM.AVAILABLE_FOR_SALE)!;
      } else if (row.id_inventory_operation_type as ROUTE_INVENTORY_OPERATION_TYPE === ROUTE_INVENTORY_OPERATION_TYPE.restock_inventory) {
        movementType = MOVEMENT_TYPE_ENUM.INTERNAL_MOVEMENT;
        targetInventory = DEFAULT_WAREHOUSE_ID;
        originInventory = userInventories.get(INVENTORY_CONTEXT_ENUM.AVAILABLE_FOR_SALE)!;
      } else if (id_inventory_operation_type as ROUTE_INVENTORY_OPERATION_TYPE === ROUTE_INVENTORY_OPERATION_TYPE.product_devolution_inventory) {
        movementType = MOVEMENT_TYPE_ENUM.INTERNAL_MOVEMENT;
        targetInventory = userInventories.get(INVENTORY_CONTEXT_ENUM.AVAILABLE_FOR_SALE)!
        originInventory = DEFAULT_WAREHOUSE_DEVOLUTION_ID;
      } else if (id_inventory_operation_type as ROUTE_INVENTORY_OPERATION_TYPE === ROUTE_INVENTORY_OPERATION_TYPE.end_shift_inventory) {
        movementType = MOVEMENT_TYPE_ENUM.INTERNAL_MOVEMENT;
        targetInventory = userInventories.get(INVENTORY_CONTEXT_ENUM.AVAILABLE_FOR_SALE)!;
        originInventory = DEFAULT_WAREHOUSE_ID;
      } else {
        throw new Error(`inventory`)
      }
      
      const inventoryOperationCancelation = crypto.randomUUID();

      cancelInventoryOperations.push(
        {
          id_inventory_operation: inventoryOperationCancelation,
          document_reference: null,
          movement_type: movementType,
          latitude: null,
          longitude: null,
          inventory_operation_reference: row.id_inventory_operation,
          created_by: workDay.id_user,
          id_inventory_origin: originInventory,
          id_inventory_target: targetInventory,
          created_at: row.date,
        }
      );

      const inventoryOperationDescriptionsCancelled = inventoryOperationDescriptionsMap.get(row.id_inventory_operation)

      if(inventoryOperationDescriptionsCancelled !== undefined) {
        inventoryOperationDescriptionsCancelled.forEach((invOpDesc) => {
          cancelInventoryOperationsDescriptions.push(
            {
              id_inventory_operation_description: crypto.randomUUID(),
              id_inventory_operation: row.id_inventory_operation,
              id_product: invOpDesc.id_product,
              quantity: invOpDesc.quantity,
              price_at_moment: invOpDesc.price_at_moment,
              cost_at_moment: invOpDesc.cost_at_moment,
              created_at: invOpDesc.created_at,
            }
          );
        });
      }
    }
  });

  console.log(`[Process] Inventory operations cancelled to migrate: ${cancelInventoryOperations.length}.`);
  console.log(`[Process] Inventory operations descriptions cancelled to migrate: ${cancelInventoryOperationsDescriptions.length}.`);
  
  
  const insertedInventoryOperations = await insertRows(
    targetDbClient,
    "inventory_operations",
    inventoryOperationRows,
  );
  console.log(`[Process] Inventory operations inserted: ${insertedInventoryOperations}.`);

  const insertedInventoryOperationDescriptions = await insertRows(
    targetDbClient,
    "inventory_operation_descriptions",
    inventoryOperationDescriptionRows,
  );  
  console.log(`[Process] Inventory operations inserted: ${insertedInventoryOperationDescriptions}.`);
  
  const insertedInventoryOperationsCancelled = await insertRows(
    targetDbClient,
    "inventory_operations",
    inventoryOperationRows,
  );
  console.log(`[Process] Inventory operations cancelled inserted: ${insertedInventoryOperationsCancelled}.`);

  const insertedInventoryOperationDescriptionsCancelled = await insertRows(
    targetDbClient,
    "inventory_operation_descriptions",
    inventoryOperationDescriptionRows,
  );  
  console.log(`[Process] Inventory operations cancelled inserted: ${insertedInventoryOperationDescriptionsCancelled}.`);
}

// Supabase client
export class SupabaseDataSource {
  private client: SupabaseClientType;

  constructor(supabaseUrl?: string, supabaseAnonKey?: string) {

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        'Supabase credentials not found in environment variables.',
      );
    }

    this.client = createClient(supabaseUrl, supabaseAnonKey);
  }

  getClient(): SupabaseClientType {
    return this.client;
  }
}


async function migrateScript() {
  const supabaseOriginDataSource: SupabaseDataSource = new SupabaseDataSource(
    process.env.PUBLIC_ORIGIN_SUPABASE_URL, 
    process.env.PUBLIC_ORIGIN_SUPABASE_ANON_KEY
  );
  const supabaseTargetDataSource: SupabaseDataSource = new SupabaseDataSource(
    process.env.PUBLIC_TARGET_SUPABASE_URL, 
    process.env.PUBLIC_TARGET_SUPABASE_ANON_KEY
  );
  
  // await productProcess(supabaseOriginDataSource.getClient(), supabaseTargetDataSource.getClient());
  // await locationProcess(supabaseOriginDataSource.getClient(), supabaseTargetDataSource.getClient());
  // await routeRecordsProcess(supabaseOriginDataSource.getClient(), supabaseTargetDataSource.getClient());
  // await workDayProcess(supabaseOriginDataSource.getClient(), supabaseTargetDataSource.getClient());
  // await transactionProcess(supabaseOriginDataSource.getClient(), supabaseTargetDataSource.getClient());
  
  // Special process
  await createVisitForTransactions(supabaseOriginDataSource.getClient(), supabaseTargetDataSource.getClient());
  
  await inventoryOperationProcess(supabaseOriginDataSource.getClient(), supabaseTargetDataSource.getClient());


  /*
  Origin database - Target database    

  // Substep 4.1 - Insert 0-dependency records.  
    products                          -> products
      product_name - product_name
      barcode - barcode
      weight - <doesn't exist>
      unit - <doesn't exist>
      comission - <doesn't exist>
      price - <record in product_price table>*
      <doesn't exist> - cost = Let it in 0
      product_status - product_status
      <doesn't exist> - quantity_presentation = Let it in 0
      order_to_show - order_to_show
      id_product - id_product
      <doesn't exist> - id_measurement_unit = Let it in 4ec2e2fc-625b-4b45-a75f-4b028fb32ea0
      <doesn't exist> - created_at = Let it in Now()
      
      For price, you'll create a record in 'product_prices'
        id_product_price = Ignore it (db autogenerated)
        price = price (from origin database)
        created_at = now()
        id_product = id_product
        id_facility = NULL
        id_location = NULL
        id_route_day = NULL

    stores                            -> locations
      street - street
      ext_number - ext_number
      colony - colony
      postal_code - postal_code
      address_reference - address_reference
      store_name - location_name
      owner_name - <doesn't exist>
      cellphone - <doesn't exist>
      latitude - latitude
      longitude - longitude
      creation_date - created_at
      creation_context - <doesn't exist>
      status_store - status_location
      id_creator - id_creator
      id_store - id_location
      <doesn't exist> - id_client = '041c6093-a97b-4f4c-ab8e-6d1e35689555'
      <doesn't exist> - id_location_type = 'c272bb96-cf1a-4d8f-8598-179e6869847a'
      <doesn't exist> - updated_at = Let it in Now() (or creation_date)

    routes                            -> routes
      route_name - route_name
      description - description
      route_status - route_status
      id_route - id_route
      id_vendor - <doesn't exist>

    workdays                          -> work_days
      start_date - start_date
      finish_date - finish_date
      id_work_day - id_work_day
      id_route - <doesn't exist>
      id_vendor - id_user
      id_commission - <doesn't exist>
      start_petty_cash - start_petty_cash
      final_petty_cash - final_petty_cash
      comment - <doesn't exist>
      id_route_day - id_route_day
      <doesn't exist> - id_payment_stub = NULL

  // Substep 4.2 Insert records about locations and routes.
    route_days                        -> route_days
      id_route_day - id_route_day
      id_route - id_route
      id_day - id_day
      
    route_day_stores                  -> route_day_locations
      position_in_route - position_in_route
      id_route_day_store - id_route_day_location
      id_store - id_location
      id_route_day - id_route_day

    route_day_proposals               -> route_day_proposals
      id_route_day_proposal - id_route_day_proposal
      proposal_name - proposal_name
      created_at - created_at
      id_route_day - id_route_day

    route_day_store_proposals         -> route_day_location_proposals
      id_route_day_store - id_route_day_location_proposal
      created_at - <doesn't exist>
      position_in_route - position_in_route
      id_route_day_proposal - id_route_day_proposal
      id_store - id_location

  // Substep 4.4 Retrieving updated records from target database.
    - Retrieve product
    - Retrieve locations
    - Retrieve work_days
    
    - Create a map for fast retrieving. 

    
  // Substep 4.5 Insert records about transactions.
    route_transactions                -> transactions
      date - created_at
      state - state
      id_route_transaction - id_transaction
      id_work_day - id_work_day
      id_store - id_location
      id_payment_method - id_payment_method
      cash_received - received_amount
      <doesn't exist> - cfdi = NULL
      <doesn't exist> - id_invoice_concept = NULL
      <doesn't exist> - id_client = '041c6093-a97b-4f4c-ab8e-6d1e35689555'
      <doesn't exist> - id_payment_schema = 'a5c8cb96-860c-4f40-bff2-3fb80fde2ef4'
      <doesn't exist> - latitude = From retrieved location, search in locations map the location that refers "id_location" and retrieve latitude
      <doesn't exist> - longitude = From retrieved location, search in locations map the location that refers "id_location" and retrieve latitude
      <doesn't exist> - created_by = From retrieved work_days, search in work day map the workday that refers "id_work_day" and retrieve id_user

    route_transaction_descriptions    -> transaction_descriptions
      price_at_moment - price_at_moment
      amount - quantity
      id_route_transaction_description - id_transaction_description
      id_route_transaction - id_transaction
      id_route_transaction_operation_type - id_transaction_operation_type
      id_product - id_product
      comission_at_moment - <doesn't exist>
      created_at - created_at
      <doesn't exist> - cost_at_moment = From retrieved product, search in product map the product that refers "id_product" and retrieve cost

     

  // Substep 4.6 Insert records about inventories.
    inventory_operations              -> inventory_operations***************************************************
      
    Logic for finding the correct information:
      - From retrieved work_days, search in work day map the workday that refers "id_work_day" of inventory_operations and retrieve id_user
      - Once you get the 

      <doesn't exist> - created_by = id_user
      <doesn't exist> - id_inventory_origin = <assign origin inventory UUID>
      <doesn't exist> - id_inventory_target = <assign target inventory UUID>
      <doesn't exist> - movement_type = <assign movement type int2>
      date - created_at
      id_inventory_operation - id_inventory_operation
      <doesn't exist> - document_reference = NULL
      <doesn't exist> - latitude = NULL
      <doesn't exist> - longitude = NULL
      <doesn't exist> - inventory_operation_reference = NULL
      id_inventory_operation_type - <doesn't exist>
      id_work_day - <doesn't exist>
      state - <doesn't exist>
      sign_confirmation - <doesn't exist>
      audit - <doesn't exist>

    inventory_operation_descriptions  -> inventory_operation_descriptions
      amount - quantity
      price_at_moment - price_at_moment
      id_inventory_operation - id_inventory_operation
      id_product - id_product
      created_at - created_at
      id_inventory_operation_description - id_inventory_operation_description
      <doesn't exist> - cost_at_moment = From retrieved product, search in product map the product that refers "id_product" and retrieve cost
  */
}


migrateScript().catch((error) => {
  console.error("Migration script failed:", error);
  process.exitCode = 1;
});