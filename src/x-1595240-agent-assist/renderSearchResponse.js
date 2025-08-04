import { Fragment } from '@servicenow/ui-renderer-snabbdom';
import '@servicenow/now-label-value';
import '@servicenow/now-rich-text';
// import '@servicenow/now-card';
import '@servicenow/now-button';
import '@servicenow/now-heading';
import '@servicenow/now-icon';
import '@servicenow/now-rich-text';
import { SET_TEMPLATE, DISPLAY_FIELDS, THEME_COLORS } from '../constants';

/**
 * Get theme-aware styles for search response rendering
 * @param {boolean} darkMode - Whether dark mode is enabled
 * @returns {Object} Theme-specific styles
 */
const getSearchResponseStyles = (darkMode = false) => {
    const theme = darkMode ? THEME_COLORS.dark : THEME_COLORS.light;
    
    return {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: "'Arial', sans-serif",
    },
    leftContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    span: {
        color: theme.textPrimary,
        fontWeight: '400',
    },
    actionContainer: {
        display: 'flex',
        gap: '4px',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    nowHeading: {
        margin: '8px 0 0 0',
        padding: '0px',
        fontFamily: "'Arial', sans-serif",
    },
    summary: {
        whiteSpace: 'normal',
        marginTop: '3px',
        color: theme.textMuted,
        fontSize: '15px',
        flexGrow: 1,  
    },
    footer: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: '10px',
        fontSize: '14px',
        fontWeight: '500',
        color: theme.textPrimary,
    },
    noResultMessage: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: "center",
        marginTop: '20px',
        padding: '20px',
        textAlign: 'center',
    },
    contcontainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '12px',
        width: '100%',
        padding: '4px',
        boxSizing: 'border-box',
    },
    article: {
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '4px',
        border: `1px solid ${theme.borderLight}`,
        padding: '8px',
        backgroundColor: theme.cardBg,
        boxShadow: `0px 1px 3px ${theme.shadow}`,
        cursor: 'pointer',
        boxSizing: 'border-box',
        minWidth: '250px',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        height: '100%',
        '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: `0px 2px 6px ${theme.shadow}`,
        }
    },
    responsive: `
        @media (max-width: 1200px) {
            .contcontainer {
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 8px;
            }
        }
        @media (max-width: 768px) {
            .contcontainer {
                grid-template-columns: 1fr;
                gap: 6px;
            }
            .article {
                min-width: unset;
            }
        }
        @media (max-width: 480px) {
            .contcontainer {
                padding: 2px;
            }
        }
    `,
    };
};

function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    };

    for (let [unit, value] of Object.entries(intervals)) {
        const count = Math.floor(seconds / value);
        if (count >= 1) {
            return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(-count, unit);
        }
    }
    return "Just now";
}

/**
 * Trims and sanitizes an article body.
 * @param {string} articleBody - The article body as a string.
 * @returns {string|null} - A sanitized and trimmed version of the article body or null if input is empty.
 */
const trimArticleBody = (articleBody) => {
    if (!articleBody) return null;
    
        return articleBody
            .replace(/<\/?[^>]+(>|$)/g, '') // Removes only valid HTML tags
            .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec)) // Decodes HTML entities
            .replace(/={3,}/g, '') // Removes sequences of 3 or more '='
            .substring(0, 150)
            .trim();
    };


/**
 * Retrieves and trims the first available summary field from DISPLAY_FIELDS.
 * @param {Object} item - The item object containing the field values.
 * @returns {string} - The trimmed summary field value or an empty string if not found.
 */
const getSummaryField = (item) => {
    for (const field of DISPLAY_FIELDS) {
        const value = item[field.field];
        if (value) return trimArticleBody(value);
    }
    return "";
};

/**
 * Displays the summary for an item.
 * @param {Object|string} item - The item object or JSON string.
 * @returns {string} - The formatted summary text.
 */
function displaySummary(item) {
    const data = typeof item === "string" ? JSON.parse(item) : item;
    return getSummaryField(data);
}


export const renderSearchResponse = (result, fullView, dispatch, openedArticle, updateState, darkMode = false) => {
    const Styles = getSearchResponseStyles(darkMode);
    
    return (
        <Fragment>
            <div style={Styles.contcontainer}>
                <style>{Styles.responsive}</style>
            {result.length ? (
                result.map((item) => (
                    <div className="article" 
                         style={Styles.article} 
                         on-click={() => updateState({ fullView: true, openedArticle: item })}>
                        <header style={Styles.header}>
                            <div style={Styles.leftContainer}>
                                <now-icon icon="document-outline" size="lg" />
                                {item.meta.number && <span style={Styles.span}>{item.meta.number}</span>}
                            </div>
                            <div style={Styles.actionContainer}>
                               {item.u_template && (
                                    <now-button
                                        label="Apply Template"
                                        variant="secondary"
                                        size="sm"
                                        on-click={(event) => {
                                            event.stopPropagation();
                                            dispatch(SET_TEMPLATE, { templateId: item.u_template.link.split("/").pop(), table: item.sys_class_name, kbNumber:item.number });
                                        }}
                                    />
                                )}
                            </div>
                        </header>

                      {item.title && <now-heading label={item.title} variant="title-secondary" style={Styles.nowHeading} />}  
                      {item.snippet && <summary style={Styles.summary}>{`${displaySummary(item)}...` || ""}</summary>}
                      {/* {item.snippet &&  <now-rich-text html={`${displaySummary(item)}...` || ""} />} */}

                      {/* Footer Section - Always at the bottom */}
                      <div style={Styles.footer}>
                          <span>Updated: {timeAgo(item.meta.modified_display)} </span>
                          <span style={{ margin: '0 8px' }}>|</span>
                          <span> Views: {item.meta.viewCount}</span>
                      </div>
                  
                    </div>
                ))
            ) : (
                <div style={Styles.noResultMessage}>
                    <now-icon icon="magnifying-glass-fill" size="xl" />
                    <now-heading label="No Matches Found" variant="title-tertiary" />
                    <now-label-value-inline label="Try adjusting your search criteria." />
                </div>
            )}
        </div>
    </Fragment>
    );
};
