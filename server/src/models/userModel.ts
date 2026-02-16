import mongoose from "mongoose";
import validator from "validator";

interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  // password: string;
  photo: string;
  role: "admin" | "user";
  gender: "male" | "female";
  dob: Date;
  createdAt: Date;
  updatedAt: Date;
  //Virutal Atrrbute
  age: number;
}

const schema = new mongoose.Schema(
  {
    _id: { type: String, required: [true, "Please Enter Your ID"] },
    name: { type: String, required: [true, "Please Enter Name"] },
    email: {
      type: String,
      required: [true, "Please Enter Your Email-ID"],
      unique: [true, "Email-ID Already Exists"],
      validate: validator.default.isEmail,
    },
    // password: { type: String, required: [true, "Please Enter Your Password"] },
    photo: { type: String, required: [true, "Please add Photo"] },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Please Enter Your Gender"],
    },
    dob: {
      type: Date,
      required: [true, "Please Enter Your Date of Birth"],
    },
  },
  { timestamps: true }
);

schema.virtual("age").get(function () {
  const today = new Date();
  const dob = this.dob;
  let age = today.getFullYear() - dob.getFullYear();

  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  ) {
    age--;
  }
  return age;
});

export const User = mongoose.model<IUser>("User", schema);
