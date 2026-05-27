---
name: Create new nest module.
description: This prompt is used when the user wants to create a new NestJS module.
---

This prompt is used when the user wants to create a new NestJS module. 

User will ask you to create a new module, he can refers as nest module or simply module, but you have to understand that he is referring to a nest module, so you have to create the module following the nestjs structure and best practices.

# Input:
User will provide you with the following information:
- Name of the module.


# Steps to follow:

> To name the module, files and folders, you'll need to use the kebab-case format. For example, if the module name is "User Management", the folder and files should be named "user-management".

1. Create a new folder with the name of the module inside the `src` folder.
2. Inside the newly created folder, create the following files:
  - `application` folder: This folder will contain the application layer of the module, including commands, queries, and services.
    - `commands` folder: This folder will contain the command handlers for the module.
    - `dtos` folder: This folder will contain the data transfer objects for the module.
    - `guards` folder: This folder will contain the guards for the module.
      - `dtos` folder: This folder will contain the data transfer objects for the guards.
      - `entities` folder: This folder will contain the entities for the guards.
      - `models` folder: This folder will contain the models for the guards.
      - `object-values` folder: This folder will contain the object values for the guards.
    - `mappers` folder: This folder will contain the mappers for the module.
    - `queries` folder: This folder will contain the query handlers for the module.
    - `models` folder: This folder will contain the models that represent database table for the module.
  - `core` folder: This folder will contain the core layer of the module, including aggregates, entities, repositories, and value objects.
    - `aggregates` folder: This folder will contain the aggregate roots for the module.
    - `constants` folder: This folder will contain the constants for the module.
    - `entities` folder: This folder will contain the entities for the module.
    - `enums` folder: This folder will contain the enums for the module.
    - `interfaces` folder: This folder will contain the repository interfaces for the module.
    - `value-objects` folder: This folder will contain the value objects for the module.
  - `infrastructure` folder: This folder will contain the infrastructure layer of the module, including aggregates, entities, repositories, and value objects.
    - `infrastructure` folder: This folder will contain the infrastructure layer; implementations, database schemas, and other infrastructure-related files for the module.
      - `repositories` folder: This folder will contain the repository implementation for the interfaces locate at core/interfaces.
        - `supabase` folder: This folder will contain the Supabase-specific repository implementations.
  - `module-name.module.ts`: This file will contain the module definition.
  - `module-name.controller.ts`: This file will contain the controller definition.