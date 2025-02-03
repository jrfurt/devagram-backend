import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { politicaDeCors } from "@/middlewares/politicaDeCors";
import { validarTokerJWT } from "@/middlewares/validarTokerJWT";
import { PublicacaoModel } from "@/models/PublicacaoModel";
import { UsuarioModel } from "@/models/UsuarioModel";
import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { NextApiRequest, NextApiResponse } from "next";

const endpointComentario = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg>
) => {
  if (req.method === "PUT") {
    const { userId, id } = req.query;

    const usuarioLogado = await UsuarioModel.findById(userId);
    if (!usuarioLogado) {
      return res.status(404).json({ erro: "Usuario logado nao encontrado" });
    }

    const publicacao = await PublicacaoModel.findById(id);
    if (!publicacao) {
      return res.status(404).json({ erro: "Publicacao nao encontrada" });
    }

    if (!req.body || !req.body.comentario || req.body.comentario.length < 2) {
      return res.status(404).json({ erro: "Comentario nao e valido" });
    }

    const comentario = {
      idUsuario: usuarioLogado._id,
      nome: usuarioLogado.nome,
      comentario: req.body.comentario
    };

    publicacao.comentarios.push(comentario);
    await PublicacaoModel.findByIdAndUpdate(
      { _id: publicacao._id },
      publicacao
    );

    return res.status(200).json({ msg: "Comentario adicionado com sucesso" });
  }
};

export default politicaDeCors(validarTokerJWT(conectarMongoDB(endpointComentario)));
