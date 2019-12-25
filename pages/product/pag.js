import React, { Component } from "react";
import Pagination from "react-js-pagination";
// import "bootstrap/less/bootstrap.less";
 
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 0
    };
    this.handlePageChange = this.handlePageChange.bind(this)
  }
 
  handlePageChange(pageNumber) {
    console.log(`active page is ${pageNumber}`);
    this.setState({activePage: pageNumber});
  }
 
  render() {
    return (
      <div>
        <Pagination
          activePage={this.state.activePage}
          itemsCountPerPage={20}
          totalItemsCount={450}
          pageRangeDisplayed={10}
          onChange={this.handlePageChange}
        />
      </div>
    );
  }
}
 
export default App