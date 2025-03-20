import { User } from "./models";
import { connectToDB } from "./utils";

export const fetchUsers = async (q, page) => {
  const regex = new RegExp(q, "i");

  const ITEM_PER_PAGE = 2;

  try {
    connectToDB();
    const count = await User.find({ username: { $regex: regex } }).count();
    const users = await User.find({ username: { $regex: regex } })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1));
    return { count, users };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch users!");
  }
};

export const fetchUser = async (id) => {
  console.log(id);
  try {
    connectToDB();
    const user = await User.findById(id);
    return user;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch user!");
  }
};



// DUMMY DATA

export const cards = [
  {
    id: 1,
    title: "Total Users",
    number: 3,
    change: 12,
  },
  {
    id: 2,
    title: "Students",
    number: 20,
    change: -2,
  },
  {
    id: 3,
    title: "Facilitators",
    number: 10,
    change: 18,
  },
  {
    id: 4,
    title: "Equipments",
    number: 80,
    change: 18,
  },
];

export const projectdata=[
  {
    id: 1,
    title:"Todo",
    number: 2,
  },
  {
    id: 2,
    title:"Active",
    number: 3,
  },
  {
    id: 3,
    title:"Completed",
    number: 1,
  },
  {
    id: 4,
    title:"Total",
    number: 6,
  }
]