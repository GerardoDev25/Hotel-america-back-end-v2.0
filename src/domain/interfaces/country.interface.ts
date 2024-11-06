export interface ICountry {
  id: string;
  name: string;
}
export type CountryList = {
  ok: boolean;
  items: ICountry[];
};
