import FormTemplate from "./Templates/Tabs.html";

export default class SetupTabs extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'SETUP TABS';

        this.target = this.toDOM(FormTemplate({
            scope: {}
        }));
        this.parent.target.append(this.target);
    }

}
