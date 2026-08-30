import { SlotsService, SlotConfig } from './slots.service';
export declare class SlotsController {
    private readonly slotsService;
    constructor(slotsService: SlotsService);
    createSlot(body: {
        slotId: string;
        config?: SlotConfig;
    }): Promise<{
        success: boolean;
        slotId: string;
        path: string;
    }>;
    startSlot(id: string): Promise<{
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
    stopSlot(id: string): Promise<{
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
    restartSlot(id: string): Promise<{
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
    deleteSlot(id: string): Promise<{
        success: boolean;
        slotId: string;
    }>;
    getLogs(id: string): Promise<string>;
    sendCommand(id: string, body: {
        command: string;
    }): Promise<{
        success: boolean;
        executed: string;
    }>;
}
