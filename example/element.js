import '../src/x-1595240-agent-assist';

// Create container for ServiceNow workspace integration
const container = document.createElement('DIV');
container.style.cssText = `
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 16px;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
`;
document.body.appendChild(container);

// Agent Assist component - will automatically detect dark mode from user preferences
const componentContainer = document.createElement('DIV');
componentContainer.style.cssText = `
    width: 100%;
    min-height: 400px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
`;
container.appendChild(componentContainer);

componentContainer.innerHTML = `		
	<x-1595240-agent-assist></x-1595240-agent-assist>
`;

// Add info text
const infoText = document.createElement('P');
infoText.style.cssText = `
    margin-top: 16px;
    padding: 12px;
    background-color: #f5f5f5;
    border-radius: 4px;
    font-size: 14px;
    color: #666;
`;
infoText.textContent = 'Dark mode will be automatically detected from ServiceNow user preferences (glide.ui.polaris.theme.variant)';
container.appendChild(infoText);
