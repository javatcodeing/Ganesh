import { Fragment } from '@servicenow/ui-renderer-snabbdom';
import '@servicenow/now-label-value';
import { NO_MATCHES_FOUND, NO_MATCHES_FOUND_MESSAGE, SET_TEMPLATE, KB_TABLES_SEARCH_CONFIG,OPEN_FULL_VIEW } from '../constants';
import '@servicenow/now-rich-text';

/**
 * Styles object containing CSS properties for various elements.
 */
const Styles = {
    article: {
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        margin: '8px 0',
        padding: '10px',
        backgroundColor: '#d4e9e2',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        width: '100%',
        boxSizing: 'border-box',
        fontFamily: "'Arial', sans-serif",
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: "'Arial', sans-serif",
        alignItems: 'center',
    },
    leftContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    span: {
        color: '#757575',
        fontFamily: "'Arial', sans-serif",
        fontWeight: '500',
    },
    actionContainer: {
        display: 'flex',
        gap: '8px',
    },
    nowHeading: {
        margin: '0px',
        padding: '0px',
        fontFamily: "'Arial', sans-serif",
        marginTop: '8px',  
    },
    summary: {
        whiteSpace: 'normal',
        marginTop: '3px',
        color: '#616161',
        fontFamily: "'Arial', sans-serif",
        fontSize: '14px',
    },
    noResultMessage: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', 
        marginTop: '20px',
        padding: '20px',
        textAlign: 'left', 
    },
    responsive: `@media (max-width: 768px) {
        .article {
            padding: 12px;
            margin: 6px 0;
        }
        .summary {
            font-size: 13px;
        }
    }`
};

/**
 * Trims and sanitizes an article body.
 * @param {string} articleBody - The article body as a string.
 * @returns {string|null} - A sanitized and trimmed version of the article body or null if input is empty.
 */
const trimArticleBody = (articleBody) => {
    if (articleBody) {
        return articleBody
            .replace(/<([^>]+)>/g, '')
            .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
            .substring(0, 150)
            .trim();
    }
    return null;
};

/**
 * Retrieves the summary field value from a given item.
 * @param {Object} item - The item object containing sys_class_name.
 * @returns {string} - The summary field value or an empty string if not found.
 */
const getSummaryField = (item) => {
    const obj = KB_TABLES_SEARCH_CONFIG.find(
        (config) => config.tableName === item.sys_class_name
    );
    if (!obj) return "";
    const primaryField = obj.summaryFields?.PRIMARY?.field;
    const secondaryField = obj.summaryFields?.SECONDARY?.field;
    if (!primaryField || !secondaryField) return "";
    return item[primaryField] || item[secondaryField] || "";
};

/**
 * Displays the summary for an item.
 * @param {Object|string} item - The item object or JSON string.
 * @returns {string} - The formatted summary text.
 */
function displaySummary(item) {
    const data = typeof item === "string" ? JSON.parse(item) : item;
    return trimArticleBody(getSummaryField(data));
}

/**
 * Handles opening an article.
 * @param {Object} openedArticle - The currently opened article.
 * @param {Object} item - The article item to open.
 * @param {Function} updateState - The state update function.
 * @param {boolean} fullView - Whether full view is enabled.
 */
function handleOpenArticle(openedArticle, item, updateState, fullView) {
    updateState({ fullView: true });
    updateState({ openedArticle: item });
}

/**
 * Handles applying a template.
 * @param {Function} dispatch - The dispatch function.
 * @param {string} templateLink - The template link URL.
 */
function handleApplyTemplate(dispatch, item) {
    const sysId = item.u_template.link.split("/").pop();
    dispatch(SET_TEMPLATE, { templateId: sysId , table: item.sys_class_name});
}

function handelOpenFullView(dispatch, item){

    dispatch(OPEN_FULL_VIEW, { articleId: item.sys_id, table: item.sys_class_name });
}

/**
 * Renders the search response.
 * @param {Array} result - The search result array.
 * @param {boolean} fullView - Whether full view is enabled.
 * @param {Function} dispatch - The dispatch function.
 * @param {Object} openedArticle - The currently opened article.
 * @param {Function} updateState - The state update function.
 * @returns {JSX.Element} - The rendered search response.
 */
export const renderSearchResponse = (result, fullView, dispatch, openedArticle, updateState) => (
    <Fragment>
        <style>{Styles.responsive}</style>
        {result.length ? (
            result.map((item) => (
                <div style={Styles.article} on-click={() =>
                    handleOpenArticle(openedArticle, item, updateState, fullView)}>
                    <header style={Styles.header}>
                        <div style={Styles.leftContainer}>
                            <now-icon icon="document-outline" size="lg" />
                            <span style={Styles.span}>Article</span>
                        </div>
                        <div style={Styles.actionContainer}>
                            {item.u_template ? (
                                <now-button
                                    label="Apply Template"
                                    variant="secondary"
                                    size="sm"
                                    on-click={(event) => {
                                        event.stopPropagation();
                                        handleApplyTemplate(dispatch, item);
                                    }}
                                />  
                            ) : ""}
                               <now-button
                                    label="Full View"
                                    variant="secondary"
                                    size="sm"
                                    on-click={(event) => {
                                        event.stopPropagation();
                                        handelOpenFullView(dispatch, item);
                                    }}
                                />
                        </div>
                    </header>
                    <now-heading label={item.short_description} variant="title-secondary" style={Styles.nowHeading} />
                    <summary style={Styles.summary}>{`${displaySummary(item)}...`}</summary>
                </div>
            ))
        ) : (
            <div style={Styles.noResultMessage}>
                <span className="no-response-found">
                    <now-heading label={NO_MATCHES_FOUND} variant="title-tertiary" />
                    <now-label-value-inline label={NO_MATCHES_FOUND_MESSAGE} />
                </span>
            </div>
        )}
    </Fragment>
);