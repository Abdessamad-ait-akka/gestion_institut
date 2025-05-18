const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex space-x-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-10 bg-blue-500 rounded animate-wave"
            style={{ animationDelay: `${i * 0.2}s` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Loader;
