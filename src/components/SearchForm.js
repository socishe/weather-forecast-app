import React, { Component } from "react";
import "./SearchForm.css";

class SearchForm extends Component {
  state = {
    city: "Cape Town",
  };

  onFormSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit(this.state.city);
  };

  render() {
    return (
      <div className="inline-input">
        <form onSubmit={this.onFormSubmit}>
          <input
            type="text"
            placeholder="Search for a place"
            value={this.state.city}
            onChange={(e) => this.setState({ city: e.target.value })}
          />
        </form>
      </div>
    );
  }
}
export default SearchForm;
