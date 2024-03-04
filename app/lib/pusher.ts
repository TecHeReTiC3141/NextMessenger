import PusherServer from "pusher";
import PusherClient from "pusher-js";

let pusherServer: PusherServer | null = null;

export const getPusherInstance = () => {
    if (!pusherServer) {
        pusherServer = new PusherServer({
            appId: process.env.PUSHER_APP_ID!,
            key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
            secret: process.env.PUSHER_SECRET!,
            cluster: "eu",
            useTLS: true,
        });
    }
    return pusherServer;
};

const pusherClientSingleton = () => {
    return new PusherClient(
        process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
        {
            channelAuthorization: {
                endpoint: '/api/pusher/auth',
                transport: 'ajax',
            },
            cluster: "eu",
        }
    );
}

declare global {
    var pusherClient: undefined | ReturnType<typeof pusherClientSingleton>
}

export const pusherClient = globalThis.pusherClient ?? pusherClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.pusherClient = pusherClient;
