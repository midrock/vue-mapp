import { Vue } from 'vue/types/vue';
import { VMFindByClassParams } from './types';

export function findChildrenByNames(parent: Vue, childNames: RegExp) {
	let inputComponents: Vue[] = [];

	function find(vm: Vue) {
		if (!vm.$children) return;

		vm.$children.forEach(child => {
			let name = child.$options.name;

			if (name) {
				name = name.split("-")[1];

				if (childNames.test(name)) {
					inputComponents.push(child);
				}
			} else if (parent.$children) {
				find(child);
			}
		});
	}

	find(parent);

	return inputComponents;
}


export function findElementByClass(params: VMFindByClassParams) {

	const {
		element,
		searchClass,
		exitClass,
		exitElement,
		recursive = true,
		log
	} = params;

	if (log) {
		console.log(element.classList);
	}

	if (!searchClass ||
		!element ||
		element.localName === 'body' ||
		!element.classList) {
		return false;
	}

	if (exitClass) {

		let _exitClasses;

		if (exitClass instanceof Array) {
			_exitClasses = exitClass;
		} else {
			_exitClasses = [exitClass];
		}

		for (const _class of _exitClasses) {
			if (element.classList.contains(_class)) {
				return false;
			}
		}
	}

	if (exitElement && element === exitElement) {
		return false;
	}

	let classFinded = false;

	if (searchClass instanceof Array) {
		searchClass.forEach(_class => {
			if (element.classList.contains(_class)) {
				classFinded = true;
			}
		});
	} else {
		classFinded = element.classList.contains(searchClass);
	}

	if (classFinded) {
		return element;
	} else {
		return findElementByClass({
			...params,
			element: element.parentNode
		});
	}
}

export function checkEventElement(e: Event, reg: RegExp) {
	let result = false,
		node: any = e.target;

	while (!result && node) {
		result = reg.test(node.className);
		node = node.parentNode;
	}

	return result;
}