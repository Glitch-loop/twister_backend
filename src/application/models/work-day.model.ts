export interface WorkDayModel {
  id_work_day: string;
  start_date: Date;
  finish_date?: Date;
  id_route: string;
  start_petty_cash: number;
  final_petty_cash?: number;
  id_route_day: string;
  id_user: string;
  id_payment_stub?: string;
}
