import TopBar from "./TopBar";
import MainNav from "./MainNav";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full">
      <TopBar />
      <MainNav />
    </header>
  );
};

export default Header;
