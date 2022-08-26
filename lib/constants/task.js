export const TASK_STATUS_OPEN = 1;
export const TASK_STATUS_RUNNING = 2;
export const TASK_STATUS_CLOSE = 3;
export const TASK_STATUS_COMPLAINED = 6;

export const TASK_EXECUTION_NULL = 0;
export const TASK_EXECUTION_BEGIN = 1;
export const TASK_EXECUTION_CONFIRMED = 2;
export const TASK_EXECUTION_PAYED = 3;
export const TASK_EXECUTION_STARTED = 4;
export const TASK_EXECUTION_FINISHED = 5;
export const TASK_EXECUTION_END = 6;
export const TASK_EXECUTION_COMPLAINED = 7;

export const TASK_PAYMENT_CASH = 1;
export const TASK_PAYMENT_ON_CARD = 2;
export const TASK_PAYMENT_POST_PAY = 3;
export const TASK_PAYMENT_CASHLESS_WITH_NDS = 4;
export const TASK_PAYMENT_CASHLESS_WITHOUT_NDS = 5;
export const TASK_PAYMENT_LIST = [
    {
        text: 'Наличные',
        value: TASK_PAYMENT_CASH,
    },
    {
        text: 'По карте',
        value: TASK_PAYMENT_ON_CARD,
    },
    {
        text: 'Постоплата',
        value: TASK_PAYMENT_POST_PAY,
    },
    {
        text: 'Безналичный (с НДС)',
        value: TASK_PAYMENT_CASHLESS_WITH_NDS,
    },
    {
        text: 'Безналичный (без НДС)',
        value: TASK_PAYMENT_CASHLESS_WITHOUT_NDS,
    },
];

export default {
    TASK_STATUS_OPEN,
    TASK_STATUS_RUNNING,
    TASK_STATUS_CLOSE,
    TASK_STATUS_COMPLAINED,
    TASK_EXECUTION_NULL,
    TASK_EXECUTION_BEGIN,
    TASK_EXECUTION_CONFIRMED,
    TASK_EXECUTION_PAYED,
    TASK_EXECUTION_STARTED,
    TASK_EXECUTION_FINISHED,
    TASK_EXECUTION_END,
    TASK_EXECUTION_COMPLAINED,
    TASK_PAYMENT_CASH,
    TASK_PAYMENT_ON_CARD,
    TASK_PAYMENT_POST_PAY,
    TASK_PAYMENT_CASHLESS_WITH_NDS,
    TASK_PAYMENT_CASHLESS_WITHOUT_NDS,
    TASK_PAYMENT_LIST,
};