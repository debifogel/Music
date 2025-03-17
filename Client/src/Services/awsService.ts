import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_REGION;

if (!accessKeyId || !secretAccessKey || !bucketName || !region) {
  throw new Error('חסרים משתני סביבה');
}

AWS.config.update({
  accessKeyId,
  secretAccessKey,
  region,
});
const s3 = new AWS.S3();


const awsService = {
  uploadFile: async (file: File, onProgress: (progress: number) => void): Promise<string> => {
    try {
      const params = {
        Bucket: bucketName,
        Key: file.name,
        Body: file,
      };

      const upload = s3.upload(params);

      upload.on('httpUploadProgress', (progress) => {
        const percent = Math.round((progress.loaded / progress.total) * 100);
        onProgress(percent);
      });

      const data = await upload.promise();
      console.log('העלאה הצליחה:', data.Location);
      return data.Location;
    } catch (err: any) {
      console.error('שגיאה בהעלאה:', err);
      throw 'שגיאה בהעלאה.';
    }
  },

  downloadFile: async (key: string): Promise<AWS.S3.GetObjectOutput> => {
    try {
      const params = {
        Bucket: bucketName,
        Key: key,
      };

      const data = await s3.getObject(params).promise();
      return data;
    } catch (err: any) {
      console.error('שגיאה בהורדה:', err);
      throw err;
    }
  },

  deleteFile: async (key: string): Promise<void> => {
    try {
      const params = {
        Bucket: bucketName,
        Key: key,
      };

      await s3.deleteObject(params).promise();
    } catch (err: any) {
      console.error('שגיאה במחיקה:', err);
      throw err;
    }
  },
};

export default awsService;