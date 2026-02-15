/**
 * Type definitions for Brawl Stars Rankings API
 */

export interface PlayerRanking {
  tag: string;
  name: string;
  nameColor: string;
  icon: {
    id: number;
  };
  trophies: number;
  rank: number;
  club?: {
    name: string;
    tag: string;
    badgeId: number;
  };
}

export interface BrawlerRanking {
  tag: string;
  name: string;
  nameColor: string;
  icon: {
    id: number;
  };
  trophies: number;
  rank: number;
}

export interface RankingsResponse<T> {
  items: T[];
  paging?: {
    cursors: {
      after?: string;
      before?: string;
    };
  };
}

export interface Country {
  code: string;
  name: string;
  flag?: string;
}

// Available countries for rankings
export const RANKING_COUNTRIES: Country[] = [
  { code: 'global', name: 'Global' },
  { code: 'BR', name: 'Brasil' },
  { code: 'US', name: 'Estados Unidos' },
  { code: 'MX', name: 'México' },
  { code: 'AR', name: 'Argentina' },
  { code: 'ES', name: 'Espanha' },
  { code: 'DE', name: 'Alemanha' },
  { code: 'FR', name: 'França' },
  { code: 'IT', name: 'Itália' },
  { code: 'GB', name: 'Reino Unido' },
  { code: 'JP', name: 'Japão' },
  { code: 'KR', name: 'Coreia do Sul' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'Índia' },
  { code: 'RU', name: 'Rússia' },
  { code: 'CA', name: 'Canadá' },
  { code: 'AU', name: 'Austrália' },
  { code: 'ID', name: 'Indonésia' },
  { code: 'TH', name: 'Tailândia' },
  { code: 'VN', name: 'Vietnã' },
  { code: 'PH', name: 'Filipinas' },
  { code: 'TR', name: 'Turquia' },
  { code: 'SA', name: 'Arábia Saudita' },
  { code: 'AE', name: 'Emirados Árabes' },
  { code: 'PL', name: 'Polônia' },
];
