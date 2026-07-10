// Enums
import { TRANSACTION_STATUS_ENUM } from '@/src/sellings/core/enums/route-status.enum';
import { ROUTE_TRANSACTION_OPERATION_TYPE } from '@/src/sellings/core/enums/route-transaction-operation-type.enum';

// Object values
import { PaymentMethodObjectValue } from '@/src/sellings/core/value-objects/payment-method.object-value';
import { PaymentSchemaObjectValue } from '@/src/sellings/core/value-objects/payment-schema.object-value';
import { TransactionDescriptionObjectValue } from '@/src/sellings/core/value-objects/transaction-description.object-value';

// Entities
import { TransactionEntity } from '@/src/sellings/core/entities/transaction.entity';

// Shared - errors
import { BusinessRuleException } from '@/src/shared/errors/BusinessRuleException';

export class TransactionAggregate {
  private transaction: TransactionEntity|null;
  private paymentMethods: PaymentMethodObjectValue[]
  private paymentSchema: PaymentSchemaObjectValue[]

  constructor(
    _transaction?: TransactionEntity, 
    _paymentMethods?: PaymentMethodObjectValue[], 
    _paymentSchema?: PaymentSchemaObjectValue[]
  ) {
    this.transaction = _transaction ? _transaction : null;
    this.paymentMethods = _paymentMethods ? _paymentMethods : [];
    this.paymentSchema = _paymentSchema ? _paymentSchema : [];
  }

  createNewTransaction(
		_id_transaction: string,
    _received_amount: number,
		_created_at: Date,
		_id_client: string,
		_id_work_day: string,
		_id_payment_method: string,
		_id_payment_schema: string,
		_created_by: string,
		_id_invoice_concept: string | null,
		_latitude: string | null,
		_longitude: string | null,
		_cfdi: string | null,
		_id_location: string | null,
  ): void {
    
    const paymentMethod:PaymentMethodObjectValue|undefined = this.paymentMethods.find((paymentMethod) => {return _id_payment_method === paymentMethod.id_payment_method})
    if(paymentMethod === undefined) throw new BusinessRuleException(`Invalid payment method with id ${_id_payment_method} for transaction with id ${_id_transaction}`)
      
    const paymentSchema:PaymentSchemaObjectValue|undefined = this.paymentSchema.find((paymentSchema) => {return _id_payment_schema === paymentSchema.id_payment_schema})
    if(paymentSchema === undefined) throw new BusinessRuleException(`Invalid payment method with id ${_id_payment_schema} for transaction with id ${_id_transaction}`)

    this.transaction = new TransactionEntity(
      _id_transaction,
      TRANSACTION_STATUS_ENUM.ACTIVE,
      _received_amount,
      _created_at,
      _id_client,
      _created_by,
      _id_work_day,
      new PaymentMethodObjectValue(
        paymentMethod.id_payment_method,
        paymentMethod.payment_method_name
      ),
      new PaymentSchemaObjectValue(
        paymentSchema.id_payment_schema,
        paymentSchema.payment_schema_type
      ),
      [],
      _id_invoice_concept,
      _latitude,
      _longitude,
      _cfdi,
      _id_location,
    ) 
  }

  addRouteDescription(
    _id_transaction_description: string,
    _price_at_moment: number,
    _cost_at_moment: number,
    _quantity: number,
    _created_at: Date,
    _id_transaction: string,
    _id_transaction_operation_type: ROUTE_TRANSACTION_OPERATION_TYPE,
    _id_product: string,
  ): void {
    if(this.transaction === null) throw new Error(`Transaction description cannot be added because transaction has not been initialized.`)
    this.transaction.transaction_descriptions.push(
      new TransactionDescriptionObjectValue(
        _id_transaction_description,
        _price_at_moment,
        _cost_at_moment,
        _quantity,
        _created_at,
        _id_transaction,
        _id_transaction_operation_type,
        _id_product
      )
    );
  }

  cancelTransaction(): void {
    if(this.transaction === null) throw new Error(`Transaction cannot be cancelled because transaction has not been initialized.`)
    this.transaction = new TransactionEntity(
      this.transaction.id_transaction,
      TRANSACTION_STATUS_ENUM.INACTIVE,
      this.transaction.received_amount,
      this.transaction.created_at,
      this.transaction.id_client,
      this.transaction.created_by,
      this.transaction.id_work_day,
      this.transaction.payment_method,
      this.transaction.payment_schema,
      this.createCopyOfTransactionDescriptions(this.transaction.transaction_descriptions),
      this.transaction.id_invoice_concept,
      this.transaction.latitude,
      this.transaction.longitude,
      this.transaction.cfdi,
      this.transaction.id_location,
    );
  }

  getTransaction(): TransactionEntity {
    if(this.transaction === null) throw new Error(`Transaction has not been initialized.`)
    return new TransactionEntity(
      this.transaction.id_transaction,
      this.transaction.state,
      this.transaction.received_amount,
      this.transaction.created_at,
      this.transaction.id_client,
      this.transaction.created_by,
      this.transaction.id_work_day,
      this.transaction.payment_method,
      this.transaction.payment_schema,
      this.createCopyOfTransactionDescriptions(this.transaction.transaction_descriptions),
      this.transaction.id_invoice_concept,
      this.transaction.latitude,
      this.transaction.longitude,
      this.transaction.cfdi,
      this.transaction.id_location,
    );
  }

  private createCopyOfTransactionDescriptions(_transactionDescription: TransactionDescriptionObjectValue[]): TransactionDescriptionObjectValue[] {
    return _transactionDescription.map((description) => {
      return new TransactionDescriptionObjectValue(
        description.id_transaction_description,
        description.price_at_moment,
        description.cost_at_moment,
        description.quantity,
        description.created_at,
        description.id_transaction,
        description.id_transaction_operation_type,
        description.id_product,
      )
    });
  }
}