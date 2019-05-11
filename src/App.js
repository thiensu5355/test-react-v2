import React from 'react';
import { Button, Form, Table, Col, Alert } from 'react-bootstrap';
import './App.css';
import axios from 'axios';
import _ from 'lodash';

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      edit: false,
      show: false,
      showMessage: {
        show: false,
        message: ''
      },
      data: [],
      email: '',
      password: ''
    };
  }

  onAdd = () => {
    this.setState({
      edit: false,
      show: true,
      email: '',
      password: ''
    });
  }

  componentDidMount() {
    axios.get('https://economic-database.azurewebsites.net/user').then(res => {
      this.setState({
        data: res.data
      })
    }).catch(err => {
      console.log(err);
    });
  }

  onChange = (event) => {
    var target = event.target;
    var name = target.name;
    var value = target.value;
    this.setState({
      [name]: value
    });
  }

  onSubmit = (event) => {
    event.preventDefault();
    const data = {
      email: this.state.email,
      password: this.state.password
    }
    axios.post('https://economic-database.azurewebsites.net/user', data)
      .then(res => {
        this.state.data.push(res.data);
        this.setState({
          showMessage: {
            show: true,
            message: 'Them Thanh Cong'
          },
          show: false,
          email: '',
          password: ''
        }, () => {
          setTimeout(() => {
            this.setState({
              showMessage: {
                show: false,
                message: ''
              }
            });
          }, 2000);
        });
      });
  }

  onDelete = (id) => {
    axios.delete(`https://economic-database.azurewebsites.net/user/${id}`)
      .then((res) => {
        const data = _.reject(this.state.data, function (el) { return el['_id'] === id; });
        this.setState({
          data: data,
          showMessage: {
            show: true,
            message: 'Delete Thanh Cong'
          },
        }, () => {
          setTimeout(() => {
            this.setState({
              showMessage: {
                show: false,
                message: ''
              }
            });
          }, 2000);
        });
      });
  }

  onEdit = (data) => {
    this.setState({
      id: data._id,
      show: true,
      edit: true,
      email: data.email,
      password: data.password
    });
  }

  onSubmitedit = (event) => {
    event.preventDefault();
    const data = {
      email: this.state.email,
      password: this.state.password
    }
    axios.put(`https://economic-database.azurewebsites.net/user/${this.state.id}`, data)
      .then((res) => {
        const objIndex = this.state.data.findIndex(obj => obj._id === this.state.id);
        let y = this.state.data;
        y[objIndex].email = this.state.email;
        y[objIndex].password = this.state.password;
        this.setState({
          showMessage: {
            show: true,
            message: 'Edit Thanh Cong'
          },
          show: false,
          edit: false,
          email: '',
          password: ''
        }, () => {
          setTimeout(() => {
            this.setState({
              showMessage: {
                show: false,
                message: ''
              }
            });
          }, 2000);
        });
      });
  }

  render() {
    return (
      <div>
        <div className="container">
          {
            (this.state.showMessage.show) ?
              <div className="message text-center">
                <Alert variant="success">
                  {this.state.showMessage.message}
                </Alert>
              </div>
              : null
          }
          <div className="addButton">
            <Button variant="primary" onClick={this.onAdd}>
              <i className="fas fa-plus"></i> Add
            </Button>
          </div>
          <div className="dataTable">
            <Table className="text-center" striped bordered hover size="sm">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Email</th>
                  <th scope="col">Password</th>
                  <th scope="col">Edit</th>
                  <th scope="col">Delete</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.data.map((data, index) => (
                    <tr key={data._id}>
                      <th scope="row">{index + 1}</th>
                      <td>{data.email}</td>
                      <td>{data.password}</td>
                      <td><Button onClick={() => this.onEdit(data)} variant="info" size="sm"><i className="fas fa-edit"></i></Button></td>
                      <td><Button onClick={() => this.onDelete(data._id)} variant="danger" size="sm"><i className="fas fa-trash-alt"></i></Button></td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
          </div>
          {
            (this.state.show) ?
              <Col xs={6} md={6} className="dataFrom">
                <Form onSubmit={(this.state.edit) ? this.onSubmitedit : this.onSubmit}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control name="email" type="email" placeholder="Enter email" value={this.state.email} onChange={this.onChange} />
                  </Form.Group>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control name="password" type="password" placeholder="Password" value={this.state.password} onChange={this.onChange} />
                  </Form.Group>
                  <Col xs={8} md={2} className="buttonAdd">
                    <Button variant="primary" type="submit">Save</Button>
                  </Col>
                </Form>
              </Col> : null
          }
        </div>
      </div>
    );
  }
}

export default App;
