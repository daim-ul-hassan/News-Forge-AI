import type { Opportunity } from "@/types/opportunities.types";

export interface OpportunitiesFetchParams {
  limit?: number;
}

export interface OpportunitiesFetchResult {
  opportunities: Opportunity[];
}

export interface OpportunitiesProvider {
  fetchOpportunities(params: OpportunitiesFetchParams): Promise<OpportunitiesFetchResult>;
}
