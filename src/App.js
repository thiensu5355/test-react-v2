import React from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import './App.css';
import axios from 'axios';
import _ from 'lodash';

class App extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false,
      data: [],
      email: '',
      password: ''
    };
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

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
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
        show: false,
        email: '',
        password: ''
      });
    });
  }

  onDelete = (id) => {
    axios.delete(`https://economic-database.azurewebsites.net/user/${id}`)
    .then(res => {
     const data = _.reject(this.state.data, function(el) { return el['_id'] === "5cd23119264380279cb640ff"; });
      this.setState({
        data: data
      });
    });
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="addButton">
            <Button variant="primary" onClick={this.handleShow}>
              <i className="fas fa-plus"></i> Add
            </Button>
          </div>
          <div>
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
                      <td><Button variant="primary" size="sm"><i className="fas fa-edit"></i></Button></td>
                      <td><Button onClick={() => this.onDelete(data._id)} variant="primary" size="sm"><i className="fas fa-trash-alt"></i></Button></td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
          </div>
          <div>
            <Modal show={this.state.show} onHide={this.handleClose} size="lg" aria-labelledby="example-modal-sizes-title-lg">
              <Modal.Header closeButton>
                <Modal.Title>Add User</Modal.Title>
              </Modal.Header>
              <Form onSubmit={this.onSubmit}>
                <Modal.Body>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control name="email" type="email" placeholder="Enter email" value={this.state.email} onChange={this.onChange} />
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control name="password" type="password" placeholder="Password" value={this.state.password} onChange={this.onChange} />
                  </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={this.handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" type="submit">
                    Save
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
