export type PodcastStatus =
  | 'Idea'
  | 'Scripting'
  | 'Ready to Record'
  | 'Recorded';

export interface PodcastNote {
  id: string;
  title: string;
  content: string;
  summary: string;
  dateCreated: string;
  createdAtTimestamp: number;
  category: string;
  estimatedDuration: string;
  status: PodcastStatus;
}

export type CreatePodcastPayload = Pick<
  PodcastNote,
  'title' | 'content' | 'category' | 'estimatedDuration' | 'status'
>;

export type UpdatePodcastPayload = Partial<CreatePodcastPayload>;
