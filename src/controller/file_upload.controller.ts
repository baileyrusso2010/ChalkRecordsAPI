import { Request, Response } from "express";
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

// S3 client
const awsRegion = process.env.AWS_REGION;
const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!awsRegion || !awsAccessKeyId || !awsSecretAccessKey) {
  throw new Error("Missing AWS configuration in environment variables.");
}

const s3 = new S3Client({
  region: awsRegion,
  credentials: {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  },
});
export const uploadClassFile = async (req: Request, res: Response) => {
  try {
    console.log("In here");
    const { classId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const key = `classes/${classId}/${uuidv4()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3.send(command);

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    res.json({ message: "Upload successful", url: fileUrl, key });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
};

export const listClassFiles = async (req: Request, res: Response) => {
  try {
    const { classId } = req.params;

    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: `classes/${classId}/`,
    });

    const result = await s3.send(command);

    const files = await Promise.all(
      (result.Contents || []).map(async (obj) => {
        if (!obj.Key) return null;
        const getObjectCommand = new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: obj.Key,
        });
        const signedUrl = await getSignedUrl(s3, getObjectCommand, {
          expiresIn: 300, // 5 min
        });
        return {
          key: obj.Key,
          url: signedUrl,
          size: obj.Size,
          lastModified: obj.LastModified,
        };
      })
    );

    res.json({ files: files.filter(Boolean) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to list files" });
  }
};
