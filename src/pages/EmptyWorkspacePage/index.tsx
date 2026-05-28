import { Mic } from 'lucide-react';

type EmptyWorkspacePageProps = {
  onCreate: () => void;
};

const EmptyWorkspacePage = ({ onCreate }: EmptyWorkspacePageProps) => {
  return (
    <section className="flex min-h-full flex-col items-center justify-center bg-slate-50/50 p-8 text-center select-none">
      <div className="relative mb-6 rounded-3xl border border-slate-100 bg-white p-5 shadow-xl shadow-slate-100/50">
        <Mic className="h-10 w-10 text-indigo-600" />
        <div className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-indigo-500"></div>
      </div>
      <span className="mb-3 inline-flex justify-self-center rounded-full bg-indigo-50 px-2.5 py-1 font-mono text-xs font-bold tracking-widest text-indigo-600 uppercase">
        PodcastLab Workspace
      </span>
      <h2 className="max-w-sm font-display text-2xl font-bold leading-tight tracking-tight text-slate-800">
        No Episode Idea Selected
      </h2>
      <p className="mt-2 max-w-sm text-xs leading-relaxed text-slate-400">
        Pick an idea from the sidebar or start a fresh episode draft.
      </p>
      <button
        type="button"
        className="mt-6 cursor-pointer rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-100 transition-all duration-200 hover:bg-indigo-700"
        onClick={onCreate}
      >
        Create New Episode
      </button>
    </section>
  );
};

export default EmptyWorkspacePage;
