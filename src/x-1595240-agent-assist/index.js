import {createCustomElement} from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import actionHandlers from './actionHandlers';
import view from './view';

createCustomElement('x-1595240-agent-assist', {
	renderer: {type: snabbdom},
	view,
	initialState: {
		searchString: null,
		fullView: false,
		openedArticle:{},
		isLoading: false,
		result: [],	
		searchBgColor:"#d4e9e2"
	},
	properties: {
		nowAvoidRender: { default: true },
		fields: {
			default: {
				short_description: {
					displayValue: 'email',
					value: 'email',
					visible: true
				}
			}
		},
		fullView: { default:false}, 
		openedArticle:{
			default:{}
		},
		searchBgColor:{
			default:"#d4e9e2"
		},
	},
	
	actionHandlers

});
