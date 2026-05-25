---
name: Create or update controller.
description: This prompt is used when the user wants to create or update a controller following the project's architectural rules for responses, collection endpoints, retrieve endpoints, limits, and pagination.
---

This prompt is used when the user wants to create or update a controller.

The goal is not only to expose use cases, but to expose them with a consistent architectural contract.

# Objective

Design controller endpoints with these architectural rules:

1. All endpoints must return a standardized controller response.
2. All responses must be built through the project's response formatter abstraction.
3. Collection endpoints and retrieve endpoints must follow different input contracts.
4. Read operations must define bounded limits.
5. List endpoints must support pagination when they return collections.
6. Controllers must coordinate application use cases, not implement business logic.

# Architectural principles

1. The controller is an orchestration layer.
It receives HTTP input, normalizes it, delegates to commands or queries, and formats the output.

2. The controller must not contain business rules.
Business rules belong in aggregates, commands, queries, repositories, or domain services depending on the responsibility.

3. The controller must not return ad hoc response objects.
Every endpoint must return the project's standardized controller response contract.

4. The controller must not bypass the response formatter.
All responses, including success responses without payload, must be built through the formatter abstraction provided by the project.

5. Limits and pagination are not optional design details.
If an endpoint returns collections, the design must explicitly define how many records can be returned and how the next page is requested.

# Endpoint taxonomy

## 1. List endpoints

Use a list endpoint when the user wants a collection.

Characteristics:

1. Returns a collection, not a single resource contract.
2. Accepts filters through query parameters.
3. Accepts pagination input.
4. Enforces a maximum limit.
5. Returns pagination metadata when applicable.

Recommended design:

1. HTTP method: `GET`
2. Input source: query parameters
3. Query parameters may include:
	- `limit`
	- `next_item` or equivalent opaque cursor
	- filter fields relevant to the collection
4. Maximum limit must be explicitly bounded.
5. The application query must enforce the limit.
6. The repository implementation must also enforce the limit.

Pagination rules:

1. Use pagination for list endpoints that can grow over time.
2. Prefer cursor/keyset pagination over offset pagination for mutable data.
3. The controller must decode the incoming cursor and pass normalized pagination values to the application query.
4. The response formatter must build the pagination metadata for the response.
5. The cursor should be treated as opaque at the HTTP contract level.

## 2. Retrieve endpoints

Use a retrieve endpoint when the user wants specific records by identifier.

Characteristics:

1. It is not a generic filtered list.
2. It exists to retrieve known records.
3. It may retrieve one record or multiple specific records.
4. It should not rely on collection pagination semantics.

Recommended design:

1. Retrieve one specific record:
	- prefer a dedicated identifier-based route when the contract is truly singular.
2. Retrieve multiple specific records:
	- prefer a dedicated retrieve endpoint with a request body containing identifiers.
3. Input should be explicit and bounded.
4. The query must cap the number of identifiers it accepts.
5. Extra identifiers beyond the maximum may be ignored or rejected, but the rule must be consistent.

Typical retrieve input contract:

1. HTTP method: `POST` when retrieving many specific records by identifier list.
2. Body shape: a dedicated object containing the identifier array.
3. Maximum number of identifiers must be enforced in the application query and respected by the repository.

# Response standardization

Every endpoint must:

1. Return the standard controller response type used by the project.
2. Use the response formatter abstraction to build the response.
3. Avoid returning raw objects directly from the controller.

Response design rules:

1. Success without data still uses the formatter.
2. Success with data still uses the formatter.
3. Paginated success responses use the same formatter, adding pagination metadata.
4. Message wording should be consistent, concise, and action-oriented.

# Input normalization rules

The controller should normalize transport input before calling the use case.

Examples of normalization responsibilities:

1. Parse numeric query parameters such as `limit`.
2. Decode cursor values.
3. Normalize repeated or comma-separated query values into arrays.
4. Convert primitive transport values into the shape expected by the application query.

The controller should not:

1. Implement filtering rules.
2. Decide business validity of entities.
3. Compose domain objects that belong in mappers or use cases.

# Limits

Every read endpoint that can return more than one record must define a limit policy.

Rules:

1. Define a maximum limit at the architectural level.
2. Enforce the limit in the application query.
3. Re-enforce the limit in the repository implementation.
4. Do not leave collection size unbounded.
5. Use the same maximum consistently across the endpoint, query, and repository unless there is a documented exception.

# Controller construction checklist

When creating or updating a controller, do the following:

1. Inject the required commands and queries.
2. Decide whether each endpoint is a list endpoint or a retrieve endpoint.
3. Standardize the input contract accordingly.
4. Normalize HTTP input before calling the use case.
5. Delegate to the corresponding command or query.
6. Return the result through the response formatter.
7. If the endpoint returns collections, ensure limit and pagination are implemented.
8. If the endpoint retrieves specific records by identifiers, ensure the number of identifiers is bounded.

# Expected output when applying this prompt

When asked to create or update a controller, produce a controller that:

1. Uses the project's standard controller response contract.
2. Uses the project's response formatter abstraction for every endpoint.
3. Distinguishes clearly between list endpoints and retrieve endpoints.
4. Enforces bounded read operations.
5. Supports pagination for collection endpoints.
6. Keeps orchestration in the controller and business rules outside of it.

# Important constraints

1. Be architecture-driven, not framework-driven only.
2. Keep the design consistent across modules.
3. Do not introduce endpoint-specific response shapes when the project already defines a standard one.
4. Do not create unbounded collection reads.
5. Do not mix collection-list semantics with retrieve-specific-record semantics.
  