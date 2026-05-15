---
name: Create integration testing for supabase repository.
description: Use this prompt when the user wants to create an integration testing for a supabase repository.
---

# Input:
- The user will provide the repository to create the integration testing and he will indicate where should it be placed.


> The framework we are using for testing is Jest, so the generated code must be compatible with it.

# Process
* You have to locate the repository file, you'll find it in `@/src/infrastructure/repositories/supabase`.
* Once located, you have to locate all the domain objects/entities that the repository uses, you can find them in the following repository:
- entities: `@/src/core/entities`
- value objects: `@/src/core/value-objects`
- enums: `@/src/core/enums`

* Define each field.
* Once you get the fields that compound the schema, use a class to define the object value, all the attributes must be `public readonly` and must be declared in the constructor,
* The class will be located at `@/src/core/object-values`.
* At the end of the class name you have to add `ObjectValue`. i.e. "Route day" it would be "RouteDayObjectValue".
* By convention we are using kebab-case for file names and we add `.object-value` at the end of the file name. i.e. "route day" it would be "route-day.object-value.ts". 

For example, if the user provides you with the following information:

CREATE TABLE public.payment_method (
  id_payment_method uuid NOT NULL DEFAULT gen_random_uuid(),
  payment_method_name character varying NOT NULL,
  CONSTRAINT payment_method_pkey PRIMARY KEY (id_payment_method)
);

You should generate the following object value:

```typescript
export class PaymentMethodObjectValue {
  constructor(
    public readonly id_payment_method: string,
    public readonly payment_method_name: string
  ) {}
}
```

You only have to create the object value, you don't have to create the repository, service or controller. In the same way, avoid to add any `interface` or `primitive`. Only one class must result by file. 