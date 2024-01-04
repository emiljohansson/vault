import { json } from '@sveltejs/kit'
import { ENCRYPT_SECRET } from '$env/static/private'
import pkg from 'crypto-js'
import { createClient } from '$lib/supabaseClient.js'

const { AES, enc } = pkg

export async function POST({ request, cookies }) {
	const authHeader = request.headers.get('authorization')
	const token = authHeader?.split(' ')[1]

	if (!token) {
		return json({ message: 'Unauthorized' }, { status: 401 })
	}
	const supabase = createClient(cookies)
	const { error } = await supabase.auth.getUser(token)
	if (error) {
		return json({ message: 'Unauthorized' }, { status: 401 })
	}

	const { password } = await request.json()
	const result = AES.decrypt(password, ENCRYPT_SECRET).toString(enc.Utf8)

	return json({ data: result }, { status: 201 })
}
