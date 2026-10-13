const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    icon: { type: String, default: "📚" },

    title_en: { type: String, default: "" },
    title_ps: { type: String, default: "" },
    title_fa: { type: String, default: "" },
    title_dr: { type: String, default: "" },
    title_prs: { type: String, default: "" },

    sub_en: { type: String, default: "" },
    sub_ps: { type: String, default: "" },
    sub_fa: { type: String, default: "" },
    sub_dr: { type: String, default: "" },
    sub_prs: { type: String, default: "" },

    progress: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    stars: { type: Number, default: 0 },
    color: { type: String, default: "#8B5CF6" },
  },
  { timestamps: true }
);

lessonSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model("Lesson", lessonSchema);