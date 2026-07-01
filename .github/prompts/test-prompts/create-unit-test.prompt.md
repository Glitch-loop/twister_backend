---
name: Create unit tests
description: This prompt is used when the user wants to create unit tests.
---


# Context
### About the project
You are working on a DDD project, following the modular monolith
architecture.

The project is located inside `src`

***Structure of a module***
/<module name>
  /application
    /commands
    /dtos
    /guards
      /dtos
      /entities
      /models
      /object-values
    /mappers
    /models
    /queries
  /core
    /aggregates
    /constants
    /entities
    /enums
    /interfaces
    /value-objects
  /infrastructure
    /infrastructure
      /repositories


### About testing of the project
To keep organized the tests files, the `test folder structure` mirrors
the `project folder structure`.

The tests are located in `test/src`.

# Input
The user will provide the following inputs:
- `Module` Refers to the specific module we are working.
- `file`|`folder` Refers to the target to create the unit testing.


# Process
1. Locate the files in the `project structure folder` (`src/<module name>`). 
  First go to the module in question and then navigate between the 
  folders looking for the file(s) to make the unit test.
2. Once the files has been located, locate the folder on which you will place the tests at the `test structure folder` (`test/src/<module name>`).
  In case you were not able to locate the folder on which will place the unit test, you can create the folders always `mirroring` the project structure `src/<module name>`
3. Once you have located the files (in `project structure folder`) to create the unit testing and the place where they will reside the tests (in `test structure folder`) in the test, then you'll begin to create the unit tests.
  You'll follow the following guidelines:
    - Follow test coverage best practices.
    - If you have an `option` (if statement, two types for the same fields string|undefined) you have to create a unit test peer 
    possible path.
4. Once you have finished of creating the unit test file, place this 
unit test inside the `test structure folder`
