import React, { Component } from 'react';
import "../style/Contact.css";


class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      message: ''
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    // You can add your form submission logic here
    console.log('Form submitted:', this.state);
  };

  render() {
    return (
      <div className="contact-form">
        <span className="heading">Contact Us</span>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="name">Name:</label>
          <input 
            type="text" 
            name="name" 
            value={this.state.name} 
            onChange={this.handleChange} 
            required 
          />
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={this.state.email} 
            onChange={this.handleChange} 
            required 
          />
          <label htmlFor="message">Message:</label>
          <textarea 
            id="message" 
            name="message" 
            value={this.state.message} 
            onChange={this.handleChange} 
            required 
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default Contact;
