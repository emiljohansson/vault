import CryptoJS from 'crypto-js'

// Assume derivedKey is obtained using PBKDF2-HMAC-SHA256 during user authentication
export function pbkdf2HmacSha256(
	password: string,
	salt: CryptoJS.lib.WordArray,
	iterations: number,
	keyLength: number,
) {
	const key = CryptoJS.PBKDF2(password, salt, {
		keySize: keyLength / 32,
		iterations: iterations,
		hasher: CryptoJS.algo.SHA256,
	})

	return key.toString(CryptoJS.enc.Hex)
}

function generateRandomKey() {
	return CryptoJS.lib.WordArray.random(256 / 8).toString()
}

function decryptWithKey(ciphertext: string, key: string) {
	return CryptoJS.AES.decrypt(ciphertext, key).toString(CryptoJS.enc.Utf8)
}

function encryptWithKey(plaintext: string, key: string) {
	return CryptoJS.AES.encrypt(plaintext, key).toString()
}

// Encrypt a new password entry
export function encryptPassword(masterKey: string, plaintextPassword: string) {
	const encryptionKey = generateRandomKey() // Generate a random key for encrypting the password
	const encryptedPassword = encryptWithKey(plaintextPassword, encryptionKey)

	// Store the encryptedPassword and other data securely, along with the encrypted encryptionKey
	return {
		password: encryptedPassword,
		key: encryptWithKey(encryptionKey, masterKey),
	}
}

// Decrypt a stored password entry
export function decryptPassword(
	masterKey: string,
	encryptedPassword: string,
	encryptedEncryptionKey: string,
) {
	const encryptionKey = decryptWithKey(encryptedEncryptionKey, masterKey)

	// Use encryptionKey to decrypt storedData.encryptedPassword and retrieve the plaintext password
	const plaintextPassword = decryptWithKey(encryptedPassword, encryptionKey)

	return plaintextPassword
}
