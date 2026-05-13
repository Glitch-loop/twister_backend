---
name: Create entity
description: This prompt is used when the user wants to create a new entity in the core.
---

Note: If the user don't provide the schema/idea for generating the entity, ask him to provide the schema or idea. The user might give you an schema, explanation, picture or any other form of information, so be sure to ask for more details if the user don't provide you with enough information to generate the entity.


Remember the schema will be used in a typescript application. So you have to define the schema in typescript.

* Understand the schema/idea provided.
* Define each field.
* Once you get the fields that compound the schema, use a class to define the entity, all the attributes must be `public readonly` and must be declared in the constructor,
* The class will be located at `src/core/entities`.
* The name of the class and the file must be in camel case. For example; "route day" RouteDay, "user" User, etc.

For example, if the user provides you with the following information:

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

You should generate the following entity:

```typescript
export class User {
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