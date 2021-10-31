import React from 'react';
import { capitalize } from 'lodash';

export class DropdownSelect extends React.Component {
  render() {
    const { refSelect, toggle, value, label, className, disabled } = this.props;
    let cls = 'select';
    if (className) {
      cls += ` ${className}`;
    }
    if (disabled) {
      cls += ' is-disabled';
    }

    const [ activeOption ] = React.Children.toArray(this.props.children).filter(child => child.props.value === value);
    const activeComponent = activeOption && activeOption.props.children;

    return (
      <div ref={refSelect} className={cls} onClick={toggle}>
        {label && <span className="select-label">{capitalize(label)}</span>}
        {!activeComponent && <span className="select-text">{value}</span>}
        {activeComponent && <activeComponent.type {...activeComponent.props} />}
        <span className="select-arrow" />
      </div>
    );
  }
}