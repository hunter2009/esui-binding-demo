import u from 'underscore';
import ui from 'esui';
import Control from 'esui/Control';
import {defaults} from 'diffy-update';
import {Engine} from 'etpl';
import TEMPLATE from 'text!./todoList.tpl.html';
import TodoCard from '../todoCard/TodoCard';
import 'css!./TodoList.css';

let engine = new Engine();
engine.parse(TEMPLATE);

export default class TodoList extends Control {
    get type() {
        return 'TodoList';
    }

    get styleType() {
        return 'todo-list';
    }

    get defaultProperties() {
        return {
            datasource: []
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

    repaint() {
        this.disposeChildren();
        let viewData = u.pick(this, 'datasource');
        this.main.innerHTML = this.helper.renderTemplate('main', viewData);
        this.helper.initConnectedChildren();
    }
}

ui.register(TodoList);
