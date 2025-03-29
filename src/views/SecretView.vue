<template>
  <div class="about">
    <h1>This is protected content</h1>
	<p id="account"> Account: {{  account.data.session.user.email  }}</p>
	<p> Protect the secret password: **TMX$$ </p>
  </div>
</template>

<script setup>
import { supabase } from '../clients/supabase';
import { ref } from "vue";


const account = ref();
getSession();

async function getSession() {
	account.value = await supabase.auth.getSession();
	console.log(account.value)
}
</script>

<style>
#account {
	color: green;
}
</style>
