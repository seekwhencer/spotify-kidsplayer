import NaviTemplate from "./Templates/Navi.html";
import NaviButtonTemplate from "./Templates/NaviButton.html";

export default class SetupNavi extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'SETUP NAVI';

        this.target = this.toDOM(NaviTemplate({
            scope: {}
        }));
        this.parent.targets.navi.replaceChildren(this.target);
        this.show();
    }

    show() {
        this.parent.groups.forEach(group => {
            const button = this.toDOM(NaviButtonTemplate({
                scope: {
                    label: group
                }
            }));
            button.onclick = () => this.select(button, group);
            this.target.append(button);
        });

        const buttonAll = this.toDOM(NaviButtonTemplate({
            scope: {
                label: 'INFO'
            }
        }));
        buttonAll.onclick = () => this.summary(buttonAll);
        this.target.append(buttonAll);

    }

    blurAll(button) {
        this.target.querySelectorAll('button').forEach(b => b !== button ? b.classList.remove('active') : null);
    }

    select(button, group) {
        this.parent.selectGroup(group);
        this.blurAll(button);
        button.classList.add('active');
    }

    summary(button) {
        this.blurAll(button);
        button.classList.add('active');
        this.parent.showSummary();
    }


}
