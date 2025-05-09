const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-cover bg-center h-screen relative mt-8" style={{ backgroundImage: 'url("https://images7.alphacoders.com/135/thumb-1920-1358616.jpeg")' }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center text-white p-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Welcome to Movie Tickets</h1>
          <p className="text-xl mb-6">Book your tickets for the latest blockbusters with ease!</p>
          <a href="/movies" className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-full text-lg">Explore Movies</a>
        </div>
      </section>

      {/* About & CTA Section */}
      <section className="py-12 bg-indigo-600 text-white mt-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">Why Choose Us?</h2>
          <p className="text-xl mb-6">We offer a seamless ticketing experience with the latest movie releases, easy booking, and fast payment options!</p>
          <a href="/about" className="bg-white text-indigo-600 hover:bg-gray-100 py-3 px-6 rounded-full text-lg">Learn More About Us</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm mb-2">&copy; 2025 Movie Ticketing System</p>
          <div className="space-x-6">
            <a href="/about" className="hover:text-indigo-400">About</a>
            <a href="/contact" className="hover:text-indigo-400">Contact</a>
            <a href="/privacy" className="hover:text-indigo-400">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
