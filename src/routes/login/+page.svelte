<script>
	import { enhance } from '$app/forms'

	/** @type {import('./$types').ActionData} */
	export let form
</script>

<div class="flex items-center gap-6 h-full">
	<div
		class="
		bg-base-200
		grid items-center
		rounded-2xl
		h-full
		p-6
	"
	>
		<img src="/koda.png" alt="" />
	</div>
	<div class="max-w-sm">
		<h1>Welcome Back</h1>
		<p class="mb-4 text-base-content/70">Sign in to your account</p>
		<form method="post" use:enhance>
			<label for="email" class="form-control w-full max-w-xs">
				<div class="label">
					<span class="label-text">Email</span>
				</div>
			</label>
			<input
				class="input input-bordered w-full"
				type="email"
				name="email"
				id="email"
				required
				value=""
			/>
			<label for="password" class="form-control w-full max-w-xs">
				<div class="label">
					<span class="label-text">Password</span>
				</div>
			</label>
			<input
				class="input input-bordered w-full"
				type="password"
				name="password"
				id="password"
				required
				value=""
			/>
			<button class="btn btn-primary w-full mt-8">Login</button>
		</form>
		{#if form?.error}
			<p class="my-4 text-error">{form.error}</p>
		{/if}
	</div>
</div>
