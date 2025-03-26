/**
 * ServiceNow UI Core Action Handlers for Knowledge Base Search
 * Handles search operations with contextual search and recursive querying.
 */
import { actionTypes } from '@servicenow/ui-core';
import { createHttpEffect } from '@servicenow/ui-effect-http';
import {
    KB_KNOWLEDGE_FETCH_REQUESTED,
    KB_KNOWLEDGE_FETCH_STARTED,
    KB_KNOWLEDGE_FETCH_SUCCESS,
    KB_KNOWLEDGE_FETCH_FAILED,
    SEARCH_REQUESTED,
    NUMBER_OF_RECORDS_FETCH,
    SET_TEMPLATE,
    OPEN_FULL_VIEW,
    GET_CONTEXTUAL_SEARCH_RESULTS,
    SET_SEARCH_RESULT,
    SEARCH_CONTEXT_USED,
    SEARCH_TABLES,
    KB_KNOWLEDGE_REST_URL,
    SEARCH_API
} from '../constants';

const ERROR_PREFIX = "[ServiceNow KB Search Error]";
let accumulatedResults=[];
/**
 * Triggers a search when user input changes.
 * @param {Object} fields - The input fields containing search criteria.
 * @param {Function} dispatch - Dispatch function for triggering actions.
 * @param {Function} updateState - Function to update the component state.
 */
const triggerSearch = (fields, { dispatch, updateState }) => {
    try {
        const searchString = fields?.short_description?.value?.trim() || '';
        updateState({ searchString });
        searchString ? dispatch(SEARCH_REQUESTED, { searchString }) : updateState({ result: [] });
    } catch (error) {
        console.error(`${ERROR_PREFIX} Error in triggerSearch:`, error);
    }
};

export default {
    /**
     * Handles component initialization.
     */
    [actionTypes.COMPONENT_CONNECTED]: ({ dispatch, properties: { fields }, updateState }) => {
        try {
            fields && triggerSearch(fields, { dispatch, updateState });
        } catch (error) {
            console.error(`${ERROR_PREFIX} Error in COMPONENT_CONNECTED:`, error);
        }
    },

    /**
     * Handles property changes and triggers search accordingly.
     */
    [actionTypes.COMPONENT_PROPERTY_CHANGED]: ({ dispatch, updateState, properties: { fields } }) => {
        triggerSearch(fields, { dispatch, updateState });
    },

    /**
     * Initiates search based on user input.
     */
    [SEARCH_REQUESTED]: ({ dispatch, action }) => {
        try {
            const searchString = action.payload.searchString.trim().toLowerCase();
            if (!searchString) return;
            //Make the accumulated results empty before search is requested
            accumulatedResults=[];
            dispatch(GET_CONTEXTUAL_SEARCH_RESULTS, {
                cx: SEARCH_CONTEXT_USED,
                num: NUMBER_OF_RECORDS_FETCH,
                q: searchString,
                sysparm_display_value: true,
            });
        } catch (error) {
            console.error(`${ERROR_PREFIX} Error in SEARCH_REQUESTED:`, error);
        }
    },

    /**
     * Fetches contextual search results from API.
     */
    GET_CONTEXTUAL_SEARCH_RESULTS: createHttpEffect(SEARCH_API, {
        queryParams: ['cx', 'num', 'q'],
        startActionType: KB_KNOWLEDGE_FETCH_STARTED,
        successActionType: KB_KNOWLEDGE_FETCH_SUCCESS,
        errorActionType: KB_KNOWLEDGE_FETCH_FAILED
    }),

    /**
     * Requests additional knowledge base data.
     */
    [KB_KNOWLEDGE_FETCH_REQUESTED]: createHttpEffect(KB_KNOWLEDGE_REST_URL, {
        pathParams: ['table'],
        queryParams: ['sysparm_query', 'sysparm_limit', 'sysparm_display_value'],
        startActionType: KB_KNOWLEDGE_FETCH_STARTED,
        successActionType: SET_SEARCH_RESULT,
        errorActionType: KB_KNOWLEDGE_FETCH_FAILED
    }),

    /**
     * Handles the start of a knowledge base fetch operation.
     */
    [KB_KNOWLEDGE_FETCH_STARTED]: ({ updateState }) => updateState({ isLoading: true }),

    /**
     * Processes successful search results.
     */
    [KB_KNOWLEDGE_FETCH_SUCCESS]: ({ action, dispatch,updateState }) => {
        try {
            const articleIDs = (action.payload.result?.results || []).map(article => article.id.split(":")[1]);

            console.log("articleIDs: "+articleIDs);
            if (!articleIDs.length)
                  updateState({ isLoading: false, result: [] });;
            
            const sysparm_query = `sys_idIN${articleIDs.join(',')}`;
            SEARCH_TABLES.forEach(table => dispatch(KB_KNOWLEDGE_FETCH_REQUESTED, {
                table,
                sysparm_query,
                sysparm_display_value: true,
                sysparm_limit: NUMBER_OF_RECORDS_FETCH
            }));
        } catch (error) {
            console.error(`${ERROR_PREFIX} Error in KB_KNOWLEDGE_FETCH_SUCCESS:`, error);
        }
    },

    /**
     * Updates state with new search results.
     */
    SET_SEARCH_RESULT: ({ action, updateState }) => {
        const newResults = action.payload.result || [];
        const existingIds = accumulatedResults.map(item => item.sys_id);
        const filteredResults = newResults.filter(item => !existingIds.includes(item.sys_id));
        accumulatedResults = [...accumulatedResults, ...filteredResults];
        updateState({ isLoading: false, result: accumulatedResults });
    },

    /**
     * Handles search failures.
     */
    [KB_KNOWLEDGE_FETCH_FAILED]: ({ action, updateState }) => {
        console.error(`${ERROR_PREFIX} [KB_KNOWLEDGE_FETCH_FAILED] ${action.payload.statusText}: ${action.payload.data?.error?.message || "Unknown error"}`);
        updateState({ isLoading: false, result: [] });
    },

    /**
     * Logs template application.
     */
    [SET_TEMPLATE]: ({ action }) => {
        try {
            console.log("Template Applied:", action.payload);
        } catch (error) {
            console.error(`${ERROR_PREFIX} Error in SET_TEMPLATE:`, error);
        }
    },

    /**
     * Logs article opening action.
     */
    [OPEN_FULL_VIEW]: ({ action }) => {
        try {
            console.log("Open Article:", action.payload);
        } catch (error) {
            console.error(`${ERROR_PREFIX} Error in OPEN_FULL_VIEW:`, error);
        }
    },
};
