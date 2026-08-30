export interface SlotConfig {
    version: string;
    username: string;
    serverIp?: string;
    serverPort?: number;
    allocatedRamMB?: number;
    autoReconnect?: boolean;
    modpack?: string;
}
export declare class SlotsService {
    private readonly logger;
    private readonly slotsBaseDir;
    private readonly runningProcesses;
    constructor();
    getActiveSlotsCount(): number;
    private getSlotDir;
    createSlot(slotId: string, config: SlotConfig): Promise<{
        success: boolean;
        slotId: string;
        path: string;
    }>;
    startSlot(slotId: string): Promise<{
        success: boolean;
        message: string;
        status?: undefined;
        slotId?: undefined;
    } | {
        success: boolean;
        status: string;
        slotId: string;
        message?: undefined;
    }>;
    stopSlot(slotId: string): Promise<{
        success: boolean;
        message: string;
        status?: undefined;
        slotId?: undefined;
    } | {
        success: boolean;
        status: string;
        slotId: string;
        message?: undefined;
    }>;
    restartSlot(slotId: string): Promise<{
        success: boolean;
        message: string;
        status?: undefined;
        slotId?: undefined;
    } | {
        success: boolean;
        status: string;
        slotId: string;
        message?: undefined;
    }>;
    deleteSlot(slotId: string): Promise<{
        success: boolean;
        slotId: string;
    }>;
    getSlotLogs(slotId: string): Promise<string>;
    sendCommand(slotId: string, command: string): Promise<{
        success: boolean;
        executed: string;
    }>;
}
