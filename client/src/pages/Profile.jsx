import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { Link } from "react-router-dom";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  clearUpdateError,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice.js";
import { FaCalendarWeek, FaEdit, FaWindowClose } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { Carousel } from "antd";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, SetFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showStarupsError, setShowStarupsError] = useState(false);
  const [userStartups, setUserStartups] = useState([]);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  useEffect(() => {
    dispatch(clearUpdateError());
  }, [dispatch]);

  const handleStartupClick = (startup) => {
    setSelectedStartup(startup);
  };

  const handleClosePopup = () => {
    setSelectedStartup(null);
  };

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
      },

      (error) => {
        SetFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

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

  const handleShowStartups = async () => {
    try {
      setShowStarupsError(false);
      const res = await fetch(`/api/user/startups/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowStarupsError(true);
        return;
      }
      setUserStartups(data);
    } catch (error) {
      setShowStarupsError(true);
    }
  };

  const handleStartupDelete = async (startupId) => {
    try {
      const res = await fetch(`/api/startup/delete/${startupId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserStartups((prev) =>
        prev.filter((startup) => startup._id !== startupId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-3 max-w mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <div className="md:w-1/2 max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
          />
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            alt=""
            className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          />
          <p className="text-small self-center">
            {fileUploadError ? (
              <span className="text-red-600">Error While Uploading...</span>
            ) : filePercentage > 0 && filePercentage < 100 ? (
              <span className="text-slate-700">
                {`Uploading ${filePercentage} %`}
              </span>
            ) : filePercentage === 100 ? (
              <span className="text-green-600">
                Image Uploaded Successfully!
              </span>
            ) : (
              ""
            )}
          </p>
          <input
            className="border p-3 rounded-lg shadow-xl"
            type="text"
            placeholder="Username"
            defaultValue={currentUser.username}
            id="username"
            onChange={handleChange}
          />
          <input
            className="border p-3 rounded-lg shadow-xl"
            type="email"
            placeholder="Email Address"
            defaultValue={currentUser.email}
            id="email"
            onChange={handleChange}
          />
          <input
            className="border p-3 rounded-lg shadow-xl"
            type="password"
            placeholder="Password"
            id="password"
            onChange={handleChange}
          />
          <button
            disabled={loading}
            className="bg-blue-600 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-75"
          >
            {loading ? "Loading..." : "Update"}
          </button>
          <Link
            className="bg-green-600 text-white p-3 rounded-lg uppercase text-center hover:opacity-90"
            to={"/create-startup"}
          >
            Submit Your Startup
          </Link>
        </form>
        <div className="flex justify-between mt-5">
          <span
            onClick={handleDeleteUser}
            className="text-red-600 cursor-pointer font-semibold"
          >
            Delete Account
          </span>
          <span
            onClick={handleSignOut}
            className="text-red-600 cursor-pointer font-semibold"
          >
            Sign out
          </span>
        </div>
        <p className="text-red-500 mt-6">{error ? error : ""}</p>
        <p className="text-green-600 mt-6">
          {updateSuccess ? "User Updated Successfully!!!" : ""}
        </p>
        <button
          onClick={handleShowStartups}
          className="text-yellow-500 font-semibold w-full"
        >
          My Start-Ups
        </button>
        <p className="text-red-500 mt-6">
          {showStarupsError ? "Error Showing Startups" : ""}
        </p>

        {userStartups &&
          userStartups.length > 0 &&
          userStartups.map((startup) => (
            <div
              key={startup._id}
              className="mb-4  border border-slate-400 rounded-lg p-3 flex items-center relative transition-all duration-300 hover:shadow-xl"
            >
              <Link onClick={() => handleStartupClick(startup)}>
                <img
                  src={startup.imageUrls[0]}
                  alt=""
                  className="h-20 w-20 object-contain rounded mr-4"
                />
              </Link>
              <div className="flex-1">
                <Link onClick={() => handleStartupClick(startup)}>
                  <p className="text-gray-600 text-2xl font-bold truncate hover:underline">
                    {startup.StartupName}
                  </p>
                </Link>

                <p className="flex text-gray-600 text-sm items-center">
                  <span className="font-bold text-gray-600 mr-1 ml-1">
                    Location:
                  </span>
                  {startup.CityLocation}
                </p>
                <p className="flex text-gray-600 text-sm items-center">
                  <span className="font-bold text-gray-600 mr-1 ml-1">
                    Date:
                  </span>
                  {startup.Date}
                </p>
              </div>
              <div className="flex flex-col">
                <div className="flex gap-2 absolute top-3 right-3">
                  <button
                    onClick={() => handleStartupDelete(startup._id)}
                    className="bg-red-500 text-white px-3 py-2 rounded-full hover:opacity-90"
                  >
                    <MdDelete />
                  </button>
                </div>
                <div className="flex gap-2 absolute bottom-3 right-3">
                  <Link to={`/update-startup/${startup._id}`}>
                    <button className="bg-blue-500 text-white px-3 py-2 rounded-full hover:opacity-90">
                      <FaEdit />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}

        {selectedStartup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg w-auto max-w-xl mx-auto relative">
              <button
                onClick={handleClosePopup}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                <FaWindowClose size={24} />
              </button>
              <h2 className="text-4xl text-slate-800 font-bold mb-4 text-center">
                {selectedStartup.StartupName}
              </h2>

              <Carousel autoplay autoplaySpeed={2000} dots={false}>
                <div>
                  <img
                    src={selectedStartup.imageUrls[0]}
                    alt="Startup Image 1"
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div>
                  <img
                    src={selectedStartup.imageUrls[1]}
                    alt="Startup Image 2"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </Carousel>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="font-bold text-gray-800">Created On:</p>
                  <p className="flex items-center gap-1 text-gray-600">
                    <FaCalendarWeek />
                    {selectedStartup.Date}
                  </p>
                </div>
                <div>
                  <p className="font-bold text-gray-800">Location:</p>
                  <p className="flex items-center gap-1 text-gray-600">
                    <FaLocationDot className="text-green-600" />
                    {selectedStartup.CityLocation}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-bold mt-2 text-gray-800">
                    Investment Type:
                  </p>
                  <p className="text-gray-600">
                    {selectedStartup.InvestmentType}
                  </p>
                </div>
                <div>
                  <p className="font-bold mt-2 text-gray-800">Amount:</p>
                  <p className="text-gray-600">
                    $ {selectedStartup.AmountInUSD}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="font-bold mt-2 text-gray-800">Industry Domain:</p>
                <p className="text-gray-600">
                  {selectedStartup.IndustryVertical}
                </p>
                <p className="font-bold mt-2 text-gray-800">SubVertical:</p>
                <p className="text-gray-600">{selectedStartup.SubVertical}</p>
                <p className="font-bold mt-2 text-gray-800">Investor's Name:</p>
                <p className="text-gray-600">{selectedStartup.InvestorsName}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
