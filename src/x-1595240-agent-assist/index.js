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
		searchBgColor: null // Will be set dynamically based on theme
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
			default: null // Will be set dynamically based on theme
		},
		darkMode: {
			default: false
		},
	},
	
	actionHandlers

});
