export interface Record {
    id: number;
    amount: number;
    user_balance: number;
    date: string;
    type: string;
}

export enum OperationType {
    RANDOM_STRING = 'RANDOM_STRING',
    SQUARE_ROOT = 'SQUARE_ROOT',
    DIVISION = 'DIVISION',
    MULTIPLICATION = 'MULTIPLICATION',
    SUBSTRACTION = 'SUBSTRACTION',
    ADDITION = 'ADDITION'
}
