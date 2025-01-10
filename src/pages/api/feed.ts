import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { validarTokerJWT } from "@/middlewares/validarTokerJWT";
import { PublicacaoModel } from "@/models/PublicacaoModel";
import { UsuarioModel } from "@/models/UsuarioModel";
import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { NextApiRequest, NextApiResponse } from "next";

const endpointFeed = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg | any>
) => {
  try {
    if (req.method === "GET") {
      if (req?.query?.id) {
        // Faz a busca do usuário pela query que tem o ID
        const usuario = await UsuarioModel.findById(req?.query?.id);
        if (!usuario) {
          return res.status(400).json({ erro: "Usuario não encontrado" });
        }

        // Faz a busca das públicações do usuário
        const publicacoes = await PublicacaoModel.find({
          idUsuario: usuario._id
        }).sort({ data: -1 });

        return res.status(200).json(publicacoes);
      }

      return res.status(400).json({ erro: "ID do usuario nao informado" });
    }
    return res.status(405).json({ erro: "Metodo informado nao e valido" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ erro: "Nao foi possivel obter dados do usuario" });
  }
};

export default validarTokerJWT(conectarMongoDB(endpointFeed));