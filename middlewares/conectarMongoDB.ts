import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import mongoose from "mongoose";
import type { respostaPadraoMsg } from "../types/respostaPadraoMsg";

export const conectarMongoDB =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) => {
    // verificar se o banco de dados já está conectado, se sim, seguir para o endpoint
    // ou seguir para o próximo middleware
    if (mongoose.connections[0].readyState) {
      return handler(req, res);
    }

    // se não estiver conectado, vamos conectar

    // obter a variável de ambiente preenchida do env
    const { DB_CONEXAO_STRING } = process.env;

    // se a env estiver vazia, aborta o uso do sistema e avisa
    if (!DB_CONEXAO_STRING) {
      return res
        .status(500)
        .json({ erro: "ENV de configuracao do banco nao informado" });
    }

    mongoose.connection.on("connected", () =>
      console.log("Banco de dados conectou!")
    );
    mongoose.connection.on("error", (error) =>
      console.log(`Ocorreu erro ao conectar ao banco: ${error}`)
    );
    await mongoose.connect(DB_CONEXAO_STRING);

    // agora pode seguir para o endpoint, pois está conctado
    return handler(req, res);
  };
