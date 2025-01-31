export const Footer = () => {
  return (
    <footer className="bg-soft-gray py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-lg font-medium text-accent-dark mb-4">Brand</h4>
            <p className="text-accent max-w-xs">
              Creating beautiful experiences through thoughtful design.
            </p>
          </div>
          {["Products", "Company", "Support"].map((section) => (
            <div key={section}>
              <h4 className="text-lg font-medium text-accent-dark mb-4">
                {section}
              </h4>
              <ul className="space-y-2">
                {[1, 2, 3].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-accent hover:text-accent-dark transition-colors duration-200"
                    >
                      {section} Link {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-accent text-center">
            © {new Date().getFullYear()} Brand. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};