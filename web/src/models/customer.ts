import { GENDER } from "./enumerations/gender";
import { IncomeGroup } from "./income-group";

export class Customer {
  constructor(
    public id: number,
    public gender: GENDER,
    public incomeGroup: IncomeGroup,
    public maritalStatus: boolean
  ) {}
}
