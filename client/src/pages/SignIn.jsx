import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  clearSignInError,
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice.js";
import OAuth from "../components/OAuth.jsx";

export default function SignIn() {
  const [formData, setFormData] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(clearSignInError());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <section
      style={{ marginTop: "6rem" }}
      className="flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center mx-5 md:mx-0 md:my-0"
    >
      <div className="md:w-1/2 max-w-sm">
        <img
          src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
          alt="Sample image"
        />
      </div>
      <div className="md:w-1/2 max-w-sm">
        <form onSubmit={handleSubmit}>
          <OAuth />
          <div className="my-5 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
            <p className="mx-4 mb-0 text-center font-semibold text-slate-500">
              Or
            </p>
          </div>
          <input
            className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
            type="email"
            placeholder="Enter Email Address"
            id="email"
            onChange={handleChange}
            required
          />
          <input
            className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
            type="password"
            placeholder="Enter Password"
            id="password"
            onChange={handleChange}
            required
          />
          <div className="text-center md:text-left">
            <button
              className="mt-7 bg-blue-500 hover:bg-blue-700 px-4 py-2 text-white uppercase rounded text-xs tracking-wider"
              disabled={loading}
              type="submit"
            >
              {loading ? "Loading..." : "Sign In"}
            </button>
          </div>
        </form>

        <div className="mt-4 font-semibold text-sm text-slate-500 text-center md:text-left">
          Don't have an account?
          <Link
            className="text-red-600 hover:underline hover:underline-offset-4"
            to={"/register"}
          >
            <span> </span>Register
          </Link>
        </div>
        {error && <p className="text-red-500 mt-6">{error}</p>}
      </div>
    </section>
  );
}
