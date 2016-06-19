import u from 'underscore';
import ui from 'esui';
import Control from 'esui/Control';
import marked from 'marked';
import moment from 'moment';
import {defaults} from 'diffy-update';
import {Engine} from 'etpl';
import TEMPLATE from 'text!./todoCard.tpl.html';
import 'css!./TodoCard.css';

let engine = new Engine();
engine.addFilter('markdown', str => marked(str));
engine.addFilter('date', date => moment(date).format('YYYY-MM-DD'));
engine.parse(TEMPLATE);

export default class TodoCard extends Control {
    get type() {
        return 'TodoCard';
    }

    get styleType() {
        return 'todo-card';
    }

    get defaultProperties() {
        return {
            todo: {
                id: 0,
                title: '',
                content: '',
                dueDate: null,
                completed: false,
                mode: 'view'
            }
        };
    }

    constructor(options) {
        super(options);

        this.helper.setTemplateEngine(engine);
    }

    initOptions(options) {
        let properties = defaults(options, null, this.defaultProperties);
        this.setProperties(properties);
    }

    initEvents() {
        this.helper.addEventForSelector('click', '#complete', () => this.fire('complete'));
        this.helper.addEventForSelector('click', '#remove', () => this.fire('remove'));
    }

    repaint() {
        this.disposeChildren();
        let viewData = u.pick(this, 'todo');
        this.main.innerHTML = this.helper.renderTemplate('main', viewData);
    }
}

ui.register(TodoCard);
