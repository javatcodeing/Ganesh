export const KB_KNOWLEDGE_REST_URL = '/api/now/table/:table';
export const SEARCH_REQUESTED = 'SEARCH_REQUESTED';
export const KB_KNOWLEDGE_FETCH_REQUESTED = 'KB_KNOWLEDGE_FETCH_REQUESTED';
export const SET_TEMPLATE="SET_TEMPLATE";
export const KB_KNOWLEDGE_FETCH_STARTED = 'KB_KNOWLEDGE_FETCH_STARTED';
export const KB_KNOWLEDGE_FETCH_SUCCESS = 'KB_KNOWLEDGE_FETCH_SUCCESS';
export const KB_KNOWLEDGE_FETCH_FAILED = 'KB_KNOWLEDGE_FETCH_FAILED';
export const NO_MATCHES_FOUND = 'No matches found';
export const NO_MATCHES_FOUND_MESSAGE =
	'Try modifying your search text or filter to find what you\'re looking for';
export const KB_KNOWLEDGE_TABLE = 'kb_knowledge';
export const NUMBER_OF_RECORDS_FETCH = '10';
export const OPEN_FULL_VIEW="OPEN_FULL_VIEW";
export const SET_SEARCH_RESULT="SET_SEARCH_RESULT";
export const GET_CONTEXTUAL_SEARCH_RESULTS="GET_CONTEXTUAL_SEARCH_RESULTS";
export const    SEARCH_CONTEXT_USED='69a05b3853001300a9a2664906dc343f';
export const  SEARCH_TABLES=["u_kb_template_business_case","kb_template_faq", "kb_template_how_to", "kb_template_kcs_article", "kb_template_what_is", "kb_knowledge"]; //
export const SEARCH_API ='/api/now/cxs/search';


export const KB_TABLES_SEARCH_CONFIG =[
    {
        tableName: "Knowledge",
        sysClassName: "kb_knowledge",
        summaryFields: {
            PRIMARY: { field: "text" },
            SECONDARY: { field: "text" }
        },
        displayFields: [
            { title: "", field: "text" }
        ],
   
    },
    {
        tableName: "Kb Template Business Case",
        sysClassName: "u_kb_template_business_case",
        summaryFields: {
            PRIMARY: { field: "u_kb_symptom" },
            SECONDARY: { field: "u_kb_symptom" }
        },
        displayFields: [
            { title: "Symptom", field: "u_kb_symptom" },
            { title: "Solution / Instructions", field: "u_kb_solution_instructions" },
            { title: "Reason", field: "u_kb_reason" }
        ],
      
    },
    {
        tableName: "FAQ",
        sysClassName: "kb_template_faq",
        summaryFields: {
            PRIMARY: { field: "kb_question" },
            SECONDARY: { field: "kb_answer" }
        },
        displayFields: [
            { title: "Question", field: "kb_question" },
            { title: "Answer", field: "kb_answer" }
        ],
       
    },
    {
        tableName: "How To",
        sysClassName: "kb_template_how_to",
        summaryFields: {
            PRIMARY: { field: "kb_introduction" },
            SECONDARY: { field: "kb_instructions" }
        },
        displayFields: [
            { title: "Introduction", field: "kb_introduction" },
            { title: "Instructions", field: "kb_instructions" }
        ],
      
    },
    {
        tableName: "KCS Article",
        sysClassName: "kb_template_kcs_article",
        summaryFields: {
            PRIMARY: { field: "kb_issue" },
            SECONDARY: { field: "kb_environment" }
        },
        displayFields: [
            { title: "Issue", field: "kb_issue" },
            { title: "Environment", field: "kb_environment" },
            { title: "Cause", field: "kb_cause" },
            { title: "Resolution", field: "kb_resolution" }
        ],
     
    },
    {
        tableName: "What Is",
        sysClassName: "kb_template_what_is",
        summaryFields: {
            PRIMARY: { field: "short_description" },
            SECONDARY: { field: "kb_introduction" }
        },
        displayFields: [
            { title: "Introduction", field: "kb_introduction" },
            { title: "Explanation", field: "kb_explanation" }
        ],
     
    }
];






