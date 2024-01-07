import { type Actions } from '@sveltejs/kit'
import pkg from 'crypto-js'
import { createClient } from '$lib/supabaseClient'

const { AES } = pkg

export const actions = {
	'create-message': async ({ request, cookies }) => {
		const formData = await request.formData()
		const json = Object.fromEntries(formData)
		const password = json.password as string
		delete json.password
		const encrypted = AES.encrypt(JSON.stringify(json), password).toString()
		const supabase = createClient(cookies)
		const { data, error } = await supabase.from('message').insert([{ encrypted }])
		if (error) {
			return { status: 500, body: error }
		}
		return { status: 200, body: data }
	},
} satisfies Actions
