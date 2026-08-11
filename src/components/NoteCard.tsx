import { Calendar, Clock } from 'lucide-react';
import type { PodcastNote } from '../types/podcast';

type NoteCardProps = {
  note: PodcastNote;
  isActive: boolean;
  onSelect: (note: PodcastNote) => void;
};

const categoryClass: Record<string, string> = {
  'Tech & AI': 'border-indigo-100 bg-indigo-50 text-indigo-600',
  'Solo Chats': 'border-emerald-100 bg-emerald-50 text-emerald-700',
  Interviews: 'border-violet-100 bg-violet-50 text-violet-600',
  Storytelling: 'border-amber-100 bg-amber-50 text-amber-700',
  'Deep Dive': 'border-cyan-100 bg-cyan-50 text-cyan-600',
  'Pop Culture': 'border-rose-100 bg-rose-50 text-rose-600',
  Finance: 'border-green-100 bg-green-50 text-green-700',
};

const statusClass: Record<string, string> = {
  Idea: 'bg-blue-100 text-blue-800',
  Scripting: 'bg-amber-100 text-amber-800',
  'Ready to Record': 'bg-purple-100 text-purple-800',
  Recorded: 'bg-emerald-100 text-emerald-800',
};

const NoteCard = ({ note, isActive, onSelect }: NoteCardProps) => {
  const category =
    categoryClass[note.category] ??
    'border-slate-100 bg-slate-50 text-slate-600';
  const status = statusClass[note.status] ?? 'bg-slate-100 text-slate-800';

  return (
    <article
      className={`group relative flex cursor-pointer flex-col justify-between rounded-2xl border bg-white p-4 transition-all duration-200 ${
        isActive
          ? 'border-indigo-100 shadow-md shadow-indigo-50/40'
          : 'border-slate-100/80 hover:border-indigo-100 hover:shadow-md hover:shadow-indigo-50/40'
      }`}
      onClick={() => onSelect(note)}
      aria-label={`Open note ${note.title || 'Untitled Episode Idea'}`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <span
          className={`rounded border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${category}`}
        >
          {note.category}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase ${status}`}
        >
          {note.status}
        </span>
      </div>

      <h3 className="font-display text-[15px] font-semibold text-slate-800 transition duration-150 group-hover:text-indigo-600">
        {note.title || 'Untitled Episode Idea'}
      </h3>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">
        {note.summary ||
          'No description provided. Click to add detailed planning and decorate text.'}
      </p>

      <footer className="mt-3 flex items-center justify-between border-t border-slate-50 pt-3 text-[10px]">
        <div className="flex items-center gap-3 text-slate-400">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-slate-400/80" />
            {note.dateCreated}
          </span>
          <span className="flex items-center gap-1 rounded bg-slate-50 px-1.5 py-0.5 font-medium">
            <Clock className="h-3 w-3 text-indigo-500/80" />
            {note.estimatedDuration}
          </span>
        </div>
      </footer>
    </article>
  );
};

export default NoteCard;
