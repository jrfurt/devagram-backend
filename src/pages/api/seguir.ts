import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { politicaDeCors } from "@/middlewares/politicaDeCors";
import { validarTokerJWT } from "@/middlewares/validarTokerJWT";
import { SeguidorModel } from "@/models/SeguidorModel";
import { UsuarioModel } from "@/models/UsuarioModel";
import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { NextApiRequest, NextApiResponse } from "next";

const endpointSeguir = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg>
) => {
  try {
    // Funções de toggle utilizam método PUT
    if (req.method === "PUT") {
      const { userId, id } = req.query;

      const usuarioLogado = await UsuarioModel.findById(userId);
      if (!usuarioLogado) {
        return res.status(404).json({ erro: "Usuario logado nao encontrado" });
      }

      const usuarioASerSeguido = await UsuarioModel.findById(id);
      if (!usuarioASerSeguido) {
        return res
          .status(404)
          .json({ erro: "Usuario a ser seguido nao encontrado" });
      }
      const usuarioJaEhSeguido = await SeguidorModel.findOne({
        idUsuario: usuarioLogado._id,
        idUsuarioSeguido: usuarioASerSeguido._id
      });

      if (usuarioJaEhSeguido) {
        await SeguidorModel.findByIdAndDelete({ _id: usuarioJaEhSeguido._id });

        usuarioLogado.seguindo--;
        await UsuarioModel.findByIdAndUpdate(
          { _id: usuarioLogado._id },
          usuarioLogado
        );

        usuarioASerSeguido.seguidores--;
        await UsuarioModel.findByIdAndUpdate(
          { _id: usuarioASerSeguido._id },
          usuarioASerSeguido
        );

        return res
          .status(200)
          .json({ msg: "Usuario deixado de seguir com sucesso" });
      } else {
        const seguir = {
          idUsuario: usuarioLogado._id,
          idUsuarioSeguido: usuarioASerSeguido._id
        };

        await SeguidorModel.create(seguir);

        usuarioLogado.seguindo++;
        await UsuarioModel.findByIdAndUpdate(
          { _id: usuarioLogado._id },
          usuarioLogado
        );

        usuarioASerSeguido.seguidores++;
        await UsuarioModel.findByIdAndUpdate(
          { _id: usuarioASerSeguido._id },
          usuarioASerSeguido
        );

        return res.status(200).json({ msg: "Usuario seguido com sucesso" });
      }
    }

    return res.status(405).json({ erro: "Metodo informado nao e valido" });
  } catch (error) {
    return res.status(500).json({
      erro: "Ocorreu um erro ao seguir/deixar de seguir usuario informado"
    });
  }
};

export default politicaDeCors(validarTokerJWT(conectarMongoDB(endpointSeguir)));
