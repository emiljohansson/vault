import CryptoJS from 'crypto-js'
import crypto from 'crypto'

// Assume derivedKey is obtained using PBKDF2-HMAC-SHA256 during user authentication
export function pbkdf2HmacSha256(
	password: string,
	salt: string,
	iterations: number,
	keyLength: number,
) {
	const key = CryptoJS.PBKDF2(password, salt, {
		keySize: keyLength / 32,
		iterations,
		hasher: CryptoJS.algo.SHA256,
	})

	return key.toString(CryptoJS.enc.Hex)
}

function generateSalt() {
	return crypto.randomBytes(16).toString('hex')
}

function decryptWithKey(ciphertext: string, key: string) {
	return CryptoJS.AES.decrypt(ciphertext, key).toString(CryptoJS.enc.Utf8)
}

function encryptWithKey(plaintext: string, key: string) {
	return CryptoJS.AES.encrypt(plaintext, key).toString()
}

// Encrypt a new password entry
export function encryptPassword(masterKey: string, plaintextPassword: string) {
	const salt = generateSalt() // Generate a random key for encrypting the password
	const encryptedPassword = encryptWithKey(plaintextPassword, salt)

	// Store the encryptedPassword and other data securely, along with the encrypted encryptionKey
	return {
		password: encryptedPassword,
		salt: encryptWithKey(salt, masterKey),
	}
}

// Decrypt a stored password entry
export function decryptPassword(masterKey: string, encryptedPassword: string, salt: string) {
	const encryptionKey = decryptWithKey(salt, masterKey)
	const plaintextPassword = decryptWithKey(encryptedPassword, encryptionKey)
	return plaintextPassword
}
