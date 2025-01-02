import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { validarTokerJWT } from "@/middlewares/validarTokerJWT";
import { UsuarioModel } from "@/models/UsuarioModel";
import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { NextApiRequest, NextApiResponse } from "next";

const endpointUsuario = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg>
) => {
  try {
    const { userId } = req.query;

    const usuario = await UsuarioModel.findById(userId);
    // Setar a senha como null ao retornar
    usuario.senha = null;

    return res.status(200).json(usuario);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ erro: "Nao foi possivel obter dados do usuario" });
  }
};

export default validarTokerJWT(conectarMongoDB(endpointUsuario));
