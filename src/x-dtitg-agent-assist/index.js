import {createCustomElement} from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import actionHandlers from './actionHandlers';
import view from './view';

//  import styles from '../agent-assist-sm-now/';

// const view = (state, {updateState}) => (
// 	<div>
// 		<h1>Example</h1>
// 		<p>This is an example of a bare-bones component.</p>
// 		<p>You might want to read the <a href ="https://developer.servicenow.com/dev.do#!/reference/next-experience/latest/ui-framework/getting-started/introduction">documentation</a> on the ServiceNow developer site.</p>
// 	</div>
// );

createCustomElement('x-dtitg-agent-assist', {
	renderer: {type: snabbdom},
	view,
	// styles,
	initialState: {
		searchString: null,
		fullView: false,
		openedArticle:{},
		isLoading: false,
		result: [],
		stopWord:[]
		
	},
	properties: {
	
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
		stopWord:{
			default:[]
		}

	
	},
	
	actionHandlers

});
