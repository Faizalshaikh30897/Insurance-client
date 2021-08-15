import { Router, Request, Response } from "express";
import { where } from "sequelize";
import { col, QueryTypes } from "sequelize";
import { cast } from "sequelize";
import { Op } from "sequelize";
import { CustomerPolicy } from "src/models/customer-policy";
import {
  CustomerModel,
  CustomerPolicyModel,
  IncomeGroupModel,
  sequelize,
} from "../db/setupDB";

const router = Router();

// get api for getting all policies with search and pagination
router.get("/", async (req: Request, res: Response) => {
  try {
    const size = req.query.size;
    const page = req.query.page;
    const search = String(req.query.query) || "";
    if (!size || !page) {
      res.status(400).json({ message: "no pagination details provided" });
    } else {
      const { count, rows } = await CustomerPolicyModel.findAndCountAll({
        where: {
          [Op.or]: [
            where(cast(col("CustomerPolicy.id"), "varchar"), {
              [Op.like]: `%${search.toLowerCase()}%`,
            }),
            where(cast(col("CustomerPolicy.customer_id"), "varchar"), {
              [Op.like]: `%${search.toLowerCase()}%`,
            }),
          ],
        },
        order: [["dateOfPurchase", "ASC"]],
        include: {
          model: CustomerModel,
          as: "customer",
          required: true,
          include: [
            {
              model: IncomeGroupModel,
              as: "incomeGroup",
              required: true,
            },
          ],
        },
        offset: Number(page) * Number(size),
        limit: Number(size),
      });

      res.json({ count, result: rows });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});


// get api to get month wise data based on region
router.get("/statistics/:region", async (req: Request, res: Response) => {
  try {
    const region = req.params.region;

    const data: { date_part: number; count: string }[] = await sequelize.query(
      `select date_part('month', date_of_purchase), count(*) from customer_policy cp where cp.region = :region 
    group by date_part('month', date_of_purchase) order by date_part('month', date_of_purchase) ;`,
      { type: QueryTypes.SELECT, replacements: { region } }
    );
    const result = [];
    const monthMap = new Map<Number, String>();
    monthMap.set(1, "Jan");
    monthMap.set(2, "Feb");
    monthMap.set(3, "Mar");
    monthMap.set(4, "Apr");
    monthMap.set(5, "May");
    monthMap.set(6, "Jun");
    monthMap.set(7, "Jul");
    monthMap.set(8, "Aug");
    monthMap.set(9, "Sep");
    monthMap.set(10, "Oct");
    monthMap.set(11, "Nov");
    monthMap.set(12, "Dec");
    for (const monthData of data) {
      result.push({
        month: monthMap.get(monthData.date_part),
        count: Number(monthData.count),
      });
    }
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

// put api to update a given policy
router.put("/:policyId", async (req: Request, res: Response) => {
  if (!req.params.policyId) {
    res.status(400).json({ message: "No policy id sent" });
  }
  const policyId = Number(req.params.policyId);
  const policy: CustomerPolicy = req.body;
  const existingPolicy = await CustomerPolicyModel.findOne({
    where: { id: policyId },
  });
  if (!existingPolicy) {
    res.status(404).json({ message: "Policy not found" });
  } else {
    const existingPolicyObject = existingPolicy.get();
    console.log("existing", existingPolicyObject);
    const update = await CustomerPolicyModel.update(
      {
        id: existingPolicyObject.id,
        dateOfPurchase: existingPolicyObject.dateOfPurchase,
        customerId: existingPolicyObject.customerId,
        fuel: policy.fuel,
        vehicleSegment: policy.vehicleSegment,
        premium: policy.premium,
        bodilyInjuryLiability: policy.bodilyInjuryLiability,
        personalInjuryProtection: policy.personalInjuryProtection,
        propertyDamageLiability: policy.propertyDamageLiability,
        collision: policy.collision,
        comprehensive: policy.comprehensive,
        region: policy.region,
      },
      {
        where: {
          id: policyId,
        },
      }
    );

    console.log(update);
    res.json({ updated: true });
  }
});

export default router;
