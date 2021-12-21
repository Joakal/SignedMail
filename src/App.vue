<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { URL_KEY } from 'src/util/constants';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore 
window.handleOpenURL = function (url: string) {
  const path = url.split('signedmail://');
  window.localStorage.setItem(URL_KEY, JSON.stringify(path[1]))
}

export default defineComponent({
  name: 'App'
})
</script>
