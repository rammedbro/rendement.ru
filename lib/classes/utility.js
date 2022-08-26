/**
 * Подбирает правильное окончание для слов-числительных из
 * 3-х предоставленных вариантов.
 *
 * @param {Number} number
 * @param {Array} variants
 *
 * @returns {String}
 */
export function pickNumeralEnding( number, variants ) {
    number = Math.abs( number ) % 100;
    const module = number % 10;

    if ( number > 10 && number < 20 ) return variants[2];
    if ( module > 1 && module < 5 ) return variants[1];
    if ( module === 1 ) return variants[0];

    return variants[2];
}

/**
 * Преобразует временную метку в выбранный формат.
 *
 * @param {Number} timestamp
 * @param {String} part - настраивает, какие части даты будут включены в результат
 * @param {Object} options - настройки методов toLocale класса Date
 * @param {Boolean} unixFormat - указывает, что временная метка задана в формате UNIX
 * @param {String} locale - локаль
 *
 * @returns {String|Date}
 */
export function formatLocaleDate( timestamp, part, options, unixFormat = true, locale = 'ru' ) {
    timestamp = unixFormat ? ( timestamp * 1000 ) : timestamp;
    const date = new Date( timestamp );

    switch ( part ) {
        case 'full':
            return date.toLocaleString( locale, options );
        case 'date':
            return date.toLocaleDateString( locale, options );
        case 'time':
            return date.toLocaleTimeString( locale, options );
        default:
            return date;
    }
}

/**
 * Преобразует временную метку в формат времени, актуальном для чатов
 *
 * @param {Number} timestamp
 * @param {Boolean} unixFormat - указывает формат временной метки
 *
 * @returns {String}
 */
export function formatDateLastOnline( timestamp, unixFormat = true ) {
    timestamp = unixFormat ? ( timestamp * 1000 ) : timestamp;

    const date = new Date( timestamp );
    const diffMs = new Date() - date;
    const diffSec = Math.round( diffMs / 1000 );
    const diffMin = Math.round( diffSec / 60 );
    const diffHour = Math.round( diffMin / 60 );
    const diffDay = Math.round( diffHour / 24 );
    let result = '';

    if ( diffMin < 1 ) {
        result += `${ diffSec } сек. назад`;
    } else if ( diffHour < 1 ) {
        result += `${ diffMin } мин. назад`;
    } else if ( diffDay < 1 ) {
        const timeFormat = date.toLocaleTimeString( 'ru', { hour: 'numeric', minute: 'numeric' } );
        result += `сегодня в ${ timeFormat }`;
    } else {
        const dateFormat = date.toLocaleDateString(
            'ru', { day: 'numeric', month: 'short', year: 'numeric' } ).slice( 0, -2 );
        const timeFormat = date.toLocaleTimeString( 'ru', { hour: 'numeric', minute: 'numeric' } );
        result += `${ dateFormat } в ${ timeFormat }`;
    }

    return result;
}

/**
 * Преобразует номер телефона в формат 8 (000) 000-00-00
 *
 * @param {String} phone
 *
 * @returns {String}
 */
export function formatPhone( phone ) {
    phone = ( phone.length === 11 ) ? phone.slice( 1 ) : phone;
    const matches = phone.match( /(\d{3})(\d{3})(\d{2})(\d{2})/ );

    return `8 (${ matches[1] }) ${ matches[2] }-${ matches[3] }-${ matches[4] }`;
}

/**
 * Преобразует файловый размер в удобный формат
 *
 * @param {Number} size
 * @param {Number} accuracy - кол-во знаков после запятой
 *
 * @returns {String}
 */
export function formatSize( size, accuracy = 2 ) {
    const types = [ 'б', 'Кб', 'Мб', 'Гб', 'Тб', 'Пб' ];
    let i = 0;

    while ( ( size / 1000 | 0 ) && i < ( types.length - 1 ) ) {
        size = size / 1024;
        i++;
    }

    return size.toFixed( accuracy ) + ' ' + types[i];
}

/**
 * Преобразует большие числа в формат с добавлинием тысячных в виде буквы "K"
 *
 * @param {Number} count
 *
 * @returns {String}
 */
export function formatBigCount( count ) {
    if ( !Math.floor( +count / 1000 ) ) {
        return `${ count }`;
    }

    const k = Math.ceil( count.toString().length / 3 ) - 1;
    const number = +( count / ( 1000 ** k ) ).toFixed( 1 );

    return `${ number }${ 'К'.repeat( k ) }`;
}

/**
 * Создает описание интерфейса.
 *
 * Каждое свойство представляет собой объект со следующими возможными свойствами:
 *      type - тип свойства. Может бытб функцией-конструктором, в случае примитивных значений,
 *             или кастомным интерфейсом, созданным данной функцией.
 *      required - обязательность свойства. Может быть значением типа Boolean или
 *                 callback-функцией, принимающей единственный параметр - проверяемый объект,
 *                 и возвращающей значение типа Boolean. Если проверяемое свойство необязательно,
 *                 указывать данный параметр необязательно.
 *      default - значение по умолчанию. Принимается во внимание, если свойство является не
 *                обязательным. В противном случае, свойство необязательно.
 *      arrayOf - тип элементов массива. Если свойство type указано как Array, то в данном свойстве
 *                необходимо указать требуемый тип элементов массива. В противном случае, свойство
 *                необязательно.
 *
 * @param {String} name - имя интерфейса, которое будет указано в сообщение об ошибке.
 *                        Данное свойство не будет участвовать в переборе свойств объекта.
 * @param {Object} props - объект со свойствами, составляющими интерфейс.
 *
 * @returns {Object} - возвращает запечатанный объект, в котором разрешено только чтение свойств.
 */
export function createObjectInterface( name, props ) {
    return Object.freeze( Object.defineProperty( props, 'intName', {
        value: name,
    } ) );
}

/**
 * Создает описание интерфейса на основе переданного, выбирая только указанные поля.
 */
export function pickObjectInterface( object, keys = [], name = null ) {
    const intName = name || ( object.intName + 'Omitted' );
    const props = {};

    Object.keys( object ).forEach( key => {
        if ( keys.includes( key ) ) {
            props[key] = object[key];
        }
    } );

    return createObjectInterface( intName, props );
}

/**
 * Создает описание интерфейса на основе переданного, исключая указанные поля.
 */
export function omitObjectInterface( object, keys = [], name = null ) {
    const intName = name || ( object.intName + 'Omitted' );
    const props = {};

    Object.keys( object ).forEach( key => {
        if ( !keys.includes( key ) ) {
            props[key] = object[key];
        }
    } );

    return createObjectInterface( intName, props );
}

/**
 * Очищает текст от спец. символов
 *
 * Внутри использует функцию объекта DOM, поэтому данный метод подходит
 * только для клиентской части.
 *
 * @param {String} text
 *
 * @returns {string}
 */
export function stripHtmlTags( text ) {
    const document = new DOMParser().parseFromString( text, 'text/html' );
    return document.body.textContent || '';
}

/**
 * Кодирует объект с данными в GET-параметры
 *
 * @param {Object} data
 *
 * @returns {string}
 */
export function encodeToUriParams( data ) {
    let params = '';

    for ( const [ key, value ] of Object.entries( data ) ) {
        params += ( params === '' ) ? '?' : '&';
        params += key + '=' + encodeURIComponent( value );
    }

    return params;
}

/**
 * Преобразует объект любой сложности в одномерный массив
 *
 * @param object
 *
 * @returns {Array}
 */
export function transformObjectToPlainArray( object ) {
    const result = [];

    for ( const value of Object.values( object ) ) {
        if ( Array.isArray( value ) ) {
            result.push( ...value );
        } else {
            result.push( ...transformObjectToPlainArray( value ) );
        }
    }

    return result;
}

export default {
    pickNumeralEnding,
    formatLocaleDate,
    formatDateLastOnline,
    formatPhone,
    formatSize,
    formatBigCount,
    createObjectInterface,
    stripHtmlTags,
    encodeToUriParams,
};