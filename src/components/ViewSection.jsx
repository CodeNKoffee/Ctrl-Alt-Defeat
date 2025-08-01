function ViewSection({ title, children }) {
  return (
    <section className="mb-10">
      <h1 className="text-3xl font-bold text-[#2a5f74] mb-6 relative inline-block">
        {title}
        <span className="absolute bottom-0 left-0 w-24 h-1 bg-[#2a5f74]"></span>
      </h1>
      <div>{children}</div>
    </section>
  );
}

export default ViewSection; 