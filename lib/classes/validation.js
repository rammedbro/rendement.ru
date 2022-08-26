import {
    FieldRequiredError,
    FieldInvalidTypeError,
    InvalidValueError,
    InvalidTypeError,
} from '~/lib/classes/error';

/**
 * Проверяет на непустое/неопределенное значение
 *
 * @param {*} value
 * @param {Object} options
 *
 * @returns {Boolean}
 */
export function checkNotEmpty( value, options = {} ) {
    const { lengthCheck = false } = options;
    let result = !( [ undefined, null, NaN ].includes( value ) );

    if ( result && lengthCheck && ( Array.isArray( value ) || typeof value === 'string' ) ) {
        result = !!value.length;
    }

    return result;
}

/**
 * Проверяет объект на соответствие кастомному типу,
 * определенному через {@link createObjectInterface},
 *
 * @param {Object} object
 * @param {Object|Array} int - интерфейс, который должен реализовывать объект
 * @param {Object} options
 *
 * @returns {Boolean|Object}
 */
export function checkObjectInterface( object, int, options = {} ) {
    const { rootObject = object, throwError = true } = options;
    const interfaces = Array.isArray( int ) ? int : [ int ];
    const result = {};
    let error;

    for ( const int of interfaces ) {
        const { intName } = int;

        for ( const [ prop, options ] of Object.entries( int ) ) {
            const { required } = options;
            const type = ( options.type && options.type.name === 'type' )
                ? options.type( rootObject ) : options.type;
            const arrayOf = ( options.arrayOf && options.arrayOf.name === 'arrayOf' )
                ? options.arrayOf( rootObject ) : options.arrayOf;
            const value = object[prop];

            try {
                result[prop] = checkType( value, type, { arrayOf, rootObject } );
            } catch ( e ) {
                if ( e instanceof InvalidValueError ) {
                    const isRequired = ( typeof required === 'function' )
                        ? required( rootObject ) : required;

                    if ( isRequired ) {
                        error = new FieldRequiredError(
                            `Отсутствует обязательное поле "${ prop }" ` +
                            `в объекте, реализующем интрефейс "${ intName }"`,
                        );
                    } else if ( options.default !== undefined ) {
                        result[prop] = options.default;
                    }
                } else if ( e instanceof InvalidTypeError ) {
                    error = new FieldInvalidTypeError(
                        `Тип "${ value.constructor.name }" поля "${ prop }" не соответсвует типу "${ type.name }" ` +
                        `в объекте, реализующем интрефейс "${ intName }"`,
                    );
                } else {
                    error = e;
                }
            }

            if ( error ) break;
        }
    }

    if ( error ) {
        if ( throwError ) {
            throw error;
        } else {
            return false;
        }
    }

    return throwError ? result : true;
}

/**
 * Проверяет тип.
 * Включает проверку:
 *      на непустое значение
 *      примитивных типов
 *      кастомных типов определенных через {@link createObjectInterface}
 *      в случае массивов - элементов массивов
 *
 * @param {*} value
 * @param {Function|Object|Array} type - функция-конструктор примитивов или кастомный тип (или массив фугкций/типов),
 *                                       которому должен удовлетворять тип проверяемого значения.
 * @param {Object} options
 *
 * @returns {Boolean|*}
 */
export function checkType( value, type, options = {} ) {
    const { arrayOf, rootObject, throwError = true } = options;
    const types = Array.isArray( type ) ? type : [ type ];
    let result, error;

    for ( let i = 0; i < types.length; i++ ) {
        const type = types[i];
        const isLastType = i === types.length - 1;

        /* Тип - any (любой), не предъявлены требования к типу */
        if ( type === undefined ) {
            result = value;
            break;
            /* Пустое значение - ошибка */
        } else if ( !checkNotEmpty( value ) ) {
            error = new InvalidValueError( `Значение "${ value }" не соответсвует типу "${ type.name }"` );
            break;
            /* Тип - объект. Делигируем проверку функции проверки интерфейса */
        } else if ( type.constructor === Object ) {
            try {
                result = checkObjectInterface( value, type, { rootObject } );
                break;
            } catch ( e ) {
                error = isLastType ? e : undefined;
            }
            /* Некорректный тип - ошибка */
        } else if ( value.constructor.name !== type.name ) {
            error = isLastType
                ? new InvalidTypeError( `Тип "${ value.constructor.name }" не соответсвует типу "${ type.name }" ` )
                : undefined;
            /* Тип - массив и указано требование к типу его элементов. Проверяем все элементы */
        } else if ( type === Array && arrayOf !== undefined ) {
            try {
                result = value.map( item => checkType( item, arrayOf, { rootObject } ) );
                break;
            } catch ( e ) {
                error = isLastType ? e : undefined;
            }
            /* Успешная проверка примитивного значения */
        } else {
            result = value;
            break;
        }
    }

    if ( error ) {
        if ( throwError ) {
            throw error;
        } else {
            return false;
        }
    }

    return throwError ? result : true;
}

export default {
    checkNotEmpty,
    checkObjectInterface,
    checkType,
};