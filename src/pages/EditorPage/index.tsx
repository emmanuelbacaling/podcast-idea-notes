import { useState } from 'react';
import { ArrowLeft, HelpCircle, Sparkles, Trash2 } from 'lucide-react';
import { CATEGORIES, DURATIONS } from '../../data/seedNotes';
import type { PodcastNote } from '../../types/podcast';
import ConfirmDialog from '../../components/ConfirmDialog';
import RichTextEditor from '../../components/RichTextEditor';
import { createPodcast, updatePodcast } from './request';
import { useNavigate } from 'react-router-dom';

type EditorPageProps = {
  note: PodcastNote | null;
  onBack: () => void;
  onDelete: (id: string) => Promise<void>;
  onRefresh: () => Promise<void>;
  onChange: (updated: PodcastNote) => void;
  isSaving: boolean;
  setIsSavingNote: (isSaving: boolean) => void;
  setSuccessMessage: (message: string) => void;
};

const getSummary = (html: string) => {
  const plainText = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!plainText) {
    return '';
  }
  return plainText.length > 140
    ? `${plainText.slice(0, 140).trim()}...`
    : plainText;
};

const EditorPage = ({
  note,
  onBack,
  onDelete,
  onRefresh,
  onChange,
  isSaving,
  setIsSavingNote,
  setSuccessMessage,
}: EditorPageProps) => {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const handleUpdate = async (id: string, note: PodcastNote) => {
    setIsSavingNote(true);
    try {
      const payload = {
        title: note.title,
        content: note.content,
        category: note.category,
        estimatedDuration: note.estimatedDuration,
        status: note.status,
      };
      if (note.id.toString().startsWith('draft-')) {
        const result = await createPodcast(payload);
        const newId = String(result.data.id);
        onChange({ ...note, id: newId });
        await onRefresh();
      } else {
        await updatePodcast(id, payload);
      }
      setSuccessMessage('Podcast updated successfully.');
      navigate('/notes');
    } catch (error) {
      console.error('Failed to update podcast:', error);
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleDelete = async (note: PodcastNote) => {
    if (!note.id) {
      return;
    }

    try {
      await onDelete(note.id);

      setSuccessMessage('Podcast deleted successfully.');
      navigate('/notes');
    } catch (error) {
      console.error('Failed to delete podcast:', error);
    }
  };

  const insertTemplate = (type: 'solo' | 'interview') => {
    if (!note) {
      return;
    }

    const content =
      type === 'solo'
        ? `
        <h3>Dynamic Solo Segment Blueprint</h3>
        <p><strong>[00:00 - 02:00] Hook:</strong> State the core question and connect it personally.</p>
        <p><strong>[02:00 - 10:00] Act I:</strong> Explain the context, tension, or challenge.</p>
        <p><strong>[10:00 - 20:00] Act II:</strong> Break down the key lessons or insights.</p>
        <blockquote>Always resolve the opening hook with a practical payoff.</blockquote>
        <p><strong>[20:00 - 25:00] Outro:</strong> Summarize and leave one strong call to action.</p>
      `
        : `
        <h3>High-Value Interview Outline</h3>
        <p><strong>Guest setup:</strong> Explain why this guest matters and what they know that others do not.</p>
        <ul>
          <li>What changed your mind most recently in your field?</li>
          <li>What mistake do beginners keep repeating?</li>
          <li>Which concrete case study best explains your process?</li>
        </ul>
        <blockquote>Aim for specific stories and contradictions, not generic advice.</blockquote>
      `;

    onChange({ ...note, content, summary: getSummary(content) });
  };

  if (!note) {
    return (
      <section className="grid min-h-full place-content-center gap-2.5 rounded-3xl border border-slate-200 bg-white p-7.5 text-center">
        <h2 className="text-[2rem] font-bold text-slate-900">Note Not Found</h2>
        <p className="text-slate-500">
          This note does not exist or may have been deleted.
        </p>
        <button
          type="button"
          className="mx-auto cursor-pointer rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          onClick={onBack}
        >
          Back to list
        </button>
      </section>
    );
  }

  const isDraftNote = String(note.id).startsWith('draft-');

  return (
    <section className="flex h-full flex-col bg-white selection:bg-indigo-100">
      <header className="flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="shrink-0 cursor-pointer rounded-xl p-2 text-slate-600 transition duration-150 hover:bg-slate-200 lg:hidden"
            title="Go Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex min-w-0 flex-col">
            <span className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Editing Idea
            </span>
            <span className="block truncate text-sm font-semibold text-slate-700">
              {note.title || 'Untitled Note'}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            className="cursor-pointer rounded-xl p-2 text-red-500 transition duration-150 hover:bg-red-50"
            onClick={() => setIsDeleteDialogOpen(true)}
            title="Delete podcast idea"
          >
            <Trash2 className="h-4.5 w-4.5" />
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm transition duration-150 hover:bg-indigo-700"
            onClick={() => handleUpdate(note.id, note)}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : isDraftNote ? 'Done' : 'Update'}
          </button>
        </div>
      </header>

      <main className="flex-1 space-y-4 overflow-y-auto p-4 pb-20">
        <div className="space-y-1">
          <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Episode Title
          </label>
          <input
            type="text"
            value={note.title}
            onChange={(event) =>
              onChange({ ...note, title: event.target.value })
            }
            placeholder="e.g. Ep 12: Demystifying UX Design with AI Tools"
            className="w-full border-b border-slate-100 py-1 text-lg font-display font-bold text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-indigo-400"
          />
        </div>

        <div className="grid grid-cols-1 gap-2.5 rounded-2xl border border-slate-100 bg-slate-50/50 p-3 sm:grid-cols-3">
          <label className="flex flex-col gap-1">
            <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">
              Category
            </span>
            <select
              value={note.category}
              onChange={(event) =>
                onChange({ ...note, category: event.target.value })
              }
              className="rounded-lg border border-slate-200 bg-white p-1 py-1.5 text-[11px] font-medium text-slate-700 outline-none focus:ring-1 focus:ring-indigo-400"
            >
              {CATEGORIES.filter((item) => item !== 'All').map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">
              Status
            </span>
            <select
              value={note.status}
              onChange={(event) =>
                onChange({
                  ...note,
                  status: event.target.value as PodcastNote['status'],
                })
              }
              className="rounded-lg border border-slate-200 bg-white p-1 py-1.5 text-[11px] font-medium text-slate-700 outline-none focus:ring-1 focus:ring-indigo-400"
            >
              <option value="Idea">Idea</option>
              <option value="Scripting">Scripting</option>
              <option value="Ready to Record">Ready to Record</option>
              <option value="Recorded">Recorded</option>
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">
              Duration
            </span>
            <select
              value={note.estimatedDuration}
              onChange={(event) =>
                onChange({ ...note, estimatedDuration: event.target.value })
              }
              className="rounded-lg border border-slate-200 bg-white p-1 py-1.5 text-[11px] font-medium text-slate-700 outline-none focus:ring-1 focus:ring-indigo-400"
            >
              {DURATIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-indigo-100/40 bg-indigo-50/60 p-2.5">
          <Sparkles className="hidden h-3.5 w-3.5 text-indigo-600 sm:block" />
          <span className="text-[10px] font-semibold text-indigo-700">
            Episode Templates:
          </span>
          <div className="flex w-full flex-wrap gap-1.5 sm:ml-auto sm:w-auto">
            <button
              type="button"
              onClick={() => insertTemplate('solo')}
              className="cursor-pointer rounded border border-slate-200 bg-white px-2 py-0.5 text-[9px] font-medium text-slate-700 shadow-sm transition duration-150 hover:bg-slate-50"
            >
              Solo Outline
            </button>
            <button
              type="button"
              onClick={() => insertTemplate('interview')}
              className="cursor-pointer rounded border border-slate-200 bg-white px-2 py-0.5 text-[9px] font-medium text-slate-700 shadow-sm transition duration-150 hover:bg-slate-50"
            >
              Interview Script
            </button>
          </div>
        </div>

        <RichTextEditor
          value={note.content}
          onChange={(content) =>
            onChange({ ...note, content, summary: getSummary(content) })
          }
        />

        <div className="flex gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-[11px] text-slate-400">
          <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <p>
            Decorate text easily: select any words to apply formatting via
            toolbar, or insert outline blueprints using the helper triggers
            above.
          </p>
        </div>
      </main>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete podcast idea?"
        description="This action cannot be undone. All content inside this note will be permanently removed."
        onCancel={() => setIsDeleteDialogOpen(false)}
        onConfirm={async () => {
          await handleDelete(note);
          setIsDeleteDialogOpen(false);
        }}
      />
    </section>
  );
};

export default EditorPage;
