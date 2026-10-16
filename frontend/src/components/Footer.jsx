import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="mt-24 bg-ink text-white">
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-2.5 font-display text-2xl font-extrabold">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-marigold text-ink">C</span>
          Campus Mart
        </div>
        <p className="mt-3 max-w-xs text-sm text-white/60">
          Buy, sell, and chat with your campus community.
        </p>
      </div>
      <div className="flex flex-col gap-4 sm:items-end">
        <nav className="flex gap-6 text-sm font-semibold text-white/80">
          <Link to="/products" className="hover:text-marigold">Browse</Link>
          <Link to="/products/new" className="hover:text-marigold">Sell</Link>
          <Link to="/chat" className="hover:text-marigold">Chat</Link>
        </nav>
        <p className="text-xs text-white/45">
          © {new Date().getFullYear()} Campus Mart. Built for students, by students.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
