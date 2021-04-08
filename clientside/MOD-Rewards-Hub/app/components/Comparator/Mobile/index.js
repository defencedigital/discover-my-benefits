import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ToolTip from '../../ToolTip';
import { slugify } from '../../../utils/string';

export class Mobile extends React.PureComponent {
  render() {
    const { salary, xFactor, leave, commitmentTypes, getClasses, slug } = this.props;
    return (
      <div className="comparator mobile-comparator">
        <table>
          <tbody>
            <tr className="mobile-comparator-headings">
              <th></th>
              <th className="mobile-comparator-cell-heading">Pay</th>
              <th className="mobile-comparator-cell-heading">
                <Link to={slug} replace={false}>
                  X-Factor
                </Link>
              </th>
              <th className="mobile-comparator-cell-heading">Leave</th>
            </tr>
            <tr className="mobile-comparator-featured">
              <td className="mobile-comparator-cell">
                <p>Your current total rewards package </p>
              </td>
              <td className="mobile-comparator-cell">
                <p>{salary}</p>
              </td>
              <td className="mobile-comparator-cell">
                <p>{xFactor}</p>
              </td>
              <td className="mobile-comparator-cell">
                <p>
                  {leave} {leave === '1' ? 'day' : 'days'}
                </p>
              </td>
            </tr>

            {commitmentTypes &&
              commitmentTypes.map(commitment => {
                const classes = getClasses(commitment, true);
                return (
                  <tr key={`${commitment.title.toLowerCase().replace(/ /g, '-')}`}>
                    <td
                      className="mobile-comparator-cell"
                      id={`${commitment.title.toLowerCase().replace(/ /g, '-')}`}
                      xs="12"
                    >
                      <p>
                        <Link to={commitment.slug}>{commitment.title}</Link>
                      </p>
                    </td>
                    <td
                      id={`${commitment.title.toLowerCase().replace(/ /g, '-')}-salary`}
                      className={classes.salaryClasses}
                      xs="12"
                    >
                      <p>
                        {commitment.salary.tooltip && (
                          <ToolTip
                            id={`mobile-${commitment.id}-salary-tooltip`}
                            content={commitment.salary.tooltip}
                          />
                        )}
                        {commitment.salary.value} {commitment.salary.tooltip ? 'per day' : ''}
                      </p>
                    </td>
                    <td
                      id={`${commitment.title.toLowerCase().replace(/ /g, '-')}-xfactor`}
                      className={classes.xFactorClasses}
                      xs="12"
                    >
                      <p dangerouslySetInnerHTML={{ __html: commitment.xFactor.value }} />
                    </td>
                    <td
                      id={`${commitment.title.toLowerCase().replace(/ /g, '-')}-leave`}
                      className={classes.leaveClasses}
                      xs="12"
                    >
                      <p>
                        {commitment.leave.tooltip && (
                          <ToolTip
                            id={`mobile-${slugify(commitment.leave.tooltip)}`}
                            content={commitment.leave.tooltip}
                          />
                        )}
                        {commitment.leave.value} {commitment.leave.value === 1 ? 'day' : 'days'}
                      </p>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    );
  }
}

Mobile.propTypes = {
  salary: PropTypes.string.isRequired,
  xFactor: PropTypes.string.isRequired,
  leave: PropTypes.string.isRequired,
  commitmentTypes: PropTypes.array.isRequired,
  getClasses: PropTypes.func.isRequired,
  slug: PropTypes.string,
};

export default Mobile;
