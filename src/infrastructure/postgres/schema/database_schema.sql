
-------------------------------------------------------------------------------------
-- NEW DATABASE SCHEMA 05-12-26
-- About users ----------------------------------------------------------------------
CREATE TABLE public.users (
  id_user uuid NOT NULL DEFAULT gen_random_uuid(),
  cellphone character varying NOT NULL,
  name character varying NOT NULL,
  password character varying NOT NULL,
  status smallint NOT NULL,
  address character varying,
  rfc character varying,
  imss character varying,
  salary numeric NOT NULL,
  created_at timestamp with time zone NOT NULL,
  updated_at timestamp with time zone NOT NULL,
  CONSTRAINT users_pkey PRIMARY KEY (id_user)
);


-- About route organization --------------------------------------------------------------------
CREATE TABLE public.routes (
  id_route uuid NOT NULL DEFAULT gen_random_uuid(),
  route_name character varying NOT NULL UNIQUE,
  description text,
  route_status smallint NOT NULL,
  CONSTRAINT routes_pkey PRIMARY KEY (id_route)
);
CREATE TABLE public.days (
  day_name character varying NOT NULL UNIQUE,
  id_day uuid NOT NULL DEFAULT gen_random_uuid(),
  order_to_show smallint NOT NULL UNIQUE,
  CONSTRAINT days_pkey PRIMARY KEY (id_day)
);
CREATE TABLE public.route_days (
  id_route_day uuid NOT NULL DEFAULT gen_random_uuid(),
  id_route uuid NOT NULL,
  id_day uuid NOT NULL,
  CONSTRAINT route_days_pkey PRIMARY KEY (id_route_day),
  CONSTRAINT route_days_id_day_fkey FOREIGN KEY (id_day) REFERENCES public.days(id_day),
  CONSTRAINT route_days_id_route_fkey FOREIGN KEY (id_route) REFERENCES public.routes(id_route)
);
CREATE TABLE public.assigned_route_days (
  id_assigned_route_day uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL,
  expired_at timestamp with time zone,
  id_route_day uuid NOT NULL,
  id_user uuid NOT NULL,
  CONSTRAINT assigned_route_days_pkey PRIMARY KEY (id_assigned_route_day),
  CONSTRAINT assigned_route_days_id_route_day_fkey FOREIGN KEY (id_route_day) REFERENCES public.route_days(id_route_day),
  CONSTRAINT assigned_route_days_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.users(id_user)
);
CREATE TABLE public.organization_strategies (
  id_organization_strategy uuid NOT NULL DEFAULT gen_random_uuid(),
  organization_strategy_name character varying NOT NULL UNIQUE,
  is_used smallint NOT NULL,
  created_at timestamp with time zone NOT NULL,
  CONSTRAINT organization_strategies_pkey PRIMARY KEY (id_organization_strategy)
);
CREATE TABLE public.route_day_proposals (
  id_route_day_proposal uuid NOT NULL DEFAULT gen_random_uuid(),
  proposal_name character varying NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL,
  id_route_day uuid NOT NULL,
  CONSTRAINT route_day_proposals_pkey PRIMARY KEY (id_route_day_proposal),
  CONSTRAINT route_day_proposals_id_route_day_fkey FOREIGN KEY (id_route_day) REFERENCES public.route_days(id_route_day)
);


-- About route context ----------------------------------------------------------------------
-- About business operation -----------------------------------------------------------------
CREATE TABLE public.work_days (
  id_work_day uuid NOT NULL DEFAULT gen_random_uuid(),
  start_date timestamp with time zone NOT NULL,
  finish_date timestamp with time zone,
  id_route uuid NOT NULL,
  start_petty_cash numeric NOT NULL,
  final_petty_cash numeric,
  id_route_day uuid NOT NULL,
  id_user uuid NOT NULL,
  id_payment_stub uuid,
  CONSTRAINT work_days_pkey PRIMARY KEY (id_work_day),
  CONSTRAINT work_days_id_route_day_fkey FOREIGN KEY (id_route_day) REFERENCES public.route_days(id_route_day),
  CONSTRAINT work_days_id_route_fkey FOREIGN KEY (id_route) REFERENCES public.routes(id_route),
  CONSTRAINT work_days_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.users(id_user)
);

CREATE TABLE public.work_day_notes (
  id_work_day_notes uuid NOT NULL DEFAULT gen_random_uuid(),
  note text NOT NULL,
  created_at timestamp with time zone NOT NULL,
  id_work_day uuid NOT NULL,
  CONSTRAINT work_day_notes_pkey PRIMARY KEY (id_work_day_notes),
  CONSTRAINT work_day_notes_id_work_day_fkey FOREIGN KEY (id_work_day) REFERENCES public.work_days(id_work_day)
);

CREATE TABLE public.work_day_operations_historic (
  id_work_day_operation uuid NOT NULL DEFAULT gen_random_uuid(),
  id_client uuid,
  id_route_transaction uuid,
  id_route uuid,
  id_operation_type uuid NOT NULL,
  created_at timestamp with time zone NOT NULL,
  id_day_operation_dependent uuid,
  id_work_day uuid NOT NULL,
  CONSTRAINT work_day_operations_historic_pkey PRIMARY KEY (id_work_day_operation),
  CONSTRAINT work_day_operations_historic_id_work_day_fkey FOREIGN KEY (id_work_day) REFERENCES public.work_days(id_work_day)
);

-- About clients and locations ----------------------------------------------------------------------
CREATE TABLE public.clients (
    id_client uuid NOT NULL DEFAULT gen_random_uuid(),
    legal_name character varying NOT NULL,
    postal_code character varying NOT NULL,
    fiscal_regime character varying NOT NULL,
    name character varying NOT NULL,
    cellphone character varying NOT NULL,
    email character varying NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT clients_pkey PRIMARY KEY (id_client)
);
CREATE TABLE public.location_types (
  id_location_type uuid NOT NULL DEFAULT gen_random_uuid(),
  location_type_name character varying NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL,
  CONSTRAINT location_types_pkey PRIMARY KEY (id_location_type)
);
CREATE TABLE public.locations (
  id_location uuid NOT NULL DEFAULT gen_random_uuid(),
  street character varying NOT NULL,
  ext_number character varying NOT NULL,
  colony character varying NOT NULL,
  postal_code character varying NOT NULL,
  address_reference text,
  location_name character varying NOT NULL,
  latitude character varying NOT NULL,
  longitude character varying NOT NULL,
  status_location smallint NOT NULL,
  id_creator uuid NOT NULL,
  id_client uuid NOT NULL,
  id_location_type uuid NOT NULL,
  created_at timestamp with time zone NOT NULL,
  updated_at timestamp with time zone NOT NULL,
  CONSTRAINT locations_pkey PRIMARY KEY (id_location),
  CONSTRAINT locations_id_creator_fkey FOREIGN KEY (id_creator) REFERENCES public.users (id_user),
  CONSTRAINT locations_id_client_fkey FOREIGN KEY (id_client) REFERENCES public.clients (id_client),
  CONSTRAINT locations_id_location_type_fkey FOREIGN KEY (id_location_type) REFERENCES public.location_types (id_location_type)
);
CREATE TABLE public.location_notes (
  id_location_note uuid NOT NULL DEFAULT gen_random_uuid(),
  note text NOT NULL,
  id_location uuid NOT NULL,
  created_at timestamp with time zone NOT NULL,
  CONSTRAINT location_notes_pkey PRIMARY KEY (id_location_note),
  CONSTRAINT location_notes_id_location_fkey FOREIGN KEY (id_location) REFERENCES public.locations (id_location)
);
CREATE TABLE public.furnitures (
    id_furniture uuid NOT NULL DEFAULT gen_random_uuid(),
    delivered_date timestamp with time zone NOT NULL,
    description_furniture text NOT NULL,
    id_location uuid NOT NULL,
    CONSTRAINT furnitures_pkey PRIMARY KEY (id_furniture),
    CONSTRAINT furnitures_id_location_fkey FOREIGN KEY (id_location) REFERENCES public.locations (id_location)
);

CREATE TABLE public.route_day_locations (
  position_in_route integer NOT NULL,
  id_route_day_location uuid NOT NULL DEFAULT gen_random_uuid(),
  id_location uuid NOT NULL,
  id_route_day uuid NOT NULL,
  CONSTRAINT route_day_locations_pkey PRIMARY KEY (id_route_day_location),
  CONSTRAINT route_day_locations_id_location_fkey FOREIGN KEY (id_location) REFERENCES public.locations(id_location),
  CONSTRAINT route_day_locations_id_route_day_fkey FOREIGN KEY (id_route_day) REFERENCES public.route_days(id_route_day)
);

CREATE TABLE public.route_day_location_proposals (
  id_route_day_location_proposal uuid NOT NULL DEFAULT gen_random_uuid(),
  position_in_route integer NOT NULL,
  id_route_day_proposal uuid NOT NULL,
  id_location uuid NOT NULL,
  CONSTRAINT route_day_location_proposals_pkey PRIMARY KEY (id_route_day_location_proposal),
  CONSTRAINT route_day_location_proposals_id_route_day_proposal_fkey FOREIGN KEY (id_route_day_proposal) REFERENCES public.route_day_proposals(id_route_day_proposal),
  CONSTRAINT route_day_location_proposals_id_location_fkey FOREIGN KEY (id_location) REFERENCES public.locations(id_location)
);


-- About products & inventories -------------------------------------------------------------
-- About products -------------------------------------------------------------------------
CREATE TABLE public.measurements_units (
    id_measurement_unit uuid NOT NULL DEFAULT gen_random_uuid(),
    measurement_unit_name character varying NOT NULL UNIQUE,
    CONSTRAINT measurements_units_pkey PRIMARY KEY (id_measurement_unit)
);
CREATE TABLE public.products (
  id_product uuid NOT NULL DEFAULT gen_random_uuid(),
  product_name character varying NOT NULL UNIQUE,
  barcode character varying,
  cost numeric NOT NULL,
  product_status smallint NOT NULL,
  quantity_presentation integer NOT NULL,
  order_to_show integer NOT NULL,
  id_measurement_unit uuid NOT NULL,
  CONSTRAINT products_pkey PRIMARY KEY (id_product),
  CONSTRAINT products_id_measurement_unit_fkey FOREIGN KEY (id_measurement_unit) REFERENCES public.measurements_units (id_measurement_unit)
);

CREATE TABLE public.product_prices (
  id_product_price uuid NOT NULL DEFAULT gen_random_uuid(),
  price numeric NOT NULL,
  created_at timestamp with time zone NOT NULL,
  id_product uuid NOT NULL,
  id_client uuid,
  id_location uuid,
  id_route_day uuid,
  CONSTRAINT product_prices_pkey PRIMARY KEY (id_product_price),
  CONSTRAINT product_prices_id_product_fkey FOREIGN KEY (id_product) REFERENCES public.products (id_product),
  CONSTRAINT product_prices_id_client_fkey FOREIGN KEY (id_client) REFERENCES public.clients (id_client),
  CONSTRAINT product_prices_id_location_fkey FOREIGN KEY (id_location) REFERENCES public.locations (id_location),
  CONSTRAINT product_prices_id_route_day_fkey FOREIGN KEY (id_route_day) REFERENCES public.route_days (id_route_day)
);

-- About inventory -------------------------------------------------------------------------
CREATE TABLE public.inventory_operation_types (
  inventory_operation_type_name character varying NOT NULL UNIQUE,
  id_inventory_operation_type uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT inventory_operation_types_pkey PRIMARY KEY (id_inventory_operation_type)
);
CREATE TABLE public.inventory_operations (
  sign_confirmation character varying NOT NULL,
  date timestamp with time zone NOT NULL,
  audit smallint NOT NULL,
  id_inventory_operation uuid NOT NULL DEFAULT gen_random_uuid(),
  id_inventory_operation_type uuid NOT NULL,
  id_work_day uuid NOT NULL,
  state smallint NOT NULL,
  CONSTRAINT inventory_operations_pkey PRIMARY KEY (id_inventory_operation),
  CONSTRAINT inventory_opertions_id_inventory_operation_type_fkey FOREIGN KEY (id_inventory_operation_type) REFERENCES public.inventory_operation_types(id_inventory_operation_type),
  CONSTRAINT inventory_opertions_id_work_day_fkey FOREIGN KEY (id_work_day) REFERENCES public.work_days(id_work_day)
);

CREATE TABLE public.inventory_operation_descriptions (
  amount numeric NOT NULL,
  price_at_moment numeric NOT NULL,
  id_inventory_operation uuid NOT NULL,
  id_product uuid NOT NULL,
  created_at timestamp with time zone NOT NULL,
  id_inventory_operation_description uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT inventory_operation_descriptions_pkey PRIMARY KEY (id_inventory_operation_description),
  CONSTRAINT inventory_operation_descriptions_id_inventory_operation_fkey FOREIGN KEY (id_inventory_operation) REFERENCES public.inventory_operations(id_inventory_operation),
  CONSTRAINT inventory_operation_descriptions_id_product_fkey FOREIGN KEY (id_product) REFERENCES public.products(id_product)
);


-- About accountability ----------------------------------------------------------------------
-- About transactions ----------------------------------------------------------------------
CREATE TABLE public.route_transaction_operation_types (
  id_route_transaction_operation_type uuid NOT NULL DEFAULT gen_random_uuid(),
  transcation_operation_type_name character varying NOT NULL UNIQUE,
  CONSTRAINT route_transaction_operation_types_pkey PRIMARY KEY (id_route_transaction_operation_type)
);

CREATE TABLE public.payment_schema (
  id_payment_schema uuid NOT NULL DEFAULT gen_random_uuid(),
  payment_schema_type character varying NOT NULL,
  CONSTRAINT payment_schema_pkey PRIMARY KEY (id_payment_schema)
);

CREATE TABLE public.payment_method (
  id_payment_method uuid NOT NULL DEFAULT gen_random_uuid(),
  payment_method_name character varying NOT NULL,
  CONSTRAINT payment_method_pkey PRIMARY KEY (id_payment_method)
);

CREATE TABLE public.transactions (
  id_transaction uuid NOT NULL DEFAULT gen_random_uuid(),
  cfdi character varying,
  state smallint NOT NULL,
  amount numeric NOT NULL,
  id_invoice_concept uuid NOT NULL,
  created_at timestamp with time zone NOT NULL,
  id_location uuid,
  id_client uuid NOT NULL,
  id_work_day uuid NOT NULL,
  id_payment_method uuid NOT NULL,
  id_payment_schema uuid NOT NULL,
  CONSTRAINT transactions_pkey PRIMARY KEY (id_transaction),
  CONSTRAINT transactions_id_location_fkey FOREIGN KEY (id_location) REFERENCES public.locations(id_location),
  CONSTRAINT transactions_id_client_fkey FOREIGN KEY (id_client) REFERENCES public.clients(id_client),
  CONSTRAINT transactions_id_payment_method_fkey FOREIGN KEY (id_payment_method) REFERENCES public.payment_method(id_payment_method),
  CONSTRAINT transactions_id_payment_schema_fkey FOREIGN KEY (id_payment_schema) REFERENCES public.payment_schema(id_payment_schema),
  CONSTRAINT transactions_id_work_day_fkey FOREIGN KEY (id_work_day) REFERENCES public.work_days(id_work_day)
);

CREATE TABLE public.transaction_descriptions (
  id_transaction_description uuid NOT NULL DEFAULT gen_random_uuid(),
  price_at_moment numeric NOT NULL,
  cost_at_moment numeric NOT NULL,
  amount numeric NOT NULL,
  created_at timestamp with time zone NOT NULL,
  id_transaction uuid NOT NULL,
  id_transaction_operation_type uuid NOT NULL,
  id_product uuid NOT NULL,
  CONSTRAINT transaction_descriptions_pkey PRIMARY KEY (id_transaction_description),
  CONSTRAINT transaction_descriptions_id_transaction_fkey FOREIGN KEY (id_transaction) REFERENCES public.transactions(id_transaction),
  CONSTRAINT transaction_descriptions_id_product_fkey FOREIGN KEY (id_product) REFERENCES public.products(id_product),
  CONSTRAINT transaction_descriptions_id_transaction_operation_type_fkey FOREIGN KEY (id_transaction_operation_type) REFERENCES public.route_transaction_operation_types(id_route_transaction_operation_type)
);

CREATE TABLE public.transaction_locations (
  id_invoice_concept uuid NOT NULL DEFAULT gen_random_uuid(),
  longitude character varying,
  latitude character varying,
  id_transaction uuid NOT NULL,
  created_at timestamp with time zone NOT NULL,
  CONSTRAINT transaction_locations_pkey PRIMARY KEY (id_invoice_concept),
  CONSTRAINT transaction_locations_id_transaction_fkey FOREIGN KEY (id_transaction) REFERENCES public.transactions(id_transaction)
);

CREATE TABLE public.taxes (
  id_tax uuid NOT NULL DEFAULT gen_random_uuid(),
  tax_name character varying NOT NULL,
  tax_rate character varying NOT NULL,
  id_transaction uuid NOT NULL,
  created_at timestamp with time zone NOT NULL,
  CONSTRAINT taxes_pkey PRIMARY KEY (id_tax),
  CONSTRAINT taxes_id_transaction_fkey FOREIGN KEY (id_transaction) REFERENCES public.transactions(id_transaction)
);

CREATE TABLE public.taxes_in_transactions (
  id_tax_in_transaction uuid NOT NULL DEFAULT gen_random_uuid(),
  id_transaction uuid NOT NULL,
  id_tax uuid NOT NULL,
  tax_rate_at_moment_of_transaction numeric NOT NULL,
  created_at timestamp with time zone NOT NULL,
  CONSTRAINT taxes_in_transactions_pkey PRIMARY KEY (id_tax_in_transaction),
  CONSTRAINT taxes_in_transactions_id_transaction_fkey FOREIGN KEY (id_transaction) REFERENCES public.transactions(id_transaction),
  CONSTRAINT taxes_in_transactions_id_tax_fkey FOREIGN KEY (id_tax) REFERENCES public.taxes(id_tax)
);

--- Database initialization ---------------------------------------------------------------------

INSERT INTO public.days (id_day, day_name, order_to_show) VALUES
  ('b1bb1619-392c-4f7e-b615-f8b3da7223b4', 'lunes', 1),
  ('81d535dc-defb-448b-b0e3-83816925765d', 'martes', 2),
  ('f99e5c5f-931d-4466-9e4a-bb4297891c96', 'miercoles', 3),
  ('32e6bbe3-75f9-4554-909e-4759b3300b5b', 'jueves', 4),
  ('5ffd4fe6-6441-4db9-ae95-0902d1b28e43', 'viernes', 5),
  ('792014f7-e29b-45b8-b5fe-0c542a25f2b4', 'sabado', 6);

INSERT INTO public.location_types (id_location_type, location_type_name, created_at) VALUES
  ('c272bb96-cf1a-4d8f-8598-179e6869847a', 'Tienda', NOW()),
  ('a188c43a-0397-474a-a3ce-b4ee041a1cc5', 'Minisuper', NOW()),
  ('8ce0d3db-bece-44f2-ac06-88c27294d4f6', 'Carniceria', NOW()),
  ('d09bfbfe-e3bd-4ec8-a405-a94c8388965d', 'Deposito', NOW()),
  ('77d29000-4eaa-433a-b9e0-3ac60623bf09', 'Puesto', NOW()),
  ('8ce0d3db-bece-44f2-ac06-88c27294d4f6', 'Fruteria', NOW());

INSERT INTO public.payment_schema (id_payment_schema, payment_schema_type) VALUES
  ('0184d0e0-c9b6-4758-b757-dea6adb28bc5', 'IMMEDIATE'),
  ('a5c8cb96-860c-4f40-bff2-3fb80fde2ef4', 'DEFERRED');

INSERT INTO public.payment_method (id_payment_method, payment_method_name) VALUES
  ('0706f60e-69ae-462f-946e-450be1f914a6', 'credit card'),
  ('412ad9d7-b51a-4a25-9f10-ff61b4c8bd27', 'debit card'),
  ('52757755-1471-44c3-b6d5-07f7f83a0f6f', 'cash'),
  ('b68e6be3-8919-41dd-9d09-6527884e162e', 'transfer');

INSERT INTO "public"."clients" ("id_client", "legal_name", "postal_code", "fiscal_regime", "name", "cellphone", "email", "created_at", "updated_at") VALUES 
('041c6093-a97b-4f4c-ab8e-6d1e35689555', 'PÚBLICO EN GENERAL', '48327', '616 – Sin obligaciones fiscales', 'PÚBLICO EN GENERAL', '0000000000', 'Ninguno', NOW(), NOW());

-- Dummy insertions