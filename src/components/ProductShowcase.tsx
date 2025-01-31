export const ProductShowcase = () => {
  return (
    <section className="py-24 px-6 bg-soft-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 mb-6 text-sm bg-accent-light rounded-full text-accent">
            Featured Products
          </span>
          <h2 className="text-3xl md:text-4xl font-medium text-accent-dark">
            Designed for you
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="group relative overflow-hidden rounded-2xl bg-accent-light aspect-square"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent-dark/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-accent-dark transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-xl font-medium mb-2">Product {item}</h3>
                <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  Discover more about this amazing product
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};