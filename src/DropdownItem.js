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
    const { className, value, activeValue, children } = this.props;
    const isActive = activeValue === value
    let cls = 'option';
    if (className) {
      cls += ` ${className}`;
    }
    if (isActive) {
      cls += ' is-active';
    }
    return (
      <div ref={this.item} onClick={this.onClick} className={cls}>
        {isActive && <div className="option-arrow" />}
        {!children && <div className="option-value">{value}</div>}
        {children && <div className="option-child">{React.Children.map(children, (child) => <child.type {...child.props} />)}</div>}
      </div>
    );
  }
}