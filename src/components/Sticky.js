import ui from 'esui';
import Extension from 'esui/Extension';

export default class Sticky extends Extension {
    get type() {
        return 'Sticky';
    }

    activate() {
        let element = this.target.main;
        window.addEventListener(
            'scroll',
            () => {
                let scrollTop = document.scrollTop || document.body.scrollTop;
                if (element.offsetTop < scrollTop) {
                    element.style.position = 'fixed';
                    element.classList.add('sticky');
                }
                else {
                    element.style.position = '';
                    element.classList.remove('sticky');
                }
            }
        );
    }
}

ui.registerExtension(Sticky);
