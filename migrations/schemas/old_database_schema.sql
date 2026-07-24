-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.days (
  day_name character varying NOT NULL UNIQUE,
  id_day uuid NOT NULL DEFAULT gen_random_uuid(),
  order_to_show smallint NOT NULL UNIQUE,
  CONSTRAINT days_pkey PRIMARY KEY (id_day)
);
CREATE TABLE public.vendors (
  cellphone character varying NOT NULL,
  name character varying NOT NULL,
  password character varying NOT NULL,
  status smallint NOT NULL,
  id_vendor uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT vendors_pkey PRIMARY KEY (id_vendor)
);
CREATE TABLE public.products (
  product_name character varying NOT NULL UNIQUE,
  barcode character varying,
  weight bigint,
  unit character varying,
  comission numeric NOT NULL,
  price numeric NOT NULL,
  product_status smallint NOT NULL,
  order_to_show integer NOT NULL,
  id_product uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT products_pkey PRIMARY KEY (id_product)
);
CREATE TABLE public.payment_method (
  id_payment_method uuid NOT NULL DEFAULT gen_random_uuid(),
  payment_method_name character varying NOT NULL,
  CONSTRAINT payment_method_pkey PRIMARY KEY (id_payment_method)
);
CREATE TABLE public.inventory_operation_types (
  inventory_operation_type_name character varying NOT NULL UNIQUE,
  id_inventory_operation_type uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT inventory_operation_types_pkey PRIMARY KEY (id_inventory_operation_type)
);
CREATE TABLE public.route_transaction_operation_types (
  transcation_operation_type_name character varying NOT NULL UNIQUE,
  id_route_transaction_operation_type uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT route_transaction_operation_types_pkey PRIMARY KEY (id_route_transaction_operation_type)
);
CREATE TABLE public.routes (
  route_name character varying NOT NULL UNIQUE,
  description text,
  route_status smallint NOT NULL,
  id_route uuid NOT NULL DEFAULT gen_random_uuid(),
  id_vendor uuid,
  CONSTRAINT routes_pkey PRIMARY KEY (id_route),
  CONSTRAINT routes_id_vendor_fkey FOREIGN KEY (id_vendor) REFERENCES public.vendors(id_vendor)
);
CREATE TABLE public.commissions (
  id_commissions uuid NOT NULL DEFAULT gen_random_uuid(),
  paid_commission numeric NOT NULL,
  issue_date timestamp with time zone NOT NULL,
  id_vendor uuid NOT NULL,
  CONSTRAINT commissions_pkey PRIMARY KEY (id_commissions),
  CONSTRAINT commissions_id_vendor_fkey FOREIGN KEY (id_vendor) REFERENCES public.vendors(id_vendor)
);
CREATE TABLE public.stores (
  street character varying NOT NULL,
  ext_number character varying NOT NULL,
  colony character varying NOT NULL,
  postal_code character varying NOT NULL,
  address_reference text,
  store_name character varying NOT NULL,
  owner_name character varying,
  cellphone character varying,
  latitude character varying NOT NULL,
  longitude character varying NOT NULL,
  creation_date timestamp with time zone NOT NULL,
  creation_context text NOT NULL,
  status_store smallint NOT NULL,
  id_creator uuid NOT NULL,
  id_store uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT stores_pkey PRIMARY KEY (id_store),
  CONSTRAINT stores_id_creator_fkey FOREIGN KEY (id_creator) REFERENCES public.vendors(id_vendor)
);
CREATE TABLE public.route_days (
  id_route_day uuid NOT NULL DEFAULT gen_random_uuid(),
  id_route uuid NOT NULL,
  id_day uuid NOT NULL,
  CONSTRAINT route_days_pkey PRIMARY KEY (id_route_day),
  CONSTRAINT route_days_id_day_fkey FOREIGN KEY (id_day) REFERENCES public.days(id_day),
  CONSTRAINT route_days_id_route_fkey FOREIGN KEY (id_route) REFERENCES public.routes(id_route)
);
CREATE TABLE public.route_day_stores (
  position_in_route integer NOT NULL,
  id_route_day_store uuid NOT NULL DEFAULT gen_random_uuid(),
  id_store uuid NOT NULL,
  id_route_day uuid NOT NULL,
  CONSTRAINT route_day_stores_pkey PRIMARY KEY (id_route_day_store),
  CONSTRAINT route_day_stores_id_route_day_fkey FOREIGN KEY (id_route_day) REFERENCES public.route_days(id_route_day),
  CONSTRAINT route_day_stores_id_store_fkey FOREIGN KEY (id_store) REFERENCES public.stores(id_store)
);
CREATE TABLE public.route_paths (
  latitude character varying NOT NULL,
  longitude character varying NOT NULL,
  id_route_path uuid NOT NULL DEFAULT gen_random_uuid(),
  id_route_day uuid NOT NULL,
  CONSTRAINT route_paths_pkey PRIMARY KEY (id_route_path)
);
CREATE TABLE public.work_days (
  start_date timestamp with time zone NOT NULL,
  finish_date timestamp with time zone,
  id_work_day uuid NOT NULL DEFAULT gen_random_uuid(),
  id_route uuid NOT NULL,
  id_vendor uuid NOT NULL,
  id_commission uuid,
  start_petty_cash numeric NOT NULL,
  final_petty_cash numeric,
  comment text,
  id_route_day uuid NOT NULL,
  CONSTRAINT work_days_pkey PRIMARY KEY (id_work_day),
  CONSTRAINT work_days_id_commission_fkey FOREIGN KEY (id_commission) REFERENCES public.commissions(id_commissions),
  CONSTRAINT work_days_id_route_day_fkey FOREIGN KEY (id_route_day) REFERENCES public.route_days(id_route_day),
  CONSTRAINT work_days_id_route_fkey FOREIGN KEY (id_route) REFERENCES public.routes(id_route),
  CONSTRAINT work_days_id_vendor_fkey FOREIGN KEY (id_vendor) REFERENCES public.vendors(id_vendor)
);
CREATE TABLE public.route_day_proposals (
  id_route_day_proposal uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  proposal_name character varying NOT NULL UNIQUE,
  id_route_day uuid,
  CONSTRAINT route_day_proposals_pkey PRIMARY KEY (id_route_day_proposal),
  CONSTRAINT route_day_proposals_id_route_day_fkey FOREIGN KEY (id_route_day) REFERENCES public.route_days(id_route_day)
);
CREATE TABLE public.route_day_store_proposals (
  id_route_day_store uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  position_in_route integer NOT NULL,
  id_route_day_proposal uuid NOT NULL,
  id_store uuid NOT NULL,
  CONSTRAINT route_day_store_proposals_pkey PRIMARY KEY (id_route_day_store),
  CONSTRAINT route_day_store_proposals_id_route_day_proposal_fkey FOREIGN KEY (id_route_day_proposal) REFERENCES public.route_day_proposals(id_route_day_proposal),
  CONSTRAINT route_day_store_proposals_id_store_fkey FOREIGN KEY (id_store) REFERENCES public.stores(id_store)
);
CREATE TABLE public.followed_paths (
  latitude character varying NOT NULL,
  longitude character varying NOT NULL,
  id_followed_path uuid NOT NULL DEFAULT gen_random_uuid(),
  id_work_day uuid NOT NULL,
  CONSTRAINT followed_paths_pkey PRIMARY KEY (id_followed_path),
  CONSTRAINT followed_paths_id_work_day_fkey FOREIGN KEY (id_work_day) REFERENCES public.work_days(id_work_day)
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
CREATE TABLE public.route_transactions (
  date timestamp with time zone NOT NULL,
  state smallint NOT NULL,
  id_route_transaction uuid NOT NULL,
  id_work_day uuid NOT NULL,
  id_store uuid NOT NULL,
  id_payment_method uuid NOT NULL,
  cash_received numeric NOT NULL,
  CONSTRAINT route_transactions_pkey PRIMARY KEY (id_route_transaction),
  CONSTRAINT route_transactions_id_payment_method_fkey FOREIGN KEY (id_payment_method) REFERENCES public.payment_method(id_payment_method),
  CONSTRAINT route_transactions_id_store_fkey FOREIGN KEY (id_store) REFERENCES public.stores(id_store),
  CONSTRAINT route_transactions_id_work_day_fkey FOREIGN KEY (id_work_day) REFERENCES public.work_days(id_work_day)
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
CREATE TABLE public.route_transaction_descriptions (
  price_at_moment numeric NOT NULL,
  amount numeric NOT NULL,
  id_route_transaction_description uuid NOT NULL DEFAULT gen_random_uuid(),
  id_route_transaction uuid NOT NULL,
  id_route_transaction_operation_type uuid NOT NULL,
  id_product uuid NOT NULL,
  comission_at_moment numeric,
  created_at timestamp with time zone NOT NULL,
  CONSTRAINT route_transaction_descriptions_pkey PRIMARY KEY (id_route_transaction_description),
  CONSTRAINT route_transaction_descriptions_id_route_transaction_fkey FOREIGN KEY (id_route_transaction) REFERENCES public.route_transactions(id_route_transaction),
  CONSTRAINT route_transaction_descriptions_id_product_fkey FOREIGN KEY (id_product) REFERENCES public.products(id_product),
  CONSTRAINT route_transaction_descriptions_id_route_transaction_operation_t FOREIGN KEY (id_route_transaction_operation_type) REFERENCES public.route_transaction_operation_types(id_route_transaction_operation_type)
);