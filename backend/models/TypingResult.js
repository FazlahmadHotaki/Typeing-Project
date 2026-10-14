const mongoose = require("mongoose");

const typingResultSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    lesson_id: { type: String, required: true, index: true },
    lessonTitle: { type: String, default: "" },

    // Typing metrics
    wpm: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    elapsed_time: { type: Number, default: 0 },

    // Progress
    completed: { type: Boolean, default: false },

    // NEW: stars & grade
    stars: { type: Number, default: 0, min: 0, max: 5 },
    score: { type: Number, default: 0, min: 0, max: 10 },

    // NEW: character counts
    typedCharacters: { type: Number, default: 0 },
    correctCharacters: { type: Number, default: 0 },
    totalCharacters: { type: Number, default: 0 },
  },
  { timestamps: true }
);

typingResultSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  obj.created_at = obj.createdAt;
  obj.lesson_id = String(obj.lesson_id);
  delete obj._id;
  delete obj.__v;
  delete obj.updatedAt;
  return obj;
};

module.exports = mongoose.model("TypingResult", typingResultSchema);