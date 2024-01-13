import type { PageServerLoad } from './$types'
import { redirect, type Actions, fail } from '@sveltejs/kit'
import CryptoJS from 'crypto-js'
import { ENCRYPT_SECRET } from '$env/static/private'
import { createClient } from '$lib/supabaseClient'
import { decryptPassword, encryptPassword } from '$lib/password'

const { AES, enc } = CryptoJS

export const load: PageServerLoad = async ({ cookies }) => {
	const supabase = createClient(cookies)
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		redirect(302, '/login')
	}

	const { data } = await supabase
		.from('account')
		.select('*')
		.eq('user_id', user?.id)
	const masterKey = cookies.get('key')
	return {
		user,
		key: masterKey,
		accounts: data ?? [],
	}
}

export const actions = {
	logout: async ({ cookies }) => {
		const supabase = createClient(cookies)
		await supabase.auth.signOut()
	},
	plaintext: async ({ request, cookies }) => {
		const formData = await request.formData()
		const masterKey = cookies.get('key')
		const password = formData.get('password') as string
		const supabase = createClient(cookies)

		const {
			data: { user },
		} = await supabase.auth.getUser()

		if (!masterKey || !user) {
			return fail(400)
		}

		const { data } = await supabase
			.from('account')
			.select('key')
			.eq('user_id', user.id)
			.eq('password', password)
			.single()

		if (!data?.key) {
			return fail(400)
		}

		const step3 = AES.decrypt(password, ENCRYPT_SECRET).toString(enc.Utf8)
		const step2 = AES.decrypt(step3, user?.id || '').toString(enc.Utf8)
		const step1 = decryptPassword(masterKey, step2, data.key)

		if (!step1) {
			return fail(400)
		}

		return step1
	},
	'add-account': async ({ request, cookies }) => {
		const formData = await request.formData()
		const website = formData.get('website') as string
		const username = formData.get('username') as string
		const password = formData.get('password') as string
		const masterKey = cookies.get('key')
		const supabase = createClient(cookies)
		const {
			data: { user },
		} = await supabase.auth.getUser()

		if (!user || !masterKey) {
			return fail(400)
		}

		const encryptedPassword = encryptPassword(masterKey, password)
		const step2 = AES.encrypt(encryptedPassword.password, user?.id || '').toString()
		const step3 = AES.encrypt(step2, ENCRYPT_SECRET).toString()

		const { data } = await supabase.from('account').insert([
			{
				website,
				username,
				password: step3,
				key: encryptedPassword.key,
				user_id: user?.id,
			},
		])
		return data
	},
} satisfies Actions
