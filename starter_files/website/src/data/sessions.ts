export interface Session {
  id: string;
  title: string;
  speaker: string;
  category: 'Keynote' | 'Breakout' | 'Learning Lab' | 'Customer Story' | 'Expo';
  day: 'Day 1' | 'Day 2' | 'Day 3';
  time: string;
  location: string;
  description: string;
  details?: {
    fullDescription: string;
    takeaways: string[];
    tracks: string[];
    level?: 'Beginner' | 'Intermediate' | 'Advanced';
    speakerBio?: string;
  };
}

import { sampleSessions } from './sampleSessions';

export const SESSIONS: Session[] = sampleSessions;
