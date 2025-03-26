import { Fragment } from '@servicenow/ui-renderer-snabbdom';
import '@servicenow/now-label-value';
import { NO_MATCHES_FOUND, NO_MATCHES_FOUND_MESSAGE, SET_TEMPLATE } from '../constants';
import '@servicenow/now-rich-text';

const Styles = {
    article: {
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        margin: '8px 0',
         padding: '10px',
        backgroundColor: '#fff',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        width: '100%',
        boxSizing: 'border-box'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    span: {
        color: '#757575',
        fontWeight: '500',
    },
    actionContainer: {
        display: 'flex',
        gap: '8px',
    },
    nowHeading: {
        margin:'0px',
        padding:'0px',
        marginTop: '8px',  
    },
    summary: {
        whiteSpace: 'normal',
        marginTop: '3px',
        color: '#616161',
        fontSize: '16px',
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

const trimArticleBody = (articleBody) => {
    if (articleBody)
        return articleBody
            .replace(/<([^>]+)>/g, '')
            .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
            .substring(0, 150)
            .trim();
    return null;
};

function handleOpenArticle(openedArticle, item, updateState, fullView) {
    updateState({ fullView: true });
    updateState({ openedArticle: item });
}

function handleApplyTemplate(dispatch, templateLink) {

    const sysId = templateLink.split("/").pop();

    dispatch(SET_TEMPLATE, { templateId: sysId });
}

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
             { item.u_template ? 
             <now-button
                label="Apply Template"
                variant="secondary"
                size="sm"
                on-click={(event) =>
             {
             event.stopPropagation();
             handleApplyTemplate(dispatch, item.u_template.link);
             }}
             /> :""} 
          </div>
       </header>
       <now-heading label={item.short_description} variant="title-secondary" style={Styles.nowHeading} />
       <summary style={Styles.summary}>{`${trimArticleBody(item.text)}...`}</summary>
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
