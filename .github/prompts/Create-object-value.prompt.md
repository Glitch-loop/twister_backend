---
name: Create object value
description: This prompt is used when the user wants to create a new object value in the core.
---

Note: If the user don't provide the schema/idea for generating the object value, ask him to provide the schema or idea. The user might give you an schema, explanation, picture or any other form of information, so be sure to ask for more details if the user don't provide you with enough information to generate the object value.


Remember the schema will be used in a typescript application. So you have to define the schema in typescript.

* Understand the schema/idea provided.
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