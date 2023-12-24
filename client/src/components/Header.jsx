import { FaSearch, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import { useEffect, useState } from "react";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/sign-out");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-blue-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-blue-600">Startup</span>
            <span className="text-blue-900">Sphere</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-blue-50 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-blue-800" />
          </button>
        </form>
        <ul className="flex gap-5">
          <Link to="/">
            <li className="font-semibold hidden sm:inline text-blue-900 hover:text-blue-600">
              Home
            </li>
          </Link>

          {currentUser ? (
            <>
              <Link to="/profile">
                <img
                  className="rounded-full h-7 w-7 object-cover"
                  src={currentUser.avatar}
                  alt=""
                />
              </Link>
              <FaSignOutAlt
                onClick={handleSignOut}
                className="h-7 w-7 cursor-pointer"
              />
            </>
          ) : (
            <>
              <Link to="sign-in">
                <li className="font-semibold text-blue-900 hover:text-blue-600">
                  SignIn
                </li>
              </Link>
              <Link to="register">
                <li className="font-semibold hidden sm:inline text-blue-900 hover:text-blue-600">
                  Register
                </li>
              </Link>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}
