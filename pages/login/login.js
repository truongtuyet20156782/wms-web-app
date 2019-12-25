// www/pages/login.js

import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
// import Layout from './../components/layout'
import { login } from '../../utils/auth'
import axios from 'axios';
const qs = require('querystring')

class Login extends Component {

  constructor (props) {
    super(props)

    this.state = { username: '', password: '', error: '' }
    this.handleChangeUser = this.handleChangeUser.bind(this)
    this.handleChangePass = this.handleChangePass.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChangeUser (event) {
    this.setState({ username: event.target.value })
  }

  handleChangePass (event) {
    this.setState({ password: event.target.value })
  }

  handleSubmit (event) {
    debugger
    event.preventDefault()
    const requestBody = {
      grant_type: 'password',
      client_id: 'ht',
      client_secret: 'ht',
      username: this.state.username,
      password: this.state.password
    }    

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    axios
      .post("http://localhost:8082/ndvn-wms-war/oauth/token", qs.stringify(requestBody), config)
      .then(async response => {
        if (response.status == 200) {
          const { access_token } =  response.data
          await login({ access_token })
        } else {
          console.log('Login failed.')
        }
      }).catch((error) => {
          console.log(error)
      });
  }

  render () {
    return (
      <div>
        <div className='login'>
          <form onSubmit={this.handleSubmit}>
            <label htmlFor='username'>Login information</label>

            <input
              type='text'
              id='username'
              name='username'
              value={this.state.username}
              onChange={this.handleChangeUser}
            />

            <input
              type='text'
              id='password'
              name='password'
              value={this.state.password}
              onChange={this.handleChangePass}
            />

            <button type='submit'>Login</button>

            <p className={`error ${this.state.error && 'show'}`}>
              {this.state.error && `Error: ${this.state.error}`}
            </p>
          </form>
        </div>
        <style jsx>{`
          .login {
            max-width: 340px;
            margin: 0 auto;
            padding: 1rem;
            border: 1px solid #ccc;
            border-radius: 4px;
          }
          form {
            display: flex;
            flex-flow: column;
          }
          label {
            font-weight: 600;
          }
          input {
            padding: 8px;
            margin: 0.3rem 0 1rem;
            border: 1px solid #ccc;
            border-radius: 4px;
          }
          .error {
            margin: 0.5rem 0 0;
            display: none;
            color: brown;
          }
          .error.show {
            display: block;
          }
        `}</style>
      </div>
    )
  }
}

export default Login