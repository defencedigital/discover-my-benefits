import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardImg, CardSubtitle, CardText, CardTitle, Row, Col } from 'reactstrap';
import { statusClasses, statuses } from '../../containers/Benefits/helpers';
import MissingIcon from '../../images/svg/question.svg';
import EligibleIcon from '../../images/svg/tick.svg';
import SheildIcon from '../../images/svg/Shield_Icon.svg';
import GatewayIcon from '../../images/svg/Gateway_Icon.svg';

class C extends React.PureComponent {
  handleEligibilityIconsRender(eligibility) {
    if (eligibility.Eltotal > 0 && eligibility.Mtotal > 0 && eligibility.Eltotal !== eligibility.Mtotal) {
      return (
        <div className="card-eligibility-indicators">
          <span>
            <EligibleIcon /> Eligible for {eligibility.Eltotal} benefit(s){' '}
          </span>
          <span>
            <MissingIcon /> {eligibility.Mtotal}
          </span>
        </div>
      );
    }
    if (eligibility.Eltotal > 0 && eligibility.Mtotal > 0 && eligibility.Eltotal === eligibility.Mtotal) {
      return (
        <div className="card-eligibility-indicators">
          <span>
            <EligibleIcon /> Eligible for {eligibility.Eltotal} benefit(s){' '}
          </span>
          <span>
            <MissingIcon /> {eligibility.Mtotal}
          </span>
        </div>
      );
    }
    if (eligibility.Eltotal <= 0 && eligibility.Mtotal > 0) {
      return (
        <div className="card-eligibility-indicators">
          <span>
            <MissingIcon /> Missing info for {eligibility.Mtotal} benefit(s)
          </span>
        </div>
      );
    }
    if (eligibility.Eltotal > 0 && eligibility.Mtotal <= 0) {
      return (
        <div className="card-eligibility-indicators">
          <span>
            <EligibleIcon /> Eligible for {eligibility.Eltotal} benefit(s){' '}
          </span>
        </div>
      );
    }
    return (
      <div className="card-eligibility-indicators">
        <span className="card-eligibility-text">Read to find out if you are eligible</span>
      </div>
    );
  }

  render() {
    const {
      className,
      onClick,
      status,
      link,
      openLinkInNewWindow,
      title,
      image,
      text,
      eligibility,
      subtitle,
      hideTextOnXs,
      tags,
      twoCol,
      modnetLink,
      gatewayLink,
    } = this.props;

    const externalLink = link.indexOf('http') > -1;
    return (
      <Card
        tag="article"
        id={`card-${title.toLowerCase().replace(/ /g, '-')}`}
        className={className}
        style={{ height: '100%' }}
        onClick={onClick}
        data-component="card"
      >
        {status !== null && (
          <CardHeader className={`card-header-${statusClasses[status]}`}>
            <span>{statuses[status]}</span>
          </CardHeader>
        )}
        {gatewayLink === true && (
          <CardHeader className="card-header-link">
            <span>
              <GatewayIcon /> Defence Gateway
            </span>
          </CardHeader>
        )}
        {modnetLink === true && (
          <CardHeader className="card-header-link">
            <span>
              <SheildIcon /> DEFnet access only
            </span>
          </CardHeader>
        )}

        <div className="card-inr">
          {twoCol && image && (
            <Row>
              <Col xs="12" md="6" lg="6">
                <CardImg top width="100%" loading="lazy" src={image} alt={title} />
              </Col>
              <Col xs="12" md="6" lg="6">
                <div
                  className={`card-body card-body-has-sibling ${hideTextOnXs ? 'adjust-padding-mobile' : ''}`}
                >
                  {eligibility && this.handleEligibilityIconsRender(eligibility)}
                  {title && !externalLink && (
                    <Link
                      className="card-link"
                      target={openLinkInNewWindow ? '_blank' : null}
                      to={link}
                      onClick={() => {}}
                      data-ga-category="card"
                      data-ga-action="click"
                      data-ga-label={title}
                    >
                      <CardTitle
                        data-ga-category="card"
                        data-ga-action="click"
                        data-ga-label={title}
                        tag="h3"
                        className="h4"
                      >
                        {title}
                      </CardTitle>
                    </Link>
                  )}
                  {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
                  {text && <CardText className={hideTextOnXs ? 'hideTextOnXs' : ''}>{text}</CardText>}
                  <div className="card-tags">
                    {tags &&
                      this.props.tags.map(tag => (
                        <span
                          key={tag.name}
                          className={`card-tag ${tag.globalFamilyTag ? 'card-tag--fam' : ''}`}
                        >
                          {tag.name}
                        </span>
                      ))}
                  </div>
                </div>
              </Col>
            </Row>
          )}

          {!twoCol && image && <CardImg top width="100%" loading="lazy" src={image} alt={title} />}
          {!twoCol && !externalLink && (
            <div className={`card-body card-body-has-sibling ${hideTextOnXs ? 'adjust-padding-mobile' : ''}`}>
              {eligibility && this.handleEligibilityIconsRender(eligibility)}
              {title && (
                <Link
                  className="card-link"
                  target={openLinkInNewWindow ? '_blank' : null}
                  to={link}
                  onClick={() => {}}
                  data-ga-category="card"
                  data-ga-action="click"
                  data-ga-label={title}
                >
                  <CardTitle
                    data-ga-category="card"
                    data-ga-action="click"
                    data-ga-label={title}
                    tag="h3"
                    className="h4"
                  >
                    {title}
                  </CardTitle>
                </Link>
              )}
              {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
            </div>
          )}

          {externalLink && (
            <a
              className="card-link"
              target={openLinkInNewWindow ? '_blank' : null}
              href={link}
              onClick={() => {}}
              data-ga-category="card"
              data-ga-action="click"
              data-ga-label={title}
            >
              {image && <CardImg top width="100%" loading="lazy" src={image} alt={title} />}

              <div
                className={`card-body card-body-has-sibling ${hideTextOnXs ? 'adjust-padding-mobile' : ''}`}
              >
                {eligibility && this.handleEligibilityIconsRender(eligibility)}
                {title && (
                  <CardTitle
                    data-ga-category="card"
                    data-ga-action="click"
                    data-ga-label={title}
                    tag="h3"
                    className="h4"
                  >
                    {title}
                  </CardTitle>
                )}
                {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
              </div>
            </a>
          )}

          {!link && onClick && (
            <>
              {image && <CardImg top width="100%" loading="lazy" src={image} alt={title} />}
              <div className="card-body card-body-has-sibling">
                {title && (
                  <CardTitle
                    data-ga-category="card"
                    data-ga-action="click"
                    data-ga-label={title}
                    tag="h3"
                    className="h4"
                  >
                    {title}
                  </CardTitle>
                )}
                {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
              </div>
            </>
          )}
          {!twoCol && (
            <div className="card-body-sibling">
              {text && <CardText className={hideTextOnXs ? 'hideTextOnXs' : ''}>{text}</CardText>}
              <div className="card-tags">
                {tags &&
                  this.props.tags.map(tag => (
                    <span key={tag.id} className={`card-tag ${tag.globalFamilyTag ? 'card-tag--fam' : ''}`}>
                      {tag.name}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  }
}

C.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  text: PropTypes.string,
  hideTextOnXs: PropTypes.bool,
  image: PropTypes.string,
  link: PropTypes.string,
  openLinkInNewWindow: PropTypes.bool,
  twoCol: PropTypes.bool,
  className: PropTypes.string,
  status: PropTypes.number,
  onClick: PropTypes.func,
  tags: PropTypes.array,
  eligibility: PropTypes.object,
  modnetLink: PropTypes.bool,
  gatewayLink: PropTypes.bool,
};

C.defaultProps = {
  status: null,
};

C.displayName = 'Card';

export default C;
