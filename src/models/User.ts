import mongoose, { Schema, models, Document } from "mongoose";

export interface User extends Document {
  name: string;
  email: string;
  image: string;
}

const UserSchema: Schema<User> = new Schema(
  {
    name: { type: String },
    email: { type: String, unique: true, required: true },
    image: { type: String }, // profile pic
  },
  { timestamps: true } // auto add createdAt, updatedAt
);

const User = models.User || mongoose.model("User", UserSchema);
export default User;
