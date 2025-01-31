export const ProductShowcase = () => {
  return (
    <section className="py-24 px-6 bg-soft-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="group relative overflow-hidden rounded-2xl bg-accent-light aspect-square"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent-dark/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};