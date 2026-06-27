

import { ApiProperty } from '@nestjs/swagger';

export class RouteInventoryOperationDescriptionDto {
    @ApiProperty({ type: String, format: 'uuid', example: '6e47b7d0-7ed2-4c7b-9a3a-0f4e8f9b2c11' })
    public readonly id_product_operation_description: string;

    @ApiProperty({ type: Number, example: 52.25 })
    public readonly price_at_moment: number;

    @ApiProperty({ type: Number, example: 41.1 })
    public readonly cost_at_moment: number;

    @ApiProperty({ type: Number, example: 12 })
    public readonly quantity: number;

    @ApiProperty({ type: Number, example: 12 })
    public readonly created_at: string;

    @ApiProperty({ type: String, format: 'uuid', example: '9c1b2a3d-4e5f-4a67-8b90-1c2d3e4f5a67' })
    public readonly id_inventory_operation: string;

    @ApiProperty({ type: String, format: 'uuid', example: '2c4d6e8f-0123-4b56-9c78-9d0e1f2a3456' })
    public readonly id_product: string;

    constructor(
        id_product_operation_description: string,
        price_at_moment: number,
        cost_at_moment: number,
        quantity: number,
        created_at: string,
        id_inventory_operation: string,
        id_product: string,
    ) {
        this.id_product_operation_description = id_product_operation_description;
        this.price_at_moment = price_at_moment;
        this.cost_at_moment = cost_at_moment;
        this.quantity = quantity;
        this.created_at = created_at;
        this.id_inventory_operation = id_inventory_operation;
        this.id_product = id_product;
    }
}