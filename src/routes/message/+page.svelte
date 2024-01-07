<script lang="ts">
	import type { PageData } from './$types'
	import { PlusIcon } from 'svelte-feather-icons'

	export let data: PageData
</script>

<div class="flex">
	<h1>Messages</h1>
	<a class="btn btn-primary btn-link ml-auto" href="/message/create">
		<PlusIcon />
		<span class="sr-only">Create a message</span>
	</a>
</div>
<ul>
	{#each data.messages as message}
		<li>
			<a class="link link-primary" href="/message/{message.id}">{message.id}</a>
		</li>
	{/each}
</ul>
