import { Country } from './country.interface';
import { League } from './league.interface';

export interface LeagueHttpResponse {
  response: {
    league: League;
    country: Country;
  }[];
}
