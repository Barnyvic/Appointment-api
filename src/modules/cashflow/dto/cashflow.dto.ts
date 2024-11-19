export class CashFlowResultDto<T> {
  data: T[];
  totalIncome?: number;
  totalExpense?: number;

  constructor(data: T[], totalIncome?: number, totalExpense?: number) {
    this.data = data;
    this.totalIncome = totalIncome;
    this.totalExpense = totalExpense;
  }
}
