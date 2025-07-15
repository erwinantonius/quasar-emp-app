<template>
    <router-view />
</template>

<script setup>
import * as firebase from 'firebase/app';
import 'firebase/messaging';

import { FIREBASE_CONFIG } from './config/firebase';
import { onBeforeMount } from 'vue';

firebase.initializeApp(FIREBASE_CONFIG);
navigator.serviceWorker.register('firebase-messaging-sw.js', {scope: "firebase-cloud-messaging-push-scope"})
  .then((registration) => {
    console.log(`Service Worker Registration (Scope: ${registration.scope})`);
  }).catch(err => {
    const msg = `Service Worker Error (${err})`;
      console.error(msg);
  })


    onBeforeMount(() => {

    })
</script>
