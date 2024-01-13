<script lang="ts">
	import { enhance } from '$app/forms'

	let fieldType: 'password' | 'text' = 'password'
</script>

<div class="grid items-center max-w-sm h-[calc(100vh-48px)] m-auto">
	<div class="bg-base-200 p-6 rounded-md w-96">
		<h1>Your Key</h1>
		<p class="mb-4 text-base-content/70">Enter your key</p>
		<form action="?/set-key" method="post" use:enhance class="flex gap-4">
			<input
				class="input input-bordered w-full"
				name="key"
				placeholder="key"
				type={fieldType}
				on:focus={() => (fieldType = 'text')}
				on:blur={() => (fieldType = 'password')}
			/>
			<button class="btn btn-primary">Set Key</button>
		</form>
	</div>
</div>
