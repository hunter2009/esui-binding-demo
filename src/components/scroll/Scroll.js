import ui from 'esui';
import Control from 'esui/Control';
import {defaults} from 'diffy-update';

export default class Scroll extends Control {
    get type() {
        return 'Scroll';
    }

    get defaultProperties() {
        return {
            value: null,
            timer: null
        };
    }

    initOptions(options) {
        let properties = defaults(options, null, this.defaultProperties);
        this.setProperties(properties);
    }

    repaint() {
        if (this.timer || this.value == null) {
            return;
        }

        this.timer = setTimeout(::this.scroll, 0);
    }

    scroll() {
        clearTimeout(this.timer);
        this.timer = null;

        if (this.value == null) {
            return;
        }

        if (this.value === 'bottom') {
            window.scrollTo(0, document.documentElement.scrollHeight);
        }
        else {
            window.scrollTo(0, this.value);
        }

        this.fire('scroll');
    }
}

ui.register(Scroll);
