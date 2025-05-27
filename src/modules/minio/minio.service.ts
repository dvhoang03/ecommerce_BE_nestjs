import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import { resolve } from 'path';
import { map, kebabCase } from 'lodash';
import * as sharp from 'sharp';

@Injectable()
export class MinioService {
  private minioClient: Minio.Client;
  private bucket: string;

  constructor() {
    //cau hinh MinIO Client
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost', // Thử sử dụng địa chỉ IPv4 thay vì 'localhost'
      port: Number(process.env.MINIO_PORT),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ROOT_USER,
      secretKey: process.env.MINIO_ROOT_PASSWORD,
    });

    this.bucket = process.env.MINIO_BUCKET || '';
  }

  //tao bucket neu chua co
  async createBucketIfNotExists() {
    const bucketExists = await this.minioClient.bucketExists(this.bucket);
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucket, 'eu-west-1');
    }
  }

  //tai anh len
  async uploadImage(fileName: string, fileBuffer: Buffer): Promise<string> {
    await this.createBucketIfNotExists(); // Đảm bảo bucket tồn tại
    const originalname = `${Date.now()}-${kebabCase(fileName.split('.')[0])}`;
    const extension = fileName.split('.').pop();
    const uploadPath = `${Date.now()}-${originalname}.${extension}`; // VD: 16987654321-my-image.jpg
    try {
      const buffer = Buffer.isBuffer(fileBuffer)
        ? fileBuffer
        : Buffer.from(fileBuffer);

      await this.minioClient.putObject(this.bucket, uploadPath, fileBuffer);

      await this.makeBucketPublic();
      // Trả về URL của ảnh
      return `http://localhost:9000/${this.bucket}/${uploadPath}`;
    } catch (err) {
      throw new Error('Error uploading image to MinIO: ' + err.message);
    }
  }

  //lay anh tu minIO
  async getImage(fileName: string) {
    return await this.minioClient.getObject(this.bucket, fileName);
  }

  //xoa anh khoi minIO
  async deleteImage(fileName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(this.bucket, fileName);
      console.log(`delete file ${fileName} from MInIO`);
    } catch (err) {
      throw new Error('error deleting image from MinIO');
    }
  }

  //reshape anh tu minIO
  async getResizeImage(fileName: string, width: number, height: number) {
    try {
      const imageStream = await this.getImage(fileName);
      console.log(imageStream);
      const chunks: Buffer[] = [];

      // đọc stream thanh buffer
      return new Promise((resolve, reject) => {
        imageStream.on('data', (chunk) => chunks.push(chunk));
        imageStream.on('end', async () => {
          const imageBuffer = Buffer.concat(chunks);

          //resize anh bằng sharp
          const resizeBuffer = await sharp(imageBuffer)
            .resize(width, height)
            .toBuffer();
          resolve(resizeBuffer);
        });
        imageStream.on('error', reject);
      });
    } catch (error) {
      throw new Error(`Error resizing image: ${error.message}`);
    }
  }

  // private async streamToBuffer(stream: any): Promise<Buffer> {
  //     const chunks: Buffer[] = [];
  //     return new Promise((reslove, reject) => {
  //         stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
  //         stream.on('error', (err) => reject(err));
  //         stream.on('end', () => resolve(Buffer.concat(chunks)));
  //     })
  // }

  // Hàm cấp quyền công khai cho bucket
  async makeBucketPublic() {
    try {
      const policy = `{
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": "*",
                    "Action": "s3:GetObject",
                    "Resource": "arn:aws:s3:::${this.bucket}/*"
                }
            ]
        }`;

      await this.minioClient.setBucketPolicy(this.bucket, policy);
      console.log(`Bucket ${this.bucket} is now public`);
    } catch (err) {
      console.error('Error setting bucket policy:', err);
    }
  }
}
