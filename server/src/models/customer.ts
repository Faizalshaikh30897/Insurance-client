import { GENDER } from "./enumerations/gender";
import { IncomeGroup } from "./income-group";


export class Customer {
  id: number;
  gender : GENDER;
  incomeGroup: IncomeGroup;
  maritalStatus: boolean;
}