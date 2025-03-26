import '@servicenow/now-icon';
import '@servicenow/now-loader';
import '@servicenow/now-heading';
import '@servicenow/now-button';
import '@servicenow/now-rich-text';
import { renderSearchResponse } from './renderSearchResponse';
import { SEARCH_REQUESTED } from '../constants';

export default (state, { dispatch, updateState }) => {
    const { isLoading, searchString, result, fullView, openedArticle } = state;

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '95%',
            maxWidth: '900px',
            margin: '10px auto',
            padding: '10px',
            backgroundColor: fullView ? 'white' : '#edeef8',
            borderRadius: '8px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            fontFamily: "'Arial', sans-serif",
            overflow: 'hidden',
        },
        header: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: '100%',
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
            color: '#888',
        },
        searchInput: {
            width: '100%',
            padding: '10px 15px 10px 40px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            outline: 'none',
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
            fontFamily: "'Arial', sans-serif",
            color: '#333',
            backgroundColor: '#fff',
            boxShadow: 'inset 0px 2px 5px rgba(0, 0, 0, 0.1)',
        },
        mainContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
        },
        articleView: {
            width: '90%',
            backgroundColor: 'white',
        },
        articleCard: {
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            padding: '15px',
            // margin: '10px 0',
            lineHeight: '1.5',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            fontFamily: "'Lato', 'Arial', sans-serif",
        },
        
        backButton: {
            // marginBottom: '10px',
            backgroundColor: 'transparent',
            borderColor: 'transparent',
        },
        separator: {
            border: '0',
            height: '1px',
            backgroundColor: '#ccc',
            margin: '10px 0',
        },
        headerText: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            margin: '0px',
            padding: '0px',
        },
        articleBody: {
            fontFamily: "'Lato', 'Arial', sans-serif",
            fontSize: '16px',
        },
        articleCategory: {
            fontWeight: "200",
            fontSize: '14px',
            fontFamily: "'Lato', 'Arial', sans-serif",
            color: '#333',
            letterSpacing: '0.5px',
            margin: '0px 0px 5px 0px', 
            padding: '0px',
        },
        
        articleTitle: {
            fontSize: '20px',
            fontWeight: '300',
            margin: '0px', 
            padding: '0px', 
            lineHeight: '1.3', 
        },
        
    };

    const triggerSearch = ({ target: { value } }) => {
        const searchValue = value.trim();
        updateState({ fullView: false });
        updateState({ searchString: searchValue });
        if (searchValue === searchString) return;
        if (searchValue) {
            dispatch(SEARCH_REQUESTED, { searchString: searchValue, sysparm_display_value: 'true' });
        } else {
            updateState({ searchString: searchValue, result: [] });
        }
    };


    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            triggerSearch(event);
        }
    };



    return (
      <div style={styles.container}>
   {!fullView && (
   <div style={styles.header}>
      <now-heading label="Knowledge Article Search" variant="header-secondary" style={styles.headerText} />
      <div style={styles.searchWrapper}>
         <now-icon style={styles.searchIcon} icon="magnifying-glass-fill" size="sm" on-click={triggerSearch} />
         <input
            type="text"
            value={searchString}
            on-blur={triggerSearch}
            on-keydown={handleKeyDown}           
            style={styles.searchInput}
            placeholder="Search knowledge articles..."
            />
      </div>
   </div>
   )}
   <main style={styles.mainContainer}>
      {isLoading ? (
      <now-loader label="Loading..." size="lg" />
      ) : !fullView ? (
      renderSearchResponse(result, fullView, dispatch, openedArticle, updateState)
      ) : (
      <div style={styles.articleView}>
         <now-button
            label="Back"
            variant="secondary"
            size="sm"
            on-click={() =>
         updateState({ fullView: false })}
         style={styles.backButton}
         />
         <div style={styles.articleCard}>
            <h3 style={styles.articleCategory}>
               <span>{openedArticle.kb_knowledge_base.display_value}</span>
               <span> | </span>
               <span>{openedArticle.kb_category.display_value}</span>
            </h3>
            <h2 style={styles.articleTitle}>{openedArticle.short_description}</h2>
            <div>
               <span className="kb-id">{openedArticle.number}</span>
               <div>
                  <now-icon icon="eye-outline" size="sm" />
                  <span> </span>
                  <span>{openedArticle.sys_view_count} views</span>
                  <span>     </span>
                  <now-icon icon="star-outline" size="sm" />
                  <span> </span>
                  <span>Rating: {openedArticle.rating || 0}/5</span>
               </div>
            </div>
            <hr style={styles.separator} />
            <now-rich-text html={openedArticle.text} style={styles.articleBody} />
         </div>
      </div>
      )}
   </main>
</div>
    );
};
