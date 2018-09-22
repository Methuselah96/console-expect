export interface IMessageInfo {
    args: any[];
    type: string;
    stack: string;
}
export interface IMessageMatch {
    type: "log" | "warn" | "error";
    args: any[];
    dev?: boolean;
    match?: (allowedMessage: IMessageMatch, receivedMessage: IMessageInfo) => boolean;
}
export default class MockConsole {
    private mockedConsole?;
    private receivedMessages;
    private expectedMessages;
    private allowedMessages;
    private events;
    private wrapLog(functionName);
    revert(ignoreChecks?: boolean): void;
    private printArgs(messageInfo);
    onceEmpty(callback: () => void): void;
    expectLog(...args: any[]): void;
    expectWarn(...args: any[]): void;
    expectError(...args: any[]): void;
    expectLogDev(...args: any[]): void;
    expectWarnDev(...args: any[]): void;
    expectErrorDev(...args: any[]): void;
    allow(allowedMessage: IMessageMatch): void;
    private expect(type, args);
    private messageReceived(messageInfo);
    private match(allowedMessage, receivedMessage);
    private checkMessage(expected, actual, justReceived);
    static messageTypes: string[];
    constructor();
    private verbose;
    wrapConsole(): void;
}
