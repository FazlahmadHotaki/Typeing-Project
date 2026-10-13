const mongoose = require("mongoose");

const typingResultSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    lesson_id: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
    wpm: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    elapsed_time: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

typingResultSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  obj.created_at = obj.createdAt;
  delete obj._id;
  delete obj.__v;
  delete obj.updatedAt;
  return obj;
};

module.exports = mongoose.model("TypingResult", typingResultSchema);