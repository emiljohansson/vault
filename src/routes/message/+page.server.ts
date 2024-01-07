import type { PageServerLoad } from './$types'
import { createClient } from '$lib/supabaseClient'

type Message = {
	id: string
}

export const load: PageServerLoad = async ({ cookies }) => {
	const supabase = createClient(cookies)
	const { data, error } = await supabase.from('message').select('id').returns<Message[]>()

	if (error) {
		return { messages: [] }
	}
	return { messages: data }
}
