import prisma from "../DB/db.config.js ";
import vine, { errors } from "@vinejs/vine";
import { authRegisterValidationSchema } from "../validations/authValidation.js";

export const register = async (req, res) => {
  try {
    const body = req.body;
    const validator = vine.compile(authRegisterValidationSchema);

    const payload = await validator.validate(body);

    return res.json({ payload: payload });
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      console.log(error.messages);
      return res.status(400).json({ errors: error.messages });
    }
  }
};
