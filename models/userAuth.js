import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    companyName: { 
      type: String, 
    },
  },
  { collection: 'customers' } // Explicitly set collection name
);

const User = models.User || mongoose.model("User", userSchema);
export default User;