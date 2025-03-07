"use server";

import { revalidatePath } from "next/cache";
import { User } from "./models";
import { connectToDB } from "./utils";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { signIn } from "../auth";

export const addUser = async (formData) => {
  const { username, email, password, phone, role, isAdmin, isActive } =
    Object.fromEntries(formData);

  try {
    if(!connectToDB()){
      console.log("not connected")
    }
    

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const lowerUsername = username.toLowerCase();

    const newUser = new User({
      username: lowerUsername,
      email,
      phone,
      role,
      password: hashedPassword,
      isAdmin,
      isActive,
    });

    await newUser.save();
  } catch (err) {
    console.log(err);
    throw new Error("Failed to create user!");
  }

  revalidatePath("/admin/dashboard/users");
  redirect("/admin/dashboard/users");
};

export const updateUser = async (formData) => {
  const { id, username, email, password, phone, role, isAdmin, isActive } =
    Object.fromEntries(formData);

  try {
    connectToDB();

    const updateFields = {
      username,
      email,
      password,
      phone,
      role,
      isAdmin,
      isActive,
    };

    Object.keys(updateFields).forEach(
      (key) =>
        (updateFields[key] === "" || undefined) && delete updateFields[key]
    );

    await User.findByIdAndUpdate(id, updateFields);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update user!");
  }

  revalidatePath("/admin/dashboard/users");
  redirect("/admin/dashboard/users");
};


export const authenticate = async (prevState, formData) => {
    const { username, password } = Object.fromEntries(formData);
  
    try {
      await signIn("credentials", { username, password });
    } catch (err) {
      if (err.message.includes("CredentialsSignin")) {
        return "Wrong Credentials";
      }
      throw err;
    }
  };