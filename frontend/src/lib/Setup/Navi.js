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

        // info button
        this.buttonInfo = this.toDOM(NaviButtonTemplate({
            scope: {
                label: 'INFO'
            }
        }));
        this.buttonInfo.onclick = () => this.summary();
        this.target.append(this.buttonInfo);

        // add artist button
        this.addArtistButton = this.toDOM(NaviButtonTemplate({
            scope: {
                label: `${this.app.icons.plus()}`
            }
        }));
        this.addArtistButton.onclick = () => this.addArtist();
        this.target.append(this.addArtistButton);
    }

    blurAll(button) {
        this.target.querySelectorAll('button').forEach(b => b !== button ? b.classList.remove('active') : null);
    }

    select(button, group) {
        this.parent.selectGroup(group);
        this.blurAll(button);
        button.classList.add('active');
    }

    summary() {
        this.blurAll(this.buttonInfo);
        this.buttonInfo.classList.add('active');
        this.parent.showSummary();
    }

    addArtist() {
        this.blurAll(this.addArtistButton);
        this.addArtistButton.classList.add('active');
        this.parent.showAddArtist();
    }


}
