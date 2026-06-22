import mongoose, { Schema } from "mongoose";

// Blog Schema
const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true }, // Markdown or HTML content
    excerpt: { type: String, required: true },
    author: { type: String, required: true }, // slug or name reference to Team
    featuredImage: { type: String, required: true },
    locale: { type: String, required: true, enum: ["en", "bn"] },
    draft: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    seo: {
      title: { type: String },
      description: { type: String },
      ogImage: { type: String },
    },
    categories: { type: [String], default: [] },
    translationGroupId: { type: String },
  },
  { timestamps: true }
);

// Team Schema
const TeamSchema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    avatar: { type: String, required: true },
    bio: { type: String, required: true },
    skills: { type: [String], default: [] },
    socials: {
      twitter: { type: String },
      linkedin: { type: String },
      github: { type: String },
      website: { type: String },
    },
    locale: { type: String, required: true, enum: ["en", "bn"] },
    translationGroupId: { type: String },
  },
  { timestamps: true }
);

// Testimonial Schema
const TestimonialSchema = new Schema(
  {
    author: { type: String, required: true },
    company: { type: String, required: true },
    logo: { type: String },
    avatar: { type: String },
    quote: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
    videoUrl: { type: String },
    locale: { type: String, required: true, enum: ["en", "bn"] },
    translationGroupId: { type: String },
  },
  { timestamps: true }
);

// Portfolio Schema
const PortfolioSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    cover: { type: String, required: true },
    gallery: { type: [String], default: [] },
    caseStudy: { type: String }, // slug referencing CaseStudy
    content: { type: String },
    excerpt: { type: String },
    locale: { type: String, required: true, enum: ["en", "bn"] },
    price: { type: Number, default: 24 },
    supportPrice: { type: Number, default: 7.13 },
    sales: { type: Number, default: 1442 },
    rating: { type: Number, default: 5.0 },
    ratingsCount: { type: Number, default: 101 },
    features: { type: [String], default: ["Quality checked by Ecare", "Future updates included", "6 months support from Ecare"] },
    demoUrl: { type: String, default: "/services" },
    videoUrl: { type: String, default: "" },
    icon: { type: String },
    productType: { type: String, enum: ["internal", "external"], default: "external" },
    translationGroupId: { type: String },
  },
  { timestamps: true }
);

// Contact Schema
const ContactSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    product: { type: String },
    supportType: { type: String },
    orderId: { type: String },
    status: { type: String, required: true, enum: ["unread", "read"], default: "unread" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Page Schema
const PageSchema = new Schema(
  {
    key: { type: String, required: true, unique: true }, // e.g. "about", "terms", "privacy"
    content: {
      en: { type: String, required: true },
      bn: { type: String, required: true },
    },
  },
  { timestamps: true }
);

// Admin Schema
const AdminSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
  },
  { timestamps: true }
);

// Comment Schema
const CommentSchema = new Schema(
  {
    productSlug: { type: String, required: true }, // slug referencing Portfolio
    name: { type: String, required: true },
    email: { type: String, required: true },
    content: { type: String, required: true },
    locale: { type: String, required: true, enum: ["en", "bn"], default: "en" },
    isAdminReply: { type: Boolean, default: false },
    parentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
  },
  { timestamps: true }
);

// Category Schema
const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["blog", "product"], required: true },
    locale: { type: String, required: true, enum: ["en", "bn"] },
    translationGroupId: { type: String }
  },
  { timestamps: true }
);

export const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
export const Team = mongoose.models.Team || mongoose.model("Team", TeamSchema);
export const Testimonial = mongoose.models.Testimonial || mongoose.model("Testimonial", TestimonialSchema);
export const Portfolio = mongoose.models.Portfolio || mongoose.model("Portfolio", PortfolioSchema);
export const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
export const Contact = mongoose.models.Contact || mongoose.model("Contact", ContactSchema);
export const Page = mongoose.models.Page || mongoose.model("Page", PageSchema);
export const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
export const Comment = mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
