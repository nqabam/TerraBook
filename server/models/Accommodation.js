import mongoose from "mongoose";

const PricingSchema = new mongoose.Schema({
  baseRate: { type: String, required: true },
  currency: { type: String, default: "ZAR" },
  specialOffers: { type: String }
});

const AccommodationSchema = new mongoose.Schema(
  {
    propertyType: { type: String, required: true },
    businessName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    owner: { type: String, required: true, ref: "User" },
    website: { type: String },
    address: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    description: { type: String },
    certifications: [{ type: String }],
    amenities: [{ type: String }],
    images: [{ type: String }],
    pricing: { type: PricingSchema, required: true },
    termsAccepted: { type: Boolean, required: true },
    privacyAccepted: { type: Boolean, required: true },
    marketingAccepted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Accommodation", AccommodationSchema);
