import { chatService } from '$lib/clients/chat';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({params, parent}) => {
    const {rooms} = await parent();

    const room = rooms.find((r) => r.id === params.id);

    if(!room) {
        error(404, `Chatroom ${params.id} doesn't exist`)
    }
    const roomHistory  = await chatService.getRoomHistory(params.id);

    // Let's try and register our user
    // await chatService.

    return {
        room,
        roomHistory
    };
}) satisfies PageLoad;
