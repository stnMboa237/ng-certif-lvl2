import { Country } from './country.interface';
import { League } from './league.interface';

export interface LeagueIndexResponseBody {
  league: League;
  country: Country;
}
