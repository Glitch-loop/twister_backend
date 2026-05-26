---
name: Implement a query.
description: This query is used when the user asks for a query implementation.
---

# Input
- Module where belongs the implemenation. i.e Module: route-organization
- Name of the query to implement. The user can attach a file or he can give you directly the name of the query.


# Coding Conventions
- `classes`: camelCase
- `file names`: kebab-case + type of file it refers. i.e. data.entity.ts, list-data.query.ts, add-info.command.ts 


# Context
First of all, you have to analyze the type of query the user is asking to implement.
At moment, there are 2 types of queries:
- `list` - Refers to retrieve a set or collection. 
- `retrieve` - Refers to retrieve information using an specific attribute of it.

When pagination is required, we use a cursor compunded of two item `id` of the record
and `created_at`.

*How would you know which type of query it is?*
The user will provide context or the filename will have implicit this information.

Depending on the type is the process you must follow.

# Process for "LIST" queries
1. Once you has identified the query and the type of query you must make, you have to identify the domain object the query involves:
  - entities `@/src/<module>/core/entities`.
  - object values `@/src/<module>/core/object-values`.
  - enum `@/src/<module>/core/enum`
  - repositories `@/src/<module>/core/interfaces`


2. After identifying the domain objects implied, you'll create the query.
Since it is a `list` query, you'll retrieve collections so the user might filter to retrive the collection he wants. 
In addition, the top for records retrieving is 1,000 + 1 (or the limit that the user indicates + 1).

3. Once you have identified the domain object that refers the query, you will list in the 
`execute` method all the "fields" or "attributes" the user might filter.

4. Use the repository for querying the information. It's likely you will find something like: ***listClient()*** without parameters for querying and withouth parameters for the
pagination, in such case you can modify the file to adapt the method to the query.

If it is necessary to modify, then you have to modify:
- repository `@/src/<module>/core/interfaces` (only the specific method)

And then:
- implementation `@/src/<module>/infrastructure/repositories/supabase`


#### How to identify parameters for filter? 
These types of parameters compound the entity or object value. 
For instance we are going to analyze LocationEntity

```typescript
export class LocationEntity {
  constructor(
    public readonly id_location: string,
    public readonly street: string,
    public readonly ext_number: string,
    public readonly colony: string,
    public readonly postal_code: string,
    public readonly location_name: string,
    public readonly latitude: string,
    public readonly longitude: string,
    public readonly status_location: LOCATION_STATUS_ENUM,
    public readonly id_creator: string,
    public readonly id_client: string,
    public readonly created_at: Date,
    public readonly updated_at: Date,
    public readonly location_type: LocationTypeObjectValue,
    public readonly notes: NoteObjectValue[],
    public readonly address_reference: string | null,
  ) {}
}
```
Analysis:
id_location is not possible, since it's an uuid that refers to domain object itself, 
street, ext_number, colony, postal_code, location_name are fields that can be used 
for filter the collection. 
latitude, longitude cannot be used because they represent coordinates and it is a query
itself.

status_location, id_creator, id_client are parmeters that can be used as filter.

created_at and updated are are filters that can be used as filters.

location type can also be used as a filter, maybe a user cannot pass an object, but he can
pass the id that refers to an specific location type.

In the end, notes and address_reference are not suitable because they refer to relative information about the clients.


#### How to identify parameters for pagination? 
These types of parameters compound the entity or object value. 
For instance we are going to analyze LocationEntity
```typescript
export class LocationEntity {
  constructor(
    public readonly id_location: string,
    public readonly street: string,
    public readonly ext_number: string,
    public readonly colony: string,
    public readonly postal_code: string,
    public readonly location_name: string,
    public readonly latitude: string,
    public readonly longitude: string,
    public readonly status_location: LOCATION_STATUS_ENUM,
    public readonly id_creator: string,
    public readonly id_client: string,
    public readonly created_at: Date,
    public readonly updated_at: Date,
    public readonly location_type: LocationTypeObjectValue,
    public readonly notes: NoteObjectValue[],
    public readonly address_reference: string | null,
  ) {}
}
```
Analysis
Following how pagination is made in the project we search the `id` of the object 
`id_location` and when it was created `created_at`.


#### How to use this information for modifying the interface and the implementation?
With the information you has, you will complement the existing function...
From this
```typescript
abstract listLocations(): Promise<LocationEntity[]>;
``` 

To this
```typescript
abstract listLocations(
    limit: number, // necessary of the implementation
    nextCreatedAt?: string, // Notice it has "next" in the name. This is part of the cursor
    nextId?: string, // Notice it has "next" in the name. This is part of the cursor
    ext_number?: string, // Param for filtering
    colony?: string, // Param for filtering
    postal_code?: string, // Param for filtering
    location_name?: string, // Param for filtering
    status_location?: number[], // Param for filtering
    id_creator?: string[], // Param for filtering
    id_client?: string[], // Param for filtering
    id_location_type?: string[], // Param for filtering
  ): Promise<LocationEntity[]>;
``` 

And the `implementation` will look like this:
```typescript
  async listLocations(
    limit: number,
    nextCreatedAt?: string, 
    nextId?: string,
    ext_number?: string,
    colony?: string,
    postal_code?: string,
    location_name?: string,
    status_location?: number[],
    id_creator?: string[],
    id_client?: string[],
    id_location_type?: string[]
  ): Promise<LocationEntity[]> {
    const query = this.supabase.from('locations').select();

    // As you might see, string are used with .ilike and `%${ext_number}%`
    if (ext_number) query.ilike('ext_number', `%${ext_number}%`);
    if (colony) query.ilike('colony', `%${colony}%`);
    if (postal_code) query.ilike('postal_code', `%${postal_code}%`);
    if (location_name) query.ilike('location_name', `%${location_name}%`);

    // As you might see, references are used with in.
    if (status_location) 
      if(status_location.length > 0) query.in('id_creator', status_location);
    

    if (id_creator)
      if(id_creator.length > 0) query.in('id_creator', id_creator);
    

    if (id_client) 
      if(id_client.length > 0) query.in('id_client', id_client);
    

    if (id_location_type)
      if(id_location_type.length > 0) query.in('id_location_type', id_location_type);
    
    // And this is how the pagination is implemented.
    if (nextCreatedAt && nextId) {
      // Keyset pagination for DESC order: older rows, then UUID tie-breaker.
      query.or(
        `created_at.lt."${nextCreatedAt}",and(created_at.eq."${nextCreatedAt}",id_location.lt."${nextId}")`,
      );
    }

    query.limit(limit);
    

    const { data, error } = await query;

    if (error) {
      throw new Error('Failed to list locations');
    }

    const locationModels = data as LocationModel[];
    const locationEntities = await Promise.all(
      locationModels.map((locationModel) => this.composeLocationEntity(locationModel)),
    );

    return locationEntities;
  } 
```

With this you have finilized the adaptation of the repo. With this modification you can 
alredy use the method in the query.

5. Return the output using the mapper (dto-domain object mapper).

Example of the query should look like:
```typescript
// Libraries
import { Inject, Injectable } from '@nestjs/common';

// Interface
import { ClientRepository } from '@/src/clients/core/interfaces/client.repository';

// Entities
import { TaxClientInformationEntity } from '@/src/clients/core/entities/tax-client-information.entity';

// DTOs
import { ClientDto } from '../dtos/client.dto';

// Mapper
import { Mapper } from '@/src/clients/application/mappers/entity-dto.mapper';

@Injectable()
export class ListClientsQuery {
	constructor(
		@Inject(ClientRepository) private readonly clientRepository: ClientRepository,
		private readonly mapper: Mapper,
	) {}

	async execute(
    limit?: number,
    cellphone?: string, 
    email?: string, 
    legal_name?: string, 
    name?: string,
    lastIdClient?: string, // Part of the cursor
    lastCreatedAt?: string, // Part of the cursor
  ): Promise<ClientDto[]> {
    let limit_to_use: number = 1001;

    if(lastCreatedAt && lastIdClient === undefined || lastCreatedAt === undefined && lastIdClient) throw new Error('If consulting a page larger than 1, pagination metadata is required.')
    
    if(limit) {
      if(limit <= 1000) {
        limit_to_use = limit + 1
      }
    }
    
		const clients: TaxClientInformationEntity[] = await this.clientRepository.listClients(
      limit_to_use,
      lastCreatedAt,
      lastIdClient,
      cellphone,
      email,
      legal_name,
      name,
    );
		return clients.map((client: TaxClientInformationEntity) => this.mapper.toDto(client));
	}
}

```


# Process for "RETRIEVE" queries
1. Once you have identified the query and the type of query you must make, you have to identify the domain object the query involves:
  - entities `@/src/<module>/core/entities`.
  - object values `@/src/<module>/core/object-values`.
  - enum `@/src/<module>/core/enum`
  - repositories `@/src/<module>/core/interfaces`


2. Then you have to declare the class and a method called `execute`. This method will have a param with the field that will be used for retrieve the records.

3. You have to set maximum amount of items to retrieve. If the user don't provide a limit then you have to set it 
to 100. If the user try to retrieve a larger amount then you will trunc the retrieving to the maximum limit 
allowed. 

4. Then use the method of the interface to achieve the goal

5. Return the value using the map for conver from dto to entity.

Example: 
```typescript
// Libraries
import { Inject, Injectable } from '@nestjs/common';

// Interface
import { ClientRepository } from '@/src/clients/core/interfaces/client.repository';

// Entities
import { TaxClientInformationEntity } from '@/src/clients/core/entities/tax-client-information.entity';

// DTOs
import { ClientDto } from '@/src/clients/application/dtos/client.dto';

// Mapper
import { Mapper } from '@/src/clients/application/mappers/entity-dto.mapper';

@Injectable()
export class RetrieveClientsByIdQuery {
	constructor(
		@Inject(ClientRepository) private readonly clientRepository: ClientRepository,
		private readonly mapper: Mapper,
	) {}

	async execute(id_client: string[]): Promise<ClientDto[]> {
		const maxIds = 100;
		const idClientToRetrieve = id_client.slice(0, maxIds);

		const clients: TaxClientInformationEntity[] = await this.clientRepository.retrieveClientById(
			idClientToRetrieve,
		);

		return clients.map((client: TaxClientInformationEntity) => this.mapper.toDto(client));
	}
}
```

Note about appliying the limit:

Note inside the function, a `slicing of the array` is being implemented. No throwing errors are in the query.

