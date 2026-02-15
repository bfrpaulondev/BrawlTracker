/**
 * Type definitions for Brawl Stars Club API
 */

export interface Club {
  tag: string;
  name: string;
  description: string;
  type: 'open' | 'inviteOnly' | 'closed';
  badgeId: number;
  requiredTrophies: number;
  trophies: number;
  members: ClubMember[];
}

export interface ClubMember {
  tag: string;
  name: string;
  nameColor: string;
  role: 'president' | 'vicePresident' | 'senior' | 'member';
  trophies: number;
  icon: {
    id: number;
  };
}

export interface ClubRanking {
  tag: string;
  name: string;
  badgeId: number;
  trophies: number;
  rank: number;
  memberCount: number;
}

export interface ClubSummary {
  tag: string;
  name: string;
  badgeId: number;
  trophies: number;
  requiredTrophies: number;
  memberCount: number;
}
