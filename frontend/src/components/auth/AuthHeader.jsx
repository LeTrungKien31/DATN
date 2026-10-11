const AuthHeader = ({ title, description }) => (
  <header className="mb-8">
    <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
      English Assessment AI
    </p>
    <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
      {title}
    </h1>
    <p className="mt-3 leading-7 text-slate-600">{description}</p>
  </header>
);

export default AuthHeader;
