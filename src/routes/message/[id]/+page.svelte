<script lang="ts">
	import { enhance } from '$app/forms'
	import { LoaderIcon } from 'svelte-feather-icons'

	export let form

	let loading = false
</script>

<div class="text-sm breadcrumbs">
	<ul>
		<li><a href="/message">Home</a></li>
		<li>Decode a message</li>
	</ul>
</div>

{#if form?.message}
	<h1>{form.subject}</h1>
	<div>{form.message}</div>
{:else}
	<h1>Unlock Message</h1>
	<form
		action="?/decrypt-message"
		method="post"
		class="grid gap-4 max-w-sm"
		use:enhance={() => {
			loading = true

			return async ({ update, result }) => {
				loading = false
				await update()
			}
		}}
	>
		<label>
			Password
			<input class="input input-bordered w-full" name="password" type="text" />
		</label>
		<button class="btn btn-primary">
			{#if loading}
				<LoaderIcon class="animate-spin h-5 w-5 mr-3" />
			{/if}
			Read message
		</button>

		{#if form?.error}
			<p class="text-error">{form.error}</p>
		{/if}
	</form>
{/if}
