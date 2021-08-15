import { CustomerPolicy } from "../models/customer-policy";
import { REGION } from "../models/enumerations/region";

export class PolicyService {
  url = process.env.REACT_APP_BACKEND_URL;

  fetchPolicies: (
    searchText: string,
    currPage: number,
    pageSize: number
  ) => Promise<{ count: number; result: CustomerPolicy[] }> = async (
    searchText: string,
    currPage: number,
    pageSize: number
  ) => {
    const response = await fetch(
      `${this.url}/api/v1/policy?query=${searchText}&page=${currPage}&size=${pageSize}`
    );
    const data = await response.json();

    return data;
  };

  updatePolicy: (policy: CustomerPolicy) => Promise<any> = async (
    policy: CustomerPolicy
  ) => {
    const response = await fetch(`${this.url}/api/v1/policy/${policy.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(policy),
    });
    const data = await response.json();

    return data;
  };

  getMonthlyStatistics: (region: REGION) => Promise<any> = async (
    region: REGION
  ) => {
    const response = await fetch(
      `${this.url}/api/v1/policy/statistics/${region}`
    );
    const data = await response.json();

    return data;
  };
}
