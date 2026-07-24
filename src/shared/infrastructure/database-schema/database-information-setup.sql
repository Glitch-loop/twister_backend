-- This file contians the information needed for the system to work properly.

-- 0-dependency information.
-- Users
INSERT INTO "public"."users" ("id_user", "cellphone", "name", "password", "status", "address", "rfc", "imss", "salary", "created_at", "updated_at") VALUES ('f228a6e5-b427-4c0e-91d8-f4bebed80469', '0000000000', 'SYSTEM', '123456789', 1, null, null, null, '0', '2026-06-06 01:20:47+00', '2026-06-06 01:20:55+00');

-- Clients
INSERT INTO "public"."clients" ("id_client", "legal_name", "postal_code", "fiscal_regime", "name", "cellphone", "email", "created_at", "updated_at") VALUES ('041c6093-a97b-4f4c-ab8e-6d1e35689555', 'PÚBLICO EN GENERAL', '48327', '616 – Sin obligaciones fiscales', 'PÚBLICO EN GENERAL', '0000000000', 'Ninguno', '2026-05-13 19:01:48+00', '2026-05-13 19:01:52+00');

-- Days 
INSERT INTO "public"."days" ("day_name", "id_day", "order_to_show") VALUES ('jueves', '32e6bbe3-75f9-4554-909e-4759b3300b5b', 4), ('viernes', '5ffd4fe6-6441-4db9-ae95-0902d1b28e43', 5), ('sabado', '792014f7-e29b-45b8-b5fe-0c542a25f2b4', 6), ('martes', '81d535dc-defb-448b-b0e3-83816925765d', 2), ('lunes', 'b1bb1619-392c-4f7e-b615-f8b3da7223b4', 1), ('miercoles', 'f99e5c5f-931d-4466-9e4a-bb4297891c96', 3);

-- Facility types
INSERT INTO "public"."facility_types" ("id_facility_type", "created_at", "facility_type_name") VALUES ('b12d5742-c21d-45e7-b722-2102cf813868', '2026-06-06 00:19:04.541638', 'fabrica');

-- Location types
INSERT INTO "public"."location_types" ("id_location_type", "location_type_name", "created_at") VALUES ('77d29000-4eaa-433a-b9e0-3ac60623bf09', 'puesto', '2026-05-12 23:11:27.272537+00'), ('8ce0d3db-bece-44f2-ac06-88c27294d4f6', 'carniceria', '2026-05-12 23:11:27.272537+00'), ('a188c43a-0397-474a-a3ce-b4ee041a1cc5', 'minisuper', '2026-05-12 23:11:27.272537+00'), ('b73c7f59-5349-4447-9d7c-3b51cc740b5b', 'fruteria', '2026-05-12 23:11:27.272537+00'), ('c272bb96-cf1a-4d8f-8598-179e6869847a', 'abarrotes', '2026-05-12 23:11:27.272537+00'), ('d09bfbfe-e3bd-4ec8-a405-a94c8388965d', 'deposito', '2026-05-12 23:11:27.272537+00'), ('e5400811-cd1f-4e1f-a898-7ef3c3b5f301', 'verdureria', '2026-05-17 13:15:48.375+00');

-- measurements units
INSERT INTO "public"."measurements_units" ("id_measurement_unit", "measurement_unit_name") VALUES ('4ec2e2fc-625b-4b45-a75f-4b028fb32ea0', 'gramos');

-- Organization strategies
INSERT INTO "public"."organization_strategies" ("id_organization_strategy", "organization_strategy_name", "is_used", "created_at") VALUES ('261cc5e1-26f1-43fb-b8cf-fd7eae9de4f2', 'Ultimo en ruta', 0, '2026-05-28 23:26:22+00'), ('c2579ae3-697e-4172-af83-200fe1ee5b9d', 'Despues de la ultima tienda visitada
', 1, '2026-05-28 23:26:57+00');

-- Payment methods
INSERT INTO "public"."payment_method" ("id_payment_method", "payment_method_name") VALUES ('0706f60e-69ae-462f-946e-450be1f914a6', 'credit card'), ('412ad9d7-b51a-4a25-9f10-ff61b4c8bd27', 'debit card'), ('52757755-1471-44c3-b6d5-07f7f83a0f6f', 'cash'), ('b68e6be3-8919-41dd-9d09-6527884e162e', 'transfer');

-- Payment schemas
INSERT INTO "public"."payment_schema" ("id_payment_schema", "payment_schema_type") VALUES ('0184d0e0-c9b6-4758-b757-dea6adb28bc5', 'DEFERRED'), ('a5c8cb96-860c-4f40-bff2-3fb80fde2ef4', 'INMMEDIATE');

-- Route transaction operation types
INSERT INTO "public"."route_transaction_operation_types" ("id_route_transaction_operation_type", "transcation_operation_type_name") VALUES ('8ebe4f07-d28e-46f5-988e-3ab3790e612d', 'product devolution'), ('992f002c-13e2-4fb8-ac20-b7b571b9162a', 'sales'), ('ec313b8e-ba1d-4a77-bbfb-bb662663720c', 'product reposition'), ('f77da214-a8e8-480b-ac8d-e41d2ed6c5af', 'courtesy');

-- Information with dependencies.
-- Facilities (Once facilities module is completed this information will not be necessary)*
INSERT INTO "public"."facilities" ("created_at", "ext_number", "colony", "postal_code", "facility_name", "latitude", "longitude", "is_active", "id_facility_type", "street", "id_facility") VALUES ('2026-06-06 01:38:19+00', '171', 'independencia', '48327', 'Fabrica independencia', '20.643443242575312', '-105.20952345690593', 1, 'b12d5742-c21d-45e7-b722-2102cf813868', 'allende', 'f2a31d77-7124-4103-b320-4b7ab5babbb4');

-- Virtual Inventories
INSERT INTO "public"."inventories" ("id_inventory", "inventory_context", "is_active", "updated_at", "created_at", "assigned_to", "assigned_facility", "created_by", "inventory_name", "stock_validation") VALUES ('cc236a57-986d-44bd-b915-ccfb057c1205', 7, 1, '2026-07-08 15:24:46', '2026-07-08 15:24:47', null, null, 'f228a6e5-b427-4c0e-91d8-f4bebed80469', 'INVENTORY_SUPPLIER_VIRTUAL', 0), ('d2673e48-cb64-43ff-8f95-f0a7f86fc6c5', 6, 1, '2026-06-30 15:19:51.956', '2026-06-30 15:19:51.956', null, null, 'f228a6e5-b427-4c0e-91d8-f4bebed80469', 'WASTED_VIRTUAL_INVENTORY', 0), ('ec802734-2ac9-4d61-ac3b-1b412d9c267b', 5, 1, '2026-07-08 15:23:52', '2026-07-08 15:23:55', null, null, 'f228a6e5-b427-4c0e-91d8-f4bebed80469', 'CLIENT_VIRTUAL', 0), ('f2f727c6-956a-4a9a-a0a7-a37bd22b766d', 8, 1, '2026-07-08 15:25:26', '2026-07-08 15:25:28', null, null, 'f228a6e5-b427-4c0e-91d8-f4bebed80469', 'ADJUSTMENT_VIRTUAL', 0);

-- Facility (Once facilities module is completed this information will not be necessary)*
INSERT INTO "public"."inventories" ("id_inventory", "inventory_context", "is_active", "updated_at", "created_at", "assigned_to", "assigned_facility", "created_by", "inventory_name", "stock_validation") VALUES ('09064209-234a-4ed7-a249-af97ec8f8bcf', 1, 1, '2026-06-27 09:49:07', '2026-06-27 15:49:13', null, 'f2a31d77-7124-4103-b320-4b7ab5babbb4', 'f228a6e5-b427-4c0e-91d8-f4bebed80469', 'Bodega', 0);
INSERT INTO "public"."inventories" ("id_inventory", "inventory_context", "is_active", "updated_at", "created_at", "assigned_to", "assigned_facility", "created_by", "inventory_name", "stock_validation") VALUES ('f890c854-25fa-4b3c-882e-aa5c30fe095a', 4, 1, '2026-06-30 09:51:59', '2026-06-30 15:52:03', null, 'f2a31d77-7124-4103-b320-4b7ab5babbb4', 'f228a6e5-b427-4c0e-91d8-f4bebed80469', 'Devolución de producto - almacen', 0);

-- Manual inventory configuration for user 

-- Pre-requisit: 
-- If the user is from route division, you'll need an warehouse inventory and product devolution warehouse inventory. inventory_context:
-- Warehouse: 1
-- Product devolution (for the warehouse): 4

-- For signing up a user in the system, you have to create the following inventories (referring to inventory_context):
-- Reserved product: 2
-- Product available for sale: 3
-- Product devolution: 4

-- Once user's inventories has been created, it's time to configure the inventories configuration:

