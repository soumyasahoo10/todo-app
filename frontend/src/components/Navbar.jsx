import { useAuth0 } from '@auth0/auth0-react'
import store from '../zustand/user.state';

function Navbar() {
  const navItems = [
    { text: "Export"},
    { text: "Share"},
  ];

  const { logout } = useAuth0();

  const user = store((state) => state.user);
  

  return (
    <div className="flex gap-5 justify-between items-center py-1.5 px-6 rounded-b-xl backdrop-blur-[17.5px] bg-opacity-80 w-full max-w-full flex-wrap sm:flex-nowrap sm:py-4 sm:px-10 bg-slate-300">
      <div className="flex gap-2 justify-between items-center py-1.5 my-auto w-full sm:w-auto">
        <div className="flex justify-center items-center px-0.5">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/96ed444f12f2297ccd4006841bd1831940e6f23d36396492d16831d2cdf15c29?apiKey=5b7d47d822c447fbbf3f0faf7f51790e&"
            className="aspect-[1.14] w-[41px]"
            alt="Logo"
          />
        </div>
        <div className="my-auto uppercase font-extrabold underline decoration-wavy text-3xl text-zinc-950">
          Slate
        </div>
      </div>
      <nav className="flex sm:flex-row flex-col gap-10 justify-center items-center self-stretch my-auto text-base text-center text-neutral-900 font-light w-full sm:w-auto">
        {navItems.map((item, index) => (
          <div key={index} className="justify-center text-xl py-2 cursor-pointer hover:scale-120 ease-in-out duration-150">
            {item.text}
          </div>
        ))}
      </nav>
      <div className="flex justify-between">
        <img src={user?.picture} className="my-auto w-10 h-10 rounded-full object-cover align-items" alt={user?.name} />
        <button className="hover:cursor-pointer justify-center self-stretch sm:self-auto px-6 py-5 text-base leading-6 text-center text-white rounded-2xl bg-neutral-900 max-md:px-5 font-light w-full sm:w-auto" onClick={(e) => logout()}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;