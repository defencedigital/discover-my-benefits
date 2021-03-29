import React from 'react';
import { connect } from 'react-redux';
import parse from 'html-react-parser';
import PropTypes from 'prop-types';
import { toJS } from '../HOC/ToJS';

import { makeSelectAccordions } from '../../containers/Accordions/selectors';
import { makeSelectImages } from '../../containers/Images/selectors';
import { AccPropType } from '../../containers/Accordions/propTypes';
import { ImagePropType } from '../../containers/Images/propTypes';

class CC extends React.PureComponent {
  constructor(props) {
    super(props);
    this.copyRef = React.createRef();
  }

  componentDidMount() {
    // get ref
    // find js selectors
    // make into workable accordions
    this.buildAccordions();
  }

  buildAccordions() {
    const copyCol = this.copyRef.current;
    const jsAccs = copyCol.querySelectorAll('.js-accordion');
    jsAccs.forEach(acc => {
      const button = acc.querySelector('.js-accordion-button');
      button.addEventListener('click', () => {
        acc.classList.toggle('acc--expanded');
        if (button.getAttribute('aria-expanded') === 'true') {
          button.setAttribute('aria-expanded', 'false');
        } else {
          button.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  renderCustomContent(content) {
    const { accordions, images } = this.props;
    const html = parse(content, {
      // eslint-disable-next-line consistent-return
      replace(domNode) {
        if (domNode.attribs && domNode.attribs.class === 'accordion') {
          const id = parseInt(domNode.attribs.id, 10);
          const accordion = accordions.filter(acc => acc.identifier === id).length
            ? accordions.filter(acc => acc.identifier === id)
            : undefined;
          if (
            accordion !== undefined &&
            accordion.length >= 0 &&
            accordion[0].title &&
            accordion[0].title.length > 0 &&
            accordion[0].content &&
            accordion[0].content.length > 0
          ) {
            return (
              <div className="js-accordion acc" data-component="accordion">
                <div className="acc__header">
                  <button className="js-accordion-button acc__button" aria-expanded="false" type="button">
                    {accordion[0].title}
                  </button>
                </div>
                <div className="acc__content js-accordion-content">{parse(accordion[0].content)}</div>
              </div>
            );
          }
        }
        if (domNode.attribs && domNode.attribs.class === 'image') {
          const id = parseInt(domNode.attribs.id, 10);
          const image = images.filter(acc => acc.identifier === id).length
            ? images.filter(acc => acc.identifier === id)
            : undefined;
          if (image !== undefined && image.length >= 0) {
            return (
              <div className="js-image image" data-id={image.identifier}>
                <img alt={image[0].AssetName} className="desktop-image" src={image[0].desktopImage} />
                <img alt={image[0].AssetName} className="mobile-image" src={image[0].mobileImage} />
              </div>
            );
          }
        }
      },
    });
    return html;
  }

  render() {
    const { content, className } = this.props;
    return (
      <div ref={this.copyRef} className={`copy-col ${className || ''}`}>
        {this.renderCustomContent(content)}
      </div>
    );
  }
}

CC.propTypes = {
  content: PropTypes.string,
  className: PropTypes.string,
  accordions: PropTypes.arrayOf(AccPropType),
  images: PropTypes.arrayOf(ImagePropType).isRequired,
};

const mapStateToProps = state => {
  const accordions = makeSelectAccordions(state);
  const images = makeSelectImages(state);
  return {
    accordions,
    images,
  };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(toJS(CC));
