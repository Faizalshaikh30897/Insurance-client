import moment from "moment";
import { Customer } from "./customer";
import { FUEL } from "./enumerations/fuel";
import { REGION } from "./enumerations/region";
import { VEHICLESEGMENT } from "./enumerations/vehicle-segment";

export class CustomerPolicy {
  constructor(
    public id?: number,
    public dateOfPurchase?: string,
    public customer?: Customer,
    public fuel?: FUEL,
    public vehicleSegment?: VEHICLESEGMENT,
    public premium?: number,
    public bodilyInjuryLiability?: boolean,
    public personalInjuryProtection?: boolean,
    public propertyDamageLiability?: boolean,
    public collision?: boolean,
    public comprehensive?: boolean,
    public region?: REGION
  ) {}
}
