import u from 'underscore';
import ui from 'esui';
import Control from 'esui/Control';
import marked from 'marked';
import moment from 'moment';
import {defaults, set} from 'diffy-update';
import {Engine} from 'etpl';
import TEMPLATE from 'text!./todoCard.tpl.html';
import 'css!./TodoCard.css';
import Calendar from 'esui/Calendar';
import TextBox from 'esui/TextBox';

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
                completed: false
            },
            mode: 'view'
        };
    }

    constructor(options) {
        super(options);

        this.helper.setTemplateEngine(engine);
    }

    initOptions(options) {
        let properties = defaults(options, null, this.defaultProperties);
        properties.form = properties.todo;
        this.setProperties(properties);
    }

    repaint() {
        this.disposeChildren();
        let viewData = u.pick(this, 'todo', 'mode');
        this.main.innerHTML = this.helper.renderTemplate('main', viewData);
        this.helper.initConnectedChildren();
    }

    edit() {
        this.set('mode', 'edit');
    }

    sync(field, target) {
        // 不用`set`避免触发`repaint`
        this.form = set(this.form, field, target.getRawValue());
    }

    save() {
        this.fire('save', {todo: this.form});
    }

    cancel() {
        // 编辑，直接换回视图模式，编辑到一半的数据保留着
        if (this.todo.id) {
            this.set('mode', 'view');
        }
        // 新增
        else {
            this.fire('cancel');
        }
    }
}

ui.register(TodoCard);
