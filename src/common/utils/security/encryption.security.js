import { ENC_SECRET_KEY, IV_LENGTH } from "../../../../config/config.service.js";
import crypto from "crypto";

export const generateEncryption = async (plaintext) => {
    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv('aes-256-cbc', ENC_SECRET_KEY, iv);

    let ciphertext = cipher.update(plaintext, 'utf-8', 'hex');
    ciphertext += cipher.final('hex');

    return `${iv.toString('hex')}:${ciphertext}`;
};
export const generateDecryption = async (ciphertext) => {
    const [iv, encryptedData] = ciphertext.split(':') || [];
    const ivLikeBinary = Buffer.from(iv, 'hex');

    let decipherIv = crypto.createDecipheriv('aes-256-cbc', ENC_SECRET_KEY, ivLikeBinary);

    let plaintext = decipherIv.update(encryptedData, 'hex', 'utf-8');
    plaintext += decipherIv.final('utf-8');

    return plaintext;
};