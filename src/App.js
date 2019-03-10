import React, { Component } from "react";
import axios from 'axios';


// Components
import Sidebar from "./Sidebar";
import AuthorsList from "./AuthorsList";
import AuthorDetail from "./AuthorDetail";

class App extends Component {
  state = {
    currentAuthor: null,
    filteredAuthors: [],
    authors: [],
    loading: true,
    error: null
  };
  async componentDidMount() {
    try {
      const response = await axios.get("https://the-index-api.herokuapp.com/api/authors/");
      const authors = response.data;
      this.setState({ authors: authors, filteredAuthors: authors, loading: false });
    } catch (error) {
      console.log("something went wrong ");
      console.log(error);
      this.setState({ erroe: error });
    }
  }

  selectAuthor = async (author) => {
    try {
      const response = await axios.get(`https://the-index-api.herokuapp.com/api/authors/${author.id}/`);
      const newAuthor = response.data;
      this.setState({ currentAuthor: newAuthor });
    } catch (error) {
      console.log("something went wrong ");
      console.log(error);
      this.setState({ erroe: error });
    }
  };

  unselectAuthor = () => this.setState({ currentAuthor: null });

  filterAuthors = query => {
    query = query.toLowerCase();
    let filteredAuthors = this.state.authors.filter(author => {
      return `${author.first_name} ${author.last_name}`
        .toLowerCase()
        .includes(query);
    });
    this.setState({ filteredAuthors: filteredAuthors });
  };

  getContentView = () => {
    if (this.state.currentAuthor) {
      return <AuthorDetail author={this.state.currentAuthor} />;
    } else {
      return (
        <AuthorsList
          authors={this.state.filteredAuthors}
          selectAuthor={this.selectAuthor}
          filterAuthors={this.filterAuthors}
        />
      );
    }
  };

  render() {
    if (this.state.error) return <div>somthing went wrong! </div>;
    if (this.state.loading) return <div>loading...</div>
    return (
      <div id="app" className="container-fluid">
        <div className="row">
          <div className="col-2">
            <Sidebar unselectAuthor={this.unselectAuthor} />
          </div>
          <div className="content col-10">{this.getContentView()}</div>
        </div>
      </div>
    );
  }
}

export default App;
