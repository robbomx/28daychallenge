export default function Footer() {
  return (
    <footer className="border-t border-op-line bg-op-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-op-orange" />
          <span className="font-display uppercase stencil-tracking text-op-off-white">
            The 28 Day Standard
          </span>
        </div>
        <p className="text-xs text-op-off-white-dim max-w-md leading-relaxed">
          General fitness guidance only. Not medical advice. Consult a professional before starting any new
          exercise program, especially if you have an injury or health condition.
        </p>
        <span className="mono-label text-[11px] text-op-off-white-dim">© {new Date().getFullYear()} · Field Copy</span>
      </div>
    </footer>
  );
}
