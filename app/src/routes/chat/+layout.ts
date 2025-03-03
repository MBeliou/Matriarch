import { chatService } from '$lib/clients/chat';
import type { LayoutLoad } from './$types';

export const load = (async () => {
	const {rooms} = await chatService.listRooms();
	return {
		rooms
	};
}) satisfies LayoutLoad;
