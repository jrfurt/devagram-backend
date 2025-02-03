import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { politicaDeCors } from "@/middlewares/politicaDeCors";
import { validarTokerJWT } from "@/middlewares/validarTokerJWT";
import { UsuarioModel } from "@/models/UsuarioModel";
import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { NextApiRequest, NextApiResponse } from "next";

const endpointPesquisa = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg | any>
) => {
  try {
    if (req.method === "GET") {
      const { filtro } = req.query;
      if (!filtro || filtro.length < 2) {
        return res.status(404).json({
          erro: "Informe pelo menos 2 caracteres para realizar a busca"
        });
      }
      const usuariosEncontrados = await UsuarioModel.find({
        // o regex para que a busca possa ser feita utilizando apenas um nome, p.e.
        // e 'options: i' indica o 'ignore case'
        nome: { $regex: filtro, $options: 'i' }
      });

      return res.status(200).json(usuariosEncontrados);
    }
    return res.status(405).json({ erro: "Metodo informado nao e valido" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ erro: "Nao foi possivel buscar usuarios" });
  }
};

export default politicaDeCors(validarTokerJWT(conectarMongoDB(endpointPesquisa)));
