import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  getUser,
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getTotalVestingShares,
  getTotalVestingFundSteem,
  getUsersAccountHistory,
  getUsersAccountHistoryLoading,
  getUsersEstAccountsValues,
  getLoadingGlobalProperties,
  getAccountHistoryFilter,
  getCurrentDisplayedActions,
} from '../reducers';
import {
  getGlobalProperties,
  getUserEstAccountValue,
  getUserAccountHistory,
  getMoreUserAccountHistory,
  updateAccountHistoryFilter,
  setInitialCurrentDisplayedActions,
} from '../wallet/walletActions';
import { getAccount } from '../user/usersActions';
import Loading from '../components/Icon/Loading';

import {
  XYPlot,
  LineSeries,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  RadialChart,
  Hint
} from 'react-vis';


@withRouter
@connect(
  (state, ownProps) => ({
    user: ownProps.isCurrentUser
      ? getAuthenticatedUser(state)
      : getUser(state, ownProps.match.params.name),
    authenticatedUserName: getAuthenticatedUserName(state),
    totalVestingShares: getTotalVestingShares(state),
    totalVestingFundSteem: getTotalVestingFundSteem(state),
    usersAccountHistory: getUsersAccountHistory(state),
    usersAccountHistoryLoading: getUsersAccountHistoryLoading(state),
    usersEstAccountsValues: getUsersEstAccountsValues(state),
    loadingGlobalProperties: getLoadingGlobalProperties(state),
    accountHistoryFilter: getAccountHistoryFilter(state),
    currentDisplayedActions: getCurrentDisplayedActions(state),
  }),
  {
    getGlobalProperties,
    getUserAccountHistory,
    getMoreUserAccountHistory,
    getAccount,
    getUserEstAccountValue,
    updateAccountHistoryFilter,
    setInitialCurrentDisplayedActions,
  },
)
class UserPerformance extends React.Component {
  static propTypes = {
    usersAccountHistoryLoading: PropTypes.bool.isRequired,
    loadingGlobalProperties: PropTypes.bool.isRequired,
    getGlobalProperties: PropTypes.func.isRequired,
    getUserAccountHistory: PropTypes.func.isRequired,
    getUserEstAccountValue: PropTypes.func.isRequired,
    getAccount: PropTypes.func.isRequired,
    updateAccountHistoryFilter: PropTypes.func.isRequired,
    setInitialCurrentDisplayedActions: PropTypes.func.isRequired,
    location: PropTypes.shape().isRequired,
    user: PropTypes.shape().isRequired,
    usersAccountHistory: PropTypes.shape().isRequired,
    usersEstAccountsValues: PropTypes.shape().isRequired,
    totalVestingShares: PropTypes.string.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
    currentDisplayedActions: PropTypes.arrayOf(PropTypes.shape()),
    isCurrentUser: PropTypes.bool,
    authenticatedUserName: PropTypes.string,
  };

  static defaultProps = {
    currentDisplayedActions: [],
    isCurrentUser: false,
    authenticatedUserName: '',
  };

  componentDidMount() {
    const {
      totalVestingShares,
      totalVestingFundSteem,
      usersEstAccountsValues,
      usersAccountHistory,
      user,
      isCurrentUser,
      authenticatedUserName,
      currentDisplayedActions,
    } = this.props;
    const username = isCurrentUser
      ? authenticatedUserName
      : this.props.location.pathname.match(/@(.*)(.*?)\//)[1];

    if (_.isEmpty(totalVestingFundSteem) || _.isEmpty(totalVestingShares)) {
      this.props.getGlobalProperties();
    }

    if (_.isEmpty(usersAccountHistory[username])) {
      this.props.getUserAccountHistory(username);
    }

    if (_.isEmpty(user)) {
      this.props.getAccount(username);
    }

    if (_.isEmpty(usersEstAccountsValues[username]) && !_.isEmpty(user.name)) {
      this.props.getUserEstAccountValue(user);
    }

    if (_.isEmpty(currentDisplayedActions)) {
      this.props.setInitialCurrentDisplayedActions(user.name);
    }

    this.props.updateAccountHistoryFilter({
      username: user.name,
      accountHistoryFilter: [],
    });
  }

  render() {
    const {
      user,
      usersAccountHistory,
      usersAccountHistoryLoading,
      loadingGlobalProperties,
      isCurrentUser,
    } = this.props;
    const actions = usersAccountHistory[user.name] || [];

    return (
      <RadialChart
        className={'donut-chart-example'}
        innerRadius={100}
        radius={140}
        getAngle={d => d.theta}
        data={[
          {theta: 2, className: 'custom-class'},
          {theta: 6},
          {theta: 2},
          {theta: 3},
          {theta: 1}
        ]}
        onValueMouseOver={v => this.setState({value: v})}
        onSeriesMouseOut={v => this.setState({value: false})}
        width={300}
        height={300}>
        {value && <Hint value={value}/>}
      </RadialChart>
    );
  }
}






export default UserPerformance;
