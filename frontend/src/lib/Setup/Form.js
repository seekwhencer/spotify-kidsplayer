import FormTemplate from "./Templates/Form.html";

export default class Form extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'FORM';

        this.target = this.toDOM(FormTemplate({
            scope: {}
        }));
        this.parent.target.append(this.target);
    }

}
