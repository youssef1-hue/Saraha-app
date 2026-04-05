import mongoose from "mongoose";
import { GenderEnum, ProviderEnum, RoleEnum } from "../common/enums/user.enum.js";
import Joi from "joi";

export const userShema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: function () {
        return this.provider === ProviderEnum.System;
      }
    },
   oldPassword: [String],
    phone: {
      type: String
    },
    confirmEmail: {
      type: Date
    },
    gender: {
      type: String,
      enum: Object.values(GenderEnum),
      default: GenderEnum.Male
    },
    provider: {
      type: String,
      enum: Object.values(ProviderEnum),
      default: ProviderEnum.System
    },
    role: {
      type: String,
      enum: Object.values(RoleEnum),
      default: RoleEnum.user
    },
    profilePicture: {
      type: String
    },
    coverProfilePicture: {
      type: [String]
    },
    changCredentialsTime: {
      type: Date
    }
  },
  {
    collection: "Route_Users",
    timestamps: true,
    strict: true,
    strictQuery: true,
    optimisticConcurrency: true,
    autoIndex: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


userShema.virtual("username").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userShema.pre("validate", function () {
  if (this.username && (!this.firstName || !this.lastName)) {
    const parts = this.username.trim().split(/\s+/);
    this.firstName = parts.shift();
    this.lastName = parts.join(" ");
  }
});


export const UserModel =
  mongoose.models.User || mongoose.model("User", userShema);