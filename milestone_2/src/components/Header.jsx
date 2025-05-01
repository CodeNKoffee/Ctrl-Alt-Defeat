export default function Header({ text, className, isFullWidth = false }) {
  return (
    <header className={className}>
      <h1 className="text-6xl text-metallica-blue-950 font-bold mb-4 font-ibm-plex-sans">{text}</h1>
      <div className="bg-metallica-blue-off-charts w-20 h-3 mb-16"></div>
    </header>
  );
}