import { checkType }   from '~/lib/classes/validation';
import { IntLocation } from '~/lib/types/other';

export const state = () => ( {
    points: undefined,
    homePoints: undefined,
} );

export const getters = {
    locationPoints: state => state.points,
    homeLocationPoints: state => state.homePoints,
};

export const mutations = {
    /**
     * @throws ValidationError
     */
    setLocationPoints( state, points ) {
        state.points = checkType( points, Array, { arrayOf: IntLocation } );
    },
    setHomeLocationPoints( state, homePoints ) {
        state.homePoints = checkType( homePoints, Array, { arrayOf: IntLocation } );
    },
};

export const actions = {
    getLocationPoints( { state, commit, dispatch }, url ) {
        if ( url === '/api/homeLocations/' ) {
            if ( state.homePoints !== undefined ) {
                return Promise.resolve( state.homePoints );
            }
        } else if ( state.points !== undefined ) {
            return Promise.resolve( state.points );
        }

        return dispatch( 'api/apiGet', { url, useLoading: false }, { root: true } )
            .then( points => {
                if ( url === '/api/homeLocations/' ) {
                    commit( 'setHomeLocationPoints', points );
                } else {
                    commit( 'setLocationPoints', points );
                }
                return points;
            } );
    },
    filterLocations( { commit, dispatch }, { url, filter = {} } = {} ) {
        return dispatch( 'api/apiPost', { url, data: { searchLocations: true, filter } }, { root: true } )
            .then( arLocationId => {
                return checkType( arLocationId, Array, { arrayOf: Number } );
            } )
            .catch( e => {
                console.log( e.message );
                commit( 'ui/showAppDialog', 'error', { root: true } );
            } );
    },
};
