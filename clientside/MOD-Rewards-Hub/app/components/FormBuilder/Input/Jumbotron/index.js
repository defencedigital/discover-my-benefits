import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Jumbotron from '../../../Jumbotron';

class Jumbo extends PureComponent {
  render() {
    const { field } = this.props;

    return (
      <Jumbotron>
        <p dangerouslySetInnerHTML={{ __html: field.value }}></p>
      </Jumbotron>
    );
  }
}

Jumbo.propTypes = {
  field: PropTypes.object.isRequired,
};

export default Jumbo;
