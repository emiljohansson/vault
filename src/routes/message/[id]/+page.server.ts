import type { PageServerLoad } from './$types'
import pkg from 'crypto-js'
import { createClient } from '$lib/supabaseClient'
import type { Actions } from '@sveltejs/kit'

const { AES, enc } = pkg

export const load: PageServerLoad = async ({ params }) => {
	return { id: params.id }
}

export const actions = {
	'decrypt-message': async ({ request, cookies, params }) => {
		if (!params.id) {
			return {
				success: false,
				error: 'No message id',
			}
		}
		const formData = await request.formData()
		const json = Object.fromEntries(formData)
		const password = json.password as string
		const supabase = createClient(cookies)
		const { data, error } = await supabase.from('message').select('*').eq('id', params.id).single()
		if (error || !data.encrypted) {
			return { status: 500, body: error }
		}
		try {
			const decrypted = AES.decrypt(data.encrypted, password).toString(enc.Utf8)
			if (decrypted === '') {
				return {
					success: false,
					error: 'Wrong password',
				}
			}
			return {
				success: true,
				...JSON.parse(decrypted),
			}
		} catch (error) {
			return {
				success: false,
				error: 'Wrong password',
			}
		}
	},
} satisfies Actions
