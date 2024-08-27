import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { Readable } from 'stream';  // Explicitly import Readable
import dotenv from "dotenv"

dotenv.config()

const region = 'us-east-1';
const bucketName = 'new-pem';
const key = 'kaf.pem';
const destinationPath = path.join(__dirname, '../ca.pem');

const accesskeyId = process.env.ACCESSS_KEY_ID||""
const secretKey = process.env.SECRET_ACCESS_KEY||""


const s3Client = new S3Client({
    credentials: {
        accessKeyId: accesskeyId,
        secretAccessKey: secretKey
    },
    region: region
});

export async function downloadFile() {
    // Check if the file already exists
    if (fs.existsSync(destinationPath)) {
        console.log("File already exists");
        return;
    }

    try {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: key
        });

        const response = await s3Client.send(command);

        // Ensure response.Body is a readable stream
        if (!response.Body || !(response.Body instanceof Readable)) {
            console.log("Response Body is not a readable stream or is undefined")
            return
        }

        // Create a write stream for the destination file
        const fileStream = fs.createWriteStream(destinationPath);

        // Use pipeline to handle streaming
        const streamPipeline = promisify(pipeline);
        await streamPipeline(response.Body, fileStream);

        console.log("File downloaded successfully");
    } catch (e) {
        console.error('Error downloading the file:', e);
    }
}
