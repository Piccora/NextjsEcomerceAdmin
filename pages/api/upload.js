import { IncomingForm } from 'formidable';
import { Storage } from '@google-cloud/storage';
import { isAdminRequest } from './auth/[...nextauth]';

const storage = new Storage({
    projectId: process.env.FIREBASE_PROJECT_ID,
    credentials: {
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY,
    },
  });
const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET);
export default async function handleUpload(req, res) {
    await isAdminRequest(req, res);
    const { method } = req
    if (res.statusCode === 200) {
        if (method === 'POST') {
            const form = new IncomingForm();
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    console.error('Error uploading file:', err);
                    return res.status(500).send(err);
                }
                // The file was uploaded successfully, so retrieve it from files
                const urls = []
                const amount = Object.keys(files).length
                for (var i = 0; i < amount; i++) {
                    const file = files[`file${i}`];
                    // Upload the file to Firebase Storage
                    const newFileName = Date.now() + '_' + file.originalFilename
                    await bucket.upload(file.filepath, {
                        destination: `ProductImages/${newFileName}`,
                    });
                    const url = `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/ProductImages/${newFileName}`
                    urls.push(url);
                }
                return res.status(200).send(urls);
            });
        }
        else {
            return res.status(405).send('Method Not Allowed')
        }
    }
}

export const config = {
    api: {
        bodyParser: false
    },
};