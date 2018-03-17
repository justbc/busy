import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { injectIntl } from 'react-intl';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';
import UserActivity from './UserPerformance';
import requiresLogin from '../auth/requiresLogin';

const Performance = ({ intl }) => (
  <div className="shifted">
    <Helmet>
      <title>{intl.formatMessage({ id: 'wallet', defaultMessage: 'Performance' })} - Busy</title>
    </Helmet>
    <div className="feed-layout container">
      <Affix className="leftContainer" stickPosition={77}>
        <div className="left">
          <LeftSidebar />
        </div>
      </Affix>
      <Affix className="rightContainer" stickPosition={77}>
        <div className="right">
          <WalletSidebar isCurrentUser />
        </div>
      </Affix>
      <div className="center">
        <UserPerformance isCurrentUser />
      </div>
    </div>
  </div>
);

Wallet.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default requiresLogin(injectIntl(Performance));
