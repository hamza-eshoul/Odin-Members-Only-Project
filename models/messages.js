const mongoose = require("mongoose");
const { DateTime } = require("luxon");

// Define a schema
const Schema = mongoose.Schema;

// Instantiate a messages schema
const messageSchema = new Schema(
  {
    messageTitle: {
      type: String,
      required: true,
    },
    messageContent: {
      type: String,
      required: true,
    },
    messageAuthor: {
      type: String,
      required: true,
    },
    messageImg: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

messageSchema.virtual("formattedDate").get(function () {
  return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("Message", messageSchema);
