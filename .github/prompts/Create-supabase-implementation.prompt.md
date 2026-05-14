---
name: Create supabase implementation
description: This prompt is used when the user wants to create a new Supabase implementation.
---

This prompt is used when the user asks for implementing a repository using supabase as datasource.

# Input:
- You'll recieve the name of the repository to implement.
- Schema of the database table that are implied in the implementation of the repository.

> Remember the schema will be used in a typescript application. So you have to define the schema in typescript.

# Steps to follow:
* Understand the repository and its methods that you have to implement.
* Identify the entities `src/core/entities`, object values `src/core/object-values` and enums `src/core/enums` that are implied.
  - If an entity is composed by object values, enums or other entities, you must find and understand them before making any implementation.
* Once you have identified all the domain objects that compound the repository, you have to find the "table" that are implied `src/infrastructure/postgres/schema`.  
* Once you have the table schema and domain object understood, you are going to implement the repository using supabase as datasource, you'll import `import { SupabaseDataSource } from 'src/infrastructure/datasources/SupabaseDataSource';` and will inject `private readonly supabaseDataSource: SupabaseDataSource` in the constructor.
  - As a way to get the instance, you have to implement a private method called `supabase`
  ```typescript
  private get supabase() {
    return this.supabaseDataSource.getClient();
  }
  ```
* Once you have created the method to get the supabase client, you can start implementing the methods of the repository.


Example: 
# Input
Implement locations repository using supabase.
The tables that are implied are:
- locations
- furnitures
- location_notes
- location_types

# Process
1. I need to implement a repository called `LocationRepository` using supabase as datasource. This is located at `src/infrastructure/repositories/LocationRepository.ts`.
2. I see that the methods that I have to implement are: `createLocation`, `getLocationById`, `getLocationByClient`, `updateLocation`, `deleteLocation` and `listLocations`. 
  - I need to identify the domain object that are implied in the repository. I see that the main entity is `LocationEntity` located at `src/core/entities/locationEntity.ts`. I need to understand this entity before making any implementation.
  - I see that `LocationEntity` is composed by the following attributes: `id_location`, `id_client`, `name`, `type`, `capacity`, `status`, `created_at` and `updated_at`. I need to understand each of these attributes and their types before making any implementation.
  - I see that `LocationEntity` has a relation with `ClientEntity` through the attribute `id_client`, I need to understand `ClientEntity` before making any implementation.
  - I see that `LocationEntity` has a relation with `LocationTypeEnum` through the attribute `type`, I need to understand `LocationTypeEnum` before making any implementation.
  - Once I have understood the entity and its relations, I need to find the tables schema that are implied in the implementation according to the user's input. According to users input the tables implied are `locations`, `furnitures`, `location_notes` and `location_types`.
  I consult the file located at `src/infrastructure/postgres/schema/locationSchema.ts`. I found: 
  ```
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
  CREATE TABLE public.location_types (
    id_location_type uuid NOT NULL DEFAULT gen_random_uuid(),
    location_type_name character varying NOT NULL,
    created_at timestamp with time zone NOT NULL,
    CONSTRAINT location_types_pkey PRIMARY KEY (id_location_type)
  );
  ```sql
- I have the big picture of the entity, its relations and the tables implied in the implementation of the repository, now I can start implementing the repository using supabase as datasource.
3. I start implementing the repository, I import `SupabaseDataSource` and inject it in the constructor, then I implement the method to get the supabase client. Once I have that, I start implementing each method of the repository according to its functionality and the schema of the tables implied. For example, for the method `createLocation` I will insert a new record in the `locations` table using supabase client, for the method `getLocationById` I will query the `locations` table using supabase client to get a location by its id, and so on with each method of the repository.

```typescript
export class UserEntity {
  constructor(
    public readonly id_user: string,
    public readonly cellphone: string,
    public readonly name: string,
    public readonly password: string,
    public readonly status: number,
    public readonly address?: string,
    public readonly rfc?: string,
    public readonly imss?: string,
    public readonly salary: number,
    public readonly created_at: Date,
    public readonly updated_at: Date,
  ) {}
}
```

You only have to create the entity, you don't have to create the repository, service or controller. In the same way, avoid to add any `interface` or `primitive`. Only one class must result by file. 