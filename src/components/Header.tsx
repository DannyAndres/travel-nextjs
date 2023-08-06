const Header = (): React.ReactNode => {
  return (
    <header className="bg-white text-gray-700 border-b border-gray-300 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="font-normal text-gray-900 text-xl">Travel App</div>
        <nav>
          <ul className="flex space-x-4">
            <li>Username</li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
