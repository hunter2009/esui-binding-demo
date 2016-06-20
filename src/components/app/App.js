import u from 'underscore';
import ui from 'esui';
import $ from 'jquery';
import Control from 'esui/Control';
import {defaults, set, invoke, push} from 'diffy-update';
import moment from 'moment';
import {Engine} from 'etpl';
import TEMPLATE from 'text!./app.tpl.html';
import TodoList from '../todoList/TodoList';
import Button from 'esui/Button';
import Panel from 'esui/Panel';
import Scroll from '../scroll/Scroll';
import Sticky from '../Sticky';
import 'css!./app.css';

let engine = new Engine();
engine.parse(TEMPLATE);

export default class App extends Control {
    get type() {
        return 'App';
    }

    get defaultProperties() {
        return {
            username: 'Anonymous',
            todos: [],
            createNew: false,
            scroll: 0
        };
    }

    constructor(options) {
        super(options);

        // 顶层组件特有
        this.owner = this;

        this.helper.setTemplateEngine(engine);
    }

    initOptions(options) {
        let properties = defaults(options, null, this.defaultProperties);
        this.setProperties(properties);
    }

    repaint() {
        this.disposeChildren();
        this.main.innerHTML = this.helper.renderTemplate('main', this);
        this.helper.initConnectedChildren();
    }

    async initApp() {
        let username = 'Gray Zhang';
        let todos = await $.getJSON('/api/todos.json');
        todos = todos.map(todo => invoke(todo, 'dueDate', date => moment(date, 'YYYYMMDD').toDate()));
        this.setProperties({username, todos});
    }

    removeCard(todo) {
        let newTodos = u.without(this.todos, todo);
        this.set('todos', newTodos);
    }

    markComplete(todo) {
        let index = this.todos.indexOf(todo);
        let newTodos = set(this.todos, [index, 'completed'], true);
        this.set('todos', newTodos);
    }

    createTodo() {
        this.setProperties({createNew: true, scroll: 'bottom'});
    }

    updateTodo(todo) {
        let index = this.todos.findIndex(item => item.id === todo.id);
        let newTodos = set(this.todos, [index], todo);
        this.set('todos', newTodos);
    }

    saveNewTodo(todo) {
        let newTodos = push(this.todos, null, todo);
        this.setProperties({todos: newTodos, createNew: false});
    }

    cancelCreateTodo() {
        this.set('createNew', false);
    }
}

ui.register(App);
