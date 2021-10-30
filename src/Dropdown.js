import React from 'react';
import TetherComponent from 'react-tether';
import { DropdownSelect } from "./DropdownSelect";
import { DropdownPopup } from "./DropdownPopup";
import { DropdownItem } from "./DropdownItem";

export class Dropdown extends React.Component {
  tether = null;
  static Option = DropdownItem;

  constructor(props) {
    super(props);
    this.state = {
      offsetTop: 0,
      isOpen: false,
      tether: null,
      targetRect: new DOMRect()
    };
  }

  onSelectClick = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  onUpdateTether = () => {
    const tetherInstance = this.tether && this.tether.getTetherInstance();

    if (!tetherInstance) {
      return;
    }

    const tetherTargetRect = tetherInstance.target.getBoundingClientRect();

    if(tetherTargetRect.bottom !== this.state.targetRect.bottom) {
      this.setState({ tether: tetherInstance, targetRect: tetherTargetRect });
    }
  };

  setOffsetTop = (offsetTop) => {
    if (offsetTop === this.state.offsetTop) {
      return;
    }

    this.setState({ offsetTop });
  };

  tetherRef = (tether) => {
    this.tether = tether
  };

  render() {
    const { offsetTop } = this.state;
    const { children, value, onChange } = this.props;

    return (
      <TetherComponent
        ref={this.tetherRef}
        offset={`${offsetTop}px 0`}
        attachment="top left"
        targetAttachment="top left"
        constraints={[{ to: 'window', pin: true }]}
        renderTarget={ref => <DropdownSelect refSelect={ref} toggle={this.onSelectClick} {...this.props} />}
        renderElement={ref => (
          <DropdownPopup
            refList={ref}
            value={value}
            items={children}
            {...this.state}
            onClose={this.onSelectClick}
            onChange={onChange}
            setOffset={this.setOffsetTop}
          />
        )}
        onRepositioned={this.onUpdateTether}
      />
    );
  }
}