import { PUBLIC_CHAT_API_KEY, PUBLIC_CHAT_SERVER_PORT } from '$env/static/public';
import type { ChatMessage, ChatRoom, ModelInfo } from '@matriarch/chat';

export class ChatApiService {
	private baseUrl: string;
	private apiKey: string;
	/**
	 * @param baseUrl - The base URL of the API (defaults to '/api/rooms')
	 */
	constructor(options: { baseUrl?: string; apiKey: string; serverPort: string }) {
		const { baseUrl = '/api/rooms', apiKey, serverPort } = options;

		this.baseUrl = serverPort ? `http://127.0.0.1:${serverPort}${baseUrl}` : baseUrl;

		this.apiKey = apiKey;
	}

	/**
	 * Handle API errors uniformly
	 */
	private handleError(error: unknown, errorMessage: string): never {
		console.error(errorMessage, error);
		throw new Error(`${errorMessage}: ${(error as Error).message || 'Unknown error'}`);
	}

	/**
	 * Common fetch method with error handling
	 */
	private async fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
		try {
			const url = `${this.baseUrl}${endpoint}`;
			const response = await fetch(url, {
				...options,
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': this.apiKey,
					...options.headers
				}
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(`API error ${response.status}: ${errorData.error || response.statusText}`);
			}

			return (await response.json()) as T;
		} catch (error) {
			this.handleError(error, `API request failed for ${endpoint}`);
		}
	}

	/**
	 * List all available chat rooms
	 * @param tags - Optional tags to filter rooms by
	 */
	async listRooms(tags?: string[]): Promise<{ rooms: ChatRoom[] }> {
		const queryParams = tags?.length ? `?tags=${tags.join(',')}` : '';
		return this.fetchApi<{ rooms: ChatRoom[] }>(`${queryParams}`);
	}

	/**
	 * Get message history for a specific room
	 * @param roomId - The ID of the room
	 */
	async getRoomHistory(roomId: string): Promise<{ messages: ChatMessage[] }> {
		return this.fetchApi<{ messages: ChatMessage[] }>(`/${roomId}/history`);
	}

	/**
	 * Send a message to a room
	 * @param roomId - The ID of the room
	 * @param content - The message content
	 * @param sender - Information about the sender
	 */
	async sendMessage(
		roomId: string,
		content: string,
		sender: ModelInfo
	): Promise<{ message: ChatMessage }> {
		return this.fetchApi<{ message: ChatMessage }>(`/${roomId}/message`, {
			method: 'POST',
			body: JSON.stringify({ content, sender })
		});
	}

	/**
	 * Create a new chat room
	 * @param roomData - Data for the new room
	 */
	async createRoom(roomData: {
		name: string;
		topic: string;
		tags: string[];
		creator: ModelInfo;
	}): Promise<{ room: ChatRoom }> {
		return this.fetchApi<{ room: ChatRoom }>('/', {
			method: 'POST',
			body: JSON.stringify(roomData)
		});
	}

	/**
	 * Clear all messages from a room
	 * @param roomId - The ID of the room
	 */
	async clearRoomMessages(roomId: string): Promise<{ success: boolean; message: string }> {
		return this.fetchApi<{ success: boolean; message: string }>(`/${roomId}/messages`, {
			method: 'DELETE'
		});
	}

	/**
	 * Poll for new messages in a room
	 * @param roomId - The ID of the room
	 * @param lastMessageTimestamp - Timestamp of the last received message
	 * @param interval - Polling interval in milliseconds
	 * @param callback - Function to call when new messages are received
	 * @returns A function that can be called to stop polling
	 */
	pollNewMessages(
		roomId: string,
		lastMessageTimestamp: string,
		interval: number = 3000,
		callback: (messages: ChatMessage[]) => void
	): () => void {
		let latestTimestamp = lastMessageTimestamp;
		let isPolling = true;

		const poll = async () => {
			if (!isPolling) return;

			try {
				const { messages } = await this.getRoomHistory(roomId);
				const newMessages = messages.filter(
					(msg) => new Date(msg.timestamp) > new Date(latestTimestamp)
				);

				if (newMessages.length > 0) {
					// Update the latest timestamp
					latestTimestamp = newMessages[newMessages.length - 1].timestamp;
					callback(newMessages);
				}
			} catch (error) {
				console.error('Polling error:', error);
			} finally {
				if (isPolling) {
					setTimeout(poll, interval);
				}
			}
		};

		poll();

		// Return function to stop polling
		return () => {
			isPolling = false;
		};
	}
}

export const chatService = new ChatApiService({
	apiKey: PUBLIC_CHAT_API_KEY,
	serverPort: PUBLIC_CHAT_SERVER_PORT
});
