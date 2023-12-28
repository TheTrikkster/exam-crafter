import mongoose, { Schema } from "mongoose";

const topicSchema = new Schema(
  {
    status: String,
    data: {
      text: String,
      grade: String,
      comment: String,
    },
  },
  {
    timestamps: true,
  },
);

const Topic = mongoose.models.Topic || mongoose.model("Topic", topicSchema);

export default Topic;
