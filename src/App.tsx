import { useEffect, useState } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useMatch,
  useNavigate,
} from 'react-router-dom';
import NotesSidebar from './components/NotesSidebar';
import { usePodcastNotes } from './hooks/usePodcastNotes';
import EditorPage from './pages/EditorPage';
import { deletePodcast } from './pages/EditorPage/request';
import EmptyWorkspacePage from './pages/EmptyWorkspacePage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
  const { notes, stats, createNote, updateNote, refreshNotes } =
    usePodcastNotes();

  const navigate = useNavigate();
  const match = useMatch('/notes/:noteId');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSuccessMessage(null);
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [successMessage]);

  const activeNoteId = match?.params.noteId ?? null;
  const activeNote =
    notes.find((note) => String(note.id) === activeNoteId) ?? null;

  const handleCreate = () => {
    const note = createNote();
    navigate(`/notes/${note.id}`);
  };

  const handleDeleteById = async (id: string) => {
    await deletePodcast(id);
    await refreshNotes();

    setSuccessMessage('Podcast deleted successfully.');

    if (activeNoteId === String(id)) {
      navigate('/notes');
    }
  };

  return (
    <div className="min-h-svh bg-white p-0 sm:p-2.5 lg:p-6">
      {successMessage ? (
        <div className="fixed right-4 top-4 z-50 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-lg">
          {successMessage}
        </div>
      ) : null}
      <div className="mx-auto grid min-h-svh w-full max-w-none grid-cols-1 overflow-hidden bg-white/90 backdrop-blur-md sm:min-h-[calc(100svh-20px)] sm:rounded-[28px] sm:border sm:border-slate-200/90 sm:shadow-[0_30px_80px_rgba(17,24,39,0.08)] lg:min-h-[calc(100svh-48px)] lg:max-w-312.5 lg:grid-cols-[390px_1fr]">
        <div className={`${activeNoteId ? 'hidden lg:flex' : 'flex'}`}>
          <NotesSidebar
            notes={notes}
            activeNoteId={activeNoteId}
            stats={stats}
            onAddNewNote={handleCreate}
            onSelectNote={(note) => navigate(`/notes/${note.id}`)}
          />
        </div>

        <main
          className={`${activeNoteId ? 'block' : 'hidden lg:block'} min-h-full p-0 sm:p-3 lg:p-6`}
          aria-label="Podcast workspace"
        >
          <Routes>
            <Route path="/" element={<Navigate to="/notes" replace />} />
            <Route
              path="/notes"
              element={<EmptyWorkspacePage onCreate={handleCreate} />}
            />
            <Route
              path="/notes/:noteId"
              element={
                <EditorPage
                  note={activeNote}
                  onBack={() => navigate('/notes')}
                  onDelete={handleDeleteById}
                  onRefresh={refreshNotes}
                  onChange={updateNote}
                  isSaving={isSavingNote}
                  setIsSavingNote={setIsSavingNote}
                  setSuccessMessage={setSuccessMessage}
                />
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
