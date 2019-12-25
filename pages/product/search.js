import { Formik, Field, Form, ErrorMessage } from 'formik';
import React from 'react';
// import * as Yup from 'yup';
import {
    Card, CardHeader, CardFooter
} from 'reactstrap';
import axios from 'axios';
import { withAuthSync } from '../../utils/auth'
import Pagination from "react-js-pagination";
import Link from "next/link";

class SearchItem extends React.Component {
    static async getInitialProps ({query}) {
        debugger
        // query.slug
      }
    constructor(props) {
        debugger
        super(props);
        this.state = {
            result: '',
            products: [],
            totalElements: '',
            activePage: 0,
            itemsCountPerPage: 20,
            values: {}
        }
        this.removeItem = this.removeItem.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this)
    }

    removeItem = (productNo, version) => {
        debugger
        axios({
            method: 'delete',
            url: 'http://localhost:8082/ndvn-wms-war/api/deleteItem.json',
            headers: {
                'Authorization': 'Bearer ' + this.props.token,
                'Content-Type': 'application/json'
            },
            params: {
                productNo,
                version
            }
        }).then(res => {
            this.setState({
                result: res.status,
            })
        }).catch(err => {
            this.setState({
                result: err.response.status
            })
        })
    }

    handlePageChange = (pageNumber) => {
        const values = this.state.values;
        values['page'] = pageNumber;
        // values['size'] = 20;
        this.setState({
            activePage: pageNumber,
            values
        })

        axios({
            method: 'get',
            url: 'http://localhost:8082/ndvn-wms-war/api/products/search.json',
            headers: {
                'Authorization': 'Bearer ' + this.props.token,
                'Content-Type': 'application/json'
            },
            params: values
        }).then(res => {
            console.log(res);
            this.setState({
                result: res.status,
                products: res.data.data,
                // totalElements: res.data.metadata.paging.totalElements
            })
        }).catch(err => {
            console.log(err);
            this.setState({
                result: err.response.status
            })
        })
    }

    render() {
        return (
            <Formik
                initialValues={{
                    categoryCode: '', customerCode: '', locCode: '', productNo: '', status: '', supplierCode: ''
                }}

                onSubmit={(values) => {
                    debugger
                    values.status = values.status.toString();
                    // values['page'] = 0;
                    // values['size'] = 20;
                    axios({
                        method: 'get',
                        url: 'http://localhost:8082/ndvn-wms-war/api/products/search.json',
                        headers: {
                            'Authorization': 'Bearer ' + this.props.token,
                            'Content-Type': 'application/json'
                        },
                        params: values
                    }).then(res => {
                        console.log(res);
                        this.setState({
                            result: res.status,
                            products: res.data.data,
                            totalElements: res.data.metadata.paging.totalElements,
                            values
                        })
                    }).catch(err => {
                        console.log(err);
                        this.setState({
                            result: err.response.status
                        })
                    })
                }}
            >
                {/* Start search condition */}
                <Form>
                    <h2>{this.state.result}</h2>
                    <Card>
                        <CardHeader>
                            Search Condition
                        </CardHeader>
                        <table className="form-table table table-bordered">
                            <colgroup>
                                <col width="20%" />
                                <col width="30%" />
                                <col width="20%" />
                                <col width="30%" />
                            </colgroup>
                            <tbody>
                                <tr>
                                    <td className="control-label">product</td>
                                    <td><Field name="productNo" type="text" className="form-control" maxLength="50" tabIndex="0" /></td>
                                    <td className="control-label">status</td>
                                    <td>
                                        <Field tabIndex="0" type="checkbox" name="status" value="1" />Active
                                    <Field tabIndex="0" type="checkbox" name="status" value="0" />No active
                                    </td>
                                </tr>
                                <tr>
                                    <td className="control-label">customer</td>
                                    <td><Field name="customerCode" type="text" className="form-control" maxLength="50" tabIndex="0" /></td>
                                    <td className="control-label">supplier</td>
                                    <td>
                                        <Field name="supplierCode" type="text" className="form-control" maxLength="50" tabIndex="0" />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="control-label">loc</td>
                                    <td><Field name="locCode" type="text" className="form-control" maxLength="50" tabIndex="0" /></td>
                                    <td className="control-label">category</td>
                                    <td>
                                        <Field name="categoryCode" type="text" className="form-control" maxLength="50" tabIndex="0" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        { /* Card footer */}
                        <CardFooter>
                            <button type="submit" className="button btn btn-primary">
                                Save
                        </button>
                        </CardFooter>
                        { /* End card footer */}
                    </Card>

                    {/* Search result */}
                    <Card>
                        <CardHeader>
                            {this.state.totalElements > 0 &&
                                <span>Find {this.state.totalElements} items</span>
                            }
                            {this.state.totalElements === 0 &&
                                <span>Not found</span>
                            }
                        </CardHeader>
                        {this.state.products && this.state.totalElements > 0 && (
                            <table className="form-table table table-bordered table-striped stickyTable">
                                <colgroup>
                                    <col />
                                    <col />
                                    <col />
                                    <col />
                                    <col />
                                    <col width="1%" />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: "left" }}>product_no</th>
                                        <th style={{ textAlign: "left" }}>product_name</th>
                                        <th style={{ textAlign: "left" }}>category</th>
                                        <th style={{ textAlign: "left" }}>unit</th>
                                        <th style={{ textAlign: "left" }}>status</th>
                                        <th><span>{' '}</span></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {this.state.products.map(item =>
                                        <tr key={item.productNo}>
                                            <td>
                                                <a href="#">{item.productNo}</a>
                                            </td>
                                            <td style={{ textAlign: "left" }}>{item.productName}</td>
                                            <td style={{ textAlign: "left" }}>{item.categoryCode}</td>
                                            <td style={{ textAlign: "left" }}>{item.unit}</td>
                                            <td style={{ textAlign: "left" }}>
                                                {item.status == "1" && <span>Active</span>}
                                                {item.status == "0" && <span>No active</span>}
                                            </td>
                                            <td> <Link href={{ pathname: './update', query: { productNo: item.productNo } }}><a>update</a></Link>
                                                <span>{'  '}</span>
                                                <a href="#" className='cssCursor' onClick={() => { if (window.confirm('Delete the item?')) { this.removeItem(item.productNo, item.version) }; }}>
                                                    remove</a>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                        <CardFooter>
                            {this.state.totalElements > 0 &&
                                <Pagination
                                    activePage={this.state.activePage}
                                    itemsCountPerPage={this.state.itemsCountPerPage}
                                    totalItemsCount={this.state.totalElements}
                                    pageRangeDisplayed={10}
                                    onChange={this.handlePageChange}
                                />
                            }
                        </CardFooter>
                    </Card>
                </Form>
            </Formik>
        )
    }
}

export default withAuthSync(SearchItem)


