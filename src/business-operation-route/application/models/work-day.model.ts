export interface WorkDayModel {
  id_work_day: string;
  start_date: string;
  finish_date: string | null;
  start_petty_cash: number;
  final_petty_cash: number | null;
  id_route_day: string;
  id_user: string;
  id_payment_stub: string | null;
}
