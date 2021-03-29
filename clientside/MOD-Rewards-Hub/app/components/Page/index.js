import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { toJS } from '../HOC/ToJS';
import { makeSelectFlyoutOpen } from '../../containers/App/selectors';

import { makeSelectServiceById } from '../../containers/Services/selectors';
import { ServicePropType } from '../../containers/Services/propTypes';
import Head from '../Head';
import { makeSelectCurrentProfileType } from '../../containers/Questions/selectors';
import FeedbackPanel from '../FeedbackPanel';
import ProgressHOC from '../HOC/Progress';

export class Page extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function

  render() {
    const {
      children,
      service,
      title,
      cssClass,
      flyoutOpen,
      modalActive,
      notFound,
      currentProfileType,
      bgColour,
      description,
    } = this.props;
    const isActive = flyoutOpen ? 'container-wrap flyout-is-active' : 'container-wrap';

    return (
      <>
        <Head title={title} service={service} notFound={notFound} description={description} />
        <Container
          className={`${cssClass || ''}${modalActive ? 'modal-active' : ''} ${bgColour || ''} no-padding`}
        >
          <div className={isActive}>{currentProfileType !== null && children}</div>
        </Container>
        {!notFound && (
          <ProgressHOC service={service}>
            <FeedbackPanel service={service} />
          </ProgressHOC>
        )}
      </>
    );
  }
}

Page.defaultProps = {
  // eslint-disable-next-line react/default-props-match-prop-types
  notFound: false,
};

Page.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  service: ServicePropType,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  notFound: PropTypes.bool.isRequired,
  cssClass: PropTypes.string,
  flyoutOpen: PropTypes.bool,
  modalActive: PropTypes.bool,
  currentProfileType: PropTypes.string,
  bgColour: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => {
  if (!ownProps.service) {
    return {
      title: ownProps.title,
    };
  }

  const service = makeSelectServiceById(state, ownProps.service.id);
  const flyoutOpen = makeSelectFlyoutOpen(state);
  const currentProfileType = makeSelectCurrentProfileType(state);

  return {
    service,
    title: ownProps.title,
    flyoutOpen,
    currentProfileType,
  };
};
export default connect(mapStateToProps)(withRouter(toJS(Page)));
