const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true }, // "pashto-typing"

    icon: { type: String, default: "⌨" }, // URL or single char
    color: { type: String, default: "#5B8DEF" },

    title: {
      en: { type: String, default: "" },
      ps: { type: String, default: "" },
      fa: { type: String, default: "" },
    },

    sub: {
      en: { type: String, default: "" },
      ps: { type: String, default: "" },
      fa: { type: String, default: "" },
    },

    score: { type: String, default: "0" },
    stars: { type: Number, default: 0 },
    progress: { type: Number, default: 0, min: 0, max: 100 },

    order: { type: Number, default: 0 }, // display order
  },
  { timestamps: true }
);

courseSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  delete obj.createdAt;
  delete obj.updatedAt;
  return obj;
};

module.exports = mongoose.model("Course", courseSchema);