import u from 'underscore';
import $ from 'jquery';
import {set, invoke} from 'diffy-update';
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
        this.autoInrement = todos.length;
    }

    removeCard(todo) {
        /* eslint-disable fecs-use-method-definition */
        this.update({todos: {$invoke: todos => u.without(todos, todo)}});
        /* eslint-enable fecs-use-method-definition */
    }

    markComplete(todo) {
        let index = this.get('todos').indexOf(todo);
        this.update({todos: {[index]: {completed: {$set: true}}}});
    }

    createTodo() {
        this.update({createNew: {$set: true}, scroll: {$set: 'bottom'}});
    }

    updateTodo(todo) {
        let index = this.get('todos').findIndex(item => item.id === todo.id);
        this.update({todos: {[index]: {$set: todo}}});
    }

    saveNewTodo(form) {
        let todo = set(form, 'id', this.autoInrement++);
        this.update({todos: {$push: todo}, createNew: {$set: false}});
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
