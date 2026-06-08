-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

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
  id_location uuid,
  id_route_transaction uuid,
  id_route_day uuid,
  id_operation_type uuid NOT NULL,
  created_at timestamp with time zone NOT NULL,
  id_day_operation_dependent uuid,
  id_work_day uuid NOT NULL,
  latitude character varying,
  longitude character varying,
  id_inventory_operation character varying,
  CONSTRAINT work_day_operations_historic_pkey PRIMARY KEY (id_work_day_operation),
  CONSTRAINT work_day_operations_historic_id_work_day_fkey FOREIGN KEY (id_work_day) REFERENCES public.work_days(id_work_day)
);
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
  location_type_name character varying NOT NULL,
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
  CONSTRAINT locations_id_creator_fkey FOREIGN KEY (id_creator) REFERENCES public.users(id_user),
  CONSTRAINT locations_id_client_fkey FOREIGN KEY (id_client) REFERENCES public.clients(id_client),
  CONSTRAINT locations_id_location_type_fkey FOREIGN KEY (id_location_type) REFERENCES public.location_types(id_location_type)
);
CREATE TABLE public.location_notes (
  id_location_note uuid NOT NULL DEFAULT gen_random_uuid(),
  note text NOT NULL,
  id_location uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT location_notes_pkey PRIMARY KEY (id_location_note),
  CONSTRAINT location_notes_id_location_fkey FOREIGN KEY (id_location) REFERENCES public.locations(id_location)
);
CREATE TABLE public.furnitures (
  id_furniture uuid NOT NULL DEFAULT gen_random_uuid(),
  delivered_date timestamp with time zone NOT NULL,
  description_furniture text NOT NULL,
  id_location uuid NOT NULL,
  CONSTRAINT furnitures_pkey PRIMARY KEY (id_furniture),
  CONSTRAINT furnitures_id_location_fkey FOREIGN KEY (id_location) REFERENCES public.locations(id_location)
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
  created_at timestamp without time zone NOT NULL,
  CONSTRAINT products_pkey PRIMARY KEY (id_product),
  CONSTRAINT products_id_measurement_unit_fkey FOREIGN KEY (id_measurement_unit) REFERENCES public.measurements_units(id_measurement_unit)
);
CREATE TABLE public.product_prices (
  id_product_price uuid NOT NULL DEFAULT gen_random_uuid(),
  price numeric NOT NULL,
  created_at timestamp with time zone NOT NULL,
  id_product uuid NOT NULL,
  id_facility uuid,
  id_location uuid,
  id_route_day uuid,
  CONSTRAINT product_prices_pkey PRIMARY KEY (id_product_price),
  CONSTRAINT product_prices_id_product_fkey FOREIGN KEY (id_product) REFERENCES public.products(id_product),
  CONSTRAINT product_prices_id_location_fkey FOREIGN KEY (id_location) REFERENCES public.locations(id_location),
  CONSTRAINT product_prices_id_route_day_fkey FOREIGN KEY (id_route_day) REFERENCES public.route_days(id_route_day)
);
CREATE TABLE public.inventory_operation_types (
  inventory_operation_type_name character varying NOT NULL UNIQUE,
  id_inventory_operation_type uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT inventory_operation_types_pkey PRIMARY KEY (id_inventory_operation_type)
);
CREATE TABLE public.inventory_operations (
  document_reference uuid,
  created_at timestamp without time zone NOT NULL,
  movement_type smallint NOT NULL,
  id_inventory_operation uuid NOT NULL DEFAULT gen_random_uuid(),
  latitude character varying,
  longitude character varying,
  inventoy_operation_referenced uuid,
  created_by uuid NOT NULL,
  id_inventory_origin uuid NOT NULL,
  id_inventory_target uuid NOT NULL,
  CONSTRAINT inventory_operations_pkey PRIMARY KEY (id_inventory_operation),
  CONSTRAINT inventory_operations_inventoy_operation_referenced_fkey FOREIGN KEY (inventoy_operation_referenced) REFERENCES public.inventory_operations(id_inventory_operation),
  CONSTRAINT inventory_operations_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id_user),
  CONSTRAINT inventory_operations_id_inventory_origin_fkey FOREIGN KEY (id_inventory_origin) REFERENCES public.inventories(id_inventory),
  CONSTRAINT inventory_operations_id_inventory_target_fkey FOREIGN KEY (id_inventory_target) REFERENCES public.inventories(id_inventory)
);
CREATE TABLE public.inventory_operation_descriptions (
  quantity numeric NOT NULL,
  price_at_moment numeric NOT NULL,
  id_inventory_operation uuid NOT NULL,
  id_product uuid NOT NULL,
  created_at timestamp without time zone NOT NULL,
  id_inventory_operation_description uuid NOT NULL DEFAULT gen_random_uuid(),
  cost_at_moment numeric NOT NULL,
  CONSTRAINT inventory_operation_descriptions_pkey PRIMARY KEY (id_inventory_operation_description),
  CONSTRAINT inventory_operation_descriptions_id_inventory_operation_fkey FOREIGN KEY (id_inventory_operation) REFERENCES public.inventory_operations(id_inventory_operation),
  CONSTRAINT inventory_operation_descriptions_id_product_fkey FOREIGN KEY (id_product) REFERENCES public.products(id_product)
);
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
  received_amount numeric NOT NULL,
  id_invoice_concept uuid,
  created_at timestamp with time zone NOT NULL,
  id_location uuid,
  id_client uuid NOT NULL,
  id_work_day uuid NOT NULL,
  id_payment_method uuid NOT NULL,
  id_payment_schema uuid NOT NULL,
  latitude character varying,
  longitude character varying,
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
  quantity numeric NOT NULL,
  created_at timestamp with time zone NOT NULL,
  id_transaction uuid NOT NULL,
  id_transaction_operation_type uuid NOT NULL,
  id_product uuid NOT NULL,
  CONSTRAINT transaction_descriptions_pkey PRIMARY KEY (id_transaction_description),
  CONSTRAINT transaction_descriptions_id_transaction_fkey FOREIGN KEY (id_transaction) REFERENCES public.transactions(id_transaction),
  CONSTRAINT transaction_descriptions_id_product_fkey FOREIGN KEY (id_product) REFERENCES public.products(id_product),
  CONSTRAINT transaction_descriptions_id_transaction_operation_type_fkey FOREIGN KEY (id_transaction_operation_type) REFERENCES public.route_transaction_operation_types(id_route_transaction_operation_type)
);
CREATE TABLE public.taxes (
  id_tax uuid NOT NULL DEFAULT gen_random_uuid(),
  tax_name character varying NOT NULL,
  tax_rate character varying NOT NULL,
  created_at timestamp with time zone NOT NULL,
  CONSTRAINT taxes_pkey PRIMARY KEY (id_tax)
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
CREATE TABLE public.inventories (
  id_inventory uuid NOT NULL DEFAULT gen_random_uuid(),
  inventory_context smallint NOT NULL,
  is_active smallint NOT NULL,
  updated_at timestamp without time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  assigned_to uuid,
  assigned_facility uuid,
  created_by uuid NOT NULL,
  inventory_name character varying NOT NULL UNIQUE,
  stock_validation smallint NOT NULL,
  CONSTRAINT inventories_pkey PRIMARY KEY (id_inventory),
  CONSTRAINT inventories_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id_user),
  CONSTRAINT inventories_assigned_facility_fkey FOREIGN KEY (assigned_facility) REFERENCES public.facilities(id_facility),
  CONSTRAINT inventories_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id_user)
);
CREATE TABLE public.facility_types (
  id_facility_type uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  facility_type_name character varying NOT NULL,
  CONSTRAINT facility_types_pkey PRIMARY KEY (id_facility_type)
);
CREATE TABLE public.facilities (
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  ext_number character varying NOT NULL,
  colony character varying NOT NULL,
  postal_code character varying NOT NULL,
  facility_name character varying NOT NULL,
  latitude character varying NOT NULL,
  longitude character varying NOT NULL,
  is_active smallint NOT NULL,
  id_facility_type uuid NOT NULL,
  street character varying NOT NULL,
  id_facility uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT facilities_pkey PRIMARY KEY (id_facility),
  CONSTRAINT facility_id_facility_type_fkey FOREIGN KEY (id_facility_type) REFERENCES public.facility_types(id_facility_type)
);
CREATE TABLE public.inventories_balance (
  id_inventory_balance uuid NOT NULL DEFAULT gen_random_uuid(),
  quantity numeric NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone,
  id_inventory uuid NOT NULL,
  id_product uuid NOT NULL,
  min_quantity numeric,
  max_quantity numeric,
  CONSTRAINT inventories_balance_pkey PRIMARY KEY (id_inventory_balance),
  CONSTRAINT inventories_balance_id_inventory_fkey FOREIGN KEY (id_inventory) REFERENCES public.inventories(id_inventory),
  CONSTRAINT inventories_balance_id_product_fkey FOREIGN KEY (id_product) REFERENCES public.products(id_product)
);