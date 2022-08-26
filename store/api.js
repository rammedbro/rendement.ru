import {
    NO_ERROR,
    SYSTEM_ERROR,
    USER_ERROR,
}                            from '~/lib/constants/error';
import {
    UserError,
    SystemError,
    RequestError,
}
                             from '~/lib/classes/error';
import {
    checkNotEmpty,
    checkType,
    checkObjectInterface,
}                            from '~/lib/classes/validation';
import { encodeToUriParams } from '~/lib/classes/utility';
import {
    IntApiResponse,
    IntSSEResponse,
    IntWebsocketResponse,
}                            from '~/lib/types/request';

export const state = () => ( {
    key: undefined,
    loading: false,
} );

export const getters = {
    apiKey: state => state.key,
    apiLoading: state => state.loading,
};

export const mutations = {
    /**
     * @throws ValidationError
     */
    setApiKey( state, payload ) {
        state.key = checkType( payload, String );
    },
    setApiLoading( state, value ) {
        state.loading = value;
    },
};

export const actions = {
    /**
     * Отправка GET запроса.
     **/
    apiGet( { dispatch }, {
        url,
        headers = {},
        data = {},
        passApiKey = false,
        useLoading = true,
        cancelToken,
    } ) {
        return dispatch( 'apiCall', {
            url, method: 'GET', params: data, headers, passApiKey, useLoading, cancelToken,
        } );
    },
    /**
     * Отправка POST запроса.
     */
    apiPost( { dispatch }, {
        url,
        headers = {},
        data = {},
        passApiKey = false,
        useLoading = true,
        cancelToken,
    } ) {
        return dispatch( 'apiCall', {
            url, method: 'POST', headers, data, passApiKey, useLoading, cancelToken,
        } );
    },
    /**
     * Отправка формы.
     *
     * Кодирует данные, переданные в виде объекта, в FormData.
     * Данные должны быть примитивного типа, массивами или простыми объектами.
     */
    apiSendForm( { dispatch }, {
        url,
        headers = {},
        data = {},
        files = {},
        passApiKey = false,
        useLoading = true,
        cancelToken,
    } ) {
        const formData = new FormData();

        for ( const [ key, value ] of Object.entries( data ) ) {
            if ( !checkNotEmpty( value ) ) {
                formData.set( key, '' );
            } else if ( checkType( value, [ Array, Object ], { throwError: false } ) ) {
                formData.set( key, JSON.stringify( value ) );
            } else {
                formData.set( key, value.toString() );
            }
        }

        for ( const [ key, array ] of Object.entries( files ) ) {
            array.forEach( ( item, index ) => {
                formData.append( `${ key }[${ index }]`, item );
            } );
        }

        return dispatch( 'apiCall', {
            url, method: 'POST', headers, data: formData, passApiKey, useLoading, cancelToken,
        } );
    },
    /**
     * Установка соединения с сервером по спецификации Server Sent Events (SSE)
     *
     * Кодирует данные, переданные в виде объекта, в GET-параметры.
     * Данные должны быть примитивного типа.
     *
     * @param {Object} store - хранилище Vuex
     * @param {String} url - адрес запроса
     * @param {Object} data - параметры GET-запроса
     * @param {Function} successCallback - callback-функция, которая будет вызвана при событии onmessage
     *
     * @returns {Promise} - возвращает промис, который завершится в случае окончательного закрытия соединения
     */
    apiSSE( store, {
        url,
        data = {},
        onMessageCallback,
    } ) {
        const params = encodeToUriParams( data );

        return new Promise( ( resolve, reject ) => {
            const eventSource = new EventSource( url + params );

            window.onbeforeunload = function( event ) {
                eventSource.close();
            };

            eventSource.addEventListener( 'message', event => {
                try {
                    const data = JSON.parse( event.data );
                    const { errorCode, errorMessage, result } = checkObjectInterface( data, IntApiResponse );

                    switch ( errorCode ) {
                        case NO_ERROR:
                            const { type, data: message } = checkObjectInterface( result, IntSSEResponse );

                            if ( type === 'message' ) {
                                onMessageCallback( message );
                            }

                            break;
                        case USER_ERROR:
                            throw new UserError( errorMessage );
                        case SYSTEM_ERROR:
                            throw new SystemError( errorMessage );
                        default:
                            throw new RequestError( `Неизвестный код ошибки - ${ errorCode }` );
                    }
                } catch ( e ) {
                    eventSource.close();
                    reject( e );
                }
            } );

            eventSource.addEventListener( 'error', event => {
                if ( eventSource.readyState === EventSource.CONNECTING ) return;
                reject( new RequestError( `Ошибка соединения` ) );
            } );

            eventSource.addEventListener( 'close', event => {
                resolve();
            } );
        } );
    },
    /**
     * Установка соединения с сервером по спецификации WebSocket
     *
     * Кодирует данные, переданные в виде объекта, в GET-параметры.
     * Данные должны быть примитивного типа.
     *
     * @param {Object} store - хранилище Vuex
     * @param {String} url - адрес запроса
     * @param {Object} data - параметры GET-запроса
     * @param {Function} onMessageCallback - callback-функция, которая будет вызвана при событии onmessage
     *
     * @returns {Object} - возвращает объект с ключами:
     *                          * webSocket - объект соединения
     *                          * listener - промис-обёртка над событиями webSocket
     */
    apiWebSocket( store, {
        url,
        data = {},
        onMessageCallback,
    } ) {
        const host = this.$axios.defaults.baseURL.replace( 'http', 'ws' );
        const params = encodeToUriParams( data );
        const webSocket = new WebSocket( host + url + params );
        const listener = new Promise( ( resolve, reject ) => {
            window.onbeforeunload = function( event ) {
                webSocket.close();
            };

            webSocket.addEventListener( 'open', event => {
                const userId = store.rootGetters['user/userId'];

                webSocket.send( JSON.stringify( {
                    type: 'auth',
                    data: userId,
                } ) );
            } );

            webSocket.addEventListener( 'message', event => {
                try {
                    const data = JSON.parse( event.data );
                    const { errorCode, errorMessage, result } = checkObjectInterface( data, IntApiResponse );

                    switch ( errorCode ) {
                        case NO_ERROR:
                            onMessageCallback( checkObjectInterface( result, IntWebsocketResponse ) );
                            break;
                        case USER_ERROR:
                            throw new UserError( errorMessage );
                        case SYSTEM_ERROR:
                            throw new SystemError( errorMessage );
                        default:
                            throw new RequestError( `Неизвестный код ошибки - ${ errorCode }` );
                    }
                } catch ( e ) {
                    webSocket.close();
                    reject( e );
                }
            } );

            webSocket.addEventListener( 'error', event => {
                reject( new RequestError( 'Ошибка соединения' ) );
            } );

            webSocket.addEventListener( 'close', event => {
                reject( new RequestError( `Соединение закрыто: код - ${ event.code }, причина - ${ event.reason }` ) );
            } );
        } );

        return { webSocket, listener };
    },
    /**
     * Отправка запроса.
     *
     * Отправляет запрос и возвращает Promise, который завершится с объектом ответа
     * с ключами result, errorCode, errorMessage.
     * По умолчанию, использует переменную модуля {@link apiLoading} для индикации загрузки.
     *
     * @param {Function} getters - геттер свойств хранилища Vuex
     * @param {Function} commit - метод запуска синхронных действий Vuex
     * @param {Function} dispatch - метод запуска асинхронных действий Vuex
     * @param {String} url - адрес запроса
     * @param {String} method - метод запроса
     * @param {Object} headers - заголовки запроса
     * @param {Object} params - параметры GET-запроса
     * @param {Object} data - данные POST-запроса
     * @param {Boolean} passApiKey - передать api-ключ
     * @param {Boolean} useLoading - использовать индикатор загрузки модуля
     * @param {CancelToken} cancelToken - токен объекта создданного через axios API
     *                                    для ручного прерывания запроса
     *
     * @return {Promise}
     */
    apiCall( { getters, commit, dispatch }, {
        url,
        method = 'GET',
        headers = {},
        params,
        data,
        passApiKey = false,
        useLoading = true,
        cancelToken,
    } ) {
        if ( useLoading ) commit( 'setApiLoading', true );

        return new Promise( async( resolve, reject ) => {
            // Получение ключа пользователя
            if ( passApiKey ) {
                if ( getters.apiKey === undefined ) {
                    try {
                        await dispatch( 'user/getUser', { root: true } );
                    } catch ( e ) {
                        return reject( e );
                    }
                }

                Object.assign( headers, { 'x-pi-key': getters.apiKey } );
            }

            this.$axios( { url, method, headers, params, data, cancelToken } )
                .then( response => {
                    try {
                        const { status, data } = response;
                        const { errorCode, errorMessage, result } = checkObjectInterface( data, IntApiResponse );

                        switch ( errorCode ) {
                            case NO_ERROR:
                                resolve( result );
                                break;
                            case USER_ERROR:
                                reject( new UserError( errorMessage ) );
                                break;
                            case SYSTEM_ERROR:
                                reject( new SystemError( errorMessage ) );
                                break;
                            default:
                                reject( new RequestError( `Неизвестный код ошибки - ${ errorCode }`, status ) );
                                break;
                        }
                    } catch ( e ) {
                        reject( e );
                    }
                } )
                .catch( e => {
                    if ( this.$axios.isCancel( e ) ) return;

                    const data = e.response || e.request;

                    if ( data ) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        // or the request was made but no response was received
                        const { status, statusText } = data;
                        reject( new RequestError( statusText, status ) );
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        reject( e );
                    }
                } );
        } ).finally( () => {
            if ( useLoading ) commit( 'setApiLoading', false );
        } );
    },
};