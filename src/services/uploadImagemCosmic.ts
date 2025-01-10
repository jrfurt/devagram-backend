import multer from "multer";
import { createBucketClient } from "@cosmicjs/sdk";

const { BUCKET_SLUG, WRITE_KEY, READ_KEY } = process.env;

const bucketDevagram = createBucketClient({
  bucketSlug: BUCKET_SLUG as string,
  readKey: READ_KEY as string,
  writeKey: WRITE_KEY as string
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadImagemCosmic = async (req: any) => {
  try {
    if (req?.file?.originalname) {
      const mediaObject = {
        originalname: req.file.originalname,
        buffer: req.file.buffer
      };

      if (req.url && req.url.includes("publicacao")) {
        return await bucketDevagram.media.insertOne({
          media: mediaObject,
          folder: "publicacao"
        });
      } else {
        return await bucketDevagram.media.insertOne({
          media: mediaObject,
          folder: "avatar"
        });
      }
    } else {
      throw new Error("Arquivo inválido ou ausente.");
    }
  } catch (error) {
    console.error("Erro no uploadImagemCosmic:", error);
    return null;
  }
};

export { upload, uploadImagemCosmic };
