import '../src/x-1595240-agent-assist';

const el = document.createElement('DIV');
document.body.appendChild(el);

// Example with light mode (default)
el.innerHTML = `		
	<x-1595240-agent-assist></x-1595240-agent-assist>
`;

// Example with dark mode
const darkEl = document.createElement('DIV');
darkEl.style.marginTop = '20px';
document.body.appendChild(darkEl);

darkEl.innerHTML = `		
	<x-1595240-agent-assist dark-mode="true"></x-1595240-agent-assist>
`;

// Add toggle button for demonstration
const toggleButton = document.createElement('button');
toggleButton.textContent = 'Toggle Dark Mode';
toggleButton.style.margin = '20px';
toggleButton.style.padding = '10px 20px';
toggleButton.style.cursor = 'pointer';

let isDark = false;
toggleButton.addEventListener('click', () => {
    isDark = !isDark;
    const component = document.querySelector('x-1595240-agent-assist');
    if (component) {
        component.setAttribute('dark-mode', isDark.toString());
    }
});

document.body.insertBefore(toggleButton, el);
