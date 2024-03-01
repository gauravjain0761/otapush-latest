import notifee, {EventType} from '@notifee/react-native';

export async function ForegroundHandler(data: any, state: string) {
  await notifee.requestPermission();

  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  await notifee.displayNotification({
    title: data.notification.title,
    body: data.notification.body,
    android: {
      channelId,
      // smallIcon : "",
      pressAction: {
        id: `${state}`,
      },
      sound: 'default',
    },
  });

  // console.log(`Notification clicked in ${state} state`);
}
const handleNotificationPress = async (event: any) => {
  if (event.type === EventType.PRESS) {
    console.log('Notification Pressed in Foreground...', event);
  }
};

notifee.onForegroundEvent(handleNotificationPress);

export default ForegroundHandler;

const handleBackgroundEvent = async (event: any) => {
  if (event.type === EventType.PRESS) {
    console.log('Notification Pressed', event);
  }
};

notifee.onBackgroundEvent(handleBackgroundEvent);
