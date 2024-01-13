import { redirect, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { createClient } from '$lib/supabaseClient'
import { pbkdf2HmacSha256 } from '$lib/password'

export const load: PageServerLoad = async ({ cookies }) => {
	const supabase = createClient(cookies)
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		redirect(302, '/login')
	}
}

export const actions = {
	'set-key': async ({ request, cookies }) => {
		const formData = await request.formData()
		const enteredKey = formData.get('key') as string
		const iterations = 10000 // You can adjust the number of iterations based on your security requirements
		const keyLength = 256 // Desired key length in bits
		const supabase = createClient(cookies)
		const {
			data: { user },
		} = await supabase.auth.getUser()
		const { data } = await supabase
			.from('key')
			.select('salt')
			.eq('id', enteredKey)
			.eq('user_id', user?.id || '')
			.single()

		const derivedKey = pbkdf2HmacSha256(
			enteredKey,
			data?.salt || 'wrong key',
			iterations,
			keyLength,
		)

		cookies.set('key', derivedKey, {
			path: '/',
			sameSite: 'strict',
			secure: false,
			httpOnly: true,
		})

		redirect(302, '/')
	},
} satisfies Actions
