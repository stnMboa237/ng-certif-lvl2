export interface FixtureHttpResponse {
  response: [
    {
      teams: {
        away: Team;
        home: Team;
      };
      goals: Goals;
    }
  ];
}

interface Team {
  id: number;
  name: string;
  logo: string;
  winner: boolean;
}

interface Goals {
  home: number;
  away: number;
}
