import { NextApiRequest, NextApiResponse } from "next";
import { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { CadastroRequisicao } from "../../types/CadastroRequisicao";
import { UsuarioModel } from "@/models/UsuarioModel";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import md5 from "md5";
import nextConnect from "next-connect";
import { upload, uploadImagemCosmic } from "@/services/uploadImagemCosmic";

const handler = nextConnect()
  .use(upload.single("file"))
  .post(
    async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
      try {
        const usuario = req.body as CadastroRequisicao;

        if (!usuario.nome || usuario.nome.length < 2) {
          return res.status(400).json({ erro: "Nome invalido" });
        }

        if (
          !usuario.email ||
          usuario.email.length < 5 ||
          !usuario.email.includes("@") ||
          !usuario.email.includes(".")
        ) {
          return res.status(400).json({ erro: "Email invalido" });
        }

        if (!usuario.senha || usuario.senha.length < 4) {
          return res.status(400).json({ erro: "Senha invalida" });
        }

        const usuarioComMesmoEmail = await UsuarioModel.find({
          email: usuario.email
        });
        if (usuarioComMesmoEmail && usuarioComMesmoEmail.length > 0) {
          return res
            .status(400)
            .json({ erro: "Ja existe usuario com este email cadastrado" });
        }

        // enviar imagem do multer para o cosmic
        const image = await uploadImagemCosmic(req);

        // Usuário salvo com a senha criptografada
        const usuarioASerSalvo = {
          nome: usuario.nome,
          email: usuario.email,
          senha: md5(usuario.senha),
          avatar: image?.media?.url
        };

        await UsuarioModel.create(usuarioASerSalvo);
        return res.status(201).json({ msg: "Dados corretos" });
      } catch (error) {
        console.error(error);
      }
    }
  );

// por conta da mídia enviada no form, o padrão de envio das infos não pode ser json
// por isso nessa  API desativa o body parser
export const config = { api: { bodyParser: false } };
export default conectarMongoDB(handler);
