import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { findDOMNode } from 'react-dom';
import { addClass, removeClass } from 'dom-lib';


const DropContainer = React.createClass({
    PropTypes: {
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func
    },
    handleMouseEnter(event) {
        const { onMouseEnter } = this.props;
        addClass(findDOMNode(this.container), 'hover');
        onMouseEnter && onMouseEnter();
    },
    handleMouseLeave(event) {
        const { onMouseLeave } = this.props;
        removeClass(findDOMNode(this.container), 'hover');
        onMouseLeave && onMouseLeave();
    },
    render() {

        const { className, children } = this.props;
        const classes = classNames('drag-container', className);
        return (
            <div ref={(ref) => {
                this.container = ref;
            }}
                className={classes}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
            >
                <div className="drag-container-content">
                    {children}
                </div>
            </div>
        );
    }
});
export default DropContainer;
