import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { RespostaPadraoMsg } from "../types/RespostaPadraoMsg";
import jwt, { JwtPayload } from "jsonwebtoken";

export const validarTokerJWT =
  (handler: NextApiHandler) =>
  (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    const { MINHA_CHAVE_JWT } = process.env;
    if (!MINHA_CHAVE_JWT)
      return res.status(500).json({ erro: "ENV JWT não foi informada" });

    if (!req.method || !req.headers)
      return res
        .status(401)
        .json({ erro: "Nao foi possivel validar o token de acesso" });

    if (req.method !== "OPTIONS") {
      const authorization = req.headers["authorization"];
      if (!authorization)
        return res
          .status(401)
          .json({ erro: "Nao foi possivel validar o token de acesso" });

      const token = authorization.substring(7);
      if (!token)
        return res
          .status(401)
          .json({ erro: "Nao foi possivel validar o token de acesso" });

      const tokenDecoded = jwt.verify(token, MINHA_CHAVE_JWT) as JwtPayload;
      if (!tokenDecoded)
        return res
          .status(401)
          .json({ erro: "Nao foi possivel validar o token de acesso" });

      if (!req.query) req.query = {};

      req.query.userId = tokenDecoded._id;
    }

    return handler(req, res);
  };
