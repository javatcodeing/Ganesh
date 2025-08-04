export const KB_KNOWLEDGE_REST_URL = '/api/now/table/:table';
export const SEARCH_REQUESTED = 'SEARCH_REQUESTED';
export const KB_KNOWLEDGE_FETCH_REQUESTED = 'KB_KNOWLEDGE_FETCH_REQUESTED';
export const ERROR_PREFIX='[Knowledge Search]';
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
export const SEARCH_CONTEXT_USED='69a05b3853001300a9a2664906dc343f';
export const SEARCH_TABLES=["kb_template_faq", "kb_template_how_to", "kb_template_kcs_article", "kb_template_what_is", "kb_knowledge"]; //"u_kb_template_business_case",
export const SEARCH_API ='/api/now/cxs/search';

export const DISPLAY_FIELDS=[
    { title: "", field: "text" },
    { title: "Symptom", field: "u_kb_symptom" },
    { title: "Solution / Instructions", field: "u_kb_solution_instructions" },
    { title: "Description", field: "kb_description" },
    { title: "Reason", field: "u_kb_reason" },
    { title: "Question", field: "kb_question" },
    { title: "Answer", field: "kb_answer" },
    { title: "Introduction", field: "kb_introduction" },
    { title: "Instructions", field: "kb_instructions" },
    { title: "Issue", field: "kb_issue" },
    { title: "Environment", field: "kb_environment" },
    { title: "Cause", field: "kb_cause" },
    { title: "Resolution", field: "kb_resolution" },
    { title: "Workaround", field: "kb_workaround" },
    { title: "Cause", field: "kb_cause" },
    { title: "Introduction", field: "kb_introduction" },
    { title: "Explanation", field: "kb_explanation" }
]

