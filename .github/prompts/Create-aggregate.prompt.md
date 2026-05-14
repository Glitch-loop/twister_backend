---
name: Create aggregate
description: This prompt is used when the user wants to create a new aggregate in the core.
---

You'll use this prompt when the user asked you for create a new aggreagte.


# Input:
You'll recieve an image, an explanation or both to create the aggregate.
If the user doesn't provide any rule or description about what a method makes then only declare inside the class.


* Understand the schema/idea/photo provided.
* Locate all the domain objects that compound the aggregate:
  - entities `src/core/entities`.
  - object values `src/core/object-values`.
  - enum `src/core/clientStatusEnum`
* Once you located the domain object that compound the aggregate define them as attributes inside the aggregate.
* All attributes will be injected throught the constructor, at least the user specifically says that not. If user provide rules then apply them in the constructor otherwise, only assign the paramters to their respective attributes. 
* Define all the methods the aggregate must contain, take into account if the user describes what the method does, if there is not description then let it empty.
* At the end of the class name you have to add `Aggregate`. i.e. "Client" it would be "ClientAggregate".
* By convention we are using kebab-case for file names and we add `.aggregate` at the end of the file name. i.e. "route day" it would be "route-day.aggregate.ts". 
* This file will be placed at `src/core/aggregates` folder.



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