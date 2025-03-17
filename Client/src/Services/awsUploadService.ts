import AWS from 'aws-sdk';

interface UploadServiceProps {
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  region: string;
}

const awsUploadService = {
  uploadFile: (file: File, props: UploadServiceProps, onProgress: (progress: number) => void): Promise<string> => {
    return new Promise((resolve, reject) => {
      AWS.config.update({
        accessKeyId: props.accessKeyId,
        secretAccessKey: props.secretAccessKey,
        region: props.region,
      });

      const s3 = new AWS.S3();
      const params = {
        Bucket: props.bucketName,
        Key: file.name,
        Body: file,
      };

      s3.upload(params)
        .on('httpUploadProgress', (progress) => {
          const percent = Math.round((progress.loaded / progress.total) * 100);
          onProgress(percent);
        })
        .send((err: AWS.AWSError, data: AWS.S3.ManagedUpload.SendData) => {
          if (err) {
            console.error('שגיאה בהעלאה:', err);
            reject('שגיאה בהעלאה.');
          } else {
            console.log('העלאה הצליחה:', data.Location);
            resolve('העלאה הצליחה.');
          }
        });
    });
  },
};

export default awsUploadService;