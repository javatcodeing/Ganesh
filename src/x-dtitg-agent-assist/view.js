import '@servicenow/now-icon';
import '@servicenow/now-loader';
import '@servicenow/now-heading';
import '@servicenow/now-button';
import '@servicenow/now-rich-text';
import { renderSearchResponse } from './renderSearchResponse';
import { SEARCH_REQUESTED , SET_TEMPLATE,KB_TABLES_SEARCH_CONFIG} from '../constants';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '95%',
        maxWidth: '900px',
        minHeight: '300px',
        // margin: '1rem auto',
       padding: '1rem 2rem 1rem 1rem',
        backgroundColor: '#d4e9e2',
        borderRadius: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        fontFamily: "Arial, sans-serif",
        overflow: 'hidden',
    },
    header: {
        width: '100%',
        marginBottom: '1rem',
        paddingRight:'1rem'
    },
    searchWrapper: {
        position: 'relative',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
    },
    searchIcon: {
        position: 'absolute',
        left: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#555',
        cursor: 'pointer',
    },
    searchInput: {
        width: '100%',
        padding: '10px 15px 10px 40px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        color: '#333',
        backgroundColor: '#d4e9e2',
        boxShadow: 'inset 0px 2px 4px rgba(0, 0, 0, 0.1)',
        outline: 'none',
    },
    dropdownContainer: {
        position: 'absolute',
        top: '100%',
        left: '0',
        backgroundColor: '#fff',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '6px',
        padding: '8px',
        zIndex: 1000,
        width: '180px',
        border: '1px solid #ccc',
    },
    articleTitle: {
        margin:'0px',
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '5px',
    },
    headerInfo: {
        fontSize: '14px',
        color: '#555',
        marginBottom: '5px',
    },
    articleStats: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '5px',
        color: '#777',
    },
    statIcon: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
    },
    lineBreak: {
        width: '100%',
        height: '1px',
        backgroundColor: '#ccc',
        margin: '10px 0',
    },
    btnContainer:{
        display:"flex",
        justifyContent:'space-between',
        margin:"5px"
    },
    mainContainer:{
        width: '100%',
        fontSize: '16px',
        lineHeight: '1.25',
        fontFamily: "Arial, sans-serif",
         paddingRight:'1rem'

    },
    displayContainer:{
    //     maxWidth: '100%',
    //     overflowX: 'auto',
    // //   whiteSpace: 'nowrap',
    //     whiteSpace:"normal",
    //     display: 'block',
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
    }
};



const SearchBar = ({ state, triggerSearch, handleKeyDown,updateState }) => (

    <div style={styles.searchWrapper}>
        <now-icon style={styles.searchIcon} icon="magnifying-glass-fill" size="sm" on-click={triggerSearch} />
        <input
            type="text"
            value={state.searchString}
            on-blur={triggerSearch}
            on-keydown={handleKeyDown}
            on-focus={() => updateState({ searchBgColor: "#ffffff" })}  
    // on-mouse-enter={() => alert("onmouce enter")}  updateState({ searchBgColor: "#b0b0b0" })
    // onMouseLeave={() => alert("onmouce leve")} // updateState({ searchBgColor: "#d4e9e2" })
    style={{ ...styles.searchInput, backgroundColor: state.searchBgColor }}
            placeholder="Search knowledge articles..."
        />
    </div>
);

const SearchResults = ({ isLoading, result, fullView, dispatch, openedArticle, updateState }) => (
    isLoading ? (
        <now-loader label="Loading..." size="lg" />
    ) : !fullView ? (
        renderSearchResponse(result, fullView, dispatch, openedArticle, updateState)
    ) : (
        <ArticleView openedArticle={openedArticle} updateState={updateState} dispatch={dispatch}/>
    )
);


 function handelApplyTemplate(openedArticle, dispatch){
    const sysId = openedArticle.u_template.link.split("/").pop();

    dispatch(SET_TEMPLATE, { templateId: sysId });
}




const getDisplayData = (item) => {
    console.log("Checking sys_class_name:", item.sys_class_name);

    // Find the matching config object based on sys_class_name
    const obj = KB_TABLES_SEARCH_CONFIG.find(
        (config) => config.tableName === item.sys_class_name 
    );

    if (!obj) {
        console.warn("No matching config found for:", item.sys_class_name);
        return []; 
    }
    console.log("Checking sys_class_name:", item.sys_class_name+ " obj.displayFields: "+JSON.stringify(obj.displayFields));
    return obj.displayFields || [];
};



const ArticleView = ({ openedArticle, updateState, dispatch }) => (
<div>
    <div style={styles.btnContainer}>
        <now-button label="Back" variant="secondary" size="sm" on-click={()=> updateState({ fullView: false })} /> {openedArticle.u_template ?
            <now-button label="Apply Template" variant="secondary" size="sm" on-click={()=> handelApplyTemplate(openedArticle, dispatch)} /> : ""}

    </div>

    <div>
        <h3 style={styles.headerInfo}>
                <span>{openedArticle.kb_knowledge_base.display_value}</span>
                <span> | </span>
                <span>{openedArticle.kb_category.display_value}</span>
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
            {getDisplayData(openedArticle).map((article, index) => (
            <div key={index} style={styles.articledata}>
                {article.title?
                <h2>{article.title}</h2>:"" }
                <now-rich-text html={openedArticle[article.field]} />
            </div>
            ))}
        </div>
    </div>
</div>
);




export default (state, { dispatch, updateState }) => { const { isLoading, searchString, result, fullView, openedArticle } = state; 


const triggerSearch = ({ target: { value } }) => {
     const searchValue = value.trim();
      updateState({ fullView: false, searchString:searchValue , searchBgColor: "#d4e9e2" }); 
if (searchValue === searchString) return;
 if (searchValue) { dispatch(SEARCH_REQUESTED, { searchString: searchValue, sysparm_display_value: 'true' }); 
} else { updateState({ searchString: searchValue, result: [] }); 
} }; 
const handleKeyDown
= (event) => { if (event.key === "Enter") triggerSearch(event); }; return (
<div style={{ ...styles.container, backgroundColor: fullView ? 'white' : '#d4e9e2' }}>
    {!fullView && (
    <div style={styles.header}>
        <now-heading label="Knowledge Article Search" variant="header-secondary" />
        <SearchBar state={state} triggerSearch={triggerSearch} handleKeyDown={handleKeyDown} updateState={updateState}/>

    </div>
    )}
    <main style={styles.mainContainer}>
        <SearchResults isLoading={isLoading} result={result} fullView={fullView} dispatch={dispatch} openedArticle={openedArticle} updateState={updateState} />
    </main>
</div>
    );
};
