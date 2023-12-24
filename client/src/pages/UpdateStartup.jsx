import React, { useState, useEffect } from "react";
import { CiCircleRemove } from "react-icons/ci";
import { useSelector } from "react-redux";
import { app } from "../firebase";
import { useParams } from "react-router-dom";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  getStorage,
} from "firebase/storage";

export default function CreateStartup() {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    Date: "",
    StartupName: "",
    IndustryVertical: "",
    SubVertical: "",
    CityLocation: "",
    InvestorsName: "",
    InvestmentType: "seedfunding",
    AmountInUSD: "",
    imageUrls: [],
  });
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchStartup = async () => {
      const startupId = params.startupId;
      const res = await fetch(`/api/startup/get/${startupId}`);
      const data = await res.json();
      setFormData(data);
      if (data.success === false) {
        console.log(data.message);
        return;
      }
    };
    fetchStartup();
  }, []);

  const handleImageUpload = () => {
    setUploading(true);
    setImageUploadError(null);

    if (files.length === 0) {
      setImageUploadError("Please Choose at least one image");
      setUploading(false);
      return;
    }

    if (files.length + formData.imageUrls.length > 2) {
      setImageUploadError("You can only upload 2 images per Startup");
      setUploading(false);
      return;
    }

    const promises = [];

    for (let i = 0; i < files.length; i++) {
      promises.push(storeImage(files[i]));
    }

    Promise.all(promises)
      .then((urls) => {
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(urls),
        });
      })
      .catch((err) => {
        setImageUploadError(
          "Image Upload Failed: Exceeds the maximum file size of 2MB"
        );
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "seedfunding" || e.target.id === "pvtequity") {
      setFormData({
        ...formData,
        InvestmentType: e.target.id,
      });
    }

    if (e.target.id === "date") {
      setFormData({
        ...formData,
        Date: e.target.value,
      });
    }

    if (e.target.id === "industrydomain") {
      setFormData({
        ...formData,
        IndustryVertical: e.target.value,
      });
    }

    if (e.target.type === "textarea") {
      setFormData({
        ...formData,
        SubVertical: e.target.value,
      });
    }

    if (e.target.type === "text") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/startup/update/${params.startupId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      } else {
        setError(false);
        setImageUploadError(false);
        setUpdateSuccess(true);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update Your Startup
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-8">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="date"
            id="date"
            className="border p-3 rounded-lg shadow-xl"
            required
            onChange={handleChange}
            value={formData.Date}
          />
          <input
            type="text"
            id="StartupName"
            placeholder="Startup Name"
            className="border p-3 rounded-lg shadow-xl"
            maxLength="62"
            minLength="5"
            required
            onChange={handleChange}
            value={formData.StartupName}
          />
          <select
            className="border p-3 rounded-lg shadow-xl"
            id="industrydomain"
            required
            onChange={handleChange}
            value={formData.IndustryVertical}
          >
            <option disabled value="" hidden>
              Select Industry Domain
            </option>
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

          <textarea
            type="text"
            placeholder="Sub Vertical"
            className="border p-3 rounded-lg shadow-xl"
            id="subvertical"
            required
            onChange={handleChange}
            value={formData.SubVertical}
          />
          <input
            type="text"
            placeholder="City"
            className="border p-3 rounded-lg shadow-xl"
            id="CityLocation"
            required
            onChange={handleChange}
            value={formData.CityLocation}
          />
          <input
            type="text"
            placeholder="Amount in $"
            className="border p-3 rounded-lg shadow-xl"
            id="AmountInUSD"
            required
            onChange={handleChange}
            value={formData.AmountInUSD}
          />
          <input
            type="text"
            placeholder="Investor's Name"
            className="border p-3 rounded-lg shadow-xl"
            id="InvestorsName"
            required
            onChange={handleChange}
            value={formData.InvestorsName}
          />
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">Investment Type:</p>
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="seedfunding"
                className="w-5 cursor-pointer"
                onChange={handleChange}
                checked={formData.InvestmentType === "seedfunding"}
              />
              <span>Seed Funding</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="pvtequity"
                className="w-5 cursor-pointer"
                onChange={handleChange}
                checked={formData.InvestmentType === "pvtequity"}
              />
              <span>Private Equity</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              <p className="font-semibold text-lg">Images:</p>
              <span className="font-normal text-gray-600 ml-2">
                Upload startup images (max 2)
              </span>
            </div>
            <div className="flex gap-4">
              <input
                onChange={(e) => setFiles(e.target.files)}
                className="border p-3 rounded-lg shadow-md flex-grow"
                type="file"
                id="images"
                accept="image/*"
                multiple
              />
              <button
                type="button"
                onClick={handleImageUpload}
                className="p-3 py-1 flex items-center text-blue-600 border border-blue-600 rounded-lg uppercase shadow-md disabled:opacity-75"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
            <p className="text-red-500">
              {imageUploadError && imageUploadError}
            </p>
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
                <div
                  key={url}
                  className="flex justify-between p-2 border items-center"
                >
                  <img
                    src={url}
                    alt=""
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                  <CiCircleRemove
                    onClick={() => handleRemoveImage(index)}
                    className="text-red-600 h-10 w-10 cursor-pointer hover:text-red-400"
                  />
                </div>
              ))}
          </div>
          <button className="p-3 bg-blue-600 text-white rounded-lg uppercase hover:opacity-90 disabled:opacity-75">
            {loading ? "Updating..." : "Update"}
          </button>
          {error && <p className="text-red-500">{error}</p>}

          <p className="text-green-600">
            {updateSuccess ? "Startup Updated Successfully!!!" : ""}
          </p>
        </div>
      </form>
    </main>
  );
}
