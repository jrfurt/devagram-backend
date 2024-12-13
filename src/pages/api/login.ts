import type { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "../../../middlewares/conectarMongoDB";
import type { RespostaPadraoMsg } from "../../../types/RespostaPadraoMsg";
import { UsuarioModel } from "@/models/UsuarioModel";
import md5 from "md5";

const endpointLogin = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg> // <> padroniza o type da response
) => {
  if (req.method === "POST") {
    const { login, senha } = req.body;

    const usuarioEncontrado = await UsuarioModel.find({
      email: login,
      senha: md5(senha)
    });
    if (usuarioEncontrado && usuarioEncontrado.length > 0) {
      const usuarioLogado = usuarioEncontrado[0];
      return res
        .status(200)
        .json({ msg: `Usuario ${usuarioLogado.nome} autenticado com sucesso` });
    }

    return res.status(400).json({ erro: "Usuario ou senha nao encontrado" });
  }

  return res.status(405).json({ erro: "Metodo informado nao e valido" });
};

// Ao exportar, primeiro é chamada a função (middleware) pra saber se está conectado ao DB
export default conectarMongoDB(endpointLogin);
