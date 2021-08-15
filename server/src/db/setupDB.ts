import { Model } from "sequelize";
import { Sequelize, DataTypes } from "sequelize";
import { FUEL } from "../models/enumerations/fuel";
import { GENDER } from "../models/enumerations/gender";
import { REGION } from "../models/enumerations/region";
import { VEHICLESEGMENT } from "../models/enumerations/vehicle-segment";

export class IncomeGroupModel extends Model {}

export class CustomerModel extends Model {}

export class CustomerPolicyModel extends Model {}

export let sequelize: Sequelize;

export const setupDB = async () => {
  console.log(
    `db creds: ${process.env.DATABASE} ${process.env.DB_USERNAME} ${process.env.DB_PASSWORD}`
  );
  sequelize = new Sequelize(
    process.env.DATABASE!,
    process.env.DB_USERNAME!,
    process.env.DB_PASSWORD!,
    {
      dialect: "postgres",
    }
  );

  IncomeGroupModel.init(
    {
      id: { type: DataTypes.BIGINT, primaryKey: true },
      incomeRange: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: "income_range",
      },
    },
    {
      sequelize,
      modelName: "IncomeGroup",
      tableName: "income_group",
      timestamps: false,
    }
  );

  CustomerModel.init(
    {
      id: { type: DataTypes.BIGINT, primaryKey: true },
      gender: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: [GENDER.FEMALE, GENDER.MALE],
      },
      maritalStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "marital_status",
      },
    },
    {
      sequelize,
      modelName: "Customer",
      tableName: "customer",
      timestamps: false,
    }
  );

  CustomerPolicyModel.init(
    {
      id: { type: DataTypes.BIGINT, primaryKey: true },
      dateOfPurchase: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "date_of_purchase",
      },
      region: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: [REGION.East, REGION.North, REGION.South, REGION.West],
      },
      fuel: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: [FUEL.CNG, FUEL.Diesel, FUEL.Petrol],
      },
      vehicleSegment: {
        type: DataTypes.ENUM,
        allowNull: false,
        field: "vehicle_segment",
        values: [VEHICLESEGMENT.A, VEHICLESEGMENT.B, VEHICLESEGMENT.C],
      },
      premium: { type: DataTypes.INTEGER, allowNull: false },
      bodilyInjuryLiability: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "bodily_injury_liability",
      },
      personalInjuryProtection: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "personal_injury_protection",
      },
      propertyDamageLiability: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "property_damage_liability",
      },
      collision: { type: DataTypes.BOOLEAN, allowNull: false },
      comprehensive: { type: DataTypes.BOOLEAN, allowNull: false },
    },
    {
      sequelize,
      modelName: "CustomerPolicy",
      tableName: "customer_policy",
      timestamps: false,
    }
  );
  // CustomerModel.hasMany(CustomerPolicyModel);
  CustomerPolicyModel.belongsTo(CustomerModel, {
    foreignKey: "customer_id",
    as: "customer",
  });
  CustomerModel.belongsTo(IncomeGroupModel, {
    foreignKey: "income_group_id",
    as: "incomeGroup",
  });
  await IncomeGroupModel.sync(); //{force: true}
  await CustomerModel.sync();
  await CustomerPolicyModel.sync();
};
