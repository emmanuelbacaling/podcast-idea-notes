import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <section className="grid min-h-full place-content-center gap-2.5 rounded-3xl border border-slate-200 bg-white p-7.5 text-center">
      <h2 className="text-[2rem] font-bold text-slate-900">404</h2>
      <p className="text-slate-500">We could not find that page.</p>
      <Link
        to="/notes"
        className="mx-auto cursor-pointer rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        Go back to PodcastLab
      </Link>
    </section>
  );
};

export default NotFoundPage;
