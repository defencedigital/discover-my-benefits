import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import sortBy from 'lodash/sortBy';
import findIndex from 'lodash/findIndex';
import { Link, withRouter } from 'react-router-dom';
import { closeFlyout } from '../../containers/App/actions';
import { slugify } from '../../utils/string';
import { toJS } from '../HOC/ToJS';

export class BL extends React.PureComponent {
  handleClick = () => {
    const { onCloseFlyout } = this.props;
    onCloseFlyout();
  };

  buildRows = rows => {
    const colSize = '7';
    return (
      <div className="benefits-list">
        {rows.map(row => (
          <div key={row.category} className="benefit-list-section">
            <Row className="benefits-list-row benefits-list-row-header">
              <Col xs="12" sm="7">
                <Link onClick={this.handleClick} to={row.categoryLink}>
                  <h2 className="h3">{row.category}</h2>
                </Link>
              </Col>
              <Col className="benefits-list-col-right-md" xs="12" sm="5">
                <p className="badge badge-light">{row.text}</p>
              </Col>
            </Row>

            {row.benefits.map((benefit, index) => (
              <Row
                key={benefit.title}
                className={`benefits-list-row ${
                  !benefit.changed && !(row.benefits[index - 1] && row.benefits[index - 1].changed)
                    ? 'row-bdr-top'
                    : `${row.benefits[index - 1] && row.benefits[index - 1].changed ? '' : 'row-bdr-bottom'}`
                } ${benefit.changed ? 'has-changed' : ''} ${
                  row.benefits[index - 1] && row.benefits[index - 1].changed
                    ? 'has-changed-no-top-border'
                    : ''
                }`}
              >
                <Col xs={colSize}>
                  <h3 className="h4">
                    <Link
                      data-ga-category="My Benefits Flyout"
                      data-ga-action="All"
                      data-ga-label={benefit.title}
                      onClick={this.handleClick}
                      to={benefit.link}
                    >
                      {benefit.title}
                    </Link>
                  </h3>
                </Col>

                <Col className="benefits-list-col-right" xs="5">
                  <span
                    data-test={`my-benefits-${slugify(row.category)}-${slugify(benefit.title)}`}
                    className={`icon icon-${benefit.class}`}
                  >
                    {benefit.status}
                  </span>
                </Col>
              </Row>
            ))}
            <Row className="benefits-list-row row-bdr-top">
              <Col xs="12">
                <Link onClick={this.handleClick} to={row.categoryLink}>
                  <small>{row.linkText}</small>
                </Link>
              </Col>
            </Row>
          </div>
        ))}
      </div>
    );
  };

  render() {
    const { progress, changed } = this.props;

    const rows = Object.keys(progress.benefits).map(id => {
      const category = progress.benefits[id];
      const eligibleCount = category.filter(b => b.code === 0).length;
      const txt = `Eligible for ${eligibleCount}`;
      return {
        category: category[0].primaryCategory.name,
        categoryLink: `/${category[0].serviceSlug}/${category[0].primaryCategory.slug}`,
        linkText: `Discover all other benefits/Allowances in ${category[0].primaryCategory.name}`,
        text: txt,
        benefits: category.map(b => ({
          title: b.benefit,
          link: `/${category[0].serviceSlug}/${b.primaryCategory.slug}/${b.benefitSlug}`,
          class: b.class,
          status: b.status,
          changed: changed && changed.indexOf(b.benefit) !== -1,
        })),
      };
    });

    if (changed) {
      const changedBenefitsPerCat = [];
      rows.forEach(row => {
        let count = 0;

        row.benefits.forEach(benefit => {
          if (benefit.changed === true) {
            count += 1;
          }
        });
        changedBenefitsPerCat.push({
          category: row.category,
          totalChanged: count,
        });
      });

      const categoriesByTotalChanged = sortBy(changedBenefitsPerCat, y => y.totalChanged).reverse();
      const newRows = sortBy(rows, row =>
        findIndex(categoriesByTotalChanged, y => row.category === y.category),
      );
      return this.buildRows(newRows);
    }

    return this.buildRows(rows);
  }
}

BL.propTypes = {
  changed: PropTypes.array,
  progress: PropTypes.object.isRequired,
  onCloseFlyout: PropTypes.func.isRequired,
  flyout: PropTypes.bool,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  onCloseFlyout: () => dispatch(closeFlyout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(toJS(withRouter(BL)));
