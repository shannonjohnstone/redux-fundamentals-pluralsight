import React from 'react';
import { createStore } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import axios from 'axios';
import debounce from 'lodash.debounce';
import store from '../stores/configureStore';
import * as actions from '../actions';
import actionTypes from '../stores/actionTypes';

class FeesTable extends React.PureComponent {
    render() {
        var {conversionRate, fee, total, originCurrency, destinationCurrency} = this.props;

        return (
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>Conversion Rate</td>
                            <td>1 {originCurrency} -> {conversionRate.toFixed(2)} {destinationCurrency}</td>
                        </tr>
                        <tr>
                            <td>Fee</td>
                            <td>{fee.toFixed(2)} {originCurrency}</td>
                        </tr>
                        <tr>
                            <td className="total-label">Total Cost</td>
                            <td>{total.toFixed(2)} {originCurrency}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

FeesTable.propTypes = {
    conversionRate: PropTypes.number.isRequired,
    originCurrency: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    destinationCurrency: PropTypes.string.isRequired
}

class Conversion extends React.Component {
    constructor(props) {
        super(props);
        // bind event listeners so 'this' will be available in the handlers
        this.handleOriginAmountChange = this.handleOriginAmountChange.bind(this);
        this.handleDestAmountChange = this.handleDestAmountChange.bind(this);
        this.handleOriginCurrencyChange = this.handleOriginCurrencyChange.bind(this)
        this.handleDestCurrencyChange = this.handleDestCurrencyChange.bind(this)
    }

    componentDidMount() {
        this.originAmountInput.focus();
    }
    handleOriginCurrencyChange(event) {
        let newCurrency = event.target.value;

        // optimistic field updates
        this.props.dispatch(actions.changeOriginCurrency(newCurrency))

        const payload = {
            originAmount: this.props.originAmount,
            originCurrency: newCurrency,
            destCurrency: this.props.destinationCurrency,
            calcOriginAmount: false
        }

        this.props.dispatch(actions.fetchConversionRate(payload))

        // // get the new fee & total amount
        const feePayload = {
            originAmount: this.props.originAmount,
            originCurrency: newCurrency,
            destCurrency: this.props.destinationCurrency
        }

        this.props.dispatch(actions.fetchFees(feePayload));
    }
    handleDestCurrencyChange(event) {
        let newCurrency = event.target.value;

        // optimistic field updates
        this.props.dispatch(actions.changeDestCurrency(newCurrency))

        const payload = {
            originAmount: this.props.originAmount,
            originCurrency: this.props.originCurrency,
            destCurrency: newCurrency,
            calcOriginAmount: false
        }

        this.props.dispatch(actions.fetchConversionRate(payload))

        // // get the new fee & total amount
        const feePayload = {
            originAmount: this.props.originAmount,
            originCurrency: this.props.originCurrency,
            destCurrency: newCurrency,
        }

        this.props.dispatch(actions.fetchFees(feePayload));
    }
    handleOriginAmountChange(event) {
        let newAmount = event.target.value;

        // remove unallowed chars
        newAmount = newAmount.replace(',','')

        // optimistic field updates
        this.props.dispatch(actions.changeOriginAmount(newAmount))

        const payload = {
            originAmount: newAmount,
            originCurrency: this.props.originCurrency,
            destCurrency: this.props.destinationCurrency,
            calcOriginAmount: false
        }

        this.props.dispatch(actions.fetchConversionRate(payload))

        // // get the new fee & total amount
        const feePayload = {
            originAmount: newAmount,
            originCurrency: this.props.originCurrency,
            destCurrency: this.props.destinationCurrency
        }

        this.props.dispatch(actions.fetchFees(feePayload));
    }
    handleDestAmountChange(event) {
        let newAmount = event.target.value;

        // remove unallowed chars
        newAmount = newAmount.replace(',', '')

        // optimistic field updates
        this.props.dispatch(actions.changeDestAmount(newAmount))

        const payload = {
            destAmount: newAmount,
            originCurrency: this.props.originCurrency,
            destCurrency: this.props.destinationCurrency,
            calcOriginAmount: true
        }

        this.props.dispatch(actions.fetchConversionRateAndFees(payload))
    }
    render() {
        if (this.props.errorMsg) {
            var errorMsg = <div className="errorMsg">{this.props.errorMsg}</div>
        }


        return (
            <div>
                {errorMsg}
                <label>Convert</label>&nbsp;
                <input className="amount-field" ref={input => this.originAmountInput = input} onChange={this.handleOriginAmountChange} value={this.props.originAmount} />
                <select value={this.props.originCurrency} onChange={this.handleOriginCurrencyChange}>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="JPY">JPY</option>
                </select>
                to <input className="amount-field" onChange={this.handleDestAmountChange} value={this.props.destinationAmount} />&nbsp;
                <select value={this.props.destinationCurrency} onChange={this.handleDestCurrencyChange}>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="JPY">JPY</option>
                </select>


                <br/><br/><br/>
                <FeesTable
                    originCurrency={this.props.originCurrency}
                    destinationCurrency={this.props.destinationCurrency}
                    conversionRate={this.props.conversionRate}
                    fee={this.props.feeAmount}
                    total={this.props.totalCost}
                />
            </div>
        )
    }
}

export default connect(
    (state, ownProps) => {
        return {
            originAmount: state.amount.originAmount,
            destinationAmount: state.amount.destinationAmount,
            conversionRate: state.amount.conversionRate,
            feeAmount: state.amount.feeAmount,
            totalCost: state.amount.totalCost,
            originCurrency: state.amount.originCurrency,
            destinationCurrency: state.amount.destinationCurrency,
            errorMsg: state.errors.errorMsg,
        }
    }
)(Conversion);
