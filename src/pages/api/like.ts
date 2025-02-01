import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { validarTokerJWT } from "@/middlewares/validarTokerJWT";
import { PublicacaoModel } from "@/models/PublicacaoModel";
import { UsuarioModel } from "@/models/UsuarioModel";
import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { NextApiRequest, NextApiResponse } from "next";

const endpointLike = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg>
) => {
  try {
    if (req.method === "PUT") {
      const { id } = req?.query;
      const publicacao = await PublicacaoModel.findById(id);
      if (!publicacao) {
        return res.status(404).json({ erro: "Publicacao nao encontrada" });
      }

      const { userId } = req?.query;
      const usuario = await UsuarioModel.findById(userId);
      if (!usuario) {
        return res.status(404).json({ erro: "Usuario nao encontrado" });
      }

      const indexDoUsuarioNoLike = publicacao.likes.findIndex(
        (like: any) => like.toString() === usuario._id.toString()
      );

      if (indexDoUsuarioNoLike != -1) {
        publicacao.likes.splice(indexDoUsuarioNoLike, 1);
        await PublicacaoModel.findByIdAndUpdate(id, publicacao);
        return res
          .status(200)
          .json({ msg: "Publicacao descurtida com sucesso" });
      } else {
        publicacao.likes.push(usuario._id);
        await PublicacaoModel.findByIdAndUpdate(id, publicacao);
        return res.status(200).json({ msg: "Publicacao curtida com sucesso" });
      }
    }

    return res.status(405).json({ erro: "Metodo informado nao e valido" });
  } catch (error) {
    return res
      .status(500)
      .json({ erro: "Ocorreu um erro ao curtir/descurtir publicacao" });
  }
};

export default validarTokerJWT(conectarMongoDB(endpointLike));
