import { api } from "./api";

export interface Country {
  id: string;
  name: string;
  code: string;
  phoneCode: string;
  statesCount?: number;
}

export interface State {
  id: string;
  name: string;
  code: string;
  districtsCount?: number;
}

export interface District {
  id: string;
  name: string;
  code: string | null;
}

export const locationService = {
  async getCountries(): Promise<Country[]> {
    return api.get("/location/countries");
  },

  async getStates(countryId: string | number): Promise<State[]> {
    return api.get(`/location/states/${countryId}`);
  },

  async getDistricts(stateId: string | number): Promise<District[]> {
    return api.get(`/location/districts/${stateId}`);
  },

  async search(query: string, type: "state" | "country" | "district"): Promise<any[]> {
    return api.get(`/location/search?query=${encodeURIComponent(query)}&type=${type}`);
  }
};
