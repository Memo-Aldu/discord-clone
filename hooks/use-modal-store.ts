import { ChannelType, Server } from '@prisma/client';
import { create } from 'zustand';

export type ModalType = "createServer" | "invite" | "editServer" | "members" | "createChannel"
    | "leaveServer" | "deleteServer";

interface ModalDate {
    server? : Server;
    channelType?: ChannelType
}

interface ModalStore {
    type: ModalType | null;
    data: ModalDate;
    isOpen: boolean;
    onOpen: (type: ModalType, data?: ModalDate) => void;
    onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data = {}) => set({isOpen: true, type, data}),
    onClose: () => set({ type: null, isOpen: false }),
}));