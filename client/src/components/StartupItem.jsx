import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCalendarWeek, FaWindowClose } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { Carousel } from "antd";

export default function StartupItem({ startup }) {
  const [selectedStartup, setSelectedStartup] = useState(null);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", selectedStartup !== null);

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [selectedStartup]);

  const handleStartupClick = (e, startup) => {
    e.preventDefault();
    setSelectedStartup(startup);
  };

  const handleClosePopup = () => {
    setSelectedStartup(null);
  };

  return (
    <div className="bg-white shadow-lg hover:shadow-xl transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link onClick={(e) => handleStartupClick(e, startup)}>
        <img
          src={startup.imageUrls[0]}
          alt="startup image"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="truncate text-lg font-semibold text-slate-700">
            {startup.StartupName}
          </p>
          <div className="flex items-center gap-1">
            <FaLocationDot className="h-4 w-4 text-green-600" />
            <p className="truncate text-sm text-gray-600">
              {startup.CityLocation}
            </p>
          </div>
          <p className="truncate text-sm text-gray-600 ">
            {startup.SubVertical}
          </p>

          <p className="truncate text-sm text-slate-500 font-semibold ">
            $ {startup.AmountInUSD}
          </p>
          <p className=" flex text-sm text-gray-600 items-center justify-end gap-1">
            <FaCalendarWeek /> {startup.Date}
          </p>
        </div>
      </Link>

      {selectedStartup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 md:p-8 rounded-lg w-full max-w-xl mx-4 md:mx-auto relative">
            <button
              onClick={handleClosePopup}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 cursor-pointer"
            >
              <FaWindowClose size={24} />
            </button>
            <h2 className="text-2xl md:text-4xl text-slate-800 font-bold mb-4 text-center">
              {selectedStartup.StartupName}
            </h2>

            <Carousel autoplay autoplaySpeed={2000} dots={false}>
              <div>
                <img
                  src={selectedStartup.imageUrls[0]}
                  alt="Startup Image 1"
                  className="w-full h-48 md:h-64 object-cover"
                />
              </div>
              <div>
                <img
                  src={selectedStartup.imageUrls[1]}
                  alt="Startup Image 2"
                  className="w-full h-48 md:h-64 object-cover"
                />
              </div>
            </Carousel>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <p className="font-bold text-gray-800 text-sm md:text-base">
                  Created On:
                </p>
                <p className="flex items-center gap-1 text-gray-600 text-sm md:text-base">
                  <FaCalendarWeek />
                  {selectedStartup.Date}
                </p>
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm md:text-base">
                  Location:
                </p>
                <p className="flex items-center gap-1 text-gray-600 text-sm md:text-base">
                  <FaLocationDot className="text-green-600" />
                  {selectedStartup.CityLocation}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-bold mt-2 text-gray-800 text-sm md:text-base">
                  Investment Type:
                </p>
                <p className="text-gray-600 text-sm md:text-base">
                  {selectedStartup.InvestmentType}
                </p>
              </div>
              <div>
                <p className="font-bold mt-2 text-gray-800 text-sm md:text-base">
                  Amount:
                </p>
                <p className="text-gray-600 text-sm md:text-base">
                  $ {selectedStartup.AmountInUSD}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="font-bold mt-2 text-gray-800 text-sm md:text-base">
                Industry Domain:
              </p>
              <p className="text-gray-600 text-sm md:text-base">
                {selectedStartup.IndustryVertical}
              </p>
              <p className="font-bold mt-2 text-gray-800 text-sm md:text-base">
                SubVertical:
              </p>
              <p className="text-gray-600 text-sm md:text-base">
                {selectedStartup.SubVertical}
              </p>
              <p className="font-bold mt-2 text-gray-800 text-sm md:text-base">
                Investor's Name:
              </p>
              <p className="text-gray-600 text-sm md:text-base">
                {selectedStartup.InvestorsName}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
