import { Injectable } from '@nestjs/common';


// Repositories
import { RouteTransactionRepository } from '@/src/sellings/core/interfaces/route-transactions.repository';

// Value objects
import { PaymentMethodObjectValue } from '@/src/sellings/core/value-objects/payment-method.object-value';
import { PaymentSchemaObjectValue } from '@/src/sellings/core/value-objects/payment-schema.object-value';
import { TaxInTransactionObjectValue } from '@/src/sellings/core/value-objects/tax-in-transaction.object-value';
import { TransactionDescriptionObjectValue } from '@/src/sellings/core/value-objects/transaction-description.object-value';

// Entitites
import { TaxEntity } from '@/src/sellings/core/entities/tax.entity';
import { TransactionEntity } from '@/src/sellings/core/entities/transaction.entity';

import { SupabaseDataSource } from '@/src/shared/infrastructure/datasources/supabase-data-source';

// Models
import type { PaymentMethodModel } from '@/src/sellings/application/models/payment.method.model';
import type { PaymentSchemaModel } from '@/src/sellings/application/models/payment-schema.model';
import type { TaxInTransactionModel } from '@/src/sellings/application/models/tax-in-transaction.model';
import type { TaxModel } from '@/src/sellings/application/models/tax.model';
import type { TransactionDescriptionModel } from '@/src/sellings/application/models/transaction-description.model';
import type { TransactionModel } from '@/src/sellings/application/models/transaction.model';

// Mappers
import { EntityModelMapper } from '@/src/sellings/application/mappers/entity-model.mapper';



interface TransactionRow {
  id_transaction: string;
  cfdi?: string | null;
  state: number;
  amount: number | string;
  id_invoice_concept: string;
  created_at: Date | string;
  latitude?: string | null;
  longitude?: string | null;
  id_location?: string | null;
  id_client: string;
  id_work_day: string;
  id_payment_method: string;
  id_payment_schema: string;
}

interface TransactionDescriptionRow {
  id_transaction_description: string;
  price_at_moment: number | string;
  cost_at_moment: number | string;
  amount: number | string;
  created_at: Date | string;
  id_transaction: string;
  id_transaction_operation_type: string;
  id_product: string;
}

interface TaxInTransactionRow {
  id_tax_in_transaction: string;
  id_transaction: string;
  id_tax: string;
  tax_rate_at_moment_of_transaction: number | string;
  created_at: Date | string;
}

@Injectable()
export class RouteTransactionsSupabaseRepository implements RouteTransactionRepository {
  constructor(
    private readonly supabaseDataSource: SupabaseDataSource,
    private readonly mapper: EntityModelMapper,
  ) {}

  private get supabase() {
    return this.supabaseDataSource.getClient();
  }

  async createTransaction(transaction: TransactionEntity): Promise<void> {
    try {
      const transactionModel = this.mapper.toModel(transaction);
      const transactionPayload = {
        id_transaction: transactionModel.id_transaction,
        cfdi: transactionModel.cfdi,
        state: transactionModel.state,
        amount: transactionModel.received_amount,
        id_invoice_concept: transactionModel.id_invoice_concept,
        longitude: transactionModel.longitude,
        latitude: transactionModel.latitude,
        created_at: transactionModel.created_at,
        id_location: transactionModel.id_location,
        id_client: transactionModel.id_client,
        id_work_day: transactionModel.id_work_day,
        id_payment_method: transactionModel.id_payment_method,
        id_payment_schema: transactionModel.id_payment_schema,
      };

      const { error: transactionError } = await this.supabase
        .from('transactions')
        .insert(transactionPayload);

      if (transactionError) {
        throw new Error(`Failed to create transaction: ${transactionError.message}`);
      }

      if (transaction.transaction_descriptions.length > 0) {
        const transactionDescriptionModels = transaction.transaction_descriptions.map((description) =>
          this.mapper.toModel(description),
        );

        const { error: descriptionError } = await this.supabase
          .from('transaction_descriptions')
          .insert(transactionDescriptionModels);

        if (descriptionError) {
          throw new Error(`Failed to create transaction descriptions: ${descriptionError.message}`);
        }
      }
    } catch (error) {
      throw new Error(
        `Failed to create transaction: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async cancelTransaction(idTransaction: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('transactions')
        .update({ state: 0 })
        .eq('id_transaction', idTransaction);

      if (error) {
        throw new Error(`Failed to cancel transaction: ${error.message}`);
      }
    } catch (error) {
      throw new Error(
        `Failed to cancel transaction: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async listPaymentMethods(): Promise<PaymentMethodObjectValue[]> {
    try {
      const { data, error } = await this.supabase
        .from('payment_method')
        .select('*');

      if (error) {
        throw new Error(`Failed to list payment methods: ${error.message}`);
      }

      return ((data ?? []) as PaymentMethodModel[]).map((model) =>
        this.mapper.toDomainObject(model),
      );
    } catch (error) {
      throw new Error(
        `Failed to list payment methods: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async listPaymentSchema(): Promise<PaymentSchemaObjectValue[]> {
    try {
      const { data, error } = await this.supabase
        .from('payment_schema')
        .select('*');

      if (error) {
        throw new Error(`Failed to list payment schema: ${error.message}`);
      }

      return ((data ?? []) as PaymentSchemaModel[]).map((model) =>
        this.mapper.toDomainObject(model),
      );
    } catch (error) {
      throw new Error(
        `Failed to list payment schema: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async listTaxes(taxName?: string): Promise<TaxEntity[]> {
    try {
      const query = this.supabase.from('taxes').select('*');

      if (taxName) {
        query.ilike('tax_name', `%${taxName}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to list taxes: ${error.message}`);
      }

      return ((data ?? []) as TaxModel[]).map((model) =>
        this.mapper.toDomainObject(model),
      );
    } catch (error) {
      throw new Error(
        `Failed to list taxes: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async retrieveTaxesInTransactionByIdTransaction(
    idTransaction: string,
  ): Promise<TaxInTransactionObjectValue[]> {
    try {
      const { data, error } = await this.supabase
        .from('taxes_in_transactions')
        .select('*')
        .eq('id_transaction', idTransaction);

      if (error) {
        throw new Error(`Failed to retrieve taxes in transaction: ${error.message}`);
      }

      const models: TaxInTransactionModel[] = ((data ?? []) as TaxInTransactionRow[]).map((row) => ({
        id_tax_in_transaction: row.id_tax_in_transaction,
        id_transaction: row.id_transaction,
        id_tax: row.id_tax,
        tax_rate_at_moment_of_transaction: this.toNumber(
          row.tax_rate_at_moment_of_transaction,
          'tax_rate_at_moment_of_transaction',
        ),
        created_at: this.toDate(row.created_at, 'created_at'),
      }));

      return models.map((model) => this.mapper.toDomainObject(model));
    } catch (error) {
      throw new Error(
        `Failed to retrieve taxes in transaction by id_transaction: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async retrieveRouteTransactionDescriptionByIdTransaction(
    idTransaction: string,
  ): Promise<TransactionDescriptionObjectValue[]> {
    try {
      const { data, error } = await this.supabase
        .from('transaction_descriptions')
        .select('*')
        .eq('id_transaction', idTransaction);

      if (error) {
        throw new Error(`Failed to retrieve transaction descriptions: ${error.message}`);
      }

      const models: TransactionDescriptionModel[] = ((data ?? []) as TransactionDescriptionRow[]).map((row) => ({
        id_transaction_description: row.id_transaction_description,
        price_at_moment: this.toNumber(row.price_at_moment, 'price_at_moment'),
        cost_at_moment: this.toNumber(row.cost_at_moment, 'cost_at_moment'),
        amount: this.toNumber(row.amount, 'amount'),
        created_at: this.toDate(row.created_at, 'created_at'),
        id_transaction: row.id_transaction,
        id_transaction_operation_type: row.id_transaction_operation_type,
        id_product: row.id_product,
      }));

      return models.map((model) => this.mapper.toDomainObject(model));
    } catch (error) {
      throw new Error(
        `Failed to retrieve transaction descriptions by id_transaction: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async listTransactions(
    limit?: number,
    nextCreatedAt?: string,
    nextId?: string,
    cfdi?: string,
    received_amount?: string,
    transaction_status?: number[],
    id_location?: string[],
    id_client?: string[],
    id_work_day?: string[],
    id_payment_method?: string[],
    id_payment_schema?: string[],
  ): Promise<TransactionEntity[]> {
    try {
      const query = this.supabase.from('transactions').select('*');

      if (cfdi) query.ilike('cfdi', `%${cfdi}%`);
      if (received_amount !== undefined) query.eq('amount', received_amount);
      if (transaction_status && transaction_status.length > 0) query.in('state', transaction_status);
      if (id_location && id_location.length > 0) query.in('id_location', id_location);
      if (id_client && id_client.length > 0) query.in('id_client', id_client);
      if (id_work_day && id_work_day.length > 0) query.in('id_work_day', id_work_day);
      if (id_payment_method && id_payment_method.length > 0) query.in('id_payment_method', id_payment_method);
      if (id_payment_schema && id_payment_schema.length > 0) query.in('id_payment_schema', id_payment_schema);

      if (nextCreatedAt && nextId) {
        query.or(
          `created_at.lt."${nextCreatedAt}",and(created_at.eq."${nextCreatedAt}",id_transaction.lt."${nextId}")`,
        );
      }

      query.order('created_at', { ascending: false });
      query.order('id_transaction', { ascending: false });
      query.limit(this.normalizeLimit(limit));

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to list transactions: ${error.message}`);
      }

      const transactionModels = ((data ?? []) as TransactionRow[]).map((row) =>
        this.mapTransactionRowToModel(row),
      );

      return this.composeTransactions(transactionModels);
    } catch (error) {
      throw new Error(
        `Failed to list transactions: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async retrieveTransactionsByIdTransaction(idTransaction: string[]): Promise<TransactionEntity[]> {
    try {
      if (idTransaction.length === 0) {
        return [];
      }

      const { data, error } = await this.supabase
        .from('transactions')
        .select('*')
        .in('id_transaction', idTransaction);

      if (error) {
        throw new Error(`Failed to retrieve transactions by ids: ${error.message}`);
      }

      const transactionModels = ((data ?? []) as TransactionRow[]).map((row) =>
        this.mapTransactionRowToModel(row),
      );

      return this.composeTransactions(transactionModels);
    } catch (error) {
      throw new Error(
        `Failed to retrieve transactions by ids: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private async composeTransactions(
    transactionModels: TransactionModel[],
  ): Promise<TransactionEntity[]> {
    if (transactionModels.length === 0) {
      return [];
    }

    const transactionIds = transactionModels.map((transaction) => transaction.id_transaction);
    const paymentMethodIds = [...new Set(transactionModels.map((transaction) => transaction.id_payment_method))];
    const paymentSchemaIds = [...new Set(transactionModels.map((transaction) => transaction.id_payment_schema))];

    const [paymentMethodsResult, paymentSchemasResult, descriptionsResult] = await Promise.all([
      this.supabase
        .from('payment_method')
        .select('*')
        .in('id_payment_method', paymentMethodIds),
      this.supabase
        .from('payment_schema')
        .select('*')
        .in('id_payment_schema', paymentSchemaIds),
      this.supabase
        .from('transaction_descriptions')
        .select('*')
        .in('id_transaction', transactionIds),
    ]);

    if (paymentMethodsResult.error) {
      throw new Error(`Failed to retrieve payment methods for transactions: ${paymentMethodsResult.error.message}`);
    }

    if (paymentSchemasResult.error) {
      throw new Error(`Failed to retrieve payment schema for transactions: ${paymentSchemasResult.error.message}`);
    }

    if (descriptionsResult.error) {
      throw new Error(`Failed to retrieve transaction descriptions for transactions: ${descriptionsResult.error.message}`);
    }

    const paymentMethodsById = new Map<string, PaymentMethodModel>(
      ((paymentMethodsResult.data ?? []) as PaymentMethodModel[]).map((model) => [
        model.id_payment_method,
        model,
      ]),
    );

    const paymentSchemasById = new Map<string, PaymentSchemaModel>(
      ((paymentSchemasResult.data ?? []) as PaymentSchemaModel[]).map((model) => [
        model.id_payment_schema,
        model,
      ]),
    );

    const descriptionsByTransactionId = new Map<string, TransactionDescriptionModel[]>();

    for (const row of (descriptionsResult.data ?? []) as TransactionDescriptionRow[]) {
      const model: TransactionDescriptionModel = {
        id_transaction_description: row.id_transaction_description,
        price_at_moment: this.toNumber(row.price_at_moment, 'price_at_moment'),
        cost_at_moment: this.toNumber(row.cost_at_moment, 'cost_at_moment'),
        amount: this.toNumber(row.amount, 'amount'),
        created_at: this.toDate(row.created_at, 'created_at'),
        id_transaction: row.id_transaction,
        id_transaction_operation_type: row.id_transaction_operation_type,
        id_product: row.id_product,
      };

      const current = descriptionsByTransactionId.get(model.id_transaction) ?? [];
      current.push(model);
      descriptionsByTransactionId.set(model.id_transaction, current);
    }

    return transactionModels.map((transactionModel) => {
      const paymentMethodModel = paymentMethodsById.get(transactionModel.id_payment_method);
      const paymentSchemaModel = paymentSchemasById.get(transactionModel.id_payment_schema);
      const transactionDescriptions = descriptionsByTransactionId.get(transactionModel.id_transaction) ?? [];

      if (!paymentMethodModel) {
        throw new Error(`Payment method not found for transaction ${transactionModel.id_transaction}`);
      }

      if (!paymentSchemaModel) {
        throw new Error(`Payment schema not found for transaction ${transactionModel.id_transaction}`);
      }

      return this.mapper.toDomainObject(
        transactionModel,
        paymentMethodModel,
        paymentSchemaModel,
        transactionDescriptions,
      );
    });
  }

  private mapTransactionRowToModel(row: TransactionRow): TransactionModel {
    return {
      id_transaction: row.id_transaction,
      cfdi: row.cfdi ?? undefined,
      state: row.state,
      received_amount: this.toNumber(row.amount, 'amount'),
      id_invoice_concept: row.id_invoice_concept,
      created_at: this.toDate(row.created_at, 'created_at'),
      latitude: row.latitude ?? undefined,
      longitude: row.longitude ?? undefined,
      id_location: row.id_location ?? undefined,
      id_client: row.id_client,
      id_work_day: row.id_work_day,
      id_payment_method: row.id_payment_method,
      id_payment_schema: row.id_payment_schema,
    };
  }

  private normalizeLimit(limit?: number): number {
    if (limit === undefined || limit <= 0) {
      return 1001;
    }

    return limit;
  }

  private toNumber(value: number | string, fieldName: string): number {
    const numericValue = typeof value === 'number' ? value : Number(value);

    if (Number.isNaN(numericValue)) {
      throw new Error(`Invalid numeric value in ${fieldName}`);
    }

    return numericValue;
  }

  private toDate(value: Date | string, fieldName: string): Date {
    const parsedDate = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
      throw new Error(`Invalid date value in ${fieldName}`);
    }

    return parsedDate;
  }
}
