import { LeagueStanding } from './league-standing.interface';

export interface StandingHttpResponse {
  response: [{ league: { standings: [LeagueStanding[]] } }];
}
