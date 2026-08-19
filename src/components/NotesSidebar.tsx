import { useMemo, useState } from 'react';
import { Bookmark, Mic, Plus, Search } from 'lucide-react';
import { CATEGORIES } from '../data/seedNotes';
import type { PodcastNote } from '../types/podcast';
import NoteCard from './NoteCard';
import { searchPodcasts } from '../pages/EditorPage/request';

type NotesSidebarProps = {
  notes: PodcastNote[];
  activeNoteId: string | null;
  stats: {
    total: number;
    readyToRecord: number;
    recorded: number;
  };
  onSelectNote: (note: PodcastNote) => void;
  onAddNewNote: () => void;
};

const NotesSidebar = ({
  notes,
  activeNoteId,
  stats,
  onSelectNote,
  onAddNewNote,
}: NotesSidebarProps) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All');
  const [filtered, setFiltered] = useState<PodcastNote[]>(notes);

  const visibleNotes = useMemo(() => {
    const source = query.trim() ? filtered : notes;

    return source.filter((note) => {
      const searchSource =
        `${note.title} ${note.summary} ${note.category}`.toLowerCase();
      const matchesQuery = searchSource.includes(query.toLowerCase());
      const matchesCategory = category === 'All' || note.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [category, filtered, notes, query]);

  const handleSearch = async (query: string) => {
    const nextQuery = query.trim();

    if (!nextQuery) {
      setFiltered(notes);
      return;
    }

    try {
      const response = await searchPodcasts(nextQuery);
      setFiltered(response);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <aside className="relative flex min-h-full w-full flex-col bg-slate-50 selection:bg-indigo-100 lg:border-r lg:border-slate-200/80">
      <header className="relative rounded-t-3xl border-b border-slate-100 bg-white px-5 pb-4 pt-8 shadow-sm">
        <div className="mb-1 flex items-center justify-between pr-12">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-indigo-600 p-2 text-white shadow-md shadow-indigo-200">
              <Mic className="h-5 w-5" />
            </div>
            <div>
              <p className="font-mono text-xs font-bold tracking-widest text-indigo-600 uppercase">
                PodcastLab
              </p>
              <h1 className="font-display text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">
                Episode Ideas
              </h1>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="absolute right-5 top-8 cursor-pointer rounded-xl bg-indigo-50 p-2.5 text-indigo-700 transition hover:bg-indigo-100"
          onClick={onAddNewNote}
          title="Create new idea"
        >
          <Plus className="h-5 w-5" />
        </button>

        <section
          className="mt-4 grid grid-cols-3 gap-2"
          aria-label="Episode statistics"
        >
          <div className="flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50/50 p-2.5">
            <span className="text-[10px] font-medium tracking-wider text-slate-400 uppercase">
              Total
            </span>
            <strong className="mt-0.5 text-lg font-bold text-slate-800">
              {stats.total}
            </strong>
          </div>
          <div className="flex flex-col items-center rounded-xl border border-purple-50 bg-purple-50/30 p-2.5">
            <span className="text-[10px] font-medium tracking-wider text-purple-600/70 uppercase">
              To Record
            </span>
            <strong className="mt-0.5 text-lg font-bold text-purple-700">
              {stats.readyToRecord}
            </strong>
          </div>
          <div className="flex flex-col items-center rounded-xl border border-emerald-50 bg-emerald-50/30 p-2.5">
            <span className="text-[10px] font-medium tracking-wider text-emerald-600/70 uppercase">
              Recorded
            </span>
            <strong className="mt-0.5 text-lg font-bold text-emerald-700">
              {stats.recorded}
            </strong>
          </div>
        </section>

        <label className="relative mt-4 block" id="search-container">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={query}
            onChange={(event) => {
              const value = event.target.value;
              setQuery(value);
              void handleSearch(value);
            }}
            placeholder="Search titles, category, tags..."
            className={`w-full rounded-xl border border-transparent bg-slate-100 py-2 pl-9 text-sm text-slate-700 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 ${query ? 'pr-12' : 'pr-4'}`}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setFiltered(notes);
              }}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs font-medium text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </label>

        <div className="-mx-5 mt-4 flex gap-1.5 overflow-x-auto px-5">
          {CATEGORIES.map((item) => (
            <button
              type="button"
              key={item}
              role="tab"
              aria-selected={category === item}
              className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                category === item
                  ? 'scale-[1.02] bg-indigo-600 text-white shadow-sm shadow-indigo-100'
                  : 'border border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-4 pb-24">
        {visibleNotes.length === 0 ? (
          <section className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 rounded-full bg-slate-100 p-4 text-slate-400">
              <Bookmark className="h-8 w-8 opacity-60" />
            </div>
            <h2 className="text-sm font-semibold text-slate-700">
              {query.trim() ? 'No match found' : 'No notes found'}
            </h2>
            <p className="mt-1 max-w-50 text-xs text-slate-400">
              {query.trim()
                ? 'Try another keyword to find matching notes.'
                : 'Try adjusting your filters or search keywords.'}
            </p>
            <button
              type="button"
              className="mt-3 cursor-pointer rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
              onClick={onAddNewNote}
            >
              Create note
            </button>
          </section>
        ) : (
          <div className="space-y-3">
            {visibleNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                isActive={String(note.id) === activeNoteId}
                onSelect={onSelectNote}
              />
            ))}
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute bottom-5 right-5 hidden lg:block">
        <button
          type="button"
          onClick={onAddNewNote}
          className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-300 transition-all duration-200 hover:scale-105 hover:bg-indigo-700 active:scale-95"
          title="Add New Podcast Episode"
        >
          <Plus className="h-6 w-6 stroke-[2.5]" />
        </button>
      </div>
    </aside>
  );
};

export default NotesSidebar;
