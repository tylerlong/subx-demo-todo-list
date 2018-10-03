import React from 'react'
import ReactDOM from 'react-dom'
import SubX from 'subx'
import { Component } from 'react-subx'
import uuid from 'uuid/v1'
import classNames from 'classnames'
import pluralize from 'pluralize'
import * as R from 'ramda'

import 'todomvc-app-css/index.css'

const Todo = new SubX({
  title: '',
  completed: false
})
Todo.create = obj => new Todo({ id: uuid(), ...obj })
const store = SubX.create({
  todos: [],
  get allDone () {
    return R.all(todo => todo.completed, this.todos)
  },
  get left () {
    return this.todos.filter(todo => !todo.completed).length
  },
  toggleAll () {
    if (this.allDone) {
      R.forEach(todo => { todo.completed = false }, this.todos)
    } else {
      R.forEach(todo => { todo.completed = true }, this.todos)
    }
  }
})

class TodoItem extends Component {
  render () {
    const todo = this.props.todo
    return <li className={classNames('todo', { completed: todo.completed })}>
      <div className='view'>
        <input className='toggle' type='checkbox' checked={todo.completed} onChange={e => { todo.completed = e.target.checked }} />
        <label>{todo.title}</label>
        <button className='destroy' />
      </div>
      <input className='edit' type='text' />
    </li>
  }
}

class App extends Component {
  constructor (props) {
    super(props)
    this.store = this.props.store
    this.todos = this.store.todos
    this.handleEnter = this.handleEnter.bind(this)
  }
  handleEnter (e) {
    if (e.key !== 'Enter') {
      return
    }
    const title = e.target.value.trim()
    if (title === '') {
      return
    }
    e.target.value = ''
    this.todos.push(Todo.create({ title }))
  }
  render () {
    return <>
      <section className='todoapp'>
        <header className='header'>
          <h1>todos</h1>
          <input className='new-todo' autoFocus autoComplete='off' placeholder='What needs to be done?' onKeyUp={this.handleEnter} />
        </header>
        <section className='main'>
          <input id='toggle-all' className='toggle-all' type='checkbox' checked={this.store.allDone} onChange={e => this.store.toggleAll()} />
          <label htmlFor='toggle-all'>Mark all as complete</label>
          <ul className='todo-list'>
            {this.todos.map(todo => <TodoItem todo={todo} key={todo.id} />)}
          </ul>
        </section>
        <footer className='footer'>
          <span className='todo-count'>
            <strong>{pluralize('item', this.store.left, true)}</strong> left
          </span>
          <ul className='filters'>
            <li><a href='#/all'>All</a></li>
            <li><a href='#/active'>Active</a></li>
            <li><a href='#/completed'>Completed</a></li>
          </ul>
          <button className='clear-completed'>
          Clear completed
          </button>
        </footer>
      </section>,
      <footer className='info'>
        <p>Double-click to edit a todo</p>
        <p>Written by <a href='https://github.com/tylerlong'>Tyler Long</a></p>
        <p><a href='https://github.com/tylerlong/subx-demo-todomvc'>Source code</a> available</p>
      </footer>
    </>
  }
}

ReactDOM.render(<App store={store} />, document.getElementById('container'))
