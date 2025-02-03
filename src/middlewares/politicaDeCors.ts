import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";

export const politicaDeCors =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    try {
      await NextCors(req, res, {
        // Options
        methods: ['GET', 'PUT', 'POST'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
     });

     return handler(req, res);
    } catch (error) {
      console.log("Erro de CORS:", error);
      return res
        .status(500)
        .json({ erro: "Ocorreu um erro com a política de CORS" });
    }
  };
