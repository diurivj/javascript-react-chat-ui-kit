import React from "react";

/** @jsx jsx */
import { jsx } from '@emotion/core';
import PropTypes from 'prop-types';

import { checkMessageForExtensionsData } from "../../util/common";

import ToolTip from "../ToolTip";
import ReplyCount from "../ReplyCount";
import ReadReciept from "../ReadReciept";
import RegularReactionView from "../RegularReactionView";

import {
    messageContainerStyle,
    messageWrapperStyle,
    messageTxtWrapperStyle,
    messageTxtContainerStyle,
    messageTxtStyle,
    messageBtnStyle,
    messageInfoWrapperStyle,
    messageReactionsWrapperStyle,
} from "./style";

import { theme } from "../../resources/theme";
import Translator from "../../resources/localization/translator";

import callIcon from "./resources/sendervideocall.png";

class SenderDirectCallBubble extends React.Component {

    messageFrom = "sender";

    constructor(props) {

        super(props);
        const message = Object.assign({}, props.message, { messageFrom: this.messageFrom });

        this.state = {
            message: message, 
            isHovering: false,
        }
    }

    componentDidUpdate(prevProps) {

        const previousMessageStr = JSON.stringify(prevProps.message);
        const currentMessageStr = JSON.stringify(this.props.message);

        if (previousMessageStr !== currentMessageStr) {

            const message = Object.assign({}, this.props.message, { messageFrom: this.messageFrom });
            this.setState({ message: message })
        }
    }

    handleMouseHover = () => {
        this.setState(this.toggleHoverState);
    }

    toggleHoverState = (state) => {

        return {
            isHovering: !state.isHovering,
        };
    }

    render() {

        let messageReactions = null;
        const reactionsData = checkMessageForExtensionsData(this.state.message, "reactions");
        if (reactionsData) {

            if (Object.keys(reactionsData).length) {
                messageReactions = (
                    <div css={messageReactionsWrapperStyle()} className="message__reaction__wrapper">
                        <RegularReactionView {...this.props} message={this.state.message} reaction={reactionsData} />
                    </div>
                );
            }
        }

        let toolTipView = null;
        if (this.state.isHovering) {
            toolTipView = (<ToolTip {...this.props} message={this.state.message} />);
        }

        const messageTitle = Translator.translate("YOU_INITIATED_GROUP_CALL", this.props.lang);
        return (
            <div css={messageContainerStyle()} 
            className="sender__message__container message__directcall"
            onMouseEnter={this.handleMouseHover}
            onMouseLeave={this.handleMouseHover}>

                {toolTipView}

                <div css={messageWrapperStyle()} className="message__wrapper">
                    <div css={messageTxtWrapperStyle(this.props)} className="message__directcall__wrapper">
                        <div css={messageTxtContainerStyle()} className="message__directcall__container">
                            <img src={callIcon} alt={Translator.translate("VIDEO_CALL", this.props.lang)} />
                            <p css={messageTxtStyle()} className="directcall__title">{messageTitle}</p>
                        </div>
                        <ul css={messageBtnStyle(this.props)} className="directcall__button">
                            <li onClick={() => this.props.actionGenerated("joinDirectCall", this.state.message)}>
                                <p>{Translator.translate("JOIN", this.props.lang)}</p>
                            </li>
                        </ul>
                    </div>
                </div>

                {messageReactions}

                <div css={messageInfoWrapperStyle()} className="message__info__wrapper">
                    <ReplyCount {...this.props} message={this.state.message} />
                    <ReadReciept {...this.props} message={this.state.message} />
                </div>

            </div>
        )
    }
}

// Specifies the default values for props:
SenderDirectCallBubble.defaultProps = {
    lang: Translator.getDefaultLanguage(),
    theme: theme,
    message: {},
    loggedInUser: {}
};

SenderDirectCallBubble.propTypes = {
    lang: PropTypes.string,
    theme: PropTypes.object,
    message: PropTypes.object,
    loggedInUser: PropTypes.object
}

export default SenderDirectCallBubble;