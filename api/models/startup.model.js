import mongoose from "mongoose";

const startupSchema = new mongoose.Schema(
  {
    Date: {
      type: String,
      required: true,
    },
    StartupName: {
      type: String,
      required: true,
    },
    IndustryVertical: {
      type: String,
      required: true,
    },
    SubVertical: {
      type: String,
      required: true,
    },
    CityLocation: {
      type: String,
      required: true,
    },
    InvestorsName: {
      type: String,
      required: true,
    },
    InvestmentType: {
      type: String,
      required: true,
    },
    AmountInUSD: {
      type: String,
      required: true,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Startup = mongoose.model("Startup", startupSchema);

export default Startup;
