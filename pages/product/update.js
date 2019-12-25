import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import React from 'react';
import Select2 from 'react-select2-wrapper';
import {
    Card, CardHeader, CardFooter
} from 'reactstrap';
import axios from 'axios';
import { withAuthSync } from '../../utils/auth'

const Location = (props) => {
    return (
        <table className="form-table table table-bordered">
            <colgroup>
                <col width="2%" />
                <col width="20%" />
                <col width="20%" />
                <col width="20%" />
                <col width="30%" />
            </colgroup>
            <thead>
                <tr>
                    <th align="right">no</th>
                    <th align="right">qty</th>
                    <th align="left">warehouse</th>
                    <th align="left">loc_code</th>
                    <th align="left">loc_name</th>
                    <th />
                </tr>
            </thead>
            <tbody>
                {props.field.value.map((item, index) =>
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td><input type="text" value={item && item.qty ? item.qty : ''} onChange={(e) => {
                            const qty = e.target.value;
                            if (/^\d*$/.test(qty)) {
                                const newData = props.field.value;
                                newData[index].qty = qty;
                                props.form.setFieldValue('locations', newData);
                                return true
                            } else {
                                return false
                            }
                        }} /></td>
                        <td>
                            <Select2
                                value={item && item.whCode ? item.whCode : ''}
                                onChange={(e) => {
                                    const whCode = e.target.value;
                                    const newData = props.field.value;
                                    newData[index].whCode = whCode
                                    props.form.setFieldValue('locations', newData);
                                    props.getLocCode(whCode, index);
                                }}
                                data={props.whCodeList}
                            />
                        </td>
                        <td>
                            <Select2
                                value={item && item.locCode ? item.locCode : ''}
                                onChange={(e) => {
                                    const locCode = e.target.value;
                                    const newData = props.field.value;
                                    const locObj = props.locList && props.locList[index] ? props.locList[index].find(element => element.loc_code == locCode): '';
                                    const locName = locObj && locObj.loc_name ? locObj.loc_name : '';
                                    newData[index].locCode = locCode;
                                    newData[index].locName = locName;
                                    props.form.setFieldValue('locations', newData);
                                }}
                                data={props.locCodeList[index]}
                            />
                        </td>
                        <td>
                            <span>{item && item.locName ? item.locName : ''}</span>
                        </td>
                        <td><a href="#"
                            onClick={() => {
                                const newData = props.field.value;
                                newData.splice(index, 1);
                                props.form.setFieldValue('locations', newData)
                                props.removeLocList(index);
                            }} // remove a friend from the list
                        > remove
                            </a>
                        </td>
                    </tr>
                )}
            </tbody>
            <tfoot>
                <tr>
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                    <td align="center">
                        <a href="#"
                            onClick={() => {
                                const newData = props.field.value;
                                newData.push({
                                    qty: '',
                                    locCode: '',
                                    locName: '',
                                    whCode: ''
                                })
                                props.form.setFieldValue('locations', newData);
                                props.addLocList();
                            }}
                        >
                            add
                                </a>
                    </td>
                </tr>
            </tfoot>
        </table>
    )
}
const StorageUnit = (props) => {
    return (
        <table className="form-table table table-bordered">
            <colgroup>
                <col width="2%" />
                <col width="20%" />
                <col width="70%" />
                <col width="8%" />
            </colgroup>
            <thead>
                <tr>
                    <th align="right">no</th>
                    <th align="left">storage_unit_code</th>
                    <th align="left">storage_unit_name</th>
                    <th align="center" />
                </tr>
            </thead>
            <tbody>
                {props.field.value.map((item, index) =>
                    <tr key={index}>
                        <td><span>{index + 1}</span></td>
                        <td>
                            <Select2
                                value={item && item.storageUnitCode ? item.storageUnitCode : ''}
                                onChange={(e) => {
                                    const productNo = e.target.value;
                                    const newData = props.field.value;
                                    const productObj = props.storageUnitList.find(element => element.product_no == productNo);
                                    const productName = productObj && productObj.product_name ? productObj.product_name : '';
                                    newData[index] = {
                                        storageUnitCode: productNo,
                                        storageUnitName: productName
                                    }
                                    props.form.setFieldValue('storageUnits', newData);
                                }}
                                data={props.storageUnitCodeList}
                            />
                        </td>
                        <td>
                            <span className="storageName">{item && item.storageUnitName ? item.storageUnitName : ''}</span>
                        </td>
                        <td align="center">
                            <br /><br />
                            <a href="#" onClick={() => {
                                const newData = props.field.value;
                                newData.splice(index, 1);
                                props.form.setFieldValue('storageUnits', newData)
                            }}>remove</a>
                        </td>
                    </tr>
                )}
            </tbody>
            <tfoot>
                <tr>
                    <td />
                    <td />
                    <td />
                    <td align="center">
                        <br /><br />
                        <a href="#" onClick={() => {
                            const newData = props.field.value;
                            newData.push({
                                "storageUnitCode": "",
                                "storageUnitName": ""
                            });
                            props.form.setFieldValue('storageUnits', newData)
                        }}>add</a>
                    </td>
                </tr>
            </tfoot>
        </table>
    )
}

class UpdateItem extends React.Component {
    static async getInitialProps (ctx) {
        debugger
        return {
            productNo: ctx.query.productNo
        }
      }
    constructor(props) {
        debugger
        super(props);
        this.state = {
            unitList: [],
            categoryList: [],
            suggestModel: [],
            fifoUnit: [],
            storageUnitCodeList: [],
            storageUnitList: [],
            whCodeList: [],
            locCodeList: [],
            locList: [],
            result: {
                productNo: '', productName: '', unit: '', categoryCode: '', customerCode: '', supplierCode: '', productLocalName: '', productNumber: '', color: '', modelCode: '', market: '', remark: '', palletCap: '', fifoUnit: '', upc: '', boxCap: '',
                    length: '', width: '', height: '', weight: '', volume: '', surface: '',
                    storageUnits: [],
                    locations: [],
                    version: 0,
                    status: ''
            },
            productNo: '',
        };
        this.getLocCode = this.getLocCode.bind(this);
        this.removeLocList = this.removeLocList.bind(this);
        this.addLocList = this.addLocList.bind(this);
        this.pushLocCode = this.pushLocCode.bind(this);
    }

    componentDidMount() {
        axios({
            method: 'get',
            url: `http://localhost:8082/ndvn-wms-war/api/products/${this.props.productNo}.json`,
            headers: {
                'Authorization': 'Bearer ' + this.props.token
            }
        }).then(res => {
            this.setState({
                result: res.data.data
            })
            this.state.result.locations.forEach((item) => {
                this.pushLocCode(item.whCode)
              });
        }).catch((error) => {
            console.log(error)
        });
        axios({
            method: 'get',
            url: 'http://localhost:8082/ndvn-wms-war/api/ajaxList.json?sqlId=unit.getUnitList',
            headers: {
                'Authorization': 'Bearer ' + this.props.token
            }
        }).then(res => {
            this.setState({
                unitList: res.data.data.map(e => e.unit)
            })
        }).catch((error) => {
            console.log(error)
        });

        axios({
            method: 'get',
            url: 'http://localhost:8082/ndvn-wms-war/api/ajaxList.json?sqlId=MS01.getCategoryList',
            headers: {
                'Authorization': 'Bearer ' + this.props.token
            }
        }).then(res => {
            this.setState({
                categoryList: res.data.data.map(e => e.category_code)
            })
        }).catch((error) => {
            console.log(error)
        });

        axios({
            method: 'get',
            url: 'http://localhost:8082/ndvn-wms-war/api/ajaxList.json?sqlId=MS01.suggestModel',
            headers: {
                'Authorization': 'Bearer ' + this.props.token
            }
        }).then(res => {
            this.setState({
                suggestModel: res.data.data.map(e => e.model_code)
            })
        }).catch((error) => {
            console.log(error)
        });

        axios({
            method: 'get',
            url: 'http://localhost:8082/ndvn-wms-war/api/ajaxList.json',
            headers: {
                'Authorization': 'Bearer ' + this.props.token
            }
        }).then(res => {
            this.setState({
                fifoUnit: res.data.data
            })
        }).catch((error) => {
            console.log(error)
        });

        axios({
            method: 'get',
            url: 'http://localhost:8082/ndvn-wms-war/api/ajaxList.json?sqlId=MS01.getStorageUnits',
            headers: {
                'Authorization': 'Bearer ' + this.props.token
            }
        }).then(res => {
            this.setState({
                storageUnitCodeList: res.data.data.map(e => e.product_no),
                storageUnitList: res.data.data
            })
        }).catch((error) => {
            console.log(error)
        });

        axios({
            method: 'get',
            url: 'http://localhost:8082/ndvn-wms-war/api/ajaxList.json?sqlId=MS01.getWarehouse',
            headers: {
                'Authorization': 'Bearer ' + this.props.token
            }
        }).then(res => {
            this.setState({
                whCodeList: res.data.data.map(e => e.wh_code),
            })
        }).catch((error) => {
            console.log(error)
        });
    }

    getLocCode = (whCode, index) => {
        axios({
            method: 'get',
            url: `http://localhost:8082/ndvn-wms-war/api/ajaxList.json?sqlId=MS01.getLocations&limit=20&whCode=${whCode}&byWhCode=true`,
            headers: {
                'Authorization': 'Bearer ' + this.props.token
            }
        }).then(res => {
            const oldLocCodeList = this.state.locCodeList;
            oldLocCodeList[index] = res.data.data.map(e => e.loc_code);
            const oldLocList = this.state.locList;
            oldLocList[index] = res.data.data;
            this.setState({
                locCodeList: oldLocCodeList,
                locList: oldLocList
            })
        }).catch((error) => {
            console.log(error)
        });
    }

    pushLocCode = (whCode) => {
        axios({
            method: 'get',
            url: `http://localhost:8082/ndvn-wms-war/api/ajaxList.json?sqlId=MS01.getLocations&limit=20&whCode=${whCode}&byWhCode=true`,
            headers: {
                'Authorization': 'Bearer ' + this.props.token
            }
        }).then(res => {
            const oldLocCodeList = this.state.locCodeList;
            oldLocCodeList.push(res.data.data.map(e => e.loc_code));
            const oldLocList = this.state.locList;
            oldLocList.push(res.data.data);
            this.setState({
                locCodeList: oldLocCodeList,
                locList: oldLocList
            })
        }).catch((error) => {
            console.log(error)
        });
    }

    removeLocList = (index) => {
        const oldLocCodeList = this.state.locCodeList;
        oldLocCodeList.splice(index, 1);
        const oldLocList = this.state.locList;
        oldLocList.splice(index, 1);
        this.setState({
            locCodeList: oldLocCodeList,
            locList: oldLocList
        })
    }

    addLocList = () => {
        const oldLocCodeList = this.state.locCodeList;
        oldLocCodeList.push(['']);
        const oldLocList = this.state.locList;
        oldLocList.push([{
            loc_code: '',
            loc_name: ''
        }])
        this.setState({
            locCodeList: oldLocCodeList,
            locList: oldLocList
        })
    }

    render() {
        return (
            <Formik
                initialValues={this.state.result}
                validationSchema={Yup.object({
                    productNo: Yup.string()
                        .required('Required'),
                    productName: Yup.string()
                        .required('Required'),
                    unit: Yup.string()
                        .required('Required'),
                    categoryCode: Yup.string()
                        .required('Required'),
                    customerCode: Yup.string()
                        .required('Required'),
                    supplierCode: Yup.string()
                        .required('Required'),
                    palletCap: Yup.number("").required("Required").positive("Must be positive number"),
                    boxCap: Yup.number("Must be number").required("Required").positive("Must be positive number"),
                    length: Yup.number("Must be number").required("Required").positive("Must be positive number"),
                    width: Yup.number("Must be number").required("Required").positive("Must be positive number"),
                    height: Yup.number("Must be number").required("Required").positive("Must be positive number"),
                    weight: Yup.number("Must be number").required("Required").positive("Must be positive number"),
                    volume: Yup.number("Must be number").required("Required").positive("Must be positive number"),
                    surface: Yup.number("Must be number").required("Required").positive("Must be positive number")
                })}
                enableReinitialize={true}
                onSubmit={ (values) => {
                    debugger
                    axios({
                        method: 'put',
                        url: `http://localhost:8082/ndvn-wms-war/api/updateItem/${values.productNo}.json`,
                        headers: {
                            'Authorization': 'Bearer ' + this.props.token,
                            'Content-Type': 'application/json'
                        },
                        data: values
                    }).then(res => {
                        this.setState({
                            result: res.data.data
                        })
                        this.state.result.locations.forEach((item, index) => {
                            this.getLocCode(item.whCode, index)
                          });
                    }).catch((error) => {
                        console.log(error)
                    });
                }}
            >

                <Form>
                    { /* Start Product information */}
                    <Card>
                        <CardHeader>
                            Product information
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
                                    { /*  ITEM_NO */}
                                    <td className="control-label"> ITEM_NO <span className="required">&nbsp;*</span></td>
                                    <td>
                                        <Field name="version" type="text" className="form-control" maxLength="50" tabIndex="0" hidden={true} />
                                        <Field name="productNo" type="text" className="form-control" maxLength="50" tabIndex="0" disabled={true}  />
                                    </td>
                                    {/* STATUS */}
                                    <td className="control-label"> STATUS <span className="required">&nbsp;*</span></td>
                                    <td> <Field name="status" type="text" className="form-control" maxLength="50" tabIndex="0" disabled={true} /> </td>
                                </tr>
                                <tr>
                                    { /* PRODUCT_LOCAL_NAME */}
                                    <td className="control-label">PRODUCT_LOCAL_NAME</td>
                                    <td><Field name="productLocalName" type="text" className="form-control" maxLength="50" tabIndex="0"  /><ErrorMessage name="productLocalName" /></td>
                                    { /*  ITEM_NAME */}
                                    <td className="control-label"> ITEM_NAME</td>
                                    <td>
                                        <Field name="productName" type="text" className="form-control" maxLength="50" tabIndex="0"  /><ErrorMessage name="productName" />
                                    </td>
                                </tr>
                                <tr>
                                    { /* Color */}
                                    <td className="control-label">Color</td>
                                    <td><Field name="color" type="text" className="form-control" maxLength="50" tabIndex="0" /><ErrorMessage name="color" /></td>
                                    { /*  ITEM_NUMBER */}
                                    <td className="control-label">ITEM_NUMBER <span className="required">&nbsp;*</span></td>
                                    <td>
                                        <Field name="productNumber" type="text" className="form-control" maxLength="50" tabIndex="0" /><ErrorMessage name="productNumber" />
                                    </td>
                                </tr>
                                <tr>
                                    { /* CATEGORY */}
                                    <td className="control-label">CATEGORY <span className="required">&nbsp;*</span></td>
                                    <td>
                                        <Field name="categoryCode" tabIndex="0"
                                            component={props =>
                                                <Select2
                                                    name={props.field.name}
                                                    value={props.field.value}
                                                    onChange={props.field.onChange}
                                                    onBlur={() => props.field.onBlur(props.field.value)}
                                                    data={this.state.categoryList}       
                                                />
                                            }
                                        /><ErrorMessage name="categoryCode" />
                                    </td>
                                    { /* UNIT */}
                                    <td className="control-label">UNIT <span className="required">&nbsp;*</span></td>
                                    <td>
                                        <Field name="unit" tabIndex="0"
                                            component={props =>
                                                <Select2
                                                    name={props.field.name}
                                                    value={props.field.value}
                                                    onChange={props.field.onChange}
                                                    onBlur={() => props.field.onBlur(props.field.value)}
                                                    data={this.state.unitList}
                                                />
                                            }
                                        /><ErrorMessage name="unit" />
                                    </td>
                                </tr>
                                <tr>
                                    { /* OWNER */}
                                    <td className="control-label">OWNER<span className="required">&nbsp;*</span></td>
                                    <td><Field name="customerCode" type="text" className="form-control" maxLength="50" tabIndex="0" /><ErrorMessage name="customerCode" /></td>
                                    { /* MODEL_CODE */}
                                    <td className="control-label">MODEL_CODE</td>
                                    <td>
                                        <Field name="modelCode" tabIndex="0"
                                            component={props =>
                                                <Select2
                                                    name={props.field.name}
                                                    value={props.field.value ? props.field.value : ''}
                                                    onChange={props.field.onChange}
                                                    data={this.state.suggestModel}
                                                />
                                            }
                                        /><ErrorMessage name="modelCode" />
                                    </td>
                                </tr>
                                <tr>
                                    { /* SUPPLIER_CODE */}
                                    <td className="control-label">SUPPLIER_CODE <span className="required">&nbsp;*</span></td>
                                    <td><Field name="supplierCode" type="text" className="form-control" maxLength="50" tabIndex="0"  /><ErrorMessage name="supplierCode" /></td>
                                    { /* UPC */}
                                    <td className="control-label">UPC</td>
                                    <td><Field name="upc" type="text" className="form-control" maxLength="50" tabIndex="0"  /><ErrorMessage name="upc" /></td>
                                </tr>
                                <tr>
                                    { /* MARKET */}
                                    <td className="control-label">MARKET</td>
                                    <td><Field name="market" type="text" className="form-control" maxLength="50" tabIndex="0" /><ErrorMessage name="market" /></td>
                                    { /* Pallet Capacity */}
                                    <td className="control-label">Pallet Capacity</td>
                                    <td><Field name="palletCap" type="text" className="form-control" maxLength="50" tabIndex="0" /><ErrorMessage name="palletCap" /></td>
                                </tr>
                                <tr>
                                    { /* REMARK */}
                                    <td className="control-label">REMARK</td>
                                    <td><Field name="remark" type="text" className="form-control" maxLength="50" tabIndex="0" /><ErrorMessage name="remark" /></td>
                                    { /* Fifo */}
                                    <td className="control-label">Fifo</td>
                                    <td>
                                        <Field name="fifoUnit" tabIndex="0"
                                            component={props =>
                                                <Select2
                                                    name={props.field.name}
                                                    value={props.field.value ? props.field.value : ''}
                                                    onChange={props.field.onChange}
                                                    onBlur={() => props.field.onBlur(props.field.value)}
                                                    data={this.state.fifoUnit}
                                                />
                                            }
                                        /><ErrorMessage name="fifoUnit" />
                                    </td>
                                </tr>
                                <tr>
                                    { /* box_capacity */}
                                    <td className="control-label">box_capacity <span className="required">&nbsp;*</span></td>
                                    <td><Field name="boxCap" type="text" className="form-control" maxLength="50" tabIndex="0" /><ErrorMessage name="boxCap" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </Card>
                    { /* End Product information */}

                    { /* Start attributes */}
                    <Card>
                        <CardHeader>
                            Start attributes
                        </CardHeader>
                        <table className="form-table table table-bordered">
                            <colgroup>
                                <col />
                                <col />
                                <col />
                                <col />
                                <col />
                                <col />
                            </colgroup>
                            <tbody>
                                <tr>
                                    { /* LENGTH */}
                                    <td className="control-label">LENGTH</td>
                                    <td>
                                        <Field name="length" type="text" className="form-control" maxLength="50" tabIndex="0"  /><ErrorMessage name="length" />
                                        <div className="input-group-append">
                                            <span className="input-group-text">cm</span>
                                        </div>
                                    </td>
                                    { /* WIDTH */}
                                    <td className="control-label">WIDTH</td>
                                    <td>
                                        <Field name="width" type="text" className="form-control" maxLength="50" tabIndex="0" /><ErrorMessage name="width" />
                                        <div className="input-group-append">
                                            <span className="input-group-text">cm</span>
                                        </div>
                                    </td>
                                    { /* HEIGHT */}
                                    <td className="control-label">HEIGHT</td>
                                    <td>
                                        <Field name="height" type="text" className="form-control" maxLength="50" tabIndex="0" /><ErrorMessage name="height" />
                                        <div className="input-group-append">
                                            <span className="input-group-text">cm</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    { /* WEIGHT */}
                                    <td className="control-label">WEIGHT</td>
                                    <td>
                                        <Field name="weight" type="text" className="form-control" maxLength="50" tabIndex="0" 
                                        /><ErrorMessage name="weight" />
                                        <div className="input-group-append">
                                            <span className="input-group-text">kg</span>
                                        </div>
                                    </td>
                                    { /* VOLUME */}
                                    <td className="control-label">VOLUME</td>
                                    <td>
                                        <Field name="volume" type="text" className="form-control" maxLength="50" tabIndex="0"
                                        /><ErrorMessage name="volume" />
                                        <div className="input-group-append">
                                            <span className="input-group-text">cm3</span>
                                        </div>
                                    </td>
                                    { /* SURFACE */}
                                    <td className="control-label">SURFACE</td>
                                    <td>
                                        <Field name="surface" type="text" className="form-control" maxLength="50" tabIndex="0"
                                        /><ErrorMessage name="surface" />
                                        <div className="input-group-append">
                                            <span className="input-group-text">cm2</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Card>
                    { /* END attributes */}

                    { /* START PLACE_ON_STOREAGE_UNIT */}
                    <Card>
                        <CardHeader>
                            START PLACE_ON_STOREAGE_UNIT
                        </CardHeader>
                        <Field name="storageUnits" component={StorageUnit} storageUnitCodeList={this.state.storageUnitCodeList} storageUnitList={this.state.storageUnitList} />
                    </Card>
                    { /*END PLACE_ON_STOREAGE_UNIT */}

                    { /* Start Location List */}
                    <Card>
                        <CardHeader>
                            Start Location List
                        </CardHeader>
                        <Field name="locations" component={Location} whCodeList={this.state.whCodeList} locList={this.state.locList} locCodeList={this.state.locCodeList} getLocCode={this.getLocCode} removeLocList={this.removeLocList} addLocList={this.addLocList}/>
                    </Card>
                    { /* End Location List */}

                    { /* Card footer */}
                    <CardFooter>
                        <button type="submit" className="button btn btn-primary">
                            Save
                        </button>
                    </CardFooter>
                    { /* End card footer */}
                </Form>
            </Formik>
        )
    }
}

export default withAuthSync(UpdateItem)