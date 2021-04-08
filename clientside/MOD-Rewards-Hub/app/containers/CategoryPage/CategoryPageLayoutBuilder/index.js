/* eslint-disable no-underscore-dangle */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import BlockGenerator from '../../../components/BlockGenerator';
import ContainerInner from '../../../components/ContainerInner';
import { toJS } from '../../../components/HOC/ToJS';
import { makeSelectBlock3cols } from '../../Block3Col/selectors';
import { makeSelectBlock4cols } from '../../Block4Col/selectors';

class CPLB extends Component {
  getBlockdata(id, __typename) {
    const { block4cols, block3cols } = this.props;
    switch (__typename) {
      case 'Block4Col':
        return block4cols.find(item => item.id === id);
      case 'Block3Col':
        return block3cols.find(item => item.id === id);
      default:
        return false;
    }
  }

  getLayoutBlocks(layout) {
    const { category, service, tags } = this.props;
    return layout.map(block => {
      const data = this.getBlockdata(block.id, block.__typename);
      if (block.__typename === 'Block4Col') {
        return (
          <BlockGenerator
            key={`customblock-${block.id}`}
            type={block.__typename}
            tags={tags}
            category={category}
            service={service}
            data={data}
          />
        );
      }
      if (block.__typename === 'Block3Col') {
        return (
          <BlockGenerator
            key={`customblock-${block.id}`}
            type={block.__typename}
            tags={tags}
            category={category}
            service={service}
            data={data}
          />
        );
      }
      return false;
    });
  }

  render() {
    const { layout } = this.props;
    return (
      <>
        {layout && layout.length > 0 && (
          <ContainerInner key="custom-layout" className="no-padding-lrg">
            {this.getLayoutBlocks(layout)}
          </ContainerInner>
        )}
      </>
    );
  }
}

CPLB.propTypes = {
  layout: PropTypes.array,
  category: PropTypes.object,
  service: PropTypes.object,
  block4cols: PropTypes.array,
  block3cols: PropTypes.array,
  tags: PropTypes.array,
};

const mapStateToProps = state => {
  const block4cols = makeSelectBlock4cols(state);
  const block3cols = makeSelectBlock3cols(state);
  return {
    block4cols,
    block3cols,
  };
};

export default connect(mapStateToProps)(toJS(injectIntl(CPLB)));
