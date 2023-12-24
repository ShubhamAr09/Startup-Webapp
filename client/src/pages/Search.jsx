import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StartupItem from "../components/StartupItem";

export default function Search() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [startups, setStartups] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
  });

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");

    if (searchTermFromUrl) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
      });
    }

    const fetchStartups = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/startup/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      }
      setStartups(data);
      setLoading(false);
    };
    fetchStartups();
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfStartups = startups.length;
    const startIndex = numberOfStartups;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/startup/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setStartups([...startups, ...data]);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <input
            type="text"
            id="searchTerm"
            placeholder="Search..."
            className="border rounded-lg p-3 w-full"
            value={sidebardata.searchTerm}
            onChange={handleChange}
          />
          <button className="bg-blue-700 text-white p-3 rounded-lg uppercase hover:opacity-90">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-blue-800 mt-5">
          Start Ups:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && startups.length === 0 && (
            <p className="text-xl text-red-600">No Startups found!!!</p>
          )}
          {loading && (
            <p className="text-xl text-slate-800 text-center w-full">
              Loading...
            </p>
          )}
          {!loading &&
            startups &&
            startups.map((startup) => (
              <StartupItem key={startup._id} startup={startup} />
            ))}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-blue-700 hover:underline p-7 text-center w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
