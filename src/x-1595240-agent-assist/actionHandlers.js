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
    SEARCH_API,
    ERROR_PREFIX
} from '../constants';

let contextualResultsStore = []; // Stores contextual search results
let tableResultsStore = []; // Stores knowledge table API results
let completedTableCalls = 0; // Track number of completed API calls

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
            if (fields) triggerSearch(fields, { dispatch, updateState });
        } catch (error) {
            console.error(`${ERROR_PREFIX} Error in COMPONENT_CONNECTED:`, error);
        }
    },

    /**
     * Handles property changes and triggers search accordingly.
     */
    [actionTypes.COMPONENT_PROPERTY_CHANGED]: ({ action, dispatch, updateState, properties: { fields } }) => {
        const prevVal = action.payload.previousValue?.short_description?.value;
        const currentVal = action.payload.value?.short_description?.value;
        if (prevVal !== currentVal) triggerSearch(fields, { dispatch, updateState });
    },

    /**
     * Initiates search based on user input.
     */
    [SEARCH_REQUESTED]: ({ dispatch, action }) => {
        try {
            const searchString = action.payload.searchString.trim().toLowerCase();
            if (!searchString) return;
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
     * Processes successful contextual search results.
     */
    [KB_KNOWLEDGE_FETCH_SUCCESS]: ({ action, dispatch, updateState }) => {
        try {
            contextualResultsStore = (action.payload.result?.results || []).map(article => ({
                sys_id: article.id.split(":")[1],
                title: article.title,
                snippet: article.snippet,
                score: article.score,
                ...article
            }));

            if (!contextualResultsStore.length) {
                updateState({ isLoading: false, result: [] });
                return;
            }

            const sysparm_query = `sys_idIN${contextualResultsStore.map(item => item.sys_id).join(',')}`;
            SEARCH_TABLES.forEach(table =>{
                dispatch(KB_KNOWLEDGE_FETCH_REQUESTED, {
                table,
                sysparm_query,
                sysparm_limit: NUMBER_OF_RECORDS_FETCH
            })
        });
        } catch (error) {
            console.error(`${ERROR_PREFIX} Error in KB_KNOWLEDGE_FETCH_SUCCESS:`, error);
        }
    },

    /**
     * Stores and merges search results from the knowledge table API.
     */
    [SET_SEARCH_RESULT]: ({ action, updateState }) => {
        const newResults = action.payload.result || [];
        const existingIds = tableResultsStore.map(item => item.sys_id);
        const filteredResults = newResults.filter(item => !existingIds.includes(item.sys_id));
        tableResultsStore = [...tableResultsStore, ...filteredResults];
        completedTableCalls++;

        if (completedTableCalls < SEARCH_TABLES.length) return;

        const mergedResults = contextualResultsStore.map(searchItem => {
            const tableData = tableResultsStore.find(item => String(item.sys_id).trim() === String(searchItem.sys_id).trim());
            return { ...searchItem, ...tableData, meta: { ...searchItem.meta, ...tableData.meta } };
        });

        contextualResultsStore = [];
        tableResultsStore = [];
        completedTableCalls = 0;
        updateState({ isLoading: false, result: mergedResults });
    },

    /**
     * Handles search failures.
     */
    [KB_KNOWLEDGE_FETCH_FAILED]: ({ action, updateState }) => {
        console.error(`${ERROR_PREFIX} [KB_KNOWLEDGE_FETCH_FAILED] ${action.payload.statusText}: ${action.payload.data?.error?.message || "Unknown error"}`);
        updateState({ isLoading: false, result: [] });
    },
    /**
 * Handles search failures.
 * Logs the error for missing tables or invalid tables but continues the process.
 */
// [KB_KNOWLEDGE_FETCH_FAILED]: ({ action, updateState }) => {
//     const errorMessage = action.payload.data?.error?.message || "Unknown error";
//     const statusText = action.payload.statusText;

//     console.error(`${ERROR_PREFIX} [KB_KNOWLEDGE_FETCH_FAILED] ${statusText}: ${errorMessage}`);

//     // If the error is due to an invalid table, log a warning and skip that table
//     if (statusText === "Bad Request" && errorMessage.includes("Invalid table")) {
//         console.warn(`Skipping invalid table: ${action.payload.config?.url}`);
//     }

//     completedTableCalls++; // Increment the call count to ensure merging happens
//     if (completedTableCalls >= SEARCH_TABLES.length) {
//         // Proceed with the results we have, even if some tables failed
//         updateState({ isLoading: false, result: tableResultsStore });
//     }
// },

    /**
     * Logs template application.
     */
    [SET_TEMPLATE]: ({ action }) => {
       // console.log("Template Applied:", action.payload);
    },

    /**
     * Logs article opening action.
     */
    [OPEN_FULL_VIEW]: ({ action }) => {
       // console.log("Open Article:", action.payload);
    },
};