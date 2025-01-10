import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { validarTokerJWT } from "@/middlewares/validarTokerJWT";
import { UsuarioModel } from "@/models/UsuarioModel";
import { upload, uploadImagemCosmic } from "@/services/uploadImagemCosmic";
import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

const handler = nextConnect()
  .use(upload.single("file")) // vem o que estiver preenchido no multipart form data como 'file'
  .put(async (req: any, res: NextApiResponse<RespostaPadraoMsg>) => {
    try {
      const { userId } = req?.query;
      const usuario = await UsuarioModel.findById(userId);

      if (!usuario) {
        return res.status(400).json({ erro: "Usuario nao encontrado" });
      }

      const { nome } = req.body;
      if (nome && nome.length > 2) {
        usuario.nome = nome;
      }

      const { file } = req;
      if (file && file.originalname) {
        const imagem = await uploadImagemCosmic(req);
        if (imagem && imagem.media && imagem.media.url) {
          usuario.avatar = imagem.media.url;
        }
      }

      await UsuarioModel.findByIdAndUpdate({ _id: usuario._id }, usuario);
      return res.status(200).json({ msg: "Usuario alterado com sucesso" });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ erro: "Nao foi possivel atualizar dados do usuario" });
    }
  })

  .get(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
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
  });

export const config = { api: { bodyParser: false } };

export default validarTokerJWT(conectarMongoDB(handler));
