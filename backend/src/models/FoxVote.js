const mongoose = require("mongoose");

const foxVoteSchema = new mongoose.Schema(
  {
    foxId: {
      type: Number,
      required: true,
      min: 1
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true
    },
    votes: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true,
    collection: "fox_votes"
  }
);

foxVoteSchema.index({ foxId: 1 }, { unique: true });
foxVoteSchema.index({ votes: -1, foxId: 1 });

module.exports = mongoose.model("FoxVote", foxVoteSchema);
