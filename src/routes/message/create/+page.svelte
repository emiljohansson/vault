<script lang="ts">
	import { enhance } from '$app/forms'
</script>

<div class="text-sm breadcrumbs">
	<ul>
		<li><a href="/message">Home</a></li>
		<li>Create a message</li>
	</ul>
</div>

<h1>New Message</h1>
<form action="?/create-message" method="post" use:enhance class="grid gap-4 max-w-sm">
	<label>
		Subject
		<input class="input input-bordered w-full" name="subject" placeholder="Subject" type="text" />
	</label>
	<label>
		Password
		<input class="input input-bordered w-full" name="password" placeholder="Password" type="text" />
	</label>
	<textarea class="textarea textarea-bordered w-full" name="message"></textarea>
	<button class="btn btn-primary">Save</button>
</form>
