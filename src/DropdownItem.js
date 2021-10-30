import React from 'react';

export class DropdownItem extends React.Component {
  item = React.createRef();

  componentDidUpdate() {
    const { value, activeValue } = this.props;
    const isActive = activeValue === value;
    if (isActive) {
      this.props.setActiveOffsetTop(this.item.current.offsetTop);
    }
  }

  onClick = (event) => {
    const { onChange, onClose } = this.props;
    onChange(event);
    onClose();
  };

  render() {
    const { className, value, activeValue } = this.props;
    let cls = 'option';
    if (className) {
      cls += ` ${className}`;
    }
    if (activeValue === value) {
      cls += ' is-active';
    }
    return (
      <div ref={this.item} onClick={this.onClick} className={cls}>{value}</div>
    );
  }
}