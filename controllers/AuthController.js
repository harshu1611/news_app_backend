import prisma from "../DB/db.config.js ";
import vine, { errors } from "@vinejs/vine";
import { authRegisterValidationSchema } from "../validations/authValidation.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const body = req.body;
    const validator = vine.compile(authRegisterValidationSchema);

    const payload = await validator.validate(body);

    const findUser = await prisma.users.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (findUser) {
      return res
        .status(400)
        .json({ message: `User with email ${payload.email} already exists` });
    }
    const salt = bcrypt.genSaltSync(10);
    payload.password = bcrypt.hashSync(payload.password, salt);

    const user = await prisma.users.create({
      data: payload,
    });
    return res
      .status(200)
      .json({ message: "User created successfully", data: user });
  } catch (error) {
    console.log(error);
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return res.status(400).json({ errors: error.messages });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const login = async (req, res) => {
  try {
    const body = req.body;
    if(!body.email || !body.password){
      return res.status(400).json({message:"Email and password are required"})
    }
    const user = await prisma.users.findUnique({
      where: {
        email: body.email,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if(user){
      const isMatch = bcrypt.compareSync(body.password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const jwtToken = jwt.sign(
        {
          id: user.id,
          email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      return res.status(200).json({ message: "Login successful", data: user, access_token:`Bearer ${jwtToken}` });
    }
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
