import FormTemplate from "./Templates/Form.html";
import FormElementInputTemplate from "./Templates/FormElementInput.html";
import FormElementSwitchTemplate from "./Templates/FormElementSwitch.html";
import FromOptionsTemplate from "./Templates/FormOptions.html";
import FromSummaryTemplate from "./Templates/FormSummary.html";
import FromSummaryItemTemplate from "./Templates/FormSummaryItem.html";


export default class SetupForm extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'SETUP FORM';
    }

    show(group) {
        this.target = this.toDOM(FormTemplate({
            scope: {}
        }));
        this.parent.targets.form.replaceChildren(this.target);

        const props = this.getProps(group);
        props.forEach(prop => {
            const input = this.toDOM(FormElementInputTemplate({
                scope: {
                    id: prop,
                    label: prop,
                    name: prop,
                    value: this.parent.data[prop]
                }
            }));

            const inputElement = input.querySelector('input');
            inputElement.onkeyup = () => this.updateInput(inputElement, prop);

            this.target.append(input);
        });
    }

    getProps(group) {
        if (group !== 'GLOBAL')
            return this.parent.allowedProps.filter(g => g.substring(0, group.length) === group);

        return this.parent.allowedProps.filter(g => g.split('_').length === 1);
    }

    updateInput(inputElement, prop) {
        `${inputElement.value}` === `${this.parent.data[prop]}` ? this.hideInputOptions(inputElement, prop) : this.showInputOptions(inputElement, prop);
    }

    showInputOptions(inputElement, prop) {
        LOG(this.label, 'SHOW INPUT OPTIONS', prop, inputElement, '');
        !inputElement.classList.contains('update') ? inputElement.classList.add('update') : null;

        inputElement.optionsElement ? inputElement.optionsElement.remove() : null;
        inputElement.optionsElement = this.toDOM(FromOptionsTemplate({
            scope: {
                id: prop,
                label: prop,
                name: prop,
                value: this.parent.data[prop],
                icons: {
                    check: this.app.icons.check(),
                    close: this.app.icons.close()
                }
            }
        }));

        const buttonUpdate = inputElement.optionsElement.querySelector('[data-form-button-option="update"]');
        const buttonCancel = inputElement.optionsElement.querySelector('[data-form-button-option="cancel"]');

        buttonUpdate.onclick = () => this.update(inputElement, prop);
        buttonCancel.onclick = () => this.cancel(inputElement, prop);

        inputElement.after(inputElement.optionsElement);
    }

    hideInputOptions(inputElement, prop) {
        LOG(this.label, 'HIDE INPUT OPTIONS', prop, inputElement, '');
        inputElement.classList.remove('update');
        inputElement.optionsElement ? inputElement.optionsElement.remove() : null;
    }

    update(inputElement, prop) {
        this.parent.data[prop] = inputElement.value;
        this.hideInputOptions(inputElement, prop);
    }

    cancel(inputElement, prop) {
        inputElement.value = this.parent.data[prop];
        this.hideInputOptions(inputElement, prop);
    }

    summary() {
        this.target = this.toDOM(FromSummaryTemplate({
            scope: {
                data: this.parent.data
            }
        }));

        Object.keys(this.parent.dataSource).forEach(prop => {
            const item = this.toDOM(FromSummaryItemTemplate({
                scope: {
                    prop: prop,
                    value: this.parent.data[prop]
                }
            }));
            this.target.append(item);
        });

        this.parent.targets.form.replaceChildren(this.target);
    }

}
