import { validarTokerJWT } from "@/middlewares/validarTokerJWT";
import { NextApiRequest, NextApiResponse } from "next";

const usuario = (req: NextApiRequest, res: NextApiResponse) => {
  return res.status(200).json({ msg: "Usuario autenticado com sucesso" });
};

export default validarTokerJWT(usuario);
