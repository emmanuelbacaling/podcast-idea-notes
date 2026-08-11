import type { PodcastNote } from '../types/podcast';

export const CATEGORIES = [
  'All',
  'Tech & AI',
  'Solo Chats',
  'Interviews',
  'Storytelling',
  'Deep Dive',
  'Pop Culture',
  'Finance',
] as const;

export const DURATIONS = [
  '5 mins',
  '15 mins',
  '30 mins',
  '45 mins',
  '60 mins',
  '90+ mins',
] as const;

export const PODCAST_STORAGE_KEY = 'podcast_idea_notes';

export const SEED_NOTES: PodcastNote[] = [
  {
    id: 'seed-design-copilots',
    title: 'Ep 32: Design & AI Copilots',
    content:
      '<h3>Episode Hook</h3><p>How will generative AI tools shape design and engineering workflows?</p><blockquote>Creative direction remains the premium skill.</blockquote><ul><li>Intro and framing</li><li>Live workflow examples</li><li>Debate and takeaways</li></ul>',
    summary:
      'How generative AI tools are changing product design and engineering workflows.',
    dateCreated: 'May 27, 2026, 1:40 PM',
    createdAtTimestamp: 1779914600000,
    category: 'Tech & AI',
    estimatedDuration: '30 mins',
    status: 'Scripting',
  },
  {
    id: 'seed-unboring-interviews',
    title: 'The Art of Un-boring Guest Interviews',
    content:
      '<h3>Interview Playbook</h3><p>Ask contradiction-seeking questions and follow-up on specifics.</p><ol><li>Challenge assumptions</li><li>Probe for turning points</li><li>Request concrete examples</li></ol>',
    summary:
      'Interview techniques that replace generic Q and A with meaningful conversations.',
    dateCreated: 'May 25, 2026, 4:15 PM',
    createdAtTimestamp: 1779741800000,
    category: 'Interviews',
    estimatedDuration: '45 mins',
    status: 'Ready to Record',
  },
  {
    id: 'seed-mic-mistakes',
    title: 'My 3 Biggest Solo Mic Mistakes',
    content:
      '<h3>Lessons Learned</h3><p>What went wrong in early episodes and how to fix it quickly.</p><ul><li>Script less, converse more</li><li>Improve room treatment</li><li>Refine episode structure</li></ul>',
    summary:
      'A candid retrospective on common solo recording mistakes and practical fixes.',
    dateCreated: 'May 20, 2026, 10:30 AM',
    createdAtTimestamp: 1779309800000,
    category: 'Solo Chats',
    estimatedDuration: '15 mins',
    status: 'Recorded',
  },
];
