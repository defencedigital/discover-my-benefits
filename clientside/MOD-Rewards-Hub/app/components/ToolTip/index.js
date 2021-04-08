import React from 'react';
import PropTypes from 'prop-types';
import { Button, Popover, PopoverBody } from 'reactstrap';

export class ToolTip extends React.PureComponent {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      popoverOpen: false,
    };
  }

  toggle() {
    this.setState({
      // eslint-disable-next-line react/no-access-state-in-setstate
      popoverOpen: !this.state.popoverOpen,
    });
  }

  render() {
    return (
      <span className="tooltip">
        <Button type="button" className="btn btn-tooltip btn-warning" id={this.props.id} onClick={this.toggle}></Button>
        <Popover placement="bottom" isOpen={this.state.popoverOpen} target={this.props.id} toggle={this.toggle}>
          <PopoverBody>
            <p>{this.props.content}</p>
          </PopoverBody>
        </Popover>
      </span>
    );
  }
}

ToolTip.propTypes = {
  content: PropTypes.string,
  id: PropTypes.string.isRequired,
};

export default ToolTip;
