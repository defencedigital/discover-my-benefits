import PropTypes from 'prop-types';
import React from 'react';
import { Card, CardText, CardTitle, Button } from 'reactstrap';
import { isExternal } from '../../utils/url';

class Cardcta extends React.PureComponent {
  render() {
    const { link, title, text } = this.props;

    return (
      <Card
        tag="article"
        id={`card-${title.toLowerCase().replace(/ /g, '-')}`}
        className="bg-primary text-center px-5 py-4"
        style={{ height: '100%' }}
      >
        {title && (
          <CardTitle
            data-ga-category="card"
            data-ga-action="click"
            data-ga-label={title}
            tag="h4"
            className="h4 w-75 mx-auto mb-4 text-white"
          >
            {title}
          </CardTitle>
        )}
        {text && <CardText className="text-white pb-4">{text}</CardText>}
        {link &&
          link.map(item => {
            const name = item.data.name.iv;
            const url = item.data.url.iv;

            const { isLinkExternal } = item.data;
            const testInternalLink = isExternal(url);

            return (
              <Button
                className="bg-secondary-beta w-75 mb-3"
                key={`card-cta-${name}`}
                href={url}
                target={testInternalLink && !isLinkExternal ? `_blank` : null}
                rel={isLinkExternal && !isLinkExternal ? `extenal` : null}
              >
                {name}
              </Button>
            );
          })}
      </Card>
    );
  }
}

Cardcta.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string,
  link: PropTypes.array,
};

export default Cardcta;
