import AWS from 'aws-sdk';

// Load environment variables
const S3_BUCKET = import.meta.env.VITE_S3_BUCKET || "" ;
const REGION = import.meta.env.VITE_S3_REGION || "" ;
const ACCESS_KEY = import.meta.env.VITE_AWS_ACCESS_KEY  || ""
const SECRET_KEY = import.meta.env.VITE_AWS_SECRET_KEY || "" ;
const FOLDER_NAME = import.meta.env.VITE_FOLDER_NAME ;
console.log(import.meta.env);

// Configure AWS SDK
AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
    region: REGION,
});

const s3 = new AWS.S3();

interface UploadResponse {
    Location: string;
    Key: string;
    Bucket: string;
}

const S3Service = {
    // Upload file to S3
    uploadFile: async (file: File, fileName: string, progress?: (progressEvent: AWS.S3.ManagedUpload.Progress) => void): Promise<UploadResponse> => {
        const params: AWS.S3.PutObjectRequest = {
            Bucket: S3_BUCKET,
            Key: FOLDER_NAME+fileName, // This should include the full path, e.g., "folderName/fileName.ext" if you want to upload to a folder
            Body: file,
            ContentType: 'audio/m4a',
            };
        const upload = s3.upload(params);

        if (progress) {
            upload.on('httpUploadProgress', progress);
        }

        return upload.promise() as Promise<UploadResponse>;
    },

    // Download file from S3
    getFileUrl: (fileName: string): string => {
        return `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${fileName}`;
    },

    // Delete file from S3
    deleteFile: async (fileName: string): Promise<AWS.S3.DeleteObjectOutput> => {
        const params: AWS.S3.DeleteObjectRequest = {
            Bucket: S3_BUCKET,
            Key: fileName,
        };
        return s3.deleteObject(params).promise();
    },
// פונקציה ליצירת Pre-signed URL
generatePresignedUrl: ( objectKey: string): string => {
    const params = {
        Bucket: S3_BUCKET,
        Key: objectKey,
        Expires: 60 * 5 // תוקף ה-URL (בדקות)
    };

    // יצירת ה-Pre-signed URL

    const url= s3.getSignedUrl('getObject', params);
    console.log(url)
    return url
}
};

export default S3Service;
