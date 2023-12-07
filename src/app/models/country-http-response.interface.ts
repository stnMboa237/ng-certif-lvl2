import { Country } from './country.interface';

export interface CountryHttpResponse {
  response: [country: Country];
  // response: { country: Country }[];
}
