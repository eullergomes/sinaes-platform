import {
  S3Client,
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketPolicyCommand
} from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'us-east-1',
  endpoint: process.env.MINIO_ENDPOINT ? `http://${process.env.MINIO_ENDPOINT}` : 'http://localhost:9000',
  credentials: {
    accessKeyId: process.env.MINIO_ROOT_USER || 'minioadmin',
    secretAccessKey: process.env.MINIO_ROOT_PASSWORD || 'minioadmin'
  },
  forcePathStyle: true
});

const BUCKET_NAME = process.env.MINIO_BUCKET || 'sinaes-files';

async function ensureBucketExists(bucketName: string) {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
    console.log(`Bucket "${bucketName}" already exists.`);
    return;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.log(`Bucket "${bucketName}" does not exist. Creating...`);
  }

  await s3Client.send(
    new CreateBucketCommand({
      Bucket: bucketName
    })
  );

  console.log(`Bucket "${bucketName}" criado.`);
}

async function setBucketPublicRead(bucketName: string) {
  // S3-style policy: allows s3:GetObject for anyone (*)
  const policy = {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'AllowPublicRead',
        Effect: 'Allow',
        Principal: '*',
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${bucketName}/*`]
      }
    ]
  };

  const policyString = JSON.stringify(policy);

  await s3Client.send(
    new PutBucketPolicyCommand({
      Bucket: bucketName,
      Policy: policyString
    })
  );

  console.log(
    `Política de leitura pública aplicada ao bucket "${bucketName}".`
  );
}

export async function setupMinioBucket() {
  await ensureBucketExists(BUCKET_NAME);
  await setBucketPublicRead(BUCKET_NAME);
}

if (typeof require !== 'undefined' && require.main === module) {
  setupMinioBucket()
    .then(() => {
      console.log('Setup do MinIO concluído.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Erro no setup do MinIO:', err);
      process.exit(1);
    });
}
