import { USER_ERROR, SYSTEM_ERROR } from '~/lib/constants/error';

/**
 * Базовый класс ошибки
 */
class LegacyError extends Error {
    constructor( message ) {
        super( message );
        this.name = this.constructor.name;
    }
}

/**
 * Класс пользовательских ошибок
 */
export class UserError extends LegacyError {
    constructor( message ) {
        super( message );
        this.errorCode = USER_ERROR;
    }
}

/**
 * Класс системных ошибок
 *
 * Включает в сообщение название класса.
 */
export class SystemError extends LegacyError {
    constructor( message ) {
        super( message );
        this.errorCode = SYSTEM_ERROR;
        this.message = `${ this.name }: ${ this.message }`;
    }
}

/**
 * Класс ошибок сетевых запросов
 */
export class RequestError extends SystemError {
    constructor( message, statusCode = 400 ) {
        super( message );
        this.statusCode = statusCode;
    }
}

/**
 * Базовый класс ошибок валидации
 */
export class ValidationError extends SystemError {}

/**
 * Уточняющий класс ошибок: некорректное значение
 */
export class InvalidValueError extends ValidationError {}

/**
 * Уточняющий класс ошибок: некорректный тип
 */
export class InvalidTypeError extends ValidationError {}

/**
 * Уточняющий класс ошибок: некорректное значение свойства объекта
 */
export class FieldRequiredError extends ValidationError {}

/**
 * Уточняющий класс ошибок: некорректный тип свойства объекта
 */
export class FieldInvalidTypeError extends ValidationError {}