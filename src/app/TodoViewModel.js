import u from 'underscore';
import $ from 'jquery';
import {set, invoke, push} from 'diffy-update';
import moment from 'moment';
import Model from 'emc/Model';
import etpl from 'etpl';
import init from '../inf/init';
import TEMPLATE_TEXT from 'text!./todo.tpl.html';
import Button from 'esui/Button';
import Panel from 'esui/Panel';
import TodoList from '../components/todoList/TodoList';
import Scroll from '../components/scroll/Scroll';
import Sticky from '../components/Sticky';
import 'css!./todo.css';

etpl.parse(TEMPLATE_TEXT);

export default class TodoViewModel extends Model {

    async load() {
        this.set('username', 'Gray Zhang');

        let todos = await $.getJSON('/api/todos.json');
        todos = todos.map(todo => invoke(todo, 'dueDate', date => moment(date, 'YYYYMMDD').toDate()));
        this.set('todos', todos);
    }

    removeCard(todo) {
        let newTodos = u.without(this.get('todos'), todo);
        this.set('todos', newTodos);
    }

    markComplete(todo) {
        let index = this.get('todos').indexOf(todo);
        let newTodos = set(this.get('todos'), [index, 'completed'], true);
        this.set('todos', newTodos);
    }

    createTodo() {
        this.set('createNew', true);
        this.set('scroll', 'bottom');
    }

    updateTodo(todo) {
        let index = this.get('todos').findIndex(item => item.id === todo.id);
        let newTodos = set(this.get('todos'), [index], todo);
        this.set('todos', newTodos);
    }

    saveNewTodo(todo) {
        let newTodos = push(this.get('todos'), null, todo);
        this.set('todos', newTodos);
        this.set('createNew', false);
    }

    cancelCreateTodo() {
        this.set('createNew', false);
    }

    resetScrollState() {
        this.set('scroll', null);
    }

    render(container) {
        let html = etpl.getRenderer('main')(this.dump());
        container.innerHTML = html;

        init(container, {inputSource: this, outputSource: this});
    }
}
