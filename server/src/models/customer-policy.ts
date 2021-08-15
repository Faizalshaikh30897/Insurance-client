import moment from "moment";
import { Customer } from "./customer";
import { FUEL } from "./enumerations/fuel";
import { REGION } from "./enumerations/region";
import { VEHICLESEGMENT } from "./enumerations/vehicle-segment";


export class CustomerPolicy {
  id: number;
  dateOfPurchase : moment.Moment;
  customer: Customer;
  fuel: FUEL;
  vehicleSegment: VEHICLESEGMENT;
  premium: number;
  bodilyInjuryLiability: boolean;
  personalInjuryProtection: boolean;
  propertyDamageLiability: boolean;
  collision: boolean;
  comprehensive: boolean;
  region: REGION;
}