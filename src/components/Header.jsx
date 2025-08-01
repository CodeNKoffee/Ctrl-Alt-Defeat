export default function Header({ text, className, isFullWidth = false, size = '6xl' }) {
  return (
    <header className={`${className} ${isFullWidth && 'flex flex-col items-center'}`}>
      {isFullWidth ? (
        // <div className="relative inline-block text-center">
        //   <h1 className={`${size ? size : 'text-6xl'} text-metallica-blue-950 font-bold mb-4 font-ibm-plex-sans`}>{text}</h1>
        //   <div className={`bg-metallica-blue-off-charts h-3 absolute bottom-0 ${isFullWidth ? 'w-full' : 'w-20'}`}></div>
        // </div>
        <div className="header-full-width">
          <h1 className={`${size ? size : 'text-6xl'}`}>{text}</h1>
          <div className="header-underline"></div>
        </div>
      ) : (
        <>
          <h1 className={`${size ? size : 'text-6xl'} text-metallica-blue-950 font-bold mb-4 font-ibm-plex-sans`}>{text}</h1>
          <div className={`bg-metallica-blue-off-charts w-20 h-3 mb-16 ${isFullWidth ? 'w-full' : 'w-20'}`}></div>
        </>
      )}
    </header>
  );
}