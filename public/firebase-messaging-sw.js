importScripts("https://www.gstatic.com/firebasejs/9.0.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.2/firebase-messaging-compat.js");

// Your web app's Firebase configuration
try {
    console.log('setup sw public')
    const firebaseConfig = {
        apiKey: "AIzaSyBGTJlToEhLpYMEMjVRRGXoHVmC8LSnXsc",
        authDomain: "jarvis-59e3c.firebaseapp.com",
        databaseURL: "https://jarvis-59e3c.firebaseio.com",
        projectId: "jarvis-59e3c",
        storageBucket: "jarvis-59e3c.appspot.com",
        messagingSenderId: "839147338432",
        appId: "1:839147338432:web:456c9b928566462b18cb25"
    };

    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage(function (payload) {
        console.log(payload)
        const title = payload.notification.title;
        const options = {
            icon: 'favicon.ico',
            body: payload.notification.body
        };
        return self.registration.showNotification(title, options)
    });

    self.addEventListener('notificationclick', event => {
        event.notification.close();
        const urlToOpen = new URL('/my-task', self.location.origin).href;

        const promiseChain = clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then(windowClients => {
            let matchingClient = null;

            for (let i = 0; i < windowClients.length; i++) {
                const windowClient = windowClients[i];
                if (windowClient.url === urlToOpen) {
                    matchingClient = windowClient;
                    break;
                }
            }

            if (matchingClient) {
                return matchingClient.focus();
            } else {
                return clients.openWindow(urlToOpen);
            }
        });

        event.waitUntil(promiseChain);
    });

}
catch (e) {
    console.log(e)
}
