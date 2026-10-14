export interface MonitoredClient {
    name: string;
    configPath: string;
}
export declare function getMcpProxyEntry(): Record<string, any>;
export declare function getMonitoredClientsForUser(userHome: string): MonitoredClient[];
export declare function getAllMonitoredClients(): MonitoredClient[];
export declare function inspectAndHealClient(client: MonitoredClient): boolean;
export declare function startDaemonWatcher(): void;
//# sourceMappingURL=daemon.d.ts.map