import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import React from 'react';
import { ServicePropType } from '../../containers/Services/propTypes';
import { changeLocale } from '../../containers/LanguageProvider/actions';
import { setActiveServiceSlug } from '../../containers/App/actions';
import { makeSelectServiceById } from '../../containers/Services/selectors';
import { toJS } from '../HOC/ToJS';

export const serviceMap = {
  army: 'en',
  navy: 'fr',
  raf: 'de',
  marines: 'es',
  '_test_-service': 'es',
};

export class SetSlug extends React.PureComponent {
  componentDidMount() {
    const { onChangeLocale, onChangeActiveServiceSlug, service } = this.props;

    if (service) {
      onChangeLocale(serviceMap[service.serviceType]);
      onChangeActiveServiceSlug(service.serviceType);
    }
  }

  render() {
    return <></>;
  }
}

SetSlug.propTypes = {
  onChangeLocale: PropTypes.func.isRequired,
  onChangeActiveServiceSlug: PropTypes.func.isRequired,
  service: ServicePropType,
};

const mapStateToProps = (state, ownProps) => {
  if (!ownProps.service) {
    return {
      title: ownProps.title,
    };
  }

  const service = makeSelectServiceById(state, ownProps.service.id);

  return {
    service,
  };
};

const mapDispatchToProps = dispatch => ({
  onChangeLocale: locale => dispatch(changeLocale(locale)),
  onChangeActiveServiceSlug: slug => dispatch(setActiveServiceSlug(slug)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(toJS(SetSlug)));
