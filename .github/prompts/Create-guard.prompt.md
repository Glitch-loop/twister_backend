---
name: Create guard
description: This prompt is used when the user wants to create a new guard in the application.
---

# Input:
The domain object, dto, or entity to create the guard.

### Be cautious:
If the user don't provide the schema/idea for generating the entity, ask him to provide the schema or idea. The user might give you an schema, explanation, picture or any other form of information, so be sure to ask for more details if the user don't provide you with enough information to generate the entity.




> Remember the schema will be used in a typescript application. So you have to define the schema in typescript.


# Process:
* Find the domain object/dto/model that the user refers
  - entities `@/src/core/entities`.
  - object values `@/src/core/object-values`.
  - enum `@/src/core/clientStatusEnum`
  - models `@/src/application/models`.
* Once you located the domain object/dto/model that the user wants to create the guard,
identify the fields that compound the schema, if there is not a clear schema then ask the user to provide more details about the fields and their types.
* Once identified the fields, create a guard that validates if the input data mathces the schema.
  - The name of the guard must be `is` + name of the domain object/dto/model. i.e. "UserEntity" it would be "isUserEntity".
  - To verify if it's a record, use the `isRecord` function that is defined in `@/src/application/guards/utils.ts`.
  - You have to use all the fields that compound the schema to valiate the input data.
* Depending to what you are doing a guard, you will locate the file at:
  - If it's an entity `@/src/application/entities`.
  - If it's a model `@/src/application/models`.
  - If it's an object value `@/src/core/object-values`.
* By convention we are using kebab-case for file names and we add `.guard` at the end of the file name. i.e. "route day" it would be "route-day.guard.ts". 

For example, if the user provides you with the following information:

# Input
User asked to generate a guard for transaction model.

# Process
1. Locate the transaction model at `@/src/application/models/transaction.model.ts`.
2. Identify the fields that compound the transaction model, in this case: 
```typescript
export interface TransactionModel {
  id_transaction: string;
  cfdi?: string;
  state: number;
  amount: number;
  id_invoice_concept: string;
  created_at: Date;
  id_location?: string;
  id_client: string;
  id_work_day: string;
  id_payment_method: string;
  id_payment_schema: string;
}
```

3. Once we have identified the model and its field,  create a guard named `isTransactionModel` that validates if the input data matches the transaction model schema.
You should generate the following guard:

```typescript
import type { TransactionModel } from '@/src/application/models/transaction.model';

import { isRecord } from '@/src/application/guards/utils';

export const isTransactionModel = (value: unknown): value is TransactionModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_transaction === 'string' &&
    (value.cfdi === undefined || typeof value.cfdi === 'string') &&
    typeof value.state === 'number' &&
    typeof value.amount === 'number' &&
    typeof value.id_invoice_concept === 'string' &&
    value.created_at instanceof Date &&
    (value.id_location === undefined || typeof value.id_location === 'string') &&
    typeof value.id_client === 'string' &&
    typeof value.id_work_day === 'string' &&
    typeof value.id_payment_method === 'string' &&
    typeof value.id_payment_schema === 'string'
  );
};
```

> Notice I have used "isRecord" from utils.ts located at `src/application/guards/utils.ts` to validate if the input value is a record, then I validate each field that compound the transaction model.

4. Since it's a model the file will be located at `src/application/guards/models` and the name of the file will be `transaction.guard.ts`.