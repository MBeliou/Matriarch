import type { DatabaseAdapter } from "./types";
import { ChatRoom, ChatMessage, ModelInfo } from "../types";
export declare class SQLiteAdapter implements DatabaseAdapter {
    private db;
    initialize(): Promise<void>;
    createRoom(room: Omit<ChatRoom, "id">): Promise<ChatRoom>;
    getRoom(roomId: string): Promise<ChatRoom | null>;
    listRooms(tags?: string[]): Promise<ChatRoom[]>;
    addMessage(message: Omit<ChatMessage, "id">): Promise<ChatMessage>;
    getRoomMessages(roomId: string, limit?: number): Promise<ChatMessage[]>;
    addParticipant(roomId: string, participant: ModelInfo): Promise<void>;
    removeParticipant(roomId: string, username: string): Promise<void>;
    updateRoom(roomId: string, room: Partial<ChatRoom>): Promise<ChatRoom>;
    clearMessages(roomId: string): Promise<void>;
    close(): Promise<void>;
}
