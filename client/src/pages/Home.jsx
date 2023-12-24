import React, { useEffect, useState } from "react";
import StartupItem from "../components/StartupItem";
import { Carousel } from "antd";
import { Link } from "react-router-dom";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [startups, setStartups] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState("All");

  useEffect(() => {
    const fetchStartups = async () => {
      setLoading(true);

      const res = await fetch(`/api/startup/get`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      }
      setStartups(data);
      setLoading(false);
    };
    fetchStartups();
  }, []);

  const onSearchClick = async () => {
    const res = await fetch(`/api/startup/get?industry=${selectedIndustry}`);
    const data = await res.json();

    if (data.length > 8) {
      setShowMore(true);
    } else {
      setShowMore(false);
    }

    setStartups(data);
  };

  const onShowMoreClick = async () => {
    const numberOfStartups = startups.length;
    const startIndex = numberOfStartups;
    const urlParams = new URLSearchParams();
    urlParams.set("startIndex", startIndex);
    urlParams.set("industry", selectedIndustry);

    const res = await fetch(`/api/startup/get?${urlParams}`);
    const data = await res.json();

    if (data.length < 9) {
      setShowMore(false);
    }

    setStartups([...startups, ...data]);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-28 px-3 max-w-6xl mx-auto">
        <div>
          <h1 className="text-blue-500 font-bold text-3xl lg:text-6xl">
            Welcome to <span className="text-blue-800">StartupSphere</span>
          </h1>
          <div className="text-gray-400 text-xs sm:text-sm mt-3">
            Explore a curated collection of groundbreaking startups
            revolutionizing industries. Are you a startup ready to shine?
            <br /> Submit your venture and join the league of disruptors!
            <br />
            Join us in shaping the future of technology, finance, healthcare,
            and more. Start your journey with StartupSphere today!
            <br />
            <div className=" mt-2 text-lg text-blue-600 font-semibold">
              Submit Your StartUp (
              <Link to={"/create-startup"}>
                <span className="hover:text-blue-300">Click Here</span>)
              </Link>
            </div>
          </div>
        </div>
        <div className="max-h-96 overflow-hidden">
          <Carousel autoplay>
            <div>
              <img
                src="https://www.sme-news.co.uk/wp-content/uploads/2022/06/Tech-Startup.jpg"
                alt="Startup Image 1"
                className="w-full h-72 object-cover"
              />
            </div>
            <div>
              <img
                src="https://t4.ftcdn.net/jpg/02/38/40/55/360_F_238405533_yyX4K55OmH2LiM7LQ01ITn6kl0b6J6K8.jpg"
                alt="Startup Image 2"
                className="w-full h-72 object-cover"
              />
            </div>
            <div>
              <img
                src="https://wallpapercave.com/wp/wp7802827.jpg"
                alt="Startup Image 3"
                className="w-full h-72 object-cover"
              />
            </div>
          </Carousel>
        </div>
      </div>
      <hr />
      <div className="flex flex-col md:flex-row">
        <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
          <div className="flex flex-col gap-8">
            <select
              id="industryFilter"
              className="border rounded-lg p-3 w-full shadow-md hover:shadow-xl mt-4"
              style={{ width: "300px" }}
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
            >
              <option value="All">All Industries</option>

              <option value="Consumer Internet">Consumer Internet</option>
              <option value="Technology">Technology</option>
              <option value="Ecommerce">eCommerce</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Logistics">Logistics</option>
              <option value="Education">Education</option>
              <option value="Food and Beverage">Food & Beverage</option>
              <option value="Finance">Finance</option>
              <option value="Others">Others</option>
            </select>
            <button
              onClick={onSearchClick}
              className="bg-blue-500 text-white p-3 rounded-lg uppercase hover:opacity-90"
            >
              Search
            </button>
          </div>
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
    </div>
  );
}
