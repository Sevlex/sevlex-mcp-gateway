export interface MonitoredClient {
    name: string;
    configPath: string;
}
export declare function getMcpProxyEntry(): Record<string, any>;
export declare function getMonitoredClientsForUser(userHome: string): MonitoredClient[];
export declare function getAllMonitoredClients(): MonitoredClient[];
export declare function inspectAndHealClient(client: MonitoredClient): boolean;
export interface InjectionResult {
    client: string;
    configPath: string;
    status: "INJECTED" | "ALREADY_SHIELDED" | "NOT_FOUND" | "ERROR";
    wrappedServers: string[];
    totalServers: number;
    backupPath?: string | undefined;
    error?: string | undefined;
}
export declare function injectClient(client: MonitoredClient): InjectionResult;
export interface RestoreResult {
    client: string;
    configPath: string;
    status: "RESTORED_FROM_BACKUP" | "UNWRAPPED_CLEAN" | "NOT_FOUND" | "NO_CHANGE";
    unwrappedServers: string[];
    error?: string | undefined;
}
export declare function restoreClient(client: MonitoredClient): RestoreResult;
export declare function startDaemonWatcher(): void;
//# sourceMappingURL=daemon.d.ts.map