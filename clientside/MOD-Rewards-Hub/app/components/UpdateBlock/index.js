import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ContainerInner from '../ContainerInner';
import { ServicePropType } from '../../containers/Services/propTypes';
import { getServiceFavourites } from '../../containers/Services/helpers';

export class UpdateBlock extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      favourites: [],
    };
  }

  isFavourite(blinks, clinks) {
    const { service } = this.props;
    const favourites = getServiceFavourites(service);
    const linkArray = [...blinks, ...clinks];
    let message;
    linkArray.forEach(item => {
      if (favourites && favourites.includes(item.id, 0)) {
        message = <span className="update-block__favourite">You{`'`}ve favourited this page </span>;
      }
    });
    return message;
  }

  render() {
    const { updates } = this.props;
    return (
      <div className="update-block">
        <ContainerInner className="no-padding-lrg">
          {updates.map(update =>
            update.map(item => (
              <div key={item.changes[0].title} className="update-block__wrap">
                <h2 className="update-block__date">{item.date}</h2>
                {item.changes.map(change => (
                  <div key={change.title} className="update-block__row">
                    <div>
                      <p className="update-block__time badge badge-grey">{change.time}</p>
                      {this.isFavourite(change.benefitLinks, change.categoryLinks)}
                      <h3 className="h2 update-block__title">{change.title}</h3>
                      <p className="update-block__desc" dangerouslySetInnerHTML={{ __html: change.description }} />
                      <div className="update-block__links">
                        {change.categoryLinks
                          .concat(change.benefitLinks)
                          .concat(change.links)
                          .map(link => (
                            <Link key={link.url} target={link.url.indexOf('http') !== -1 ? '_blank' : ''} to={link.url} className="update-block__link">
                              {link.name}
                            </Link>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )),
          )}
        </ContainerInner>
      </div>
    );
  }
}

UpdateBlock.propTypes = {
  updates: PropTypes.array,
  service: ServicePropType,
};

export default UpdateBlock;
