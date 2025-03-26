import { actionTypes } from '@servicenow/ui-core';
import { createHttpEffect } from '@servicenow/ui-effect-http';
import {
    KB_KNOWLEDGE_REST_URL,
    KB_KNOWLEDGE_FETCH_REQUESTED,
    KB_KNOWLEDGE_FETCH_STARTED,
    KB_KNOWLEDGE_FETCH_SUCCESS,
    KB_KNOWLEDGE_FETCH_FAILED,
    SEARCH_REQUESTED,
    KB_KNOWLEDGE_TABLE,
    NUMBER_OF_RECORDS_FETCH,
    GET_STOP_WORDS,
    STOP_WORD_ENDPOINT,
    SET_STOP_WORD_PROPERTY,

    SET_TEMPLATE,
} from '../constants';

const triggerSearch = (fields, { dispatch, updateState }) => {
    const searchString = fields?.short_description?.value?.trim() || '';

    if (searchString) {
        dispatch(SEARCH_REQUESTED, { searchString });
    } else {
        updateState({ searchString, result: [] });
    }
};

export default {
    [actionTypes.COMPONENT_BOOTSTRAPPED]: ({ dispatch, properties: { fields } }) => {
        triggerSearch(fields, { dispatch });
        dispatch(GET_STOP_WORDS); 
    },

    [actionTypes.COMPONENT_PROPERTY_CHANGED]: ({ dispatch, action }) => {
        triggerSearch(action.payload.value, { dispatch });
    },

    [SEARCH_REQUESTED]: ({ dispatch, updateState, action, state }) => {
        const searchString = action.payload.searchString.trim().toLowerCase();
        const stopWords = state?.stopWords || []; 
        const words = searchString.split(/\s+/).filter(word => word.length > 3 && !stopWords.includes(word));

        let queryParts = [
            `short_descriptionLIKE${searchString}`,
            `metaLIKE${searchString}`
        ];

        if (words.length) {
            const keywordQueries = words.map(keyword => `short_descriptionLIKE${keyword}^ORmetaLIKE${keyword}`);
            queryParts.push(...keywordQueries);
        }

        const sysparm_query = queryParts.join('^OR');

        updateState({ searchString });
        dispatch(KB_KNOWLEDGE_FETCH_REQUESTED, {
            table: KB_KNOWLEDGE_TABLE,
            sysparm_query,
            sysparm_display_value: true,
            sysparm_limit: NUMBER_OF_RECORDS_FETCH
        });
    },

    [KB_KNOWLEDGE_FETCH_REQUESTED]: createHttpEffect(KB_KNOWLEDGE_REST_URL, {
        pathParams: ['table'],
        queryParams: ['sysparm_query', 'sysparm_limit', 'sysparm_display_value'],
        startActionType: KB_KNOWLEDGE_FETCH_STARTED,
        successActionType: KB_KNOWLEDGE_FETCH_SUCCESS,
        errorActionType: KB_KNOWLEDGE_FETCH_FAILED
    }),

    [KB_KNOWLEDGE_FETCH_STARTED]: ({ updateState }) => {
        updateState({ isLoading: true });
    },

    [KB_KNOWLEDGE_FETCH_SUCCESS]: ({ action, updateState }) => {
        updateState({
            isLoading: false,
            result: action.payload.result || []
        });
    },

    [KB_KNOWLEDGE_FETCH_FAILED]: ({ action, updateState }) => {
        console.error(`[KB_KNOWLEDGE_FETCH_FAILED] ${action.payload.statusText}: ${action.payload.data.error.message}`);
        updateState({ isLoading: false, result: [] });
    },

    // [GET_TEMPLATE]: createHttpEffect('/api/now/table/:table', {
    //     pathParams: ['table'],
    //     queryParams: ['sysparm_query'],
    //     successActionType: APPLY_TEMPLATE
    // }),

    // [APPLY_TEMPLATE]: ({ action, dispatch }) => {
    //     const sysId = action.payload.result?.[0]?.sys_id;
    //     if (sysId) {
    //         dispatch(SET_TEMPLATE, { templateId: sysId });
    //     }
    // },

    [SET_TEMPLATE]: ({ action }) => {
        console.log("Template Applied:", action.payload);
    },

    [GET_STOP_WORDS]: createHttpEffect(STOP_WORD_ENDPOINT, {
        queryParams: { sysparm_query: 'active=true' },
        successActionType: SET_STOP_WORD_PROPERTY
    }),

    [SET_STOP_WORD_PROPERTY]: ({ action, updateState }) => {
        const stopWords = action.payload.result.map(item => item.word);
        updateState({ stopWords });
    }
};
