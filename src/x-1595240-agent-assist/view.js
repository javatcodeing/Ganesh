import '@servicenow/now-icon';
import '@servicenow/now-loader';
import '@servicenow/now-heading';
import '@servicenow/now-button';
import '@servicenow/now-rich-text';
import { renderSearchResponse } from './renderSearchResponse';
import { SEARCH_REQUESTED , SET_TEMPLATE, OPEN_FULL_VIEW, DISPLAY_FIELDS, THEME_COLORS} from '../constants';

/**
 * Get theme-aware styles based on dark mode setting
 * @param {boolean} darkMode - Whether dark mode is enabled
 * @returns {Object} Theme-specific styles
 */
const getStyles = (darkMode = false) => {
    const theme = darkMode ? THEME_COLORS.dark : THEME_COLORS.light;
    
    return {
    container: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '200px',
        maxHeight: '80vh',
        padding: '0.75rem',
        backgroundColor: theme.containerBg,
        boxShadow: `0px 2px 4px ${theme.shadow}`,
        fontFamily: "Arial, sans-serif",
        overflow: 'auto',
        boxSizing: 'border-box',
        borderRadius: '4px',
    },
    header: {
        width: '100%',
        marginBottom: '0.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    searchWrapper: {
        position: 'relative',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
    },
    searchIcon: {
        position: 'absolute',
        left: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: theme.iconColor,
        cursor: 'pointer',
        zIndex: 1,
    },
    searchInput: {
        width: '100%',
        padding: '8px 12px 8px 36px',
        fontSize: '14px',
        border: `1px solid ${theme.border}`,
        borderRadius: '4px',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        color: theme.textPrimary,
        backgroundColor: theme.inputBg,
        boxShadow: `inset 0px 1px 2px ${theme.shadow}`,
        outline: 'none',
        boxSizing: 'border-box',
    },
    dropdownContainer: {
        position: 'absolute',
        top: '100%',
        left: '0',
        backgroundColor: theme.cardBg,
        boxShadow: `0px 4px 6px ${theme.shadow}`,
        borderRadius: '6px',
        padding: '8px',
        zIndex: 1000,
        width: '180px',
        border: `1px solid ${theme.border}`,
    },
    articleTitle: {
        margin:'0px',
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '5px',
        color: theme.textPrimary,
    },
    headerInfo: {
        fontSize: '14px',
        color: theme.textSecondary,
        marginBottom: '5px',
    },
    articleStats: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '5px',
        color: theme.textLight,
    },
    statIcon: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
    },
    lineBreak: {
        width: '100%',
        height: '1px',
        backgroundColor: theme.divider,
        margin: '10px 0',
    },
    btnContainer:{
        display:"flex",
        justifyContent:'space-between',
        margin:"5px"
    },
    mainContainer:{
        width: '100%',
        fontSize: '14px',
        lineHeight: '1.4',
        fontFamily: "Arial, sans-serif",
        color: theme.textPrimary,
        flex: 1,
        overflow: 'auto',
        maxHeight: 'calc(80vh - 120px)',
    },
    displayContainer:{
    maxWidth: '100%',
    overflowX: 'auto', 
    display: 'flex',  
    flexWrap: 'wrap', 
    whiteSpace: 'normal', 
    minWidth: 0, 
    wordWrap: 'break-word', 
    overflowWrap: 'break-word', 
    },
    articledata:{
        display:'flex',
        flexDirection:'column'
    },
    
    };
};

/**
 * Renders the search bar component
 * @param {Object} props - Component properties
 * @param {Object} props.state - State of the component
 * @param {Object} props.styles - Theme-aware styles
 * @param {Function} props.triggerSearch - Function to trigger search
 * @param {Function} props.handleKeyDown - Function to handle key press events
 * @param {Function} props.updateState - Function to update the state
 * @param {boolean} props.darkMode - Whether dark mode is enabled
 */
const SearchBar = ({ state, styles, triggerSearch, handleKeyDown, updateState, darkMode }) => {
    const theme = darkMode ? THEME_COLORS.dark : THEME_COLORS.light;
    
    return (
        <div style={styles.searchWrapper}>
            <now-icon style={styles.searchIcon} icon="magnifying-glass-fill" size="sm" on-click={triggerSearch} />
            <input
                type="text"
                value={state.searchString}
                on-blur={triggerSearch}
                on-keydown={handleKeyDown}
                on-focus={() => updateState({ searchBgColor: theme.inputFocusBg })}
                style={{ ...styles.searchInput, backgroundColor: state.searchBgColor || theme.inputBg }}
                placeholder="Search knowledge articles..."
            />
        </div>
    );
};

/**
 * Renders search results or loading state
 * @param {Object} props - Component properties
 * @returns {JSX.Element}
 */
const SearchResults = ({ isLoading, result, fullView, dispatch, openedArticle, updateState, styles, darkMode }) => (
    isLoading ? (
        <now-loader label="Loading..." size="lg" />
    ) : !fullView ? (
        renderSearchResponse(result, fullView, dispatch, openedArticle, updateState, darkMode)
    ) : (
        <ArticleView openedArticle={openedArticle} updateState={updateState} dispatch={dispatch} styles={styles} darkMode={darkMode} />
    )
);

/**
 * Handles applying a template to an article
 * @param {Object} openedArticle - The currently opened article
 * @param {Function} dispatch - Dispatch function to trigger actions
 * @param {Function} updateState - Function to update state
 */
function handleApplyTemplate(openedArticle, dispatch, updateState) {
    const sysId = openedArticle.u_template.link.split("/").pop();
    updateState({ fullView: false });
    dispatch(SET_TEMPLATE, { templateId: sysId, table: openedArticle.sys_class_name, kbNumber: openedArticle.number });
}

/**
 * Handles opening the full view of an article
 * @param {Function} dispatch - Dispatch function
 * @param {Object} item - Article data
 */
function handleOpenFullView(dispatch, item) {
    dispatch(OPEN_FULL_VIEW, { articleId: item.sys_id, table: item.sys_class_name });
}

/**
 * Renders the full article view
 * @param {Object} props - Component properties
 * @returns {JSX.Element}
 */
const ArticleView = ({ openedArticle, updateState, dispatch, styles, darkMode }) => (
    <div>
        <div style={styles.btnContainer}>
            <now-button label="Back" variant="secondary" size="sm" on-click={() => updateState({ fullView: false })} /> 
            <div style={{ display: "flex", columnGap: "8px" }}>
                {openedArticle.u_template && (
                    <now-button 
                        label="Apply Template" 
                        variant="primary" 
                        size="sm" 
                        on-click={() => handleApplyTemplate(openedArticle, dispatch, updateState)} 
                    />
                )}
                <now-button
                    label="Full View"
                    variant="primary"
                    size="sm"
                    on-click={(event) => {
                        event.stopPropagation();
                        handleOpenFullView(dispatch, openedArticle);
                    }} 
                />
            </div>
        </div>
        <div>
            <h3 style={styles.headerInfo}>
                <span>{openedArticle.meta.knowledgeBase}</span>
                <span> | </span>
                <span>{openedArticle.meta.category}</span>
            </h3>
            <h3 style={styles.articleTitle}>{openedArticle.short_description}</h3>
            <div style={styles.articleStats}>
                <div style={styles.statIcon}>
                    <now-icon icon="eye-outline" size="sm" />
                    <span>{openedArticle.sys_view_count} views</span>
                </div>
                <div style={styles.statIcon}>
                    <now-icon icon="star-outline" size="sm" />
                    <span>Rating: {openedArticle.rating || 0}/5</span>
                </div>
            </div>
            <div style={styles.lineBreak}></div>
            <div style={styles.displayContainer}>
                {DISPLAY_FIELDS.map((fieldData, index) => (
                    <div key={index} style={styles.articledata}>
                        {(fieldData.title && openedArticle[fieldData.field]) && <h2 style={{ color: styles.articleTitle.color }}>{fieldData.title}</h2>}
                        <now-rich-text html={openedArticle[fieldData.field] || ""} />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

/**
 * Main component for knowledge search
 * @param {Object} state - Component state
 * @param {Object} handlers - Dispatch and updateState functions
 * @param {Object} properties - Component properties including darkMode
 * @returns {JSX.Element}
 */
export default (state, { dispatch, updateState }, { darkMode = false }) => {
    const { isLoading, searchString, result, fullView, openedArticle } = state;
    const styles = getStyles(darkMode);
    const theme = darkMode ? THEME_COLORS.dark : THEME_COLORS.light;

    const triggerSearch = ({ target: { value } }) => {
        const searchValue = value.trim();
        updateState({ 
            fullView: false, 
            searchString: searchValue, 
            searchBgColor: state.searchBgColor || theme.inputBg 
        });
        if (searchValue === searchString) return;
        if (searchValue) {
            dispatch(SEARCH_REQUESTED, { searchString: searchValue, sysparm_display_value: 'true' });
        } else {
            updateState({ searchString: searchValue, result: [] });
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") triggerSearch(event);
    };

    return (
        <div 
            className="agent-assist-container"
            style={{ ...styles.container, backgroundColor: fullView ? theme.cardBg : theme.containerBg }}
        >
            {!fullView && (
                <div style={styles.header}>
                    <now-heading label="Knowledge Search" variant="header-secondary" />
                    <SearchBar 
                        state={state} 
                        styles={styles}
                        triggerSearch={triggerSearch} 
                        handleKeyDown={handleKeyDown} 
                        updateState={updateState}
                        darkMode={darkMode}
                    />
                </div>
            )}
            <main className="search-results" style={styles.mainContainer}>
                <SearchResults 
                    isLoading={isLoading} 
                    result={result} 
                    fullView={fullView} 
                    dispatch={dispatch} 
                    openedArticle={openedArticle} 
                    updateState={updateState}
                    styles={styles}
                    darkMode={darkMode}
                />
            </main>
        </div>
    );
};