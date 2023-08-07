import {useNotifications} from "vue-browser-notifications";

export function notify(message: string) {
    const {requestPermission, sendNotification} = useNotifications(true, {icon: './logo.png'})

    sendNotification('mgorski.dev', {body: message})
}
