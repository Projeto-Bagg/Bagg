import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MediaService {
  private containerName: string;

  private async getBlobServiceInstance() {
    const blobClientService = BlobServiceClient.fromConnectionString(
      process.env.BLOB_STORAGE_URL,
    );
    return blobClientService;
  }

  private async getBlobClient(imageName: string): Promise<BlockBlobClient> {
    const blobService = await this.getBlobServiceInstance();
    const containerName = this.containerName;
    const containerClient = blobService.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(imageName);

    return blockBlobClient;
  }

  async uploadFile(file: Express.Multer.File, containerName: string) {
    this.containerName = containerName;
    const extension = file.originalname.split('.').pop();
    const file_name = uuidv4() + '.' + extension;
    const blockBlobClient = await this.getBlobClient(file_name);
    const fileUrl = blockBlobClient.url;
    await blockBlobClient.uploadData(file.buffer);

    return fileUrl;
  }

  async deleteFile(file_name: string, containerName: string) {
    try {
      this.containerName = containerName;
      const blockBlobClient = await this.getBlobClient(file_name);
      await blockBlobClient.deleteIfExists();
    } catch (error) {
      console.log(error);
    }
  }
}
